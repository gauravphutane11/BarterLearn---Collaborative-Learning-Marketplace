from extensions import db
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import logging

app = Flask(__name__)
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///barterlearn.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')

CORS(app) # Enable CORS for all routes
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

from models import User, Exchange

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}), 200

@app.route('/api/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'msg': 'Email already registered'}), 400
    user = User(
        name=data.get('name'),
        email=data.get('email'),
        password=generate_password_hash(data.get('password'))
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

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@app.route('/api/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@app.route('/api/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    if get_jwt_identity() != user_id:
        return jsonify({'msg': 'Unauthorized'}), 403
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    for field in ['name','bio','skills_offered','skills_wanted','avatar']:
        if field in data:
            setattr(user, field, data[field])
    db.session.commit()
    return jsonify(user.to_dict())

@app.route('/api/exchanges', methods=['GET'])
@jwt_required()
def get_exchanges():
    exchanges = Exchange.query.all()
    return jsonify([e.to_dict() for e in exchanges])

@app.route('/api/exchanges', methods=['POST'])
@jwt_required()
def create_exchange():
    data = request.get_json()
    exchange = Exchange(
        user_id=get_jwt_identity(),
        partner_id=data.get('partner_id'),
        skill=data.get('skill'),
        partner_skill=data.get('partner_skill'),
        status='active',
        total_sessions=data.get('total_sessions', 10),
        start_date=datetime.utcnow()
    )
    db.session.add(exchange)
    db.session.commit()
    return jsonify(exchange.to_dict()), 201

@app.route('/api/exchanges/<int:exchange_id>', methods=['PATCH'])
@jwt_required()
def update_exchange(exchange_id):
    exchange = Exchange.query.get_or_404(exchange_id)
    if exchange.user_id != get_jwt_identity() and exchange.partner_id != get_jwt_identity():
        return jsonify({'msg': 'Unauthorized'}), 403
    
    data = request.get_json()
    if 'status' in data:
        exchange.status = data['status']
        if data['status'] == 'completed':
            exchange.end_date = datetime.utcnow()
            # Update user stats
            user = User.query.get(exchange.user_id)
            partner = User.query.get(exchange.partner_id)
            user.completed_exchanges += 1
            partner.completed_exchanges += 1
            
    if 'sessions_completed' in data:
        exchange.sessions_completed = data['sessions_completed']
    if 'rating' in data:
        exchange.rating = data['rating']
        
    db.session.commit()
    return jsonify(exchange.to_dict())

@app.route('/api/matches', methods=['GET'])
@jwt_required()
def get_matches():
    me_id = get_jwt_identity()
    me = User.query.get_or_404(me_id)
    others = User.query.filter(User.id != me_id).all()
    
    def get_common_skills(u):
        learn = list(set(me.skills_wanted) & set(u.skills_offered))
        teach = list(set(me.skills_offered) & set(u.skills_wanted))
        return learn, teach

    scored = []
    for u in others:
        learn, teach = get_common_skills(u)
        
        # Calculate compatibility score
        # 20 points for each skill they can teach you (max 60)
        # 10 points for each skill you can teach them (max 30)
        # 10 points for high ratings (max 10)
        score = (len(learn) * 20) + (len(teach) * 10) + (u.rating * 2)
        
        # Cap at 100%
        display_score = min(score, 100)
        
        common_skills_data = []
        for s in learn:
            common_skills_data.append({'type': 'learn', 'skill': s})
        for s in teach:
            common_skills_data.append({'type': 'teach', 'skill': s})

        scored.append({
            **u.to_dict(),
            'compatibilityScore': display_score,
            'commonSkills': common_skills_data,
            'mutualExchange': len(learn) > 0 and len(teach) > 0
        })
    
    scored.sort(key=lambda x: x['compatibilityScore'], reverse=True)
    return jsonify(scored)

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'msg': 'Resource not found'}), 404

@app.errorhandler(500)
def server_error(error):
    logger.error(f"Server Error: {error}")
    return jsonify({'msg': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
