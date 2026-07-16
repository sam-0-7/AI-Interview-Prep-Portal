using AIInterviewPortal.Data;
using AIInterviewPortal.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIInterviewPortal.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly AppDbContext _db;

        public HomeController(AppDbContext db)
        {
            _db = db;
        }

        // GET /  → Landing page (no auth required)
        [AllowAnonymous]
        public IActionResult Index()
        {
            if (User.Identity?.IsAuthenticated == true)
                return RedirectToAction("Index", "Dashboard");
            return View();
        }

        [AllowAnonymous]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() => View();

        [AllowAnonymous]
        [Route("debug-db")]
        public async Task<IActionResult> DebugDb()
        {
            try
            {
                var techCount = await _db.Technologies.CountAsync();
                var userCount = await _db.Users.CountAsync();
                var conn = _db.Database.GetConnectionString();
                var maskedConn = conn;
                if (conn != null && conn.Contains("Password="))
                {
                    var idx = conn.IndexOf("Password=");
                    var endIdx = conn.IndexOf(";", idx);
                    if (endIdx == -1) endIdx = conn.Length;
                    maskedConn = conn.Substring(0, idx) + "Password=***" + conn.Substring(endIdx);
                }
                return Content($"Database connection SUCCESS! Technologies count: {techCount}, Users count: {userCount}. Conn: {maskedConn}");
            }
            catch (Exception ex)
            {
                var conn = _db.Database.GetConnectionString();
                var maskedConn = conn;
                if (conn != null && conn.Contains("Password="))
                {
                    var idx = conn.IndexOf("Password=");
                    var endIdx = conn.IndexOf(";", idx);
                    if (endIdx == -1) endIdx = conn.Length;
                    maskedConn = conn.Substring(0, idx) + "Password=***" + conn.Substring(endIdx);
                }
                return Content($"Database connection FAILED: {ex.Message}\n\nStack Trace:\n{ex.StackTrace}\n\nInner Exception:\n{ex.InnerException?.Message}\n\nConn: {maskedConn}");
            }
        }
    }
}
