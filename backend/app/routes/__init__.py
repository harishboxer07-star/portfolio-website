from app.routes.auth import auth_bp
from app.routes.public import public_bp
from app.routes.admin import admin_bp
from app.routes.uploads import uploads_bp

__all__ = ['auth_bp', 'public_bp', 'admin_bp', 'uploads_bp']
