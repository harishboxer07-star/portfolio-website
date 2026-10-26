from datetime import datetime
from app import db

class Certificate(db.Model):
    __tablename__ = 'certificates'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    issuer = db.Column(db.String(150), nullable=False)
    issue_date = db.Column(db.String(50), default="")
    credential_url = db.Column(db.String(255), default="")
    image_url = db.Column(db.String(255), default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'issuer': self.issuer,
            'issue_date': self.issue_date or '',
            'credential_url': self.credential_url or '',
            'image_url': self.image_url or '',
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
