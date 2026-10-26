from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.profile import Profile
from app.models.project import Project
from app.models.skill import Skill
from app.models.education import Education
from app.models.certificate import Certificate
from app.models.message import Message
from app.services.storage import save_uploaded_file, delete_uploaded_file

admin_bp = Blueprint('admin', __name__)

# All routes in this blueprint require JWT authentication
@admin_bp.before_request
@jwt_required()
def require_authentication():
    pass

# ============================================================
# STATS & DASHBOARD OVERVIEW
# ============================================================
@admin_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    total_projects = Project.query.count()
    total_skills = Skill.query.count()
    total_education = Education.query.count()
    total_certificates = Certificate.query.count()
    total_messages = Message.query.count()
    unread_messages = Message.query.filter_by(is_read=False).count()

    recent_messages = Message.query.order_by(Message.created_at.desc()).limit(5).all()

    return jsonify({
        "total_projects": total_projects,
        "total_skills": total_skills,
        "total_education": total_education,
        "total_certificates": total_certificates,
        "total_messages": total_messages,
        "unread_messages": unread_messages,
        "recent_messages": [m.to_dict() for m in recent_messages]
    }), 200

# ============================================================
# PROFILE CRUD
# ============================================================
@admin_bp.route('/profile', methods=['GET'])
def get_admin_profile():
    profile = Profile.query.first()
    if not profile:
        profile = Profile(
            full_name="Harish Kumar",
            qualification="M.Sc. Data Science",
            role="Data Science Student | Aspiring Full-Stack Developer",
            mobile="6380178269"
        )
        db.session.add(profile)
        db.session.commit()
    return jsonify({"profile": profile.to_dict()}), 200

@admin_bp.route('/profile', methods=['PUT'])
def update_profile():
    profile = Profile.query.first()
    if not profile:
        profile = Profile()
        db.session.add(profile)

    data = request.get_json() or {}
    
    profile.full_name = data.get('full_name', profile.full_name)
    profile.qualification = data.get('qualification', profile.qualification)
    profile.role = data.get('role', profile.role)
    profile.mobile = data.get('mobile', profile.mobile)
    profile.email = data.get('email', profile.email)
    profile.location = data.get('location', profile.location)
    profile.bio = data.get('bio', profile.bio)
    profile.github_url = data.get('github_url', profile.github_url)
    profile.linkedin_url = data.get('linkedin_url', profile.linkedin_url)
    profile.photo_url = data.get('photo_url', profile.photo_url)
    profile.resume_url = data.get('resume_url', profile.resume_url)
    profile.career_interests = data.get('career_interests', profile.career_interests)
    profile.professional_goals = data.get('professional_goals', profile.professional_goals)
    profile.personal_strengths = data.get('personal_strengths', profile.personal_strengths)

    db.session.commit()
    return jsonify({"message": "Profile updated successfully", "profile": profile.to_dict()}), 200

# ============================================================
# PROJECTS CRUD
# ============================================================
@admin_bp.route('/projects', methods=['GET'])
def get_all_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return jsonify({"projects": [p.to_dict() for p in projects]}), 200

@admin_bp.route('/projects', methods=['POST'])
def create_project():
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    description = (data.get('description') or '').strip()

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    tech_stack = data.get('tech_stack', '')
    if isinstance(tech_stack, list):
        tech_stack = ', '.join([t.strip() for t in tech_stack if t.strip()])

    new_project = Project(
        title=title,
        description=description,
        image_url=data.get('image_url', ''),
        tech_stack=tech_stack,
        github_url=data.get('github_url', ''),
        live_demo_url=data.get('live_demo_url', ''),
        category=data.get('category', 'Data Science'),
        is_featured=bool(data.get('is_featured', False))
    )
    db.session.add(new_project)
    db.session.commit()

    return jsonify({"message": "Project created successfully", "project": new_project.to_dict()}), 201

@admin_bp.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    data = request.get_json() or {}
    if 'title' in data:
        project.title = data['title'].strip()
    if 'description' in data:
        project.description = data['description'].strip()
    if 'image_url' in data:
        project.image_url = data['image_url']
    if 'tech_stack' in data:
        tech_stack = data['tech_stack']
        if isinstance(tech_stack, list):
            tech_stack = ', '.join([t.strip() for t in tech_stack if t.strip()])
        project.tech_stack = tech_stack
    if 'github_url' in data:
        project.github_url = data['github_url']
    if 'live_demo_url' in data:
        project.live_demo_url = data['live_demo_url']
    if 'category' in data:
        project.category = data['category']
    if 'is_featured' in data:
        project.is_featured = bool(data['is_featured'])

    db.session.commit()
    return jsonify({"message": "Project updated successfully", "project": project.to_dict()}), 200

