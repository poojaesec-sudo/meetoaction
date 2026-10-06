import os
import sys

# Ensure backend directory is in python sys.path for Vercel Serverless Functions
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "..", "backend")
sys.path.insert(0, backend_dir)

from app.main import app
