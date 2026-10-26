from datetime import datetime
from app import db

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), default="")
    tech_stack = db.Column(db.String(255), default="")
    github_url = db.Column(db.String(255), default="")
    live_demo_url = db.Column(db.String(255), default="")
    category = db.Column(db.String(100), default="Data Science")
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'image_url': self.image_url or '',
            'tech_stack': [t.strip() for t in self.tech_stack.split(',') if t.strip()] if self.tech_stack else [],
            'raw_tech_stack': self.tech_stack or '',
            'github_url': self.github_url or '',
            'live_demo_url': self.live_demo_url or '',
            'category': self.category or 'General',
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
