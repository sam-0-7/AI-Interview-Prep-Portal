namespace AIInterviewPortal.Models.Domain
{
    public class Question
    {
        public int QuestionId { get; set; }
        public int SessionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int OrderIndex { get; set; }

        public InterviewSession Session { get; set; } = null!;
        public Answer? Answer { get; set; }
    }
}
