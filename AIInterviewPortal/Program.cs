using AIInterviewPortal.Data;
using AIInterviewPortal.Models.Domain;
using AIInterviewPortal.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──────────────────────────────────────────────────────────────────
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
if (!string.IsNullOrEmpty(databaseUrl))
{
    var connectionString = databaseUrl;
    if (connectionString.StartsWith("postgres://") || connectionString.StartsWith("postgresql://"))
    {
        var databaseUri = new Uri(connectionString);
        var userInfo = databaseUri.UserInfo.Split(':');
        var username = Uri.UnescapeDataString(userInfo[0]);
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var host = databaseUri.Host;
        var port = databaseUri.Port > 0 ? databaseUri.Port : 5432;
        var database = Uri.UnescapeDataString(databaseUri.LocalPath.TrimStart('/'));

        connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
    }
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite("Data Source=AIInterviewPortal.db"));
}

// ── Identity ──────────────────────────────────────────────────────────────────
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // ── Password Policy ───────────────────────────────────────────────────
    options.Password.RequireDigit           = true;
    options.Password.RequiredLength         = 8;     // increased from 6
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase       = true;  // require at least one uppercase
    options.SignIn.RequireConfirmedAccount  = false;

    // ── Brute-Force Lockout ───────────────────────────────────────────────
    options.Lockout.DefaultLockoutTimeSpan  = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers      = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// ── Auth cookies ──────────────────────────────────────────────────────────────
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath  = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/Login";
});

// ── Gemini AI Service ─────────────────────────────────────────────────────────
builder.Services.AddHttpClient<GeminiService>();
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

// ── MVC ───────────────────────────────────────────────────────────────────────
builder.Services.AddControllersWithViews();

var app = builder.Build();

// ── Auto-migrate on startup ───────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
    {
        db.Database.EnsureCreated();
    }
    else
    {
        db.Database.Migrate();
    }
}

// ── Middleware pipeline ───────────────────────────────────────────────────────
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
