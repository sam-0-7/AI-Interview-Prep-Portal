// ==========================================================================
// AI Interview Prep Portal - Application JavaScript (Routing & Mock Engine)
// ==========================================================================

// Precompiled Mock Question Bank
const QUESTION_BANK = {
    "net": {
        "name": ".NET",
        "Beginner": [
            "Explain the difference between Value Types and Reference Types in C#.",
            "What is the difference between Method Overloading and Method Overriding?",
            "What are the access modifiers in C# and what do they restrict?"
        ],
        "Intermediate": [
            "What is Garbage Collection in .NET and how do Finalizers differ from Dispose?",
            "Explain LINQ deferred execution vs immediate execution with code examples.",
            "What is ASP.NET Core Middleware and how is the pipeline configured?"
        ],
        "Advanced": [
            "Describe the internals of async/await in C#, explaining how state machines and synchronization contexts function.",
            "Explain JIT compilation internals and how tiered compilation improves performance in modern .NET.",
            "What is Memory<T> and Span<T> in .NET? Explain how they reduce allocations and improve performance."
        ]
    },
    "java": {
        "name": "Java",
        "Beginner": [
            "Explain the OOP concept of Polymorphism with an example in Java.",
            "What is the difference between '==' and '.equals()' when comparing strings in Java?",
            "What is the difference between ArrayList and LinkedList in Java?"
        ],
        "Intermediate": [
            "How does Java Memory Management work? Explain JVM Heap vs Stack memory namespaces.",
            "Explain the difference between Checked and Unchecked Exceptions in Java.",
            "What is Java Reflection API and what are its performance implications?"
        ],
        "Advanced": [
            "What is the ForkJoinPool in Java concurrency, and how does the work-stealing algorithm function?",
            "Explain JVM Garbage Collection algorithms (G1 vs ZGC) and how they minimize pause latency.",
            "Describe Java ClassLoader hierarchy and the delegation model runtime behavior."
        ]
    },
    "python": {
        "name": "Python",
        "Beginner": [
            "Explain the differences between lists and tuples in Python.",
            "What is a dictionary comprehension and how do you write one?",
            "Explain how memory management and garbage collection work in Python at a basic level."
        ],
        "Intermediate": [
            "What is the Global Interpreter Lock (GIL) in Python, and how does it affect CPU-bound multi-threaded programs?",
            "What are Python generators and decorators? Explain the difference between yield and return.",
            "Explain how namespaces, scopes (LEGB rule), and closures operate in Python."
        ],
        "Advanced": [
            "Describe Python Metaclasses and how they can be used to customize or intercept class instantiation.",
            "Explain Python asyncio runtime internals, the Event Loop, and Task/Coroutine scheduling.",
            "How does the CPython reference counting and cyclic garbage collector work under the hood?"
        ]
    },
    "javascript": {
        "name": "JavaScript",
        "Beginner": [
            "What are the differences between let, const, and var in modern JavaScript?",
            "Explain closure in JavaScript and give a simple code example.",
            "What is the difference between double equals (==) and triple equals (===)?"
        ],
        "Intermediate": [
            "Explain event delegation in JavaScript and why it is useful in DOM manipulation.",
            "Describe the difference between Promises, Callbacks, and Async/Await asynchronous syntaxes.",
            "What is prototypal inheritance and how does the prototype chain work in JS?"
        ],
        "Advanced": [
            "Describe the Javascript Event Loop, Call Stack, Microtask queue, and Macrotask queue processing hierarchy.",
            "Explain the V8 engine compilation phases, hidden classes, and inline caches optimizations.",
            "How do Memory Leaks occur in SPA JavaScript apps, and how can you isolate them using Chrome DevTools?"
        ]
    },
    "sql": {
        "name": "SQL",
        "Beginner": [
            "What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN in SQL?",
            "Explain the difference between WHERE and HAVING clauses.",
            "What is a Primary Key and how does it differ from a Foreign Key?"
        ],
        "Intermediate": [
            "Explain Database Indexing, B-Trees, and how Clustered Indexes differ from Non-Clustered Indexes.",
            "What are SQL Window Functions (like ROW_NUMBER, RANK, DENSE_RANK)?",
            "What is normalization? Explain 1NF, 2NF, and 3NF database structures."
        ],
        "Advanced": [
            "What are Isolation Levels in database transactions? Explain Dirty Reads, Non-repeatable Reads, and Phantom Reads.",
            "Explain query optimization techniques: parsing EXPLAIN plans and removing nested loops/table scans.",
            "Describe the Write-Ahead Logging (WAL) mechanism and ACID compliance restoration in crashes."
        ]
    },
    "git": {
        "name": "Git",
        "Beginner": [
            "What is the difference between git pull and git fetch?",
            "Explain git status, git add, and git commit flow.",
            "What is the difference between a soft reset, mixed reset, and hard reset?"
        ],
        "Intermediate": [
            "Explain how git rebase works and how it differs from git merge.",
            "What is git stash and when would you use it?",
            "How do you resolve merge conflicts in Git?"
        ],
        "Advanced": [
            "Describe how Git internally stores objects using blobs, trees, commits, and reference hashes.",
            "Explain the Git Reflog and how to recover a hard-deleted commit that has been garbage collected.",
            "What is git cherry-pick and how does it calculate diff patch applications?"
        ]
    },
    "html": {
        "name": "HTML",
        "Beginner": [
            "What is the difference between block-level elements and inline elements in HTML?",
            "What is the purpose of semantic HTML tags (like <header>, <article>, <footer>)?",
            "Explain the difference between <div> and <span> tags."
        ],
        "Intermediate": [
            "Describe the HTML5 storage mechanisms: localStorage, sessionStorage, and cookies.",
            "What is the role of the 'DOCTYPE' declaration in HTML documents?",
            "Explain the 'srcset' and 'sizes' attributes in the <img> tag and how they serve responsive images."
        ],
        "Advanced": [
            "What is the Critical Rendering Path in HTML page loading, and how do async/defer scripts affect it?",
            "Explain Shadow DOM and how it differs from standard light DOM in web components.",
            "How does the browser handle reflow and repaint during DOM tree parsing?"
        ]
    },
    "css": {
        "name": "CSS",
        "Beginner": [
            "What is the CSS Box Model, and what are its components?",
            "What is the difference between absolute, relative, and fixed positioning?",
            "Explain the difference between class selectors and ID selectors in CSS."
        ],
        "Intermediate": [
            "Explain CSS Flexbox vs CSS Grid. When would you choose one over the other?",
            "What is CSS specificity, and how does the browser calculate which style rules apply?",
            "Describe CSS variables (custom properties) and how they differ from SASS/LESS variables."
        ],
        "Advanced": [
            "Describe BEM (Block Element Modifier) methodology and how it prevents CSS style pollution.",
            "Explain CSS GPU hardware acceleration, compositing layers, and the 'will-change' property.",
            "What is subgrid in CSS Grid, and how does it solve nested grid layout alignment issues?"
        ]
    },
    "cpp": {
        "name": "C++",
        "Beginner": [
            "What is the difference between a reference and a pointer in C++?",
            "Explain the concept of Function Overloading in C++.",
            "What is the purpose of the 'const' keyword in variable declarations?"
        ],
        "Intermediate": [
            "What is RAII (Resource Acquisition Is Initialization) in C++ and how is it used?",
            "Explain the difference between stack allocation and heap allocation in C++.",
            "What are smart pointers (unique_ptr, shared_ptr, weak_ptr) and how do they prevent memory leaks?"
        ],
        "Advanced": [
            "Explain C++ template metaprogramming and how SFINAE (Substitution Failure Is Not An Error) works.",
            "What is move semantics, rvalue references (&&), and std::move in C++11?",
            "Describe virtual inheritance, the vtable (virtual table), and how dynamic dispatch works in C++ polymorphic calls."
        ]
    }
};

