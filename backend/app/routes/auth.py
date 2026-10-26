from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"username": user.username}
    )

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    old_password = data.get('old_password') or ''
    new_password = data.get('new_password') or ''

    if not old_password or not new_password:
        return jsonify({"error": "Both old and new passwords are required"}), 400

    if not user.check_password(old_password):
        return jsonify({"error": "Incorrect current password"}), 400

    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters"}), 400

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200
