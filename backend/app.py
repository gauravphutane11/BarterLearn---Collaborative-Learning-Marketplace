from extensions import db
from flask import Flask, jsonify, request, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import logging
import secrets

app = Flask(__name__, static_folder='../dist', static_url_path='/')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///barterlearn.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Secret Key Configuration
jwt_secret = os.getenv('JWT_SECRET_KEY')
if not jwt_secret:
    if os.getenv('FLASK_ENV') == 'production':
        raise RuntimeError("JWT_SECRET_KEY environment variable must be set in production")
    else:
        # Generate a random secret for development
        jwt_secret = secrets.token_hex(32)
        print("WARNING: Using auto-generated JWT secret for development. Set JWT_SECRET_KEY environment variable for production.")
app.config['JWT_SECRET_KEY'] = jwt_secret

# Secure CORS
allowed_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
CORS(app, origins=allowed_origins)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

from models import User, Exchange, Notification

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

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
    
    # Input validation
    if not data:
        return jsonify({'msg': 'No data provided'}), 400
    
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not name or len(name) < 2:
        return jsonify({'msg': 'Name must be at least 2 characters long'}), 400
    if not email or '@' not in email:
        return jsonify({'msg': 'Valid email is required'}), 400
    if not password or len(password) < 6:
        return jsonify({'msg': 'Password must be at least 6 characters long'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'Email already registered'}), 400
    
    user = User(
        name=name,
        email=email,
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
    current_user = User.query.get(get_jwt_identity())
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
    
    # Create notification for partner
    partner = User.query.get(data.get('partner_id'))
    if partner:
        notification = Notification(
            user_id=partner.id,
            title='New Exchange Request',
            message=f'{current_user.name} wants to exchange {data.get("skill")} for your {data.get("partner_skill")}',
            type='info',
            related_exchange_id=exchange.id
        )
        db.session.add(notification)
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

@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    total_users = User.query.count()
    total_exchanges = Exchange.query.count()
    active_exchanges = Exchange.query.filter_by(status='active').count()
    completed_exchanges = Exchange.query.filter_by(status='completed').count()
    
    # Get user's personal stats
    user_id = get_jwt_identity()
    user_exchanges = Exchange.query.filter(
        (Exchange.user_id == user_id) | (Exchange.partner_id == user_id)
    ).all()
    
    user_active = len([e for e in user_exchanges if e.status == 'active'])
    user_completed = len([e for e in user_exchanges if e.status == 'completed'])
    
    # Calculate average rating
    ratings = [e.rating for e in user_exchanges if e.rating is not None]
    avg_rating = sum(ratings) / len(ratings) if ratings else 0
    
    return jsonify({
        'global': {
            'totalUsers': total_users,
            'totalExchanges': total_exchanges,
            'activeExchanges': active_exchanges,
            'completedExchanges': completed_exchanges
        },
        'personal': {
            'activeExchanges': user_active,
            'completedExchanges': user_completed,
            'averageRating': round(avg_rating, 1) if avg_rating else 0
        }
    })

@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications])

@app.route('/api/notifications', methods=['POST'])
@jwt_required()
def create_notification():
    data = request.get_json()
    
    # Input validation
    if not data or not data.get('title') or not data.get('message'):
        return jsonify({'msg': 'Title and message are required'}), 400
    
    notification = Notification(
        user_id=get_jwt_identity(),
        title=data.get('title'),
        message=data.get('message'),
        type=data.get('type', 'info'),
        related_exchange_id=data.get('relatedExchangeId')
    )
    db.session.add(notification)
    db.session.commit()
    return jsonify(notification.to_dict()), 201

@app.route('/api/notifications/<int:notification_id>/read', methods=['PATCH'])
@jwt_required()
def mark_notification_read(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    if notification.user_id != get_jwt_identity():
        return jsonify({'msg': 'Unauthorized'}), 403
    
    notification.read = True
    db.session.commit()
    return jsonify(notification.to_dict())

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