// Seed Mock Leaderboard
const SEEDED_LEADERBOARD = [
    { name: "Alex Mercer", interviews: 25, score: 9.4, streak: 12, isUser: false },
    { name: "Sophia Lin", interviews: 18, score: 9.1, streak: 8, isUser: false },
    { name: "Marcus Vance", interviews: 20, score: 8.8, streak: 6, isUser: false },
    { name: "You (Guest)", interviews: 0, score: 0.0, streak: 0, isUser: true },
    { name: "Elena Rostova", interviews: 15, score: 8.5, streak: 4, isUser: false },
    { name: "Devon Reynolds", interviews: 10, score: 7.9, streak: 3, isUser: false },
    { name: "Hiroshi Sato", interviews: 8, score: 7.5, streak: 2, isUser: false }
];

// App State Management
let currentUser = null;
let sessionHistory = [];
let streakCalendar = [];
let leaderboard = [];

// Active Interview State
let activeSession = {
    techId: null,
    difficulty: "Beginner",
    questionCount: 3,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    scores: [],
    feedbacks: [],
    startTime: null,
    timerInterval: null,
    timeLeft: 300 // 5 minutes per question
};

// Init application state
document.addEventListener("DOMContentLoaded", () => {
    loadStateFromStorage();
    renderTechnologiesGrid();
    
    // Auto login simulation for quick guest viewing
    if (localStorage.getItem("ai_user")) {
        currentUser = JSON.parse(localStorage.getItem("ai_user"));
        navigateTo('dashboard-shell');
    } else {
        navigateTo('landing');
    }
});

// Load state from localStorage or seed mock defaults
function loadStateFromStorage() {
    if (localStorage.getItem("ai_user")) {
        currentUser = JSON.parse(localStorage.getItem("ai_user"));
    }
    
    if (localStorage.getItem("ai_history")) {
        sessionHistory = JSON.parse(localStorage.getItem("ai_history"));
    } else {
        // Pre-seed some history to make the charts look beautiful
        sessionHistory = [
            { tech: "JavaScript", difficulty: "Beginner", questions: 3, avgScore: 7.3, date: "2026-07-01" },
            { tech: "SQL", difficulty: "Intermediate", questions: 3, avgScore: 8.0, date: "2026-07-03" },
            { tech: "Python", difficulty: "Beginner", questions: 5, avgScore: 8.6, date: "2026-07-05" }
        ];
        localStorage.setItem("ai_history", JSON.stringify(sessionHistory));
    }
    
    if (localStorage.getItem("ai_streak")) {
        streakCalendar = JSON.parse(localStorage.getItem("ai_streak"));
    } else {
        // Active dates representation
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        streakCalendar = [yesterday, today];
        localStorage.setItem("ai_streak", JSON.stringify(streakCalendar));
    }

    if (localStorage.getItem("ai_leaderboard")) {
        leaderboard = JSON.parse(localStorage.getItem("ai_leaderboard"));
    } else {
        leaderboard = [...SEEDED_LEADERBOARD];
        localStorage.setItem("ai_leaderboard", JSON.stringify(leaderboard));
    }
}

// ==========================================================================
// View Router Navigation
// ==========================================================================
function navigateTo(viewId) {
    // Hide all main pages
    document.getElementById("view-landing").classList.remove("active");
    document.getElementById("view-auth").classList.remove("active");
    document.getElementById("view-dashboard-shell").classList.remove("active");
    
    // Toggle navigation bar display
    const navbar = document.getElementById("public-navbar");
    if (viewId === "dashboard-shell") {
        navbar.style.display = "none";
    } else {
        navbar.style.display = "flex";
    }
    
    // Show active page
    document.getElementById(`view-${viewId}`).classList.add("active");
    
    // View initialization scripts
    if (viewId === "dashboard-shell") {
        updateSidebarDisplay();
        switchDashboardView("dashboard");
    }
}

