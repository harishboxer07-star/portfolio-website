from datetime import datetime
from app import db

class Education(db.Model):
    __tablename__ = 'education'

    id = db.Column(db.Integer, primary_key=True)
    degree = db.Column(db.String(150), nullable=False)
    institution = db.Column(db.String(200), nullable=False)
    field_of_study = db.Column(db.String(150), default="")
    start_year = db.Column(db.String(20), default="")
    end_year = db.Column(db.String(20), default="")
    grade = db.Column(db.String(50), default="")
    description = db.Column(db.Text, default="")
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'degree': self.degree,
            'institution': self.institution,
            'field_of_study': self.field_of_study or '',
            'start_year': self.start_year or '',
            'end_year': self.end_year or '',
            'grade': self.grade or '',
            'description': self.description or '',
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
