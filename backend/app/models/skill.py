from datetime import datetime
from app import db

class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    proficiency_level = db.Column(db.Integer, default=80)  # 1 to 100 percentage
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'proficiency_level': self.proficiency_level,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
