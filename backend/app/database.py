import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Ensure SQLite resolves reliably to backend/meetings.db (or /tmp on Vercel Serverless)
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
default_db_file = os.path.join(backend_dir, "meetings.db").replace("\\", "/")

# On Vercel Serverless environment, the root filesystem is read-only; use /tmp/meetings.db
if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
    import shutil
    tmp_db_file = "/tmp/meetings.db"
    bundled_db = os.path.join(backend_dir, "meetings.db")
    if not os.path.exists(tmp_db_file) and os.path.exists(bundled_db):
        try:
            shutil.copyfile(bundled_db, tmp_db_file)
        except Exception:
            pass
    default_db_url = f"sqlite:///{tmp_db_file}"
else:
    default_db_url = f"sqlite:///{default_db_file}"

raw_db_url = os.getenv("DATABASE_URL", default_db_url)
# Fix Heroku/Render/Railway 'postgres://' URI compatibility with SQLAlchemy 2.x
if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)
DATABASE_URL = raw_db_url


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
