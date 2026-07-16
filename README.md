# Glassmorphism AI Interview Preparation Portal

An interactive, state-of-the-art AI-powered Technical Interview Preparation platform. The application uses **Gemini AI (2.5 Flash)** to generate dynamic, topic-specific interview questions at various difficulty levels, evaluate candidate answers in real-time, grade responses out of 10, and analyze weak areas.

The design utilizes a highly polished, responsive **Glassmorphism visual interface** with modern typography, smooth gradient backdrops, and interactive UI micro-animations.

---

## 🚀 Key Features

* **AI Question Generation:** Dynamically asks questions based on chosen Technology (e.g., .NET, Java, Python, SQL, JS, TypeScript) and Difficulty (Easy, Medium, Hard).
* **AI Evaluation & Grading:** Provides real-time scores (0-10), comprehensive constructive feedback, missing points, and suggested ideal answers.
* **Progress Tracking & Analytics:** View dashboard statistics, tech-specific average scores, weekly activity charts, and weak topics.
* **Leaderboard:** Track rankings and compare scores with other candidates.
* **Premium UX:** Designed with vibrant gradients, custom glassmorphism styles, responsive navigation, and transitions.

---

## 🛠️ Tech Stack

### Backend
* **Framework:** ASP.NET Core 10.0 MVC
* **Database:** PostgreSQL (with EF Core Migrations)
* **Authentication:** ASP.NET Core Identity (with brute-force lockout protection & secure password policies)
* **AI Engine:** Google Gemini 2.5 Flash API via HttpClient

### Frontend
* **Core:** HTML5, CSS3 (Vanilla Glassmorphic Design), Vanilla ES6+ JavaScript
* **Icons & Fonts:** FontAwesome & Google Fonts (Outfit, Inter)

---

## ⚙️ Local Setup Instructions

### Prerequisites
* [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
* [PostgreSQL](https://www.postgresql.org/) (installed and running locally)

### Step 1: Clone the Repo
```bash
git clone https://github.com/sam-0-7/AI-Interview-Prep-Portal.git
cd AI-Interview-Prep-Portal
```

### Step 2: Configure Environment/User Secrets
Never commit API Keys to git. Set your Gemini API key locally using .NET User Secrets:
```bash
cd AIInterviewPortal
dotnet user-secrets init
dotnet user-secrets set "Gemini:ApiKey" "YOUR_ACTUAL_GEMINI_API_KEY"
```

Configure your local database connection string in `appsettings.json` (make sure PostgreSQL is running):
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=AIInterviewPortalDB;Username=postgres;Password=YOUR_POSTGRES_PASSWORD"
}
```

### Step 3: Run the Application
Start the project:
```bash
dotnet run
```
The database migrations will run automatically on startup. Open your browser and navigate to `http://localhost:5000` or `https://localhost:5001`.

---

## ☁️ Deployment on Render

This project contains a pre-configured `render.yaml` blueprint and a `Dockerfile` for single-click deployment to **Render.com** (utilizing the PostgreSQL and Web Service free tiers).

1. Push your repository to GitHub.
2. Log in to your **[Render Dashboard](https://dashboard.render.com)**.
3. Click **New +** -> **Blueprint**.
4. Link your GitHub repository.
5. Provide your **`GEMINI__APIKEY`** when prompted by Render.
6. Click **Approve** to build and spin up the database and backend application!
