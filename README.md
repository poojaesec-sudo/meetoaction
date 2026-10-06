# AI Meeting-to-Accountability System

A modern, full-stack, AI-powered system that transforms meeting conversations, transcripts, and discussion notes into structured, trackable action items and executive accountability dashboards.

---

## 🚀 Overview & Problem Statement

### Problem
Traditional meetings suffer from manual, incomplete documentation, lost action items, ambiguity around ownership, and missed delivery deadlines. Important decisions get buried inside lengthy discussion transcripts, and team accountability relies on ad-hoc memory.

### Solution
The **AI Meeting-to-Accountability System** automatically:
1. **Summarizes** meeting transcripts into concise executive takeaways.
2. **Extracts technical decisions** and resolution consensus.
3. **Detects action items** using Natural Language Processing (NLP) and Named Entity Recognition (NER).
4. **Identifies task owners/assignees** (intelligently falling back to `Unassigned` when omitted).
5. **Extracts deadlines and delivery milestones** (falling back to `Not specified`).
6. **Classifies priority** as `High`, `Medium`, or `Low` (with AI-inferred indicators).
7. **Tracks real-time task progress (0–100%) and operational status** (`Pending`, `In Progress`, `Completed`, `Overdue`).
8. **Generates an Accountability Scorecard** displaying per-member completion rates and workload distribution.
9. **Delivers AI Productivity Insights** highlighting blockers, overdue trends, and workstream frequencies.
10. **Operates in both zero-config local Demo Mode and live Cloud LLM Mode** (Google Gemini & OpenAI).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic v2, Python-dotenv, HTTPX |
| **Database** | SQLite + SQLAlchemy ORM (lightweight, zero-config local persistence) |
| **AI / NLP** | Built-in Rule-based NER & Heuristic Extractor + Gemini 1.5 Flash / OpenAI GPT-4o-mini |

---

## 🌟 Key Features

### 1. 🔐 Workspace Authentication & One-Click Demo
- Professional login with email & password.
- **One-Click Demo Login** as **Poojasri T (Team Lead)** with pre-populated live workspace data.

### 2. 📊 Executive Dashboard
- **KPI Metric Cards**: Total Meetings, Total Action Items, Pending Tasks, Completion Rate.
- **Task Status Distribution Bar**: Interactive visual breakdown of Completed, In Progress, Pending, and Overdue tasks.
- **Priority Distribution Meters**: High, Medium, and Low urgency task counts.
- **Upcoming Deadlines Tracker**: Chronological milestone tracking with urgency badges.
- **Overdue Milestone Alert Banner**: Highlighted tasks requiring immediate unblocking with one-click completion.

### 3. 🎙️ Meeting Input & Transcript Analysis ("Add Meeting")
- Input meeting title, date, and comma-separated participants.
- Paste conversational meeting transcript or upload `.txt` / `.md` files.
- **Preset Test Case Buttons**:
  - *Sample 1 (Requirement 15)*: *"Project review meeting. Poojasri will prepare the presentation by October 8. Rithanya will complete the dataset preparation by October 6. Poojitha will test the model by October 10. The team decided to use Python and FastAPI for the prototype."*
  - *Sample 2 (Sprint Architecture)*: Multi-speaker sync with unassigned tasks and urgent blockers.
- **Multi-Step Animated AI Processing**: Live extraction status visualizer.
- **Interactive Pre-Save Review Panel**: Tweak tasks, change assignees, edit deadlines, or discard false positives before persisting to SQLite.

### 4. ✅ Action Item & Task Management ("Tasks")
- **Dual View Modes**: Switch seamlessly between **Table View** and **Kanban Board**.
- **Real-Time Filters**: Filter by Priority (`High`, `Medium`, `Low`), Status (`Pending`, `In Progress`, `Completed`, `Overdue`), or Assignee.
- **Live Search**: Instant keyword search across task titles, descriptions, and meetings.
- **Progress Sliders (0–100%)**: Interactive range slider that synchronizes status automatically.
- **Task Creation & Editing Modals**: Add custom action items or edit existing ones.

### 5. 👥 Team Accountability Scorecard ("Accountability")
- Displays each team member's performance:
  - **Total Assigned Tasks**
  - **Completed Tasks**
  - **Pending / In Progress Tasks**
  - **Overdue Tasks**
  - **Completion Percentage (%)**
  - Example: `Team Member: Poojasri | Assigned: 8 | Completed: 5 | Pending: 2 | Overdue: 1 | Completion: 62.5%`
- Performance status tags: `Top Performer` (≥75%), `On Track` (≥50%), `Needs Attention` (Overdue > 0).
- Expandable task drill-down under each member with direct status selectors.

### 6. 📁 Meeting Archives & Detail Inspector ("Meetings")
- Historical archive of all analyzed meetings.
- Detail drawer displaying executive summary, discussion bullet points, agreed decisions, and extracted tasks.
- **Export to Markdown / Clipboard**: One-click summary export for distribution.
- Meeting deletion with cascading task cleanup.

### 7. 💡 AI Productivity Insights ("AI Insights")
- Unresolved tasks count & active contributors count.
- Frequently discussed project workstream tags.
- Meeting productivity trends (actions generated per meeting & completion rate).
- Safe, objective AI recommendations (timeline unblocking, orphan task assignment, sprint focus).

### 8. ⚙️ System Settings & Data Management
- Toggle between **Demo Engine (Local)**, **Google Gemini**, or **OpenAI**.
- Manage API keys securely without hardcoding.
- **One-Click Re-seed Database**: Instantly reset SQLite to sample meetings and tasks.

---

## 📂 Project Structure

