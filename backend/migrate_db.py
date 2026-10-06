import os
import sqlite3

db_paths = [
    os.path.join(os.path.dirname(__file__), "meetings.db"),
    os.path.join(os.path.dirname(__file__), "..", "meetings.db")
]

for db_path in db_paths:
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute("PRAGMA table_info(meetings);")
        cols = [c[1] for c in cur.fetchall()]
        print(f"Checking {db_path}, existing columns: {cols}")
        if "agenda" not in cols:
            print(f"Adding agenda column to {db_path}...")
            cur.execute("ALTER TABLE meetings ADD COLUMN agenda TEXT DEFAULT ''")
            conn.commit()
            print("Successfully added agenda column!")
        conn.close()

from app.database import engine, Base, SessionLocal
from app.seed import seed_database

# Create all tables (including team_members)
Base.metadata.create_all(bind=engine)

# Re-seed with fresh data
db = SessionLocal()
try:
    seed_database(db, force_reset=True)
    print("Database successfully reseeding completed!")
finally:
    db.close()