function switchDashboardView(subViewId) {
    // Hide all sub-dashboard views
    const subViews = document.querySelectorAll(".dashboard-main > div");
    subViews.forEach(view => view.style.display = "none");
    
    // Remove active state from sidebar items
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach(item => item.classList.remove("active"));
    
    // Show selected view
    document.getElementById(`sub-${subViewId}`).style.display = "block";
    
    // Highlight matching sidebar item
    let mapping = {
        "dashboard": "menu-dashboard",
        "select-tech": "menu-practice",
        "select-difficulty": "menu-practice",
        "practice": "menu-practice",
        "feedback": "menu-practice",
        "summary": "menu-practice",
        "progress": "menu-progress",
        "leaderboard": "menu-leaderboard",
        "profile": "menu-profile"
    };
    const sidebarId = mapping[subViewId];
    if (sidebarId) {
        document.getElementById(sidebarId).classList.add("active");
    }
    
    // Viewport specifics render
    if (subViewId === "dashboard") {
        renderDashboardStats();
        renderDashboardCharts();
        renderDailyStreakGrid("streak-calendar-grid");
        renderRecentSessionsLogs();
    } else if (subViewId === "progress") {
        renderDetailedProgressCharts();
        renderDailyStreakGrid("progress-streak-calendar");
        document.getElementById("progress-streak-count-desc").innerText = `Total Active Streak: ${calculateCurrentStreak()} Days`;
    } else if (subViewId === "leaderboard") {
        renderLeaderboardTable();
    } else if (subViewId === "profile") {
        loadProfileFields();
    } else if (subViewId === "select-tech") {
        resetTechSelection();
    }
}

// Toggle Sign In / Create Account Tab
function toggleAuthTab(tabName) {
    document.getElementById("tab-login").classList.remove("active");
    document.getElementById("tab-register").classList.remove("active");
    document.getElementById("form-login").classList.remove("active");
    document.getElementById("form-register").classList.remove("active");
    
    document.getElementById(`tab-${tabName}`).classList.add("active");
    document.getElementById(`form-${tabName}`).classList.add("active");
}

// ==========================================================================
// Authentication Submission Handler
// ==========================================================================
function handleAuthSubmit(event, action) {
    event.preventDefault();
    
    if (action === "login") {
        const email = document.getElementById("login-email").value;
        const name = email.split('@')[0];
        currentUser = {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            email: email
        };
    } else {
        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const confirm = document.getElementById("reg-confirm").value;
        
        if (password !== confirm) {
            alert("Passwords do not match!");
            return;
        }
        
        currentUser = {
            name: name,
            email: email
        };
    }
    
    // Save state
    localStorage.setItem("ai_user", JSON.stringify(currentUser));
    
    // Update user rank stats in leaderboard
    updateUserInLeaderboard();
    
    // Navigate to Dashboard
    navigateTo('dashboard-shell');
}

function logout() {
    localStorage.removeItem("ai_user");
    currentUser = null;
    navigateTo('landing');
}

function updateSidebarDisplay() {
    if (!currentUser) return;
    const initials = currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase();
    document.getElementById("user-initials").innerText = initials;
    document.getElementById("user-display-name").innerText = currentUser.name;
    document.getElementById("user-display-email").innerText = currentUser.email;
}

// ==========================================================================
// Technology Selection View Grid
// ==========================================================================
function renderTechnologiesGrid() {
    const grid = document.getElementById("practice-tech-grid");
    grid.innerHTML = "";
    
    const icons = {
        "net": "fa-brands fa-microsoft",
        "java": "fa-brands fa-java",
        "python": "fa-brands fa-python",
        "javascript": "fa-brands fa-js",
        "sql": "fa-solid fa-database",
        "git": "fa-brands fa-git-alt",
        "html": "fa-brands fa-html5",
        "css": "fa-brands fa-css3-alt",
        "cpp": "fa-solid fa-code"
    };
    
    const colors = {
        "net": "#6EA6FF",
        "java": "#FF5722",
        "python": "#FFD600",
        "javascript": "#FFDF00",
        "sql": "#4CAF50",
        "git": "#F05032",
        "html": "#e34f26",
        "css": "#1572b6",
        "cpp": "#00599c"
    };

    Object.keys(QUESTION_BANK).forEach(key => {
        const tech = QUESTION_BANK[key];
        const card = document.createElement("div");
        card.className = "tech-card";
        card.id = `tech-card-${key}`;
        card.onclick = () => selectTechnology(key);
        
        card.innerHTML = `
            <i class="${icons[key]}" style="color: ${colors[key]};"></i>
            <h3>${tech.name}</h3>
            <p>${key === "net" ? "ASP.NET Core MVC, Web API, Entity Framework" : key === "java" ? "Core Java, Spring Boot, Hibernate" : key === "python" ? "Django, Flask, Data Structures" : key === "javascript" ? "React, Node.js, Express" : key === "sql" ? "Queries, Joins, Stored Procedures" : key === "git" ? "Version Control & GitHub" : key === "html" ? "Markup, Semantics, Web Storage, SEO" : key === "css" ? "Box Model, Flexbox, Grid, Animations" : "Variables, Pointers, Templates, OOP"}</p>
        `;
        
        grid.appendChild(card);
    });
}

function resetTechSelection() {
    activeSession.techId = null;
    const cards = document.querySelectorAll(".tech-card");
    cards.forEach(c => c.classList.remove("selected"));
}

function selectTechnology(key) {
    const cards = document.querySelectorAll(".tech-card");
    cards.forEach(c => c.classList.remove("selected"));
    
    document.getElementById(`tech-card-${key}`).classList.add("selected");
    activeSession.techId = key;
}

function proceedToDifficulty() {
    if (!activeSession.techId) {
        alert("Please select a technology first!");
        return;
    }
    
    // Update config title header text
    const techName = QUESTION_BANK[activeSession.techId].name;
    document.getElementById("config-selected-tech-title").innerText = `Configure Interview Session: ${techName}`;
    switchDashboardView("select-difficulty");
}

function selectDifficulty(diff) {
    document.querySelectorAll(".difficulty-card").forEach(c => c.classList.remove("selected"));
    document.getElementById(`diff-${diff}`).classList.add("selected");
    activeSession.difficulty = diff;
}

