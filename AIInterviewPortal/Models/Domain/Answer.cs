namespace AIInterviewPortal.Models.Domain
{
    public class Answer
    {
        public int AnswerId { get; set; }
        public int QuestionId { get; set; }
        public string UserAnswer { get; set; } = string.Empty;
        public double AIScore { get; set; }             // 0-10
        public string AIFeedback { get; set; } = string.Empty;
        public string MissingPoints { get; set; } = string.Empty;  // JSON array stored as string
        public string SuggestedAnswer { get; set; } = string.Empty;
        public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;

        public Question Question { get; set; } = null!;
    }
}
