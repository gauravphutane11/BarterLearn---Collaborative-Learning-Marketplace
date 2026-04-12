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

# -----------------------------
# App Setup
# -----------------------------

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "sqlite:///barterlearn.db"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "barterlearn-secret")

db.init_app(app)
jwt = JWTManager(app)

CORS(app, origins="*")

# -----------------------------
# Create tables automatically
# -----------------------------

with app.app_context():
    db.create_all()

# -----------------------------
# Root
# -----------------------------

@app.route("/")
def root():
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
        return jsonify({"msg": "Missing required fields"}), 400

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

    if not data:
        return jsonify({"msg": "Invalid data"}), 400

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    if not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad credentials"}), 401

    # JWT subject must be string
    token = create_access_token(identity=str(user.id))

    return jsonify(access_token=token)

# -----------------------------
# Current User
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

    if "name" in data:
        user.name = data["name"]

    if "bio" in data:
        user.bio = data["bio"]

    if "avatar" in data:
        user.avatar = data["avatar"]

    if "skillsOffered" in data:
        user.skills_offered = data["skillsOffered"]

    if "skillsWanted" in data:
        user.skills_wanted = data["skillsWanted"]

    db.session.commit()

    return jsonify(user.to_dict())

# -----------------------------
# Users
# -----------------------------

@app.route("/api/users", methods=["GET"])
@jwt_required()
def get_users():

    users = User.query.all()

    return jsonify([u.to_dict() for u in users])


@app.route("/api/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):

    user = User.query.get_or_404(user_id)

    return jsonify(user.to_dict())

# -----------------------------
# Matching Algorithm
# -----------------------------

@app.route("/api/matches", methods=["GET"])
@jwt_required()
def matches():

    current_user_id = int(get_jwt_identity())

    current_user = User.query.get(current_user_id)

    users = User.query.filter(User.id != current_user_id).all()

    results = []

    for u in users:

        common = list(
            set(current_user.skills_wanted).intersection(
                set(u.skills_offered)
            )
        )

        if len(common) > 0:

            results.append({
                "id": u.id,
                "name": u.name,
                "avatar": u.avatar,
                "commonSkills": common,
                "compatibilityScore": len(common) * 20
            })

    return jsonify(results)

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


@app.route("/api/exchanges/<int:id>", methods=["PATCH"])
@jwt_required()
def update_exchange(id):

    exchange = Exchange.query.get_or_404(id)

    data = request.get_json()

    if "sessions_completed" in data:
        exchange.sessions_completed = data["sessions_completed"]

    if "status" in data:
        exchange.status = data["status"]

    if "rating" in data:
        exchange.rating = data["rating"]

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
def read_notification(id):

    notification = Notification.query.get_or_404(id)

    notification.read = True

    db.session.commit()

    return jsonify(notification.to_dict())

# -----------------------------
# Run local server
# -----------------------------

if __name__ == "__main__":
    app.run(debug=True)