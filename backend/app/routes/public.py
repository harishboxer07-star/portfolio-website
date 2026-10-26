from flask import Blueprint, request, jsonify
from app import db
from app.models.profile import Profile
from app.models.project import Project
from app.models.skill import Skill
from app.models.education import Education
from app.models.certificate import Certificate
from app.models.message import Message

public_bp = Blueprint('public', __name__)

@public_bp.route('/portfolio', methods=['GET'])
def get_portfolio_bundle():
    profile = Profile.query.first()
    projects = Project.query.order_by(Project.is_featured.desc(), Project.created_at.desc()).all()
    skills = Skill.query.order_by(Skill.category.asc(), Skill.proficiency_level.desc()).all()
    education = Education.query.order_by(Education.display_order.asc(), Education.created_at.desc()).all()
    certificates = Certificate.query.order_by(Certificate.created_at.desc()).all()

    # Group skills by category
    skills_by_category = {}
    for s in skills:
        cat = s.category or 'General'
        if cat not in skills_by_category:
            skills_by_category[cat] = []
        skills_by_category[cat].append(s.to_dict())

    return jsonify({
        "profile": profile.to_dict() if profile else None,
        "projects": [p.to_dict() for p in projects],
        "skills": [s.to_dict() for s in skills],
        "skills_by_category": skills_by_category,
        "education": [e.to_dict() for e in education],
        "certificates": [c.to_dict() for c in certificates]
    }), 200

@public_bp.route('/profile', methods=['GET'])
def get_profile():
    profile = Profile.query.first()
    if not profile:
        return jsonify({"profile": None}), 200
    return jsonify({"profile": profile.to_dict()}), 200

@public_bp.route('/projects', methods=['GET'])
def get_projects():
    category = request.args.get('category', '').strip()
    search = request.args.get('search', '').strip().lower()

    query = Project.query

    if category and category.lower() != 'all':
        query = query.filter(Project.category.ilike(f"%{category}%"))

    projects = query.order_by(Project.is_featured.desc(), Project.created_at.desc()).all()

    results = []
    for p in projects:
        p_dict = p.to_dict()
        if search:
            title_match = search in p.title.lower()
            desc_match = search in p.description.lower()
            tech_match = any(search in t.lower() for t in p_dict['tech_stack'])
            if not (title_match or desc_match or tech_match):
                continue
        results.append(p_dict)

    return jsonify({"projects": results}), 200

@public_bp.route('/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.order_by(Skill.category.asc(), Skill.proficiency_level.desc()).all()
    return jsonify({"skills": [s.to_dict() for s in skills]}), 200

@public_bp.route('/education', methods=['GET'])
def get_education():
    education = Education.query.order_by(Education.display_order.asc(), Education.created_at.desc()).all()
    return jsonify({"education": [e.to_dict() for e in education]}), 200

@public_bp.route('/certificates', methods=['GET'])
def get_certificates():
    certificates = Certificate.query.order_by(Certificate.created_at.desc()).all()
    return jsonify({"certificates": [c.to_dict() for c in certificates]}), 200

@public_bp.route('/contact', methods=['POST'])
def submit_contact():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    message = (data.get('message') or '').strip()

    if not name or not email or not message:
        return jsonify({"error": "Please provide your name, email, and message."}), 400

    if '@' not in email or '.' not in email:
        return jsonify({"error": "Please provide a valid email address."}), 400

    new_msg = Message(
        name=name,
        email=email,
        message=message
    )
    db.session.add(new_msg)
    db.session.commit()

    return jsonify({
        "message": "Thank you! Your message has been sent successfully. Harish will get back to you shortly.",
        "data": new_msg.to_dict()
    }), 201
