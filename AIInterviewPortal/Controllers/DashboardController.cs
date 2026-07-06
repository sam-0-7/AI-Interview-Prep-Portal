using AIInterviewPortal.Data;
using AIInterviewPortal.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIInterviewPortal.Models.Domain;

namespace AIInterviewPortal.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public DashboardController(AppDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
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
                .SelectMany(s => s.Questions)
                .Where(q => q.Answer != null)
                .Select(q => q.Answer!)
                .ToList();

            var totalQuestions   = allAnswers.Count;
            var avgScore         = totalQuestions > 0 ? allAnswers.Average(a => a.AIScore) : 0;

            // Tech-wise average for weak/strong
            var techGroups = sessions
                .GroupBy(s => s.Technology.Name)
                .Select(g => new
                {
                    Tech = g.Key,
                    Avg  = g.SelectMany(s => s.Questions).Where(q => q.Answer != null)
                            .Average(q => q.Answer!.AIScore)
                })
                .ToList();

            var weakTopics   = techGroups.Where(t => t.Avg < 5).Select(t => t.Tech).ToList();
            var strongTopics = techGroups.Where(t => t.Avg >= 7).Select(t => t.Tech).ToList();

            // Weekly labels + scores (last 7 days)
            var weeklyLabels = new List<string>();
            var weeklyScores = new List<double>();
            for (int i = 6; i >= 0; i--)
            {
                var day    = DateTime.UtcNow.Date.AddDays(-i);
                var dayStr = day.ToString("ddd");
                var dayAnswers = sessions
                    .Where(s => s.CompletedAt.HasValue && s.CompletedAt.Value.Date == day)
                    .SelectMany(s => s.Questions).Where(q => q.Answer != null)
                    .Select(q => q.Answer!.AIScore).ToList();

                weeklyLabels.Add(dayStr);
                weeklyScores.Add(dayAnswers.Count > 0 ? Math.Round(dayAnswers.Average(), 1) : 0);
            }

            // Tech-wise for chart
            var techLabels = techGroups.Select(t => t.Tech).ToList();
            var techScores = techGroups.Select(t => Math.Round(t.Avg, 1)).ToList();

            var vm = new DashboardViewModel
            {
                UserName         = user.FullName,
                TotalSessions    = sessions.Count,
                TotalQuestions   = totalQuestions,
                AnsweredQuestions = totalQuestions,
                AverageScore     = Math.Round(avgScore, 1),
                WeakTopics       = weakTopics,
                StrongTopics     = strongTopics,
                RecentSessions   = sessions.Take(5).ToList(),
                WeeklyLabels     = weeklyLabels,
                WeeklyScores     = weeklyScores,
                TechLabels       = techLabels,
                TechScores       = techScores
            };

            return View(vm);
        }
    }
}
