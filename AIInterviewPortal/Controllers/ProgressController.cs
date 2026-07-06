using AIInterviewPortal.Data;
using AIInterviewPortal.Models.Domain;
using AIInterviewPortal.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIInterviewPortal.Controllers
{
    [Authorize]
    public class ProgressController : Controller
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProgressController(AppDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db          = db;
            _userManager = userManager;
        }

        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return RedirectToAction("Login", "Account");

            var sessions = await _db.InterviewSessions
                .Where(s => s.UserId == user.Id && s.IsCompleted)
                .Include(s => s.Technology)
                .Include(s => s.Questions).ThenInclude(q => q.Answer)
                .OrderByDescending(s => s.CompletedAt)
                .ToListAsync();

            var allAnswers = sessions
                .SelectMany(s => s.Questions).Where(q => q.Answer != null)
                .Select(q => q.Answer!).ToList();

            var totalQ       = allAnswers.Count;
            var overallAvg   = totalQ > 0 ? allAnswers.Average(a => a.AIScore) : 0;

            // Improvement: compare first half avg to second half
            double improvement = 0;
            if (sessions.Count >= 2)
            {
                var half = sessions.Count / 2;
                var older = sessions.Skip(half).SelectMany(s => s.Questions)
                    .Where(q => q.Answer != null).Select(q => q.Answer!.AIScore).ToList();
                var newer = sessions.Take(half).SelectMany(s => s.Questions)
                    .Where(q => q.Answer != null).Select(q => q.Answer!.AIScore).ToList();

                if (older.Count > 0 && newer.Count > 0)
                {
                    var olderAvg = older.Average();
                    var newerAvg = newer.Average();
                    improvement = olderAvg > 0 ? Math.Round(((newerAvg - olderAvg) / olderAvg) * 100, 1) : 0;
                }
            }

            // Weekly
            var weeklyLabels = new List<string>();
            var weeklyScores = new List<double>();
            for (int i = 6; i >= 0; i--)
            {
                var day = DateTime.UtcNow.Date.AddDays(-i);
                var dayAnswers = sessions
                    .Where(s => s.CompletedAt?.Date == day)
                    .SelectMany(s => s.Questions).Where(q => q.Answer != null)
                    .Select(q => q.Answer!.AIScore).ToList();
                weeklyLabels.Add(day.ToString("ddd"));
                weeklyScores.Add(dayAnswers.Count > 0 ? Math.Round(dayAnswers.Average(), 1) : 0);
            }

            // Tech-wise
            var techGroups = sessions.GroupBy(s => s.Technology.Name)
                .Select(g => new
                {
                    Tech = g.Key,
                    Avg  = g.SelectMany(s => s.Questions).Where(q => q.Answer != null)
                            .Average(q => q.Answer!.AIScore)
                }).ToList();

            // Score distribution: Low (0-3), Medium (4-6), High (7-10)
            var scoreDist = new List<double>
            {
                allAnswers.Count(a => a.AIScore <= 3),
                allAnswers.Count(a => a.AIScore >= 4 && a.AIScore <= 6),
                allAnswers.Count(a => a.AIScore >= 7)
            };

            // Session history
            var history = sessions.Select(s => new SessionHistoryItem
            {
                SessionId      = s.SessionId,
                Technology     = s.Technology.Name,
                TechColor      = s.Technology.Color,
                TechIcon       = s.Technology.IconClass,
                Difficulty     = s.Difficulty,
                TotalQuestions = s.Questions.Count,
                AverageScore   = Math.Round(s.AverageScore ?? 0, 1),
                Date           = s.CompletedAt ?? s.StartedAt
            }).ToList();

            return View(new ProgressViewModel
            {
                TotalSessions      = sessions.Count,
                TotalQuestions     = totalQ,
                OverallAvgScore    = Math.Round(overallAvg, 1),
                ImprovementPercent = improvement,
                SessionHistory     = history,
                WeeklyLabels       = weeklyLabels,
                WeeklyScores       = weeklyScores,
                TechLabels         = techGroups.Select(t => t.Tech).ToList(),
                TechScores         = techGroups.Select(t => Math.Round(t.Avg, 1)).ToList(),
                ScoreDistribution  = scoreDist
            });
        }

        // ── Leaderboard ───────────────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> Leaderboard()
        {
            var user = await _userManager.GetUserAsync(User);
            ViewBag.CurrentUserName = user?.FullName ?? "Rahul Sharma";
            return View();
        }
    }
}
