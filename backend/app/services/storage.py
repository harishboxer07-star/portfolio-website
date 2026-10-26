import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

def allowed_file(filename: str, allowed_extensions: set) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def save_uploaded_file(file_obj, subfolder: str = 'images') -> str:
    """
    Saves an uploaded file to the specified subfolder under UPLOAD_FOLDER.
    Returns the relative URL path to access the file, e.g. '/uploads/images/xyz.jpg'
    """
    if not file_obj or file_obj.filename == '':
        raise ValueError("No file selected")

    filename = secure_filename(file_obj.filename)
    if not filename:
        filename = f"file_{uuid.uuid4().hex[:8]}"

    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    
    if subfolder == 'images':
        if ext not in current_app.config['ALLOWED_IMAGE_EXTENSIONS']:
            raise ValueError(f"Invalid image format. Allowed: {', '.join(current_app.config['ALLOWED_IMAGE_EXTENSIONS'])}")
    elif subfolder == 'resumes':
        if ext not in current_app.config['ALLOWED_RESUME_EXTENSIONS']:
            raise ValueError(f"Invalid resume format. Only PDF files are allowed.")
    else:
        raise ValueError(f"Unknown upload subfolder: {subfolder}")

    # Unique filename to avoid collisions
    unique_name = f"{uuid.uuid4().hex[:12]}_{filename}"
    folder_path = os.path.join(current_app.config['UPLOAD_FOLDER'], subfolder)
    os.makedirs(folder_path, exist_ok=True)
    
    file_path = os.path.join(folder_path, unique_name)
    file_obj.save(file_path)

    # Return relative URL
    return f"/uploads/{subfolder}/{unique_name}"

def delete_uploaded_file(file_url: str):
    """
    Deletes a file given its relative URL if it belongs to uploads.
    """
    if not file_url or not file_url.startswith('/uploads/'):
        return

    rel_path = file_url.replace('/uploads/', '', 1).replace('/', os.sep)
    full_path = os.path.join(current_app.config['UPLOAD_FOLDER'], rel_path)
    if os.path.exists(full_path) and os.path.isfile(full_path):
        try:
            os.remove(full_path)
        except OSError:
            pass
