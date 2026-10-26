import os
import sys

# Ensure the backend directory is in the Python module search path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app, db
from run import seed_sample_data, init_db_with_defaults

# Create the WSGI Flask app for Vercel Serverless Functions
app = create_app()

# Auto-initialize database tables and initial profile on cold start
_initialized = False

@app.before_request
def ensure_db_ready():
    global _initialized
    if not _initialized:
        try:
            with app.app_context():
                db.create_all()
                seed_sample_data()
        except Exception as e:
            app.logger.warning(f"Database setup notice: {e}")
        _initialized = True

# Also run initialization on module import for immediate readiness
try:
    with app.app_context():
        db.create_all()
        init_db_with_defaults()
except Exception as e:
    pass
