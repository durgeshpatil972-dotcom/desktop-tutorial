import sys
import os

# Add backend directory to Python system path for Vercel serverless functions
backend_dir = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, backend_dir)

from main import app
