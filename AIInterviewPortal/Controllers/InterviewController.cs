using AIInterviewPortal.Data;
using AIInterviewPortal.Models.Domain;
using AIInterviewPortal.Models.ViewModels;
using AIInterviewPortal.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AIInterviewPortal.Controllers
{
    [Authorize]
    public class InterviewController : Controller
    {
        private readonly AppDbContext _db;
        private readonly GeminiService _gemini;
        private readonly UserManager<ApplicationUser> _userManager;

        public InterviewController(AppDbContext db, GeminiService gemini,
                                   UserManager<ApplicationUser> userManager)
        {
            _db          = db;
            _gemini      = gemini;
            _userManager = userManager;
        }

        // ── GET /Interview/SelectTech ─────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> SelectTech()
        {
            var techs = await _db.Technologies.ToListAsync();
            return View(new SelectTechViewModel { Technologies = techs });
        }

        // ── GET /Interview/SelectDifficulty ────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> SelectDifficulty(int techId)
        {
            var tech = await _db.Technologies.FindAsync(techId);
            if (tech == null) return RedirectToAction("SelectTech");
            ViewBag.TechName = tech.Name;
            ViewBag.TechColor = tech.Color;
            ViewBag.TechId = tech.TechId;
            return View();
        }

        // ── POST /Interview/StartSession ──────────────────────────────────────
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> StartSession(int techId, string difficulty, int questionCount)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return RedirectToAction("Login", "Account");

            var tech = await _db.Technologies.FindAsync(techId);
            if (tech == null) return NotFound();

            // Generate questions via Gemini
            List<string> questionTexts;
            try
            {
                questionTexts = await _gemini.GenerateQuestionsAsync(tech.Name, difficulty, questionCount);
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"AI service error: {ex.Message}. Please check your API key.";
                return RedirectToAction("SelectTech");
            }

            // Create session
            var session = new InterviewSession
            {
                UserId        = user.Id,
                TechId        = techId,
                Difficulty    = difficulty,
                QuestionCount = questionTexts.Count,
                StartedAt     = DateTime.UtcNow
            };
            _db.InterviewSessions.Add(session);
            await _db.SaveChangesAsync();

            // Save questions
            var questions = questionTexts.Select((q, i) => new Question
            {
                SessionId    = session.SessionId,
                QuestionText = q,
                OrderIndex   = i + 1
            }).ToList();

            _db.Questions.AddRange(questions);
            await _db.SaveChangesAsync();

            return RedirectToAction("Question", new { sessionId = session.SessionId, questionNumber = 1 });
        }

        // ── GET /Interview/Question ───────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> Question(int sessionId, int questionNumber)
        {
            var user = await _userManager.GetUserAsync(User);
            var session = await _db.InterviewSessions
                .Include(s => s.Technology)
                .Include(s => s.Questions).ThenInclude(q => q.Answer)
                .FirstOrDefaultAsync(s => s.SessionId == sessionId && s.UserId == user!.Id);

            if (session == null) return NotFound();
            if (session.IsCompleted) return RedirectToAction("Summary", new { sessionId });

            var question = session.Questions
                .OrderBy(q => q.OrderIndex)
                .Skip(questionNumber - 1)
                .FirstOrDefault();

            if (question == null) return RedirectToAction("Summary", new { sessionId });

            return View(new QuestionViewModel
            {
                SessionId      = session.SessionId,
                QuestionId     = question.QuestionId,
                QuestionText   = question.QuestionText,
                CurrentNumber  = questionNumber,
                TotalQuestions = session.Questions.Count,
                Technology     = session.Technology.Name,
                TechColor      = session.Technology.Color,
                Difficulty     = session.Difficulty
            });
        }

        // ── POST /Interview/SubmitAnswer ──────────────────────────────────────
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SubmitAnswer(int sessionId, int questionId,
                                                       string userAnswer, int currentNumber)
        {
            var user = await _userManager.GetUserAsync(User);
            var session = await _db.InterviewSessions
                .Include(s => s.Technology)
                .Include(s => s.Questions)
                .FirstOrDefaultAsync(s => s.SessionId == sessionId && s.UserId == user!.Id);

            if (session == null) return NotFound();

            var question = session.Questions.FirstOrDefault(q => q.QuestionId == questionId);
            if (question == null) return NotFound();

            if (string.IsNullOrWhiteSpace(userAnswer))
                userAnswer = "(No answer provided)";

            // Evaluate answer with Gemini
            EvaluationResult eval;
            try
            {
                eval = await _gemini.EvaluateAnswerAsync(session.Technology.Name,
                                                          question.QuestionText, userAnswer);
            }
            catch
            {
                eval = new EvaluationResult
                {
                    Score           = 0,
                    Feedback        = "AI service unavailable. Please check your API key.",
                    MissingPoints   = new List<string>(),
                    SuggestedAnswer = ""
                };
            }

            // Save answer
            var answer = new Answer
            {
                QuestionId      = questionId,
                UserAnswer      = userAnswer,
                AIScore         = eval.Score,
                AIFeedback      = eval.Feedback,
                MissingPoints   = JsonSerializer.Serialize(eval.MissingPoints),
                SuggestedAnswer = eval.SuggestedAnswer,
                AnsweredAt      = DateTime.UtcNow
            };
            _db.Answers.Add(answer);

            // Update session progress
            session.CompletedQuestions++;
            var totalQ = session.Questions.Count;

            if (session.CompletedQuestions >= totalQ)
            {
                session.IsCompleted = true;
                session.CompletedAt = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();

            // Recalculate session average
            var allAnswers = await _db.Answers
                .Where(a => session.Questions.Select(q => q.QuestionId).Contains(a.QuestionId))
                .ToListAsync();

            session.AverageScore = allAnswers.Count > 0 ? allAnswers.Average(a => a.AIScore) : 0;
            await _db.SaveChangesAsync();

            return RedirectToAction("Feedback", new { sessionId, questionId, currentNumber });
        }

        // ── GET /Interview/Feedback ───────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> Feedback(int sessionId, int questionId, int currentNumber)
        {
            var user = await _userManager.GetUserAsync(User);
            var session = await _db.InterviewSessions
                .Include(s => s.Technology)
                .Include(s => s.Questions)
                .FirstOrDefaultAsync(s => s.SessionId == sessionId && s.UserId == user!.Id);

            if (session == null) return NotFound();

            var question = await _db.Questions
                .Include(q => q.Answer)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId);

            if (question?.Answer == null) return NotFound();

            var missing = JsonSerializer.Deserialize<List<string>>(question.Answer.MissingPoints)
                          ?? new List<string>();

            return View(new FeedbackViewModel
            {
                SessionId      = sessionId,
                QuestionId     = questionId,
                QuestionText   = question.QuestionText,
                UserAnswer     = question.Answer.UserAnswer,
                Score          = question.Answer.AIScore,
                Feedback       = question.Answer.AIFeedback,
                MissingPoints  = missing,
                SuggestedAnswer = question.Answer.SuggestedAnswer,
                CurrentNumber  = currentNumber,
                TotalQuestions = session.Questions.Count,
                Technology     = session.Technology.Name,
                TechColor      = session.Technology.Color
            });
        }

        // ── GET /Interview/Summary ────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> Summary(int sessionId)
        {
            var user = await _userManager.GetUserAsync(User);
            var session = await _db.InterviewSessions
                .Include(s => s.Technology)
                .Include(s => s.Questions).ThenInclude(q => q.Answer)
                .FirstOrDefaultAsync(s => s.SessionId == sessionId && s.UserId == user!.Id);

            if (session == null) return NotFound();

            var qnaSummaries = session.Questions
                .OrderBy(q => q.OrderIndex)
                .Where(q => q.Answer != null)
                .Select(q => new QuestionAnswerSummary
                {
                    Question   = q.QuestionText,
                    UserAnswer = q.Answer!.UserAnswer,
                    Score      = q.Answer.AIScore,
                    Feedback   = q.Answer.AIFeedback
                }).ToList();

            var weakAreas = qnaSummaries
                .Where(q => q.Score < 5)
                .Select(q => q.Question.Length > 60 ? q.Question[..60] + "..." : q.Question)
                .Take(3).ToList();

            return View(new SessionSummaryViewModel
            {
                SessionId      = session.SessionId,
                Technology     = session.Technology.Name,
                TechColor      = session.Technology.Color,
                TechIcon       = session.Technology.IconClass,
                Difficulty     = session.Difficulty,
                TotalQuestions = session.Questions.Count,
                AverageScore   = session.AverageScore ?? 0,
                QnA            = qnaSummaries,
                WeakAreas      = weakAreas,
                CompletedAt    = session.CompletedAt ?? DateTime.UtcNow
            });
        }
    }
}
