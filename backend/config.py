import os
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'harish-portfolio-secret-key-change-in-prod-2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'harish-jwt-secret-key-change-in-prod-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES_HOURS', 12)))
    
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f"sqlite:///{os.path.join(BASE_DIR, 'portfolio.db')}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
    ALLOWED_RESUME_EXTENSIONS = {'pdf'}
    
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000').split(',')
