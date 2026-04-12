from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from models import User, Exchange, Notification
import os

app = Flask(__name__)

# -----------------------------
# Configuration
# -----------------------------

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "sqlite:///barterlearn.db"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

db.init_app(app)
jwt = JWTManager(app)

CORS(app, origins="*")

# -----------------------------
# Create tables
# -----------------------------

with app.app_context():
    db.create_all()

# -----------------------------
# Root Route
# -----------------------------

@app.route("/")
def home():
    return jsonify({"msg": "BarterLearn API running"})

# -----------------------------
# Register
# -----------------------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Invalid data"}), 400

    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        return jsonify({"msg": "Missing fields"}), 400

    existing = User.query.filter_by(email=email).first()

    if existing:
        return jsonify({"msg": "User already exists"}), 400

    user = User(
        name=name,
        email=email,
        password=generate_password_hash(password)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"})

# -----------------------------
# Login
# -----------------------------

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad credentials"}), 401

    # FIX: JWT subject must be string
    access_token = create_access_token(identity=str(user.id))

    return jsonify(access_token=access_token)

# -----------------------------
# Get Current User
# -----------------------------

@app.route("/api/me", methods=["GET"])
@jwt_required()
def get_me():

    user_id = int(get_jwt_identity())

    user = User.query.get_or_404(user_id)

    return jsonify(user.to_dict())

# -----------------------------
# Update Profile
# -----------------------------

@app.route("/api/me", methods=["PUT"])
@jwt_required()
def update_profile():

    user_id = int(get_jwt_identity())

    user = User.query.get_or_404(user_id)

    data = request.get_json()

    if not isinstance(data, dict):
        return jsonify({"msg": "Invalid JSON"}), 400

    user.name = data.get("name", user.name)
    user.bio = data.get("bio", user.bio)
    user.avatar = data.get("avatar", user.avatar)

    user.skills_offered = data.get("skillsOffered", user.skills_offered)
    user.skills_wanted = data.get("skillsWanted", user.skills_wanted)

    db.session.commit()

    return jsonify(user.to_dict())

# -----------------------------
# Get All Users
# -----------------------------

@app.route("/api/users", methods=["GET"])
@jwt_required()
def get_users():

    users = User.query.all()

    return jsonify([u.to_dict() for u in users])

# -----------------------------
# Get Single User
# -----------------------------

@app.route("/api/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):

    user = User.query.get_or_404(user_id)

    return jsonify(user.to_dict())

# -----------------------------
# Get Matches
# -----------------------------

@app.route("/api/matches", methods=["GET"])
@jwt_required()
def get_matches():

    current_user_id = int(get_jwt_identity())

    current_user = User.query.get(current_user_id)

    users = User.query.filter(User.id != current_user_id).all()

    matches = []

    for u in users:

        common = list(
            set(current_user.skills_wanted).intersection(
                set(u.skills_offered)
            )
        )

        if common:
            matches.append({
                "id": u.id,
                "name": u.name,
                "avatar": u.avatar,
                "commonSkills": common,
                "compatibilityScore": len(common) * 20
            })

    return jsonify(matches)

# -----------------------------
# Exchanges
# -----------------------------

@app.route("/api/exchanges", methods=["GET"])
@jwt_required()
def get_exchanges():

    user_id = int(get_jwt_identity())

    exchanges = Exchange.query.filter(
        (Exchange.user_id == user_id) |
        (Exchange.partner_id == user_id)
    ).all()

    return jsonify([e.to_dict() for e in exchanges])


@app.route("/api/exchanges", methods=["POST"])
@jwt_required()
def create_exchange():

    user_id = int(get_jwt_identity())

    data = request.get_json()

    exchange = Exchange(
        user_id=user_id,
        partner_id=data.get("partner_id"),
        skill=data.get("skill"),
        partner_skill=data.get("partner_skill"),
        total_sessions=10
    )

    db.session.add(exchange)
    db.session.commit()

    return jsonify(exchange.to_dict())


@app.route("/api/exchanges/<int:exchange_id>", methods=["PATCH"])
@jwt_required()
def update_exchange(exchange_id):

    exchange = Exchange.query.get_or_404(exchange_id)

    data = request.get_json()

    exchange.sessions_completed = data.get(
        "sessions_completed",
        exchange.sessions_completed
    )

    exchange.status = data.get(
        "status",
        exchange.status
    )

    exchange.rating = data.get(
        "rating",
        exchange.rating
    )

    db.session.commit()

    return jsonify(exchange.to_dict())

# -----------------------------
# Notifications
# -----------------------------

@app.route("/api/notifications", methods=["GET"])
@jwt_required()
def get_notifications():

    user_id = int(get_jwt_identity())

    notifications = Notification.query.filter_by(user_id=user_id).all()

    return jsonify([n.to_dict() for n in notifications])


@app.route("/api/notifications", methods=["POST"])
@jwt_required()
def create_notification():

    data = request.get_json()

    notification = Notification(
        user_id=data.get("user_id"),
        title=data.get("title"),
        message=data.get("message"),
        type=data.get("type", "info")
    )

    db.session.add(notification)
    db.session.commit()

    return jsonify(notification.to_dict())


@app.route("/api/notifications/<int:id>/read", methods=["PATCH"])
@jwt_required()
def mark_notification_read(id):

    notification = Notification.query.get_or_404(id)

    notification.read = True

    db.session.commit()

    return jsonify(notification.to_dict())

# -----------------------------
# Run Server
# -----------------------------

if __name__ == "__main__":
    app.run(debug=True)