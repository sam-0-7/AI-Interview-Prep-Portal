using AIInterviewPortal.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AIInterviewPortal.Data
{
    /// <summary>
    /// Design-time factory used by EF CLI tools (dotnet ef migrations add).
    /// This avoids "unable to create DbContext" errors at design time.
    /// </summary>
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer(
                    "Server=(localdb)\\mssqllocaldb;Database=AIInterviewPortalDB;Trusted_Connection=True;MultipleActiveResultSets=true")
                .Options;

            return new AppDbContext(options);
        }
    }
}
