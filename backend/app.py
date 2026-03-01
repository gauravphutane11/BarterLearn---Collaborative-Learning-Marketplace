from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from passlib.hash import bcrypt
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///barterlearn.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

from models import User, Exchange

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'msg': 'Email already registered'}), 400
    user = User(
        name=data.get('name'),
        email=data.get('email'),
        password=bcrypt.hash(data.get('password'))
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'User created'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    if not user or not bcrypt.verify(data.get('password'), user.password):
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
        start_date=datetime.utcnow()
    )
    db.session.add(exchange)
    db.session.commit()
    return jsonify(exchange.to_dict()), 201

@app.route('/api/matches', methods=['GET'])
@jwt_required()
def get_matches():
    me_id = get_jwt_identity()
    me = User.query.get_or_404(me_id)
    others = User.query.filter(User.id != me_id).all()
    
    def compatibility(u):
        # simple score: number of overlapping skillsWanted with skillsOffered and vice versa
        score = 0
        score += len(set(me.skills_offered) & set(u.skills_wanted))
        score += len(set(me.skills_wanted) & set(u.skills_offered))
        return score
    
    scored = []
    for u in others:
        score = compatibility(u)
        scored.append({
            **u.to_dict(),
            'compatibilityScore': score
        })
    scored.sort(key=lambda x: x['compatibilityScore'], reverse=True)
    return jsonify(scored)

# TODO: matching algorithm endpoint

if __name__ == '__main__':
    app.run(debug=True)