@admin_bp.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    if project.image_url:
        delete_uploaded_file(project.image_url)

    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted successfully"}), 200

# ============================================================
# SKILLS CRUD
# ============================================================
@admin_bp.route('/skills', methods=['GET'])
def get_all_skills():
    skills = Skill.query.order_by(Skill.category.asc(), Skill.proficiency_level.desc()).all()
    return jsonify({"skills": [s.to_dict() for s in skills]}), 200

@admin_bp.route('/skills', methods=['POST'])
def create_skill():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    category = (data.get('category') or 'Programming Languages').strip()

    if not name:
        return jsonify({"error": "Skill name is required"}), 400

    try:
        proficiency = int(data.get('proficiency_level', 80))
        proficiency = max(10, min(100, proficiency))
    except (ValueError, TypeError):
        proficiency = 80

    new_skill = Skill(
        name=name,
        category=category,
        proficiency_level=proficiency
    )
    db.session.add(new_skill)
    db.session.commit()

    return jsonify({"message": "Skill added successfully", "skill": new_skill.to_dict()}), 201

@admin_bp.route('/skills/<int:skill_id>', methods=['PUT'])
def update_skill(skill_id):
    skill = Skill.query.get(skill_id)
    if not skill:
        return jsonify({"error": "Skill not found"}), 404

    data = request.get_json() or {}
    if 'name' in data:
        skill.name = data['name'].strip()
    if 'category' in data:
        skill.category = data['category'].strip()
    if 'proficiency_level' in data:
        try:
            proficiency = int(data['proficiency_level'])
            skill.proficiency_level = max(10, min(100, proficiency))
        except (ValueError, TypeError):
            pass

    db.session.commit()
    return jsonify({"message": "Skill updated successfully", "skill": skill.to_dict()}), 200

@admin_bp.route('/skills/<int:skill_id>', methods=['DELETE'])
def delete_skill(skill_id):
    skill = Skill.query.get(skill_id)
    if not skill:
        return jsonify({"error": "Skill not found"}), 404

    db.session.delete(skill)
    db.session.commit()
    return jsonify({"message": "Skill deleted successfully"}), 200

# ============================================================
# EDUCATION CRUD
# ============================================================
@admin_bp.route('/education', methods=['GET'])
def get_all_education():
    education = Education.query.order_by(Education.display_order.asc(), Education.created_at.desc()).all()
    return jsonify({"education": [e.to_dict() for e in education]}), 200

@admin_bp.route('/education', methods=['POST'])
def create_education():
    data = request.get_json() or {}
    degree = (data.get('degree') or '').strip()
    institution = (data.get('institution') or '').strip()

    if not degree or not institution:
        return jsonify({"error": "Degree and institution are required"}), 400

    new_edu = Education(
        degree=degree,
        institution=institution,
        field_of_study=data.get('field_of_study', ''),
        start_year=data.get('start_year', ''),
        end_year=data.get('end_year', ''),
        grade=data.get('grade', ''),
        description=data.get('description', ''),
        display_order=int(data.get('display_order', 0))
    )
    db.session.add(new_edu)
    db.session.commit()

    return jsonify({"message": "Education record added successfully", "education": new_edu.to_dict()}), 201

@admin_bp.route('/education/<int:edu_id>', methods=['PUT'])
def update_education(edu_id):
    edu = Education.query.get(edu_id)
    if not edu:
        return jsonify({"error": "Education record not found"}), 404

    data = request.get_json() or {}
    if 'degree' in data:
        edu.degree = data['degree'].strip()
    if 'institution' in data:
        edu.institution = data['institution'].strip()
    if 'field_of_study' in data:
        edu.field_of_study = data['field_of_study']
    if 'start_year' in data:
        edu.start_year = data['start_year']
    if 'end_year' in data:
        edu.end_year = data['end_year']
    if 'grade' in data:
        edu.grade = data['grade']
    if 'description' in data:
        edu.description = data['description']
    if 'display_order' in data:
        try:
            edu.display_order = int(data['display_order'])
        except (ValueError, TypeError):
            pass

    db.session.commit()
    return jsonify({"message": "Education record updated successfully", "education": edu.to_dict()}), 200

