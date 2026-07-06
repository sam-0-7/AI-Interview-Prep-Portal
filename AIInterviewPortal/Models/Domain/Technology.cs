namespace AIInterviewPortal.Models.Domain
{
    public class Technology
    {
        public int TechId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IconClass { get; set; } = string.Empty;   // e.g. "fab fa-microsoft"
        public string Color { get; set; } = string.Empty;        // e.g. "#512BD4"
        public string Description { get; set; } = string.Empty;
        public ICollection<InterviewSession> InterviewSessions { get; set; } = new List<InterviewSession>();
    }
}