function selectQuestionCount(count) {
    document.querySelectorAll(".count-chip").forEach(c => c.classList.remove("selected"));
    event.target.classList.add("selected");
    activeSession.questionCount = count;
}

// ==========================================================================
// Mock Coding Interview Sessions Controller
// ==========================================================================
function startInterviewSession() {
    const techData = QUESTION_BANK[activeSession.techId];
    const pool = techData[activeSession.difficulty];
    
    // Choose randomly from pools
    activeSession.questions = [];
    const tempPool = [...pool];
    
    for (let i = 0; i < activeSession.questionCount; i++) {
        if (tempPool.length === 0) break;
        const randIdx = Math.floor(Math.random() * tempPool.length);
        activeSession.questions.push(tempPool.splice(randIdx, 1)[0]);
    }
    
    activeSession.currentQuestionIndex = 0;
    activeSession.answers = [];
    activeSession.scores = [];
    activeSession.feedbacks = [];
    activeSession.startTime = Date.now();
    
    switchDashboardView("practice");
    loadActiveQuestion();
}

function loadActiveQuestion() {
    const qIndex = activeSession.currentQuestionIndex;
    const qText = activeSession.questions[qIndex];
    const techName = QUESTION_BANK[activeSession.techId].name;
    
    document.getElementById("workspace-tech-label").innerText = `Technology: ${techName}`;
    document.getElementById("workspace-difficulty-label").innerText = `Difficulty: ${activeSession.difficulty}`;
    document.getElementById("workspace-progress-text").innerText = `Question ${qIndex + 1} of ${activeSession.questions.length}`;
    
    const percentage = ((qIndex) / activeSession.questions.length) * 100;
    document.getElementById("workspace-progress-bar-fill").style.width = `${percentage}%`;
    
    document.getElementById("workspace-question-index").innerText = `Q${qIndex + 1}`;
    document.getElementById("workspace-question-prompt").innerText = qText;
    document.getElementById("workspace-answer").value = "";
    
    // Initialize question timer (5 mins)
    activeSession.timeLeft = 300;
    startWorkspaceTimer();
}

function startWorkspaceTimer() {
    clearInterval(activeSession.timerInterval);
    updateTimerText();
    
    activeSession.timerInterval = setInterval(() => {
        activeSession.timeLeft--;
        updateTimerText();
        
        if (activeSession.timeLeft <= 0) {
            clearInterval(activeSession.timerInterval);
            submitActiveQuestionAnswer(); // Auto-submit when time is up
        }
    }, 1000);
}

