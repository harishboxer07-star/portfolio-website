import os
from flask import Blueprint, send_from_directory, current_app, abort

uploads_bp = Blueprint('uploads', __name__)

@uploads_bp.route('/<subfolder>/<path:filename>', methods=['GET'])
def serve_upload(subfolder, filename):
    if subfolder not in ['images', 'resumes']:
        abort(404)
        
    safe_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], subfolder)
    return send_from_directory(safe_folder, filename)
