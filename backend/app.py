from extensions import db
from flask import Flask, jsonify, request, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from datetime import datetime
import os
import logging

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

app = Flask(
    __name__,
    static_folder=os.path.join(basedir, '../frontend/dist'),
    static_url_path='/'
)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database
db_url = os.getenv('DATABASE_URL', 'sqlite:///barterlearn.db')

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT
app.config['JWT_SECRET_KEY'] = os.getenv(
    'JWT_SECRET_KEY',
    'super-secret-key-change-this'
)

# CORS
CORS(app)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

from models import User, Exchange, Notification

with app.app_context():
    db.create_all()


# -------------------------
# FRONTEND SERVE
# -------------------------

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


# -------------------------
# HEALTH
# -------------------------

@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})


# -------------------------
# AUTH
# -------------------------

@app.route('/api/register', methods=['POST'])
def register():

    data = request.get_json()

    if not data:
        return jsonify({'msg': 'No data provided'}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'msg': 'Missing fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'Email already registered'}), 400

    user = User(
        name=name,
        email=email.lower(),
        password=generate_password_hash(password)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'User created'}), 201


@app.route('/api/login', methods=['POST'])
def login():

    data = request.get_json()

    user = User.query.filter_by(email=data.get('email')).first()

    if not user or not check_password_hash(user.password, data.get('password')):
        return jsonify({'msg': 'Bad credentials'}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({'access_token': access_token})


@app.route('/api/me')
@jwt_required()
def get_me():

    user_id = get_jwt_identity()

    user = User.query.get_or_404(user_id)

    return jsonify(user.to_dict())


# -------------------------
# USERS
# -------------------------

@app.route('/api/users')
@jwt_required()
def get_users():

    users = User.query.all()

    return jsonify([u.to_dict() for u in users])


@app.route('/api/users/<int:user_id>')
@jwt_required()
def get_user(user_id):

    user = User.query.get_or_404(user_id)

    return jsonify(user.to_dict())


@app.route('/api/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):

    try:

        current_user = int(get_jwt_identity())

        if current_user != user_id:
            return jsonify({'msg': 'Unauthorized'}), 403

        data = request.get_json()

        if not isinstance(data, dict):
            return jsonify({'msg': 'Invalid data'}), 400

        user = User.query.get_or_404(user_id)

        user.name = data.get('name', user.name)
        user.bio = data.get('bio', user.bio)
        user.avatar = data.get('avatar', user.avatar)

        if 'skillsOffered' in data:
            user.skills_offered = data['skillsOffered']

        if 'skillsWanted' in data:
            user.skills_wanted = data['skillsWanted']

        db.session.commit()

        return jsonify(user.to_dict())

    except Exception as e:

        logger.error(e)

        return jsonify({'msg': 'Server error updating profile'}), 500


# -------------------------
# MATCHES
# -------------------------

@app.route('/api/matches')
@jwt_required()
def matches():

    me = User.query.get(get_jwt_identity())

    others = User.query.filter(User.id != me.id).all()

    results = []

    for u in others:

        learn = list(set(me.skills_wanted) & set(u.skills_offered))
        teach = list(set(me.skills_offered) & set(u.skills_wanted))

        score = (len(learn) * 20) + (len(teach) * 10)

        results.append({
            **u.to_dict(),
            "compatibilityScore": min(score, 100),
            "mutualExchange": len(learn) > 0 and len(teach) > 0
        })

    results.sort(key=lambda x: x['compatibilityScore'], reverse=True)

    return jsonify(results)


# -------------------------
# EXCHANGES
# -------------------------

@app.route('/api/exchanges')
@jwt_required()
def exchanges():

    data = Exchange.query.all()

    return jsonify([e.to_dict() for e in data])


# -------------------------
# NOTIFICATIONS
# -------------------------

@app.route('/api/notifications')
@jwt_required()
def notifications():

    user_id = get_jwt_identity()

    notes = Notification.query.filter_by(user_id=user_id).all()

    return jsonify([n.to_dict() for n in notes])


# -------------------------
# ERROR HANDLING
# -------------------------

@app.errorhandler(404)
def not_found(e):
    return jsonify({'msg': 'Not found'}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({'msg': 'Server error'}), 500


if __name__ == '__main__':
    app.run(debug=True)