function updateTimerText() {
    const min = Math.floor(activeSession.timeLeft / 60);
    const sec = activeSession.timeLeft % 60;
    document.getElementById("workspace-timer").innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// Simulated Microphone Dictation Wave Logic
let isRecordingSimulated = false;
let simulateInterval = null;

function toggleVoiceMockSimulation() {
    const btn = document.getElementById("mic-toggle");
    const waves = document.getElementById("mic-waves");
    const status = document.getElementById("mic-status");
    const textarea = document.getElementById("workspace-answer");
    
    isRecordingSimulated = !isRecordingSimulated;
    
    if (isRecordingSimulated) {
        btn.classList.add("active");
        waves.classList.add("active");
        status.innerText = "Dictating voice response...";
        
        // Mock typing simulation
        const sampleText = "In C# value types hold data directly on the stack memory whereas reference types store a memory pointer pointing to the heap. Value types are copied by value while reference types are passed by reference assignment...";
        let wordArr = sampleText.split(" ");
        let i = 0;
        
        simulateInterval = setInterval(() => {
            if (i < wordArr.length) {
                textarea.value += (textarea.value ? " " : "") + wordArr[i++];
                i++;
            } else {
                clearInterval(simulateInterval);
            }
        }, 600);
    } else {
        btn.classList.remove("active");
        waves.classList.remove("active");
        status.innerText = "Click mic to simulate voice dictation";
        clearInterval(simulateInterval);
    }
}

// ==========================================================================
// Mock AI Grading Response Calculator
// ==========================================================================
function submitActiveQuestionAnswer() {
    clearInterval(activeSession.timerInterval);
    
    // Stop recording simulation if active
    if (isRecordingSimulated) toggleVoiceMockSimulation();
    
    const answer = document.getElementById("workspace-answer").value || "(No answer provided)";
    activeSession.answers.push(answer);
    
    // Loader overlay animations
    document.getElementById("ai-loader").classList.add("active");
    
    setTimeout(() => {
        const evalResult = runMockAIEvaluation(activeSession.questions[activeSession.currentQuestionIndex], answer);
        
        activeSession.scores.push(evalResult.score);
        activeSession.feedbacks.push(evalResult.feedback);
        
        document.getElementById("ai-loader").classList.remove("active");
        
        // Show evaluation review screen
        loadAIReviewFeedback(evalResult);
    }, 2000);
}

function runMockAIEvaluation(question, answer) {
    const wordCount = answer.trim().split(/\s+/).length;
    
    // Blank response case
    if (answer === "(No answer provided)" || wordCount < 5) {
        return {
            score: 0,
            feedback: "No substantive answer was provided to the evaluation compiler. A minimum standard definition is required to assign points.",
            missing: ["Missing core definition", "Lack of architectural explanation"],
            modelAnswer: "Ensure you define values, explain heap/stack structure distributions, and provide coding structure syntax samples."
        };
    }
    
    let score = 5;
    let missing = [];
    let feedback = "";
    let modelAnswer = "";

    // Keyword checking heuristics depending on Question Bank types
    const textLower = answer.toLowerCase();
    
    if (question.includes("Value Types") || question.includes("Value")) {
        const hasStack = textLower.includes("stack");
        const hasHeap = textLower.includes("heap");
        const hasStruct = textLower.includes("struct") || textLower.includes("value");
        const hasClass = textLower.includes("class") || textLower.includes("reference");
        
        if (hasStack) score += 2;
        else missing.push("Stack allocation reference");
        
        if (hasHeap) score += 2;
        else missing.push("Heap pointer reference");
        
        if (hasStruct && hasClass) score += 1;
        else missing.push("Class vs Struct paradigms");
        
        feedback = "Your answer successfully describes C# memory organization. " + 
                   (missing.length === 0 ? "You covered stack allocation, heap pointers, classes, and structs accurately." : `However, you missed: ${missing.join(', ')}.`);
        modelAnswer = "Value types (like structs, int, bool) are allocated on the Stack, storing data values directly. Reference types (like classes, interfaces, strings) are allocated on the Heap, and the variable stores a reference pointer pointing to that memory slot.";
    } 
    else if (question.includes("let, const, and var") || question.includes("let")) {
        const hasScope = textLower.includes("scope");
        const hasReassign = textLower.includes("reassign") || textLower.includes("re-assignment");
        const hasHoist = textLower.includes("hoist");
        const hasTdz = textLower.includes("dead zone") || textLower.includes("tdz");
        
        if (hasScope) score += 2;
        else missing.push("Block-scoping rules");
        
        if (hasReassign) score += 1;
        else missing.push("Re-assignment restrictions (const)");
        
        if (hasHoist) score += 1;
        else missing.push("Hoisting behaviors");
        
        if (hasTdz) score += 1;
        else missing.push("Temporal Dead Zone");
        
        feedback = "Your description of modern ES6 scope features is " + 
                   (score >= 8 ? "excellent and precise." : "partially correct. Keep in mind block scoping rules and hoisting.");
        modelAnswer = "var is function-scoped and hoisted with undefined. let and const are block-scoped, hoisted but kept in the Temporal Dead Zone (TDZ). const variables cannot be re-assigned identifiers, though arrays and objects inside them remain reference-mutable.";
    }
    else if (question.toLowerCase().includes("block-level") || question.toLowerCase().includes("inline") || question.toLowerCase().includes("html")) {
        const hasBlock = textLower.includes("block");
        const hasInline = textLower.includes("inline");
        const hasDiv = textLower.includes("div");
        const hasSpan = textLower.includes("span");
        
        if (hasBlock) score += 2;
        else missing.push("Block elements properties");
        
        if (hasInline) score += 2;
        else missing.push("Inline elements properties");
        
        if (hasDiv && hasSpan) score += 1;
        else missing.push("Div vs Span elements usecases");
        
        feedback = "Your answer details the differences in structural elements. " +
                   (missing.length === 0 ? "You explained screen flow block-level breaks, inline spacing, div, and span configurations well." : `Consider explaining: ${missing.join(', ')}.`);
        modelAnswer = "Block-level elements (e.g. <div>, <p>, <h1>) start on a new line and stretch to fill the full width of the container. Inline elements (e.g. <span>, <a>, <strong>) do not start on a new line and only occupy as much width as necessary, and cannot have top/bottom margins/paddings set directly.";
    }
    else if (question.toLowerCase().includes("box model") || question.toLowerCase().includes("position") || question.toLowerCase().includes("css")) {
        const hasContent = textLower.includes("content") || textLower.includes("width");
        const hasPadding = textLower.includes("padding");
        const hasBorder = textLower.includes("border");
        const hasMargin = textLower.includes("margin");
        
        if (hasPadding) score += 1.5;
        else missing.push("Padding element");
        
        if (hasBorder) score += 1.5;
        else missing.push("Border element");
        
        if (hasMargin) score += 1.5;
        else missing.push("Margin element");
        
        feedback = "Your explanation of layout spacing is " + 
                   (score >= 8 ? "excellent and clear." : "basic. Make sure to define the 4 layers: Content, Padding, Border, Margin.");
        modelAnswer = "The CSS Box Model is the foundation of styling layouts. It consists of four nested layers for each HTML element: 1) Content (width/height of text/images), 2) Padding (transparent area around the content), 3) Border (surrounds padding), and 4) Margin (transparent space outside the border separating elements).";
    }
    else if (question.toLowerCase().includes("pointer") || question.toLowerCase().includes("reference") || question.toLowerCase().includes("c++")) {
        const hasAddress = textLower.includes("address") || textLower.includes("ampersand") || textLower.includes("&");
        const hasNull = textLower.includes("null") || textLower.includes("nullptr");
        
        if (hasAddress) score += 2;
        else missing.push("Address-of operator (&) concepts");
        
        if (hasNull) score += 1.5;
        else missing.push("Nullability check behaviors (nullptr)");
        
        feedback = "Your C++ memory explanation shows " + 
                   (score >= 8 ? "great technical understanding." : "room for improvement regarding variables reference storage.");
        modelAnswer = "A pointer stores the memory address of another variable and can be re-assigned or set to nullptr. A reference is an alias for an existing variable, cannot be null, and must be initialized upon declaration without being re-assigned to reference a different object.";
    }
    // Generic fallback mock evaluation
    else {
        if (wordCount > 60) score += 3;
        else if (wordCount > 30) score += 2;
        else missing.push("Insufficient detail/examples");
        
        if (textLower.includes("performance") || textLower.includes("memory")) score += 1;
        else missing.push("Performance context");
        
        if (textLower.includes("example") || textLower.includes("code")) score += 1;
        else missing.push("Practical code samples");
        
        score = Math.min(score, 10);
        
        feedback = `AI Review: The response covers the core parts of the question. You structured it with ${wordCount} words. ` + 
                   (missing.length > 0 ? `To achieve a higher score, try adding: ${missing.join(', ')}.` : "Excellent technical depth and coverage.");
        modelAnswer = "A complete explanation defines terms, analyzes memory heap distribution implications, reviews performance bottlenecks, and provides sample source configurations.";
    }

    return {
        score: score,
        feedback: feedback,
        missing: missing,
        modelAnswer: modelAnswer
    };
}

function loadAIReviewFeedback(evalResult) {
    switchDashboardView("feedback");
    
    // Tech label tag
    const techName = QUESTION_BANK[activeSession.techId].name;
    document.getElementById("feedback-tech-badge").innerText = `${techName} - Question ${activeSession.currentQuestionIndex + 1}`;
    
    // Draw Animated Score Ring
    const digits = document.getElementById("feedback-score-digits");
    digits.innerHTML = `${evalResult.score}<span>/10</span>`;
    
    const circle = document.getElementById("feedback-circle-fill");
    // Circumference = 2 * PI * 60 = ~377
    const circumference = 377;
    const offset = circumference - (evalResult.score / 10) * circumference;
    
    // Reset layout stroke first
    circle.style.strokeDashoffset = circumference;
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 100);
    
    // Score title classification
    const title = document.getElementById("feedback-score-title");
    if (evalResult.score >= 9) {
        title.innerText = "Expert! Perfect Mastery";
        title.style.color = "var(--success)";
    } else if (evalResult.score >= 7) {
        title.innerText = "Great Job! Very Strong";
        title.style.color = "var(--accent-cyan)";
    } else if (evalResult.score >= 5) {
        title.innerText = "Solid Base. Needs Work";
        title.style.color = "var(--accent-yellow)";
    } else {
        title.innerText = "Weak Response. Review Topics";
        title.style.color = "var(--danger)";
    }
    
    document.getElementById("feedback-analysis-text").innerText = evalResult.feedback;
    
    // Set status banner and correct answer text dynamically
    const banner = document.getElementById("feedback-status-banner");
    const suggestedHeading = document.querySelector("#feedback-suggested-answer").previousElementSibling;
    
    if (evalResult.score >= 6) {
        banner.innerHTML = `
            <div style="background: rgba(81, 207, 98, 0.15); border: 1px solid rgba(81, 207, 98, 0.4); color: #8ce99a; padding: 15px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <i class="fa-solid fa-circle-check" style="font-size: 1.2rem;"></i>
                <span>Passed! Your response is correct.</span>
            </div>
        `;
        if (suggestedHeading) suggestedHeading.innerText = "Suggested Model Answer";
    } else {
        banner.innerHTML = `
            <div style="background: rgba(255, 107, 107, 0.15); border: 1px solid rgba(255, 107, 107, 0.4); color: #ffc9c9; padding: 15px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <i class="fa-solid fa-circle-xmark" style="font-size: 1.2rem;"></i>
                <span>Incorrect Answer! Review the correct explanation below.</span>
            </div>
        `;
        if (suggestedHeading) suggestedHeading.innerText = "Correct Answer (Suggested Model)";
    }
    
    // Set Missing Points Tags
    const tagBox = document.getElementById("feedback-missing-tags");
    tagBox.innerHTML = "";
    if (evalResult.missing.length === 0) {
        tagBox.innerHTML = `<span style="font-size:0.85rem; color:var(--success);"><i class="fa-solid fa-circle-check"></i> No missing concepts detected! Complete coverage.</span>`;
    } else {
        evalResult.missing.forEach(pt => {
            const span = document.createElement("div");
            span.className = "missing-point-tag";
            span.innerText = pt;
            tagBox.appendChild(span);
        });
    }
    
    // Model Answer Block
    document.getElementById("feedback-suggested-answer").innerText = evalResult.modelAnswer;
    
    // Next Button settings
    const nextBtn = document.getElementById("feedback-next-btn");
    if (activeSession.currentQuestionIndex + 1 >= activeSession.questions.length) {
        nextBtn.innerHTML = `Finish Interview <i class="fa-solid fa-flag-checkered"></i>`;
    } else {
        nextBtn.innerHTML = `Next Question <i class="fa-solid fa-arrow-right"></i>`;
    }
}