```
ai-meeting-accountability/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI server entrypoint & CORS
│   │   ├── database.py              # SQLAlchemy engine & session maker
│   │   ├── models.py                # User, Meeting, ActionItem, Decision models
│   │   ├── schemas.py               # Pydantic request/response schemas
│   │   ├── seed.py                  # Initial demo data & re-seeder
│   │   ├── routes/
│   │   │   ├── auth.py              # Login and demo authentication
│   │   │   ├── meetings.py          # Analyze, create, list, view meetings
│   │   │   ├── tasks.py             # Tasks CRUD, filters, and status sync
│   │   │   ├── accountability.py    # Team member metrics & scorecard
│   │   │   └── insights.py          # Dashboard stats and AI recommendations
│   │   └── services/
│   │       ├── ai_service.py        # LLM dispatcher (Gemini/OpenAI/Fallback)
│   │       └── nlp_service.py       # Rule-based NLP & regex entity extractor
│   └── meetings.db                  # Local SQLite database
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Badges.jsx           # Status & priority badge components
│   │   │   ├── Navbar.jsx           # Top search, quick add, & notification bell
│   │   │   ├── Sidebar.jsx          # Responsive navigation sidebar
│   │   │   ├── StatCard.jsx         # KPI statistic cards
│   │   │   └── TaskModal.jsx        # Create & edit task modal
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # Login & demo login interface
│   │   │   ├── DashboardPage.jsx    # Metrics, charts, upcoming deadlines
│   │   │   ├── AddMeetingPage.jsx   # Transcript analysis & pre-save review
│   │   │   ├── TasksPage.jsx        # Table & Kanban board task manager
│   │   │   ├── AccountabilityPage.jsx # Team member scorecard
│   │   │   ├── MeetingsPage.jsx     # Meeting history and analysis modal
│   │   │   ├── InsightsPage.jsx     # AI productivity trends & recommendations
│   │   │   └── SettingsPage.jsx     # AI mode toggle & database reseed
│   │   ├── services/
│   │   │   └── api.js               # Centralized REST API client
│   │   ├── App.jsx                  # Main application router and state
│   │   ├── index.css                # Tailwind CSS base styles & glassmorphism
│   │   └── main.jsx                 # React root renderer
│   ├── index.html                   # HTML5 template with Inter font
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js               # Vite config with /api proxy to FastAPI
│
├── .env.example                     # Environment variables template
├── requirements.txt                 # Backend Python dependencies
├── test_e2e.py                      # Automated API integration test script
└── README.md                        # Documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** & **npm**

---

### Step 1: Clone or Navigate to Directory
```bash
cd "c:\Users\POOJA SRI T\OneDrive\Desktop\hackathon"
```

---

### Step 2: Backend Setup & Launch

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. (Optional) Configure environment variables:
Copy `.env.example` to `.env` if using a cloud LLM key:
```bash
copy .env.example .env
```
*(By default, `LLM_PROVIDER=demo` runs offline with zero API key!)*

3. Start the FastAPI backend server:
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now live at:
- **API URL**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Step 3: Frontend Setup & Launch

1. In a new terminal, navigate to the `frontend/` directory:
```bash
cd frontend
```

2. Install npm dependencies:
```bash
npm install
```

3. Launch the Vite development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
**[http://localhost:5173/](http://localhost:5173/)**

---

## 🧪 Demonstration Workflow (College / Hackathon Presentation)

1. **Login Screen**:
   - Click the prominent **"Launch with Demo Account (Poojasri T)"** button for instant one-click access.
2. **Executive Dashboard**:
   - Inspect the KPI metric cards, stacked task distribution chart, priority breakdown, and overdue task alerts.
3. **Add & Analyze Meeting**:
   - Navigate to **"Add Meeting"** in the sidebar.
   - Click **"Load Sample Meeting (Poojasri, Rithanya, Poojitha)"**.
   - Review the populated transcript:
     > *"Project review meeting. Poojasri will prepare the presentation by October 8. Rithanya will complete the dataset preparation by October 6. Poojitha will test the model by October 10. The team decided to use Python and FastAPI for the prototype."*
   - Click **"Analyze Meeting with AI"**.
   - Observe the multi-stage AI extraction animation.
   - Verify the extracted results:
     - **Summary**: Synthesizes project objectives and delegation.
     - **Decisions**: *"Use Python and FastAPI for the prototype"*.
     - **Action Items**:
       - `Poojasri` → *Prepare the presentation* → `October 8` (High Priority)
       - `Rithanya` → *Complete the dataset preparation* → `October 6` (High Priority)
       - `Poojitha` → *Test the model* → `October 10` (Medium Priority)
   - Click **"Confirm & Save to Workspace"** (watch celebration confetti).
4. **Action Item Tracker ("Tasks")**:
   - View newly extracted items in the table.
   - Adjust the **Progress Slider** to `100%` or change status to `Completed`.
   - Toggle the **Kanban Board** view.
5. **Team Accountability Scorecard**:
   - Navigate to **"Accountability"**.
   - See Poojasri, Rithanya, Poojitha, and Karthik's completion rates updated in real-time.
   - Expand any member's card to review their specific tasks.
6. **Productivity Insights**:
   - Navigate to **"AI Insights"** to review workstream frequencies, workload balance, and automated actionable recommendations.

---

## 🔮 Future Enhancements
- Live speech-to-text recording directly from browser microphone (Web Speech API / Whisper).
- Automated Slack and email notification webhooks for upcoming deadlines.
- Google Calendar and Microsoft Teams integration.
- Multi-tenant team authentication with granular role-based access control (RBAC).

---

## 📄 License
MIT License. Built for the Hackathon / Final Year Demonstration.
#   M e e t 2 a c t i o n  
 