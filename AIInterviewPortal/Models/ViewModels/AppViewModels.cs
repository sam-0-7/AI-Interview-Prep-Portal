using AIInterviewPortal.Models.Domain;

namespace AIInterviewPortal.Models.ViewModels
{
    public class DashboardViewModel
    {
        public string UserName { get; set; } = string.Empty;
        public int TotalSessions { get; set; }
        public int TotalQuestions { get; set; }
        public int AnsweredQuestions { get; set; }
        public double AverageScore { get; set; }
        public List<string> WeakTopics { get; set; } = new();
        public List<string> StrongTopics { get; set; } = new();
        public List<InterviewSession> RecentSessions { get; set; } = new();

        // For Chart.js — weekly scores (last 7 days)
        public List<string> WeeklyLabels { get; set; } = new();
        public List<double> WeeklyScores { get; set; } = new();

        // Tech-wise performance
        public List<string> TechLabels { get; set; } = new();
        public List<double> TechScores { get; set; } = new();
    }

    public class SelectTechViewModel
    {
        public List<Technology> Technologies { get; set; } = new();
        public string SelectedTech { get; set; } = string.Empty;
        public int SelectedTechId { get; set; }
        public string Difficulty { get; set; } = "Beginner";
        public int QuestionCount { get; set; } = 10;
    }

    public class QuestionViewModel
    {
        public int SessionId { get; set; }
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int CurrentNumber { get; set; }
        public int TotalQuestions { get; set; }
        public string Technology { get; set; } = string.Empty;
        public string TechColor { get; set; } = string.Empty;
        public string Difficulty { get; set; } = string.Empty;
        public string UserAnswer { get; set; } = string.Empty;
    }

    public class FeedbackViewModel
    {
        public int SessionId { get; set; }
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string UserAnswer { get; set; } = string.Empty;
        public double Score { get; set; }
        public string Feedback { get; set; } = string.Empty;
        public List<string> MissingPoints { get; set; } = new();
        public string SuggestedAnswer { get; set; } = string.Empty;
        public int CurrentNumber { get; set; }
        public int TotalQuestions { get; set; }
        public string Technology { get; set; } = string.Empty;
        public string TechColor { get; set; } = string.Empty;
        public bool IsLastQuestion => CurrentNumber >= TotalQuestions;
    }

    public class SessionSummaryViewModel
    {
        public int SessionId { get; set; }
        public string Technology { get; set; } = string.Empty;
        public string TechColor { get; set; } = string.Empty;
        public string TechIcon { get; set; } = string.Empty;
        public string Difficulty { get; set; } = string.Empty;
        public int TotalQuestions { get; set; }
        public double AverageScore { get; set; }
        public List<QuestionAnswerSummary> QnA { get; set; } = new();
        public List<string> WeakAreas { get; set; } = new();
        public DateTime CompletedAt { get; set; }
    }

    public class QuestionAnswerSummary
    {
        public string Question { get; set; } = string.Empty;
        public string UserAnswer { get; set; } = string.Empty;
        public double Score { get; set; }
        public string Feedback { get; set; } = string.Empty;
    }

    public class ProgressViewModel
    {
        public int TotalSessions { get; set; }
        public int TotalQuestions { get; set; }
        public double OverallAvgScore { get; set; }
        public double ImprovementPercent { get; set; }
        public List<SessionHistoryItem> SessionHistory { get; set; } = new();

        // Charts
        public List<string> WeeklyLabels { get; set; } = new();
        public List<double> WeeklyScores { get; set; } = new();
        public List<string> TechLabels { get; set; } = new();
        public List<double> TechScores { get; set; } = new();
        public List<double> ScoreDistribution { get; set; } = new(); // 0-3, 4-6, 7-10
    }

    public class SessionHistoryItem
    {
        public int SessionId { get; set; }
        public string Technology { get; set; } = string.Empty;
        public string TechColor { get; set; } = string.Empty;
        public string TechIcon { get; set; } = string.Empty;
        public string Difficulty { get; set; } = string.Empty;
        public int TotalQuestions { get; set; }
        public double AverageScore { get; set; }
        public DateTime Date { get; set; }
    }
}
