using AIInterviewPortal.Models.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AIInterviewPortal.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Technology> Technologies { get; set; }
        public DbSet<InterviewSession> InterviewSessions { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Explicit primary keys
            builder.Entity<Technology>().HasKey(t => t.TechId);
            builder.Entity<InterviewSession>().HasKey(s => s.SessionId);
            builder.Entity<Question>().HasKey(q => q.QuestionId);
            builder.Entity<Answer>().HasKey(a => a.AnswerId);

            // Answer → Question (one-to-one)
            builder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithOne(q => q.Answer)
                .HasForeignKey<Answer>(a => a.QuestionId);

            // Question → Session
            builder.Entity<Question>()
                .HasOne(q => q.Session)
                .WithMany(s => s.Questions)
                .HasForeignKey(q => q.SessionId);

            // Session → User
            builder.Entity<InterviewSession>()
                .HasOne(s => s.User)
                .WithMany(u => u.InterviewSessions)
                .HasForeignKey(s => s.UserId);

            // Session → Technology
            builder.Entity<InterviewSession>()
                .HasOne(s => s.Technology)
                .WithMany(t => t.InterviewSessions)
                .HasForeignKey(s => s.TechId);

            // Seed Technologies
            builder.Entity<Technology>().HasData(
                new Technology { TechId = 1, Name = ".NET",       IconClass = "fab fa-windows",    Color = "#512BD4", Description = "ASP.NET Core, C#, EF Core, CLR, Dependency Injection" },
                new Technology { TechId = 2, Name = "Java",       IconClass = "fab fa-java",        Color = "#ED8B00", Description = "Spring Boot, JVM, OOP, Collections, Multithreading" },
                new Technology { TechId = 3, Name = "Python",     IconClass = "fab fa-python",      Color = "#3776AB", Description = "Django, Flask, Data Structures, OOP, Libraries" },
                new Technology { TechId = 4, Name = "SQL",        IconClass = "fas fa-database",    Color = "#CC2927", Description = "Queries, Joins, Stored Procedures, Indexing, Normalization" },
                new Technology { TechId = 5, Name = "C#",         IconClass = "fas fa-code",        Color = "#9B4F96", Description = "LINQ, Async/Await, OOP, Design Patterns, Delegates" },
                new Technology { TechId = 6, Name = "JavaScript", IconClass = "fab fa-js-square",   Color = "#F7DF1E", Description = "ES6+, Promises, DOM, React, Node.js Fundamentals" },
                new Technology { TechId = 7, Name = "HTML",        IconClass = "fab fa-html5",       Color = "#E34F26", Description = "HTML5, Semantic Elements, Forms, Accessibility, SEO" },
                new Technology { TechId = 8, Name = "CSS",         IconClass = "fab fa-css3-alt",    Color = "#1572B6", Description = "Flexbox, Grid, Animations, Media Queries, BEM Methodology" },
                new Technology { TechId = 9, Name = "React",       IconClass = "fab fa-react",       Color = "#61DAFB", Description = "Components, Hooks, State Management, JSX, Virtual DOM" },
                new Technology { TechId = 10, Name = "Angular",    IconClass = "fab fa-angular",     Color = "#DD0031", Description = "Components, Services, RxJS, Dependency Injection, Routing" },
                new Technology { TechId = 11, Name = "Node.js",    IconClass = "fab fa-node-js",     Color = "#339933", Description = "Express, REST APIs, Middleware, Event Loop, Streams" },
                new Technology { TechId = 12, Name = "TypeScript",  IconClass = "fas fa-code",       Color = "#3178C6", Description = "Types, Interfaces, Generics, Enums, Type Guards" },
                new Technology { TechId = 13, Name = "MongoDB",    IconClass = "fas fa-leaf",        Color = "#47A248", Description = "Documents, Aggregation Pipeline, Indexing, Replica Sets" },
                new Technology { TechId = 14, Name = "AWS",        IconClass = "fab fa-aws",         Color = "#FF9900", Description = "EC2, S3, Lambda, IAM, CloudFormation Basics" },
                new Technology { TechId = 15, Name = "C++",        IconClass = "fas fa-code",        Color = "#00599C", Description = "Pointers, Memory Management, OOP, STL, Templates" }
            );
        }
    }
}
