using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace AIInterviewPortal.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly ILogger<GeminiService> _logger;

        // Gemini 2.5 Flash endpoint
        private const string BaseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

        public GeminiService(HttpClient httpClient, IConfiguration config, ILogger<GeminiService> logger)
        {
            _httpClient = httpClient;
            _apiKey = config["Gemini:ApiKey"] ?? string.Empty;
            _logger = logger;
        }

        // ── Generate Interview Questions ──────────────────────────────────────
        public async Task<List<string>> GenerateQuestionsAsync(string technology, string difficulty, int count)
        {
            var prompt = $"""
                You are an expert technical interviewer.
                Generate exactly {count} {difficulty}-level {technology} interview questions.
                Return ONLY a numbered list. No explanations, no extra text, no markdown headers.
                Format:
                1. Question one
                2. Question two
                ...
                """;

            var rawText = await CallGeminiAsync(prompt);
            return ParseNumberedList(rawText, count);
        }

        // ── Evaluate User Answer ──────────────────────────────────────────────
        public async Task<EvaluationResult> EvaluateAnswerAsync(string technology, string question, string userAnswer)
        {
            var prompt =
                $"You are a senior {technology} interviewer evaluating a candidate's answer.\n\n" +
                $"Question: {question}\n\n" +
                $"Candidate's Answer: {userAnswer}\n\n" +
                "Evaluate the answer and return ONLY valid JSON in this exact format (no markdown, no explanation):\n" +
                "{\n" +
                "  \"score\": <integer 0 to 10>,\n" +
                "  \"feedback\": \"<2-3 sentence overall feedback>\",\n" +
                "  \"missingPoints\": [\"<point 1>\", \"<point 2>\", \"<point 3>\"],\n" +
                "  \"suggestedAnswer\": \"<comprehensive ideal answer in 3-5 sentences>\"\n" +
                "}";

            var rawText = await CallGeminiAsync(prompt);
            return ParseEvaluation(rawText);
        }

        // ── Internal: Call Gemini API ─────────────────────────────────────────
        private async Task<string> CallGeminiAsync(string prompt)
        {
            if (string.IsNullOrEmpty(_apiKey) || _apiKey == "YOUR_GEMINI_API_KEY_HERE")
                throw new InvalidOperationException(
                    "Gemini API key is not configured. Please add your key to appsettings.json under Gemini:ApiKey.");

            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                },
                generationConfig = new
                {
                    temperature = 0.7,
                    maxOutputTokens = 2048
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"{BaseUrl}?key={_apiKey}";
            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API error {Status}: {Error}", response.StatusCode, error);
                throw new Exception($"Gemini API returned {response.StatusCode}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            var node = JsonNode.Parse(responseJson);
            var text = node?["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.GetValue<string>() ?? string.Empty;
            return text.Trim();
        }

        // ── Parse numbered list ───────────────────────────────────────────────
        private static List<string> ParseNumberedList(string text, int expected)
        {
            var lines = text.Split('\n', StringSplitOptions.RemoveEmptyEntries);
            var questions = new List<string>();

            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                // Remove leading number and dot: "1. Question" → "Question"
                if (trimmed.Length > 2 && char.IsDigit(trimmed[0]))
                {
                    var dotIndex = trimmed.IndexOf('.');
                    if (dotIndex > 0 && dotIndex < 4)
                    {
                        var q = trimmed[(dotIndex + 1)..].Trim();
                        if (!string.IsNullOrWhiteSpace(q))
                            questions.Add(q);
                    }
                }
            }

            // Fallback: if parsing fails, return raw lines
            if (questions.Count == 0)
                questions = lines.Where(l => !string.IsNullOrWhiteSpace(l)).Take(expected).ToList();

            return questions.Take(expected).ToList();
        }

        // ── Parse evaluation JSON ─────────────────────────────────────────────
        private static EvaluationResult ParseEvaluation(string text)
        {
            try
            {
                // Strip markdown code fences if present
                var cleaned = text.Replace("```json", "").Replace("```", "").Trim();
                var node = JsonNode.Parse(cleaned);

                if (node == null) return FallbackResult();

                var missingArr = node["missingPoints"]?.AsArray();
                var missing = missingArr?.Select(x => x?.GetValue<string>() ?? "").ToList() ?? new List<string>();

                return new EvaluationResult
                {
                    Score        = node["score"]?.GetValue<int>() ?? 5,
                    Feedback     = node["feedback"]?.GetValue<string>() ?? "No feedback provided.",
                    MissingPoints    = missing,
                    SuggestedAnswer  = node["suggestedAnswer"]?.GetValue<string>() ?? ""
                };
            }
            catch
            {
                return FallbackResult();
            }
        }

        private static EvaluationResult FallbackResult() => new()
        {
            Score = 5,
            Feedback = "Your answer was received. The AI evaluation could not be fully parsed.",
            MissingPoints = new List<string>(),
            SuggestedAnswer = "Please review the official documentation for a comprehensive answer."
        };
    }

    // ── DTO returned from Gemini evaluation ──────────────────────────────────
    public class EvaluationResult
    {
        public int Score { get; set; }
        public string Feedback { get; set; } = string.Empty;
        public List<string> MissingPoints { get; set; } = new();
        public string SuggestedAnswer { get; set; } = string.Empty;
    }
}
