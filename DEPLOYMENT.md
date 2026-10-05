# 🚀 Meet2Action AI — Production Deployment Guide

This guide details how **Meet2Action AI** is configured, built, and deployed to a publicly accessible production URL for demonstration.

---

## 🌐 1. Live Public URLs (Ready to Demo Now)

The full-stack application is currently running live and accessible worldwide over high-speed HTTPS:

| Component | Production URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | **[https://site-conditions-decision-applied.trycloudflare.com](https://site-conditions-decision-applied.trycloudflare.com)** | Complete React 19 / Vite Dark-Mode SPA (connects to live backend) |
| **Backend API** | **[https://things-albums-reid-ata.trycloudflare.com](https://things-albums-reid-ata.trycloudflare.com)** | FastAPI REST Services |
| **API Health Check** | **[https://things-albums-reid-ata.trycloudflare.com/api/health](https://things-albums-reid-ata.trycloudflare.com/api/health)** | Real-time health status endpoint |
| **Swagger API Docs** | **[https://things-albums-reid-ata.trycloudflare.com/docs](https://things-albums-reid-ata.trycloudflare.com/docs)** | Interactive OpenAPI Documentation |

> [!NOTE]
> **Zero Password / Zero Interstitial Screen**:
> Unlike Localtunnel or ngrok, these Cloudflare Tunnel URLs require **no IP passwords**, **no captcha**, and **no warning bypass screens**. The link opens directly in any browser on desktop, tablet, or mobile.

---

## 🏗️ 2. Architectural Structure Identified

```
hackathon/
├── frontend/                     # React 18 + Vite 5 + Tailwind CSS SPA
│   ├── dist/                     # Optimized production bundle (387 kB gzip: 105 kB)
│   ├── src/
│   │   ├── services/api.js       # Dynamic API client (supports VITE_API_URL or relative /api)
│   │   ├── pages/                # LoginPage, DashboardPage, TasksPage, AddMeetingPage, etc.
│   │   └── components/           # Navbar, Sidebar, Badges, StatCards, TaskModals
│   ├── vercel.json               # Vercel SPA routing rewrite rules
│   └── package.json              # npm scripts (dev, build, preview)
│
├── backend/                      # Python 3.11 + FastAPI + SQLAlchemy ORM
│   ├── app/
│   │   ├── main.py               # FastAPI server entrypoint, CORS, static SPA mount
│   │   ├── database.py           # SQLite / PostgreSQL engine with cloud URI compatibility
│   │   ├── models.py             # User, Meeting, ActionItem, Decision models
│   │   ├── schemas.py            # Pydantic v2 validation models
│   │   ├── seed.py               # Auto-seed initial demo dataset
│   │   ├── routes/               # auth, meetings, tasks, accountability, insights
│   │   └── services/             # ai_service (LLM dispatcher) & nlp_service (NER engine)
│   ├── requirements.txt          # Python dependencies
│   ├── Procfile                  # Platform web process start command
│   └── meetings.db               # SQLite persistent database file
│
├── render.yaml                   # 1-Click Render Cloud Blueprint
├── Dockerfile                    # Container definition for unified full-stack hosting
├── Procfile                      # Root web launch command
└── test_e2e.py                   # Automated end-to-end integration test suite
```

---

## ⚙️ 3. Production Optimizations Implemented

1. **No Hard-Coded Localhost**:
   - In `frontend/src/services/api.js`, the API base URL is resolved dynamically:
     ```javascript
     const envApiUrl = (import.meta.env.VITE_API_URL || '').trim();
     let API_BASE = '/api';
     if (envApiUrl) {
       const cleanBase = envApiUrl.endsWith('/') ? envApiUrl.slice(0, -1) : envApiUrl;
       API_BASE = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
     }
     ```
   - When deployed together on a single host or proxy, requests route seamlessly to `/api`.
   - When deployed split across Vercel and Render, `VITE_API_URL` directs traffic to the backend domain.

2. **Unified Single-Port Serving**:
   - In `backend/app/main.py`, FastAPI detects and mounts the built `frontend/dist/` directory:
     - Serves all API endpoints at `/api/...`
     - Serves client-side SPA routes (`/dashboard`, `/tasks`, `/meetings`, etc.) with `index.html` fallback.
     - Guarantees zero CORS mismatches and zero proxy latency.

3. **CORS Hardening**:
   - Configured in `main.py` with multi-origin support and `CORS_ORIGINS` environment variable parsing.

4. **Zero-Config Offline AI & Demo Mode**:
   - Default `LLM_PROVIDER=demo` extracts decisions and action items using regex and rule-based NER without requiring paid external API keys.

---

## 🚀 4. Permanent Cloud Hosting Setup (Vercel + Render / Railway)

If you wish to deploy permanent URLs connected to your own GitHub repository:

### Option A: Unified Deploy on Render (Simplest — 1 URL)
1. Push this repository to your GitHub account (`git push`).
2. Go to **[dashboard.render.com](https://dashboard.render.com)** → **New** → **Blueprint**.
3. Connect your GitHub repository. Render will automatically read `render.yaml` and provision:
   - **Backend Web Service**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Database**: SQLite `meetings.db`
4. Render gives you one permanent URL: `https://meet2action-ai.onrender.com`.

### Option B: Split Deploy (Frontend on Vercel + Backend on Render)
1. **Backend on Render**:
   - New **Web Service** → Connect repo → Root directory: `backend`.
   - Build Command: `pip install -r requirements.txt`.
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
   - Note your backend URL: e.g. `https://meet2action-backend.onrender.com`.
2. **Frontend on Vercel**:
   - Go to **[vercel.com](https://vercel.com)** → **Add New Project** → Import repo.
   - Root directory: `frontend`.
   - Framework preset: `Vite`.
   - Environment Variable:
     - Name: `VITE_API_URL`
     - Value: `https://meet2action-backend.onrender.com/api`
   - Click **Deploy**. Vercel gives you: `https://meet2action.vercel.app`.

---

## 🧪 5. Demonstration Workflow for Judges

1. Open **[https://tidy-nights-taste.loca.lt](https://tidy-nights-taste.loca.lt)**.
2. Click **"Continue with Demo (Poojasri T)"** for one-click access.
3. **Executive Dashboard**: Inspect KPIs, stacked status bars, priority breakdown, and overdue task alerts.
4. **Add Meeting**:
   - Click **"Add Meeting"** in the sidebar.
   - Click **"Load Sample Meeting"** to populate the transcript.
   - Click **"Analyze Meeting with AI"** to see live NLP extraction of decisions, assignees, and deadlines.
   - Click **"Confirm & Save to Workspace"** (watch celebration confetti).
5. **Action Item Tracker ("Tasks")**:
   - Toggle between **Table View** and **Kanban Board**.
   - Move tasks across columns or use the progress slider.
6. **Accountability Scorecard**:
   - View per-member completion rates and status tags (`Top Performer`, `On Track`).
7. **AI Insights**:
   - Review productivity trends, workload distribution, and actionable recommendations.

---

## ⚠️ 6. Hosting Considerations & Limitations

- **Localtunnel Sessions**: The localtunnel link runs through your active terminal session. If your machine sleeps or the process terminates, the link disconnects.
- **SQLite Persistence on Free Serverless**: On ephemeral platforms like Vercel Serverless Functions, SQLite files reset between cold starts. For permanent zero-cost persistence in the cloud, Render persistent disks, Railway volumes, or Supabase/Neon PostgreSQL (`DATABASE_URL=postgresql://...`) can be attached with zero code changes.
