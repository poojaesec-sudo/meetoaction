# 🚀 Meet2Action AI — Permanent Production Deployment Guide

This guide provides simple, step-by-step instructions to permanently deploy **Meet2Action AI** to production so it is accessible worldwide via:

**🌐 https://meet2action.in** and **https://www.meet2action.in**

> [!IMPORTANT]
> This deployment runs **24/7 in the cloud** on high-availability infrastructure.
> It does **NOT** depend on `localhost`, Vite dev server, Python terminals, Cloudflare temporary tunnels, or your laptop being switched on.

---

## 🏗️ Production Architecture Overview

```
User Browser
     │
     ▼
https://meet2action.in  /  https://www.meet2action.in
     │
     ▼
Frontend: React 19 / Vite SPA (Vercel CDN or Render Static Site)
     │  (API requests to /api/...)
     ▼
Backend: Python 3.11 + FastAPI + Uvicorn (Render Web Service)
     │
     ▼
Database: Persistent PostgreSQL (Render Managed DB / Neon / Supabase)
```

---

## ⚡ Option 1: 1-Click Render Blueprint (Simplest & Recommended)

This option deploys the **Frontend**, **FastAPI Backend**, and **Persistent PostgreSQL Database** automatically together using the repository's [`render.yaml`](file:///render.yaml).

### Step 1: Push Code to GitHub
1. Open **GitHub Desktop** on your computer.
2. Select your repository: `hackathon` (`poojaesec-sudo/hackathon`).
3. Commit all changes (e.g. `Production deployment setup`) and click **Push origin**.

### Step 2: Deploy on Render
1. Open your browser and go to: **[dashboard.render.com](https://dashboard.render.com)**
2. Sign in or create a free account (you can sign in with your GitHub account).
3. Click the **"New +"** button in the top navigation bar.
4. Select **"Blueprint"**.
5. Connect your GitHub repository: `poojaesec-sudo/hackathon`.
6. Render will automatically detect [`render.yaml`](file:///render.yaml) and list:
   - **`meet2action-db`**: Persistent PostgreSQL database
   - **`meet2action-backend`**: FastAPI Python Web Service
   - **`meet2action-frontend`**: React Static Web App
7. Click **"Apply"** or **"Create Blueprint Instance"**.
8. Render will provision the database, build the backend, and deploy the frontend. This takes about 2–3 minutes.

---

## 🌐 Custom Domain Configuration: `meet2action.in`

Once deployed, link your custom domain (`meet2action.in`) to the frontend:

### In Render (or Vercel):
1. In your hosting dashboard (e.g., Render `meet2action-frontend` or Vercel project), go to **Settings** → **Custom Domains**.
2. Click **"Add Custom Domain"**.
3. Enter:
   - `meet2action.in`
   - `www.meet2action.in`
4. The dashboard will display the DNS records you need to add at your domain registrar.

### In Your Domain Registrar (GoDaddy, Namecheap, Hostinger, Cloudflare, etc.):
Go to your domain DNS management page and add the following standard DNS records:

| Type | Name / Host | Target / Points To | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (root) | Provided by your host (e.g. Render `216.24.57.1` or Vercel `76.76.21.21`) | Automatic / 300 | Routes `meet2action.in` |
| **CNAME** | `www` | Provided by your host (e.g. `meet2action-frontend.onrender.com` or `cname.vercel-dns.com`) | Automatic / 300 | Routes `www.meet2action.in` |

> [!NOTE]
> Free SSL/TLS (HTTPS) certificates are provisioned automatically by Render and Vercel via Let's Encrypt within a few minutes after the DNS records propagate.

---

## 🔒 Production Environment Variables Reference

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Render auto-wires PostgreSQL connection string | Persistent storage for users, meetings, and tasks |
| `LLM_PROVIDER` | `demo` (or `gemini` / `openai`) | `demo` uses fast built-in heuristic NLP (0 cost, no API key required) |
| `GEMINI_API_KEY` | *(Optional)* | Only if `LLM_PROVIDER=gemini` |
| `OPENAI_API_KEY` | *(Optional)* | Only if `LLM_PROVIDER=openai` |
| `CORS_ORIGINS` | `https://meet2action.in,https://www.meet2action.in` | Allowed cross-origin frontend domains |
| `PORT` | Managed automatically by Render (`10000` / `$PORT`) | Server listening port |

---

## 🧪 Post-Deployment Verification Checklist

After your deployment is live at `https://meet2action.in`:

1. **Visit Domain**: Open `https://meet2action.in` in your browser. Verify the green padlock (HTTPS).
2. **Register a Fresh User**:
   - Click **Create an account**.
   - Enter your name, email, and password.
   - Click **Create Account & Launch Workspace**.
3. **Verify Zero-State Workspace**:
   - Total Meetings: **0**
   - Action Items: **0**
   - Pending Tasks: **0**
   - Completion Rate: **0%**
   - Verify that no sample meetings or fake data appear.
4. **Add and Analyze a Meeting**:
   - Click **Add Meeting**.
   - Paste a meeting transcript or click *Load Sample Meeting*.
   - Click **Analyze Meeting with AI**.
   - Review the extracted tasks, assignees, deadlines, and decisions.
   - Click **Confirm & Save to Workspace**.
5. **Verify Real-Time Updates**:
   - Check the **Dashboard**: Total Meetings becomes 1, tasks count updates.
   - Check **Tasks**: All extracted action items appear in both Table and Kanban views.
   - Check **Accountability**: Per-person scorecard reflects the new tasks.
   - Check **AI Insights**: Productivity telemetry updates.
6. **Data Isolation Test**:
   - Log out.
   - Register a second account with a different email.
   - Verify the second account starts completely from 0 and cannot see the first account's data.
   - Log into the Demo account (one-click demo) and verify the demo data remains intact and separate.