@admin_bp.route('/education/<int:edu_id>', methods=['DELETE'])
def delete_education(edu_id):
    edu = Education.query.get(edu_id)
    if not edu:
        return jsonify({"error": "Education record not found"}), 404

    db.session.delete(edu)
    db.session.commit()
    return jsonify({"message": "Education record deleted successfully"}), 200

# ============================================================
# CERTIFICATES CRUD
# ============================================================
@admin_bp.route('/certificates', methods=['GET'])
def get_all_certificates():
    certificates = Certificate.query.order_by(Certificate.created_at.desc()).all()
    return jsonify({"certificates": [c.to_dict() for c in certificates]}), 200

@admin_bp.route('/certificates', methods=['POST'])
def create_certificate():
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    issuer = (data.get('issuer') or '').strip()

    if not title or not issuer:
        return jsonify({"error": "Certificate title and issuer are required"}), 400

    new_cert = Certificate(
        title=title,
        issuer=issuer,
        issue_date=data.get('issue_date', ''),
        credential_url=data.get('credential_url', ''),
        image_url=data.get('image_url', '')
    )
    db.session.add(new_cert)
    db.session.commit()

    return jsonify({"message": "Certificate added successfully", "certificate": new_cert.to_dict()}), 201

@admin_bp.route('/certificates/<int:cert_id>', methods=['PUT'])
def update_certificate(cert_id):
    cert = Certificate.query.get(cert_id)
    if not cert:
        return jsonify({"error": "Certificate not found"}), 404

    data = request.get_json() or {}
    if 'title' in data:
        cert.title = data['title'].strip()
    if 'issuer' in data:
        cert.issuer = data['issuer'].strip()
    if 'issue_date' in data:
        cert.issue_date = data['issue_date']
    if 'credential_url' in data:
        cert.credential_url = data['credential_url']
    if 'image_url' in data:
        cert.image_url = data['image_url']

    db.session.commit()
    return jsonify({"message": "Certificate updated successfully", "certificate": cert.to_dict()}), 200

@admin_bp.route('/certificates/<int:cert_id>', methods=['DELETE'])
def delete_certificate(cert_id):
    cert = Certificate.query.get(cert_id)
    if not cert:
        return jsonify({"error": "Certificate not found"}), 404

    if cert.image_url:
        delete_uploaded_file(cert.image_url)

    db.session.delete(cert)
    db.session.commit()
    return jsonify({"message": "Certificate deleted successfully"}), 200

# ============================================================
# MESSAGES MANAGEMENT
# ============================================================
@admin_bp.route('/messages', methods=['GET'])
def get_all_messages():
    messages = Message.query.order_by(Message.created_at.desc()).all()
    return jsonify({"messages": [m.to_dict() for m in messages]}), 200

@admin_bp.route('/messages/<int:msg_id>/read', methods=['PATCH'])
def toggle_message_read(msg_id):
    msg = Message.query.get(msg_id)
    if not msg:
        return jsonify({"error": "Message not found"}), 404

    data = request.get_json() or {}
    if 'is_read' in data:
        msg.is_read = bool(data['is_read'])
    else:
        msg.is_read = not msg.is_read

    db.session.commit()
    return jsonify({"message": "Message status updated", "message_item": msg.to_dict()}), 200

@admin_bp.route('/messages/<int:msg_id>', methods=['DELETE'])
def delete_message(msg_id):
    msg = Message.query.get(msg_id)
    if not msg:
        return jsonify({"error": "Message not found"}), 404

    db.session.delete(msg)
    db.session.commit()
    return jsonify({"message": "Message deleted successfully"}), 200

# ============================================================
# FILE UPLOAD ENDPOINTS
# ============================================================
@admin_bp.route('/upload/image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files['file']
    try:
        url = save_uploaded_file(file, subfolder='images')
        return jsonify({"message": "Image uploaded successfully", "url": url}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@admin_bp.route('/upload/resume', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files['file']
    try:
        url = save_uploaded_file(file, subfolder='resumes')
        return jsonify({"message": "Resume uploaded successfully", "url": url}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