function proceedFromFeedbackScreen() {
    activeSession.currentQuestionIndex++;
    
    if (activeSession.currentQuestionIndex >= activeSession.questions.length) {
        // Wrap up complete session
        saveCompletedSessionToHistory();
        switchDashboardView("summary");
    } else {
        switchDashboardView("practice");
        loadActiveQuestion();
    }
}

// Save session records to local storage & recalculate strengths
function saveCompletedSessionToHistory() {
    const techName = QUESTION_BANK[activeSession.techId].name;
    const avgScore = parseFloat((activeSession.scores.reduce((a, b) => a + b, 0) / activeSession.scores.length).toFixed(1));
    const today = new Date().toISOString().split('T')[0];
    
    const newSession = {
        tech: techName,
        difficulty: activeSession.difficulty,
        questions: activeSession.questions.length,
        avgScore: avgScore,
        date: today
    };
    
    sessionHistory.unshift(newSession); // Add to top
    localStorage.setItem("ai_history", JSON.stringify(sessionHistory));
    
    // Handle Streak Updates
    updateStreakDates(today);
    
    // Render session stats inside final summaries views
    renderSessionFinalSummary(techName, avgScore);
    
    // Check for profile badges achievements
    evaluateAchievementsBadges();
}

function updateStreakDates(todayDate) {
    if (!streakCalendar.includes(todayDate)) {
        streakCalendar.push(todayDate);
        localStorage.setItem("ai_streak", JSON.stringify(streakCalendar));
    }
    
    // Update user stats on leaderboard
    updateUserInLeaderboard();
}

