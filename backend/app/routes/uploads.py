import os
from flask import Blueprint, send_from_directory, current_app, abort

uploads_bp = Blueprint('uploads', __name__)

@uploads_bp.route('/<subfolder>/<path:filename>', methods=['GET'])
def serve_upload(subfolder, filename):
    if subfolder not in ['images', 'resumes']:
        abort(404)
        
    # First check configured upload folder (e.g. /tmp/uploads on Vercel or local uploads)
    safe_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], subfolder)
    if os.path.exists(os.path.join(safe_folder, filename)):
        return send_from_directory(safe_folder, filename)

    # Fallback to backend bundled uploads directory (for pre-packaged assets like harish_kumar.jpg)
    backend_base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    bundled_folder = os.path.join(backend_base, 'uploads', subfolder)
    if os.path.exists(os.path.join(bundled_folder, filename)):
        return send_from_directory(bundled_folder, filename)

    abort(404)

