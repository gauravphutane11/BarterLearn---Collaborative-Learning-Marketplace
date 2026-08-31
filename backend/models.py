from extensions import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

    avatar = db.Column(db.String(10), default="😊")
    bio = db.Column(db.Text, default="")

    skills_offered = db.Column(db.PickleType, default=list)
    skills_wanted = db.Column(db.PickleType, default=list)

    rating = db.Column(db.Float, default=0.0)
    completed_exchanges = db.Column(db.Integer, default=0)

    active_matches = db.Column(db.PickleType, default=list)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "avatar": self.avatar,
            "bio": self.bio,
            "skillsOffered": self.skills_offered or [],
            "skillsWanted": self.skills_wanted or [],
            "rating": self.rating,
            "completedExchanges": self.completed_exchanges,
            "activeMatches": self.active_matches or []
        }


class Exchange(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    partner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    skill = db.Column(db.String(128))
    partner_skill = db.Column(db.String(128))

    status = db.Column(db.String(32), default="active")

    sessions_completed = db.Column(db.Integer, default=0)
    total_sessions = db.Column(db.Integer, default=10)

    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)

    rating = db.Column(db.Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "partnerId": self.partner_id,
            "skill": self.skill,
            "partnerSkill": self.partner_skill,
            "status": self.status,
            "sessionsCompleted": self.sessions_completed,
            "totalSessions": self.total_sessions,
            "startDate": self.start_date.isoformat() if self.start_date else None,
            "endDate": self.end_date.isoformat() if self.end_date else None,
            "rating": self.rating
        }


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    title = db.Column(db.String(128), nullable=False)
    message = db.Column(db.Text, nullable=False)

    type = db.Column(db.String(32), default="info")  # info, success, warning, error

    read = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    related_exchange_id = db.Column(db.Integer, db.ForeignKey("exchange.id"))

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "read": self.read,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "relatedExchangeId": self.related_exchange_id
        }