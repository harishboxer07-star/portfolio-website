from datetime import datetime
from app import db

class Profile(db.Model):
    __tablename__ = 'profiles'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False, default="Harish Kumar")
    qualification = db.Column(db.String(120), nullable=False, default="M.Sc. Data Science")
    role = db.Column(db.String(150), nullable=False, default="Data Science Student | Aspiring Full-Stack Developer")
    mobile = db.Column(db.String(30), nullable=False, default="6380178269")
    email = db.Column(db.String(120), default="")
    location = db.Column(db.String(150), default="")
    bio = db.Column(db.Text, default="")
    github_url = db.Column(db.String(255), default="")
    linkedin_url = db.Column(db.String(255), default="")
    photo_url = db.Column(db.String(255), default="")
    resume_url = db.Column(db.String(255), default="")
    career_interests = db.Column(db.Text, default="")
    professional_goals = db.Column(db.Text, default="")
    personal_strengths = db.Column(db.Text, default="")
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'qualification': self.qualification,
            'role': self.role,
            'mobile': self.mobile,
            'email': self.email or '',
            'location': self.location or '',
            'bio': self.bio or '',
            'github_url': self.github_url or '',
            'linkedin_url': self.linkedin_url or '',
            'photo_url': self.photo_url or '',
            'resume_url': self.resume_url or '',
            'career_interests': self.career_interests or '',
            'professional_goals': self.professional_goals or '',
            'personal_strengths': self.personal_strengths or '',
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
