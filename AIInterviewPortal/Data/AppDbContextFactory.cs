using AIInterviewPortal.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace AIInterviewPortal.Data
{
    /// <summary>
    /// Design-time factory used by EF CLI tools (dotnet ef migrations add).
    /// Uses environment variable or appsettings.json for the connection string.
    /// </summary>
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            // Try env variable first (set before running dotnet ef)
            var connStr = Environment.GetEnvironmentVariable("DATABASE_URL");

            if (string.IsNullOrEmpty(connStr))
            {
                // Fall back to appsettings.json
                var config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: true)
                    .AddEnvironmentVariables()
                    .Build();
                connStr = config.GetConnectionString("DefaultConnection")
                    ?? "Host=localhost;Database=AIInterviewPortalDB;Username=postgres;Password=postgres";
            }

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseNpgsql(connStr)
                .Options;

            return new AppDbContext(options);
        }
    }
}
