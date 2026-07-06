namespace AIInterviewPortal.Models.Domain
{
    public class InterviewSession
    {
        public int SessionId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int TechId { get; set; }
        public string Difficulty { get; set; } = "Beginner"; // Beginner / Intermediate / Advanced
        public int QuestionCount { get; set; } = 10;
        public int CompletedQuestions { get; set; } = 0;
        public double? AverageScore { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        public ApplicationUser User { get; set; } = null!;
        public Technology Technology { get; set; } = null!;
        public ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}
