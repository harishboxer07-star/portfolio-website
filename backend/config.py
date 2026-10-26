import os
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'harish-portfolio-secret-key-change-in-prod-2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'harish-jwt-secret-key-change-in-prod-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES_HOURS', 12)))
    
    # Database connection handling: PostgreSQL (Vercel Postgres, Neon, Supabase) or local SQLite
    _db_url = os.getenv('DATABASE_URL') or os.getenv('POSTGRES_URL') or os.getenv('POSTGRES_PRISMA_URL')
    if _db_url:
        if _db_url.startswith('postgres://'):
            _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = _db_url
    else:
        # Check if running in Vercel / serverless environment
        if os.getenv('VERCEL'):
            tmp_db = '/tmp/portfolio.db'
            instance_db = os.path.join(BASE_DIR, 'instance', 'portfolio.db')
            root_db = os.path.join(BASE_DIR, 'portfolio.db')
            src_db = instance_db if os.path.exists(instance_db) else (root_db if os.path.exists(root_db) else None)
            if src_db and not os.path.exists(tmp_db):
                try:
                    import shutil
                    shutil.copyfile(src_db, tmp_db)
                except Exception:
                    pass
            SQLALCHEMY_DATABASE_URI = f"sqlite:///{tmp_db}"
        else:
            instance_db = os.path.join(BASE_DIR, 'instance', 'portfolio.db')
            if os.path.exists(instance_db):
                SQLALCHEMY_DATABASE_URI = f"sqlite:///{instance_db}"
            else:
                SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'portfolio.db')}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Uploads directory
    if os.getenv('VERCEL'):
        UPLOAD_FOLDER = '/tmp/uploads'
    else:
        UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
    ALLOWED_RESUME_EXTENSIONS = {'pdf'}
    
    _cors_env = os.getenv('CORS_ORIGINS', '*')
    if _cors_env == '*':
        CORS_ORIGINS = '*'
    else:
        CORS_ORIGINS = [orig.strip() for orig in _cors_env.split(',') if orig.strip()]