// ==========================================================================
// Session Summary Render
// ==========================================================================
function renderSessionFinalSummary(techName, avgScore) {
    document.getElementById("summary-tech-subtitle").innerText = `Technology: ${techName} • Difficulty: ${activeSession.difficulty}`;
    document.getElementById("summary-avg-score").innerText = avgScore;
    
    const resultText = document.getElementById("summary-session-result");
    if (avgScore >= 8.5) {
        resultText.innerText = "Excellent job! You are thoroughly ready for technical interviews.";
        resultText.style.color = "var(--success)";
    } else if (avgScore >= 7.0) {
        resultText.innerText = "Good performance. A few minor concepts left to review.";
        resultText.style.color = "var(--accent-cyan)";
    } else {
        resultText.innerText = "Some critical knowledge gaps found. We suggest reviewing model answers.";
        resultText.style.color = "var(--accent-yellow)";
    }
    
    // Focus Areas compiled from evaluations
    const list = document.getElementById("summary-weaknesses-list");
    list.innerHTML = "";
    
    let allMissing = [];
    activeSession.feedbacks.forEach(f => {
        // Approximate weak points extracts from feedbacks sentences
        if (f.includes("missed:")) {
            const extracted = f.split("missed:")[1].replace(".", "").split(",");
            allMissing.push(...extracted);
        }
    });
    
    // Unique list
    allMissing = [...new Set(allMissing.map(m => m.trim()))];
    
    if (allMissing.length === 0) {
        list.innerHTML = `<li class="weakness-item" style="color: var(--success);"><i class="fa-solid fa-circle-check"></i> No critical weaknesses found! Superb coverage.</li>`;
    } else {
        allMissing.slice(0, 3).forEach(item => {
            const li = document.createElement("li");
            li.className = "weakness-item";
            li.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:var(--danger);"></i> ${item}`;
            list.appendChild(li);
        });
    }
    
    // Question Breakdown Tables rows
    const tbody = document.getElementById("summary-q-breakdown-tbody");
    tbody.innerHTML = "";
    
    activeSession.questions.forEach((q, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-weight: 500;">${q}</td>
            <td style="font-weight: 700; color: ${activeSession.scores[idx] >= 8 ? 'var(--success)' : activeSession.scores[idx] >= 6 ? 'var(--accent-cyan)' : 'var(--accent-yellow)'};">${activeSession.scores[idx]}/10</td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================================================
// Dashboard Metrics Calculations & Rendering
// ==========================================================================
function renderDashboardStats() {
    if (sessionHistory.length === 0) return;
    
    // Average Score
    const sum = sessionHistory.reduce((acc, session) => acc + session.avgScore, 0);
    const avg = (sum / sessionHistory.length).toFixed(1);
    document.getElementById("metric-avg-score").innerText = avg;
    
    // Total Sessions
    document.getElementById("metric-sessions").innerText = sessionHistory.length;
    
    // Streaks
    const streak = calculateCurrentStreak();
    document.getElementById("metric-streak").innerText = `${streak} Days`;
    document.getElementById("streak-panel-days").innerText = `${streak} Day Streak`;
    
    // Rank on Leaderboard
    const userRank = getLeaderboardRank();
    document.getElementById("metric-rank").innerText = `#${userRank}`;
}

function calculateCurrentStreak() {
    if (streakCalendar.length === 0) return 0;
    
    // Format: YYYY-MM-DD
    const sorted = [...new Set(streakCalendar)].sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    let expected = new Date(); // Start checking from today
    
    // Check if the user practiced today or yesterday
    const todayStr = expected.toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (!sorted.includes(todayStr) && !sorted.includes(yesterdayStr)) {
        return 0;
    }
    
    if (sorted.includes(todayStr)) {
        streak = 1;
        expected = new Date(Date.now() - 86400000); // Start checking from yesterday
    } else {
        streak = 1;
        expected = new Date(Date.now() - 172800000); // Start checking from two days ago
    }
    
    for (let i = 0; i < sorted.length; i++) {
        const checkStr = expected.toISOString().split('T')[0];
        if (sorted.includes(checkStr)) {
            streak++;
            expected.setDate(expected.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

function renderDailyStreakGrid(containerId) {
    const grid = document.getElementById(containerId);
    grid.innerHTML = "";
    
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    
    // Render columns headers
    daysOfWeek.forEach(day => {
        const header = document.createElement("div");
        header.style.textAlign = "center";
        header.style.fontSize = "0.78rem";
        header.style.fontWeight = "600";
        header.style.opacity = "0.6";
        header.innerText = day;
        grid.appendChild(header);
    });
    
    // Render past 21 cells represent streak squares
    const cells = [];
    const now = new Date();
    
    // Set back to Sunday of 2 weeks ago
    const startDate = new Date();
    startDate.setDate(now.getDate() - 14 - now.getDay());
    
    for (let i = 0; i < 21; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(startDate.getDate() + i);
        const checkStr = checkDate.toISOString().split('T')[0];
        const dayNum = checkDate.getDate();
        
        const cell = document.createElement("div");
        cell.className = "streak-day-cell";
        cell.innerText = dayNum;
        
        if (streakCalendar.includes(checkStr)) {
            cell.classList.add("active");
        }
        
        grid.appendChild(cell);
    }
}

function renderRecentSessionsLogs() {
    const tbody = document.getElementById("recent-sessions-tbody");
    tbody.innerHTML = "";
    
    if (sessionHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="opacity: 0.7;">No mock sessions completed yet. Click Start Practice to initiate.</td></tr>`;
        return;
    }
    
    // Render top 5
    sessionHistory.slice(0, 5).forEach(session => {
        const tr = document.createElement("tr");
        const diffClass = session.difficulty.toLowerCase() === "beginner" ? "easy" : session.difficulty.toLowerCase() === "intermediate" ? "medium" : "hard";
        
        tr.innerHTML = `
            <td style="font-weight: 600;">${session.tech}</td>
            <td><span class="badge-difficulty ${diffClass}">${session.difficulty}</span></td>
            <td>${session.questions}</td>
            <td style="font-weight: 700; color: ${session.avgScore >= 8 ? 'var(--success)' : session.avgScore >= 6 ? 'var(--accent-cyan)' : 'var(--accent-yellow)'};">${session.avgScore}/10</td>
            <td style="font-size:0.8rem; opacity:0.8;">${session.date}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================================================
// Chart.js Operations
// ==========================================================================
let mainDashboardChart = null;
let progressDetailedChart = null;

function renderDashboardCharts() {
    const ctx = document.getElementById("dashboardChart").getContext("2d");
    if (mainDashboardChart) mainDashboardChart.destroy();
    
    const scores = [...sessionHistory].reverse().map(s => s.avgScore);
    const labels = [...sessionHistory].reverse().map(s => s.tech);
    
    mainDashboardChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length > 0 ? labels : ["Empty"],
            datasets: [{
                label: 'Session Average Score',
                data: scores.length > 0 ? scores : [0],
                borderColor: '#4FD8FF',
                backgroundColor: 'rgba(79, 216, 255, 0.15)',
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    min: 0,
                    max: 10,
                    grid: { color: 'rgba(255, 255, 255, 0.08)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                }
            }
        }
    });
}

function renderDetailedProgressCharts() {
    const ctx = document.getElementById("progressDetailedChart").getContext("2d");
    if (progressDetailedChart) progressDetailedChart.destroy();
    
    // Sort timeline chronological
    const sortedHistory = [...sessionHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    const scores = sortedHistory.map(s => s.avgScore);
    const labels = sortedHistory.map(s => `${s.tech} (${s.difficulty[0]})`);
    
    progressDetailedChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length > 0 ? labels : ["Empty"],
            datasets: [{
                label: 'Average Score',
                data: scores.length > 0 ? scores : [0],
                backgroundColor: 'rgba(141, 123, 255, 0.55)',
                borderColor: 'rgba(141, 123, 255, 1)',
                borderWidth: 2,
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    min: 0,
                    max: 10,
                    grid: { color: 'rgba(255, 255, 255, 0.08)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 10 } }
                }
            }
        }
    });
}

// ==========================================================================
// Leaderboard Operations
// ==========================================================================
function updateUserInLeaderboard() {
    if (!currentUser) return;
    
    const sum = sessionHistory.reduce((acc, s) => acc + s.avgScore, 0);
    const avg = sessionHistory.length > 0 ? parseFloat((sum / sessionHistory.length).toFixed(1)) : 0;
    const streak = calculateCurrentStreak();
    
    const userIndex = leaderboard.findIndex(item => item.isUser === true);
    if (userIndex !== -1) {
        leaderboard[userIndex].name = `${currentUser.name} (You)`;
        leaderboard[userIndex].interviews = sessionHistory.length;
        leaderboard[userIndex].score = avg;
        leaderboard[userIndex].streak = streak;
    }
    
    // Sort leaderboard desc
    leaderboard.sort((a, b) => b.score - a.score || b.streak - a.streak);
    localStorage.setItem("ai_leaderboard", JSON.stringify(leaderboard));
}

function getLeaderboardRank() {
    const userIndex = leaderboard.findIndex(item => item.isUser === true);
    return userIndex !== -1 ? userIndex + 1 : 4;
}

function renderLeaderboardTable() {
    const tbody = document.getElementById("leaderboard-tbody");
    tbody.innerHTML = "";
    
    leaderboard.forEach((dev, idx) => {
        const tr = document.createElement("tr");
        if (dev.isUser) tr.className = "row-user-highlight";
        
        let rankCol = "";
        if (idx === 0) rankCol = `<span class="rank-badge rank-1"><i class="fa-solid fa-trophy"></i></span>`;
        else if (idx === 1) rankCol = `<span class="rank-badge rank-2">2</span>`;
        else if (idx === 2) rankCol = `<span class="rank-badge rank-3">3</span>`;
        else rankCol = `<span style="font-weight: 600; padding-left: 10px;">${idx + 1}</span>`;
        
        tr.innerHTML = `
            <td>${rankCol}</td>
            <td style="font-weight: 600;">${dev.name}</td>
            <td>${dev.interviews} Sessions</td>
            <td style="font-weight: 700; color: ${dev.score >= 8.5 ? 'var(--success)' : dev.score >= 7.0 ? 'var(--accent-cyan)' : 'var(--accent-yellow)'};">${dev.score.toFixed(1)}/10</td>
            <td><i class="fa-solid fa-fire" style="color: var(--accent-yellow);"></i> ${dev.streak} Days</td>
        `;
        tbody.appendChild(tr);
    });
}

function filterLeaderboardTable() {
    const query = document.getElementById("leaderboard-search").value.toLowerCase();
    const rows = document.querySelectorAll("#leaderboard-tbody tr");
    
    leaderboard.forEach((dev, idx) => {
        const row = rows[idx];
        if (!row) return;
        if (dev.name.toLowerCase().includes(query)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// ==========================================================================
// Profile and Badges Verification
// ==========================================================================
function loadProfileFields() {
    if (!currentUser) return;
    document.getElementById("profile-avatar-initials").innerText = currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase();
    document.getElementById("profile-display-name").innerText = currentUser.name;
    document.getElementById("profile-display-email").innerText = currentUser.email;
    document.getElementById("profile-name-input").value = currentUser.name;
    
    evaluateAchievementsBadges();
}

function updateProfileInfo(event) {
    event.preventDefault();
    const newName = document.getElementById("profile-name-input").value;
    if (!newName) return;
    
    currentUser.name = newName;
    localStorage.setItem("ai_user", JSON.stringify(currentUser));
    
    updateSidebarDisplay();
    updateUserInLeaderboard();
    loadProfileFields();
    alert("Profile saved successfully!");
}

function evaluateAchievementsBadges() {
    // 1. Initiate badge (completed first mock session)
    if (sessionHistory.length > 0) {
        document.getElementById("badge-first").classList.add("earned");
    }
    
    // 2. On Fire badge (streak >= 5)
    const streak = calculateCurrentStreak();
    if (streak >= 5) {
        document.getElementById("badge-streak").classList.add("earned");
    }
    
    // 3. Perfect 10 badge (any score of 10)
    const hasTen = sessionHistory.some(s => s.avgScore >= 9.5) || activeSession.scores.includes(10);
    if (hasTen) {
        document.getElementById("badge-master").classList.add("earned");
    }
    
    // 4. Polymath badge (practices in 3 different tech keys)
    const uniqueTechs = new Set(sessionHistory.map(s => s.tech));
    if (uniqueTechs.size >= 3) {
        document.getElementById("badge-polymath").classList.add("earned");
    }
}
