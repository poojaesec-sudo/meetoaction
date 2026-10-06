import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

from .database import engine, Base, get_db
from .seed import seed_database
from .routes import auth, meetings, tasks, action_items, team, ai, accountability, insights

# Initialize SQLite tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed database with initial rich sample data
    db = next(get_db())
    try:
        seed_database(db, force_reset=False)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Meet2Action AI API",
    description="Backend REST API for AI meeting management, notes summarization, action item extraction, team collaboration, and accountability.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable dynamic CORS for frontend development, Vercel deployments, and custom production domains
frontend_url_env = os.getenv("FRONTEND_URL", "")
cors_origins_env = os.getenv("CORS_ORIGINS", "")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://meet2action.in",
    "https://www.meet2action.in",
]

for env_val in [frontend_url_env, cors_origins_env]:
    if env_val:
        for o in env_val.split(","):
            clean_origin = o.strip().rstrip("/")
            if clean_origin and clean_origin not in allowed_origins:
                allowed_origins.append(clean_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under both /api and root prefixes for maximum client compatibility
routers = [
    auth.router,
    meetings.router,
    action_items.router,
    tasks.router,
    team.router,
    ai.router,
    accountability.router,
    insights.router,
]

for r in routers:
    app.include_router(r, prefix="/api")
    app.include_router(r)

@app.get("/api/health")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Meet2Action AI API",
        "version": "1.0.0"
    }


@app.post("/api/seed")
def reseed_database(db: Session = Depends(get_db)):
    """
    Resets and reseeds the database with fresh demo data.
    """
    seed_database(db, force_reset=True)
    return {"message": "Database reset and re-seeded with demo meetings, tasks, and users."}

# Production Deployment Support: Serve built React frontend if dist exists
dist_candidates = [
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"),
    os.path.join(os.path.dirname(__file__), "..", "dist"),
    os.path.join(os.getcwd(), "frontend", "dist"),
    os.path.join(os.getcwd(), "dist"),
]

dist_dir = None
for candidate in dist_candidates:
    if os.path.isdir(candidate) and os.path.exists(os.path.join(candidate, "index.html")):
        dist_dir = os.path.abspath(candidate)
        break

if dist_dir:
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static_assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        # Do not intercept API endpoints or docs
        if full_path.startswith("api/") or full_path == "api" or full_path in ["docs", "redoc", "openapi.json", "health"]:
            raise HTTPException(status_code=404, detail="Not found")
        file_path = os.path.join(dist_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))
