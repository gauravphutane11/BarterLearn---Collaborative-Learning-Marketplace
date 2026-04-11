from app import app, db
from models import User
from werkzeug.security import generate_password_hash

# sample users matching previous mockData.js
def seed_users():
    users = [
        {
            'name': 'Alex Johnson',
            'email': 'alex@example.com',
            'avatar': '👨‍💻',
            'bio': 'Full-stack developer passionate about teaching and learning new technologies',
            'skills_offered': ['React', 'Node.js', 'Python', 'Database Design'],
            'skills_wanted': ['Machine Learning', 'UI/UX Design', 'Spanish'],
            'rating': 4.8,
            'completed_exchanges': 12
        },
        {
            'name': 'Sarah Chen',
            'email': 'sarah@example.com',
            'avatar': '👩‍🎨',
            'bio': 'Creative designer who loves sharing design principles and learning tech',
            'skills_offered': ['UI/UX Design', 'Figma', 'Graphic Design', 'Branding'],
            'skills_wanted': ['React', 'Photography', 'Video Editing'],
            'rating': 4.9,
            'completed_exchanges': 18
        },
        {
            'name': 'Marcus Williams',
            'email': 'marcus@example.com',
            'avatar': '👨‍🔬',
            'bio': 'Data scientist eager to share ML knowledge and improve web dev skills',
            'skills_offered': ['Machine Learning', 'Python', 'Data Analysis', 'Statistics'],
            'skills_wanted': ['React', 'Cloud Computing', 'Public Speaking'],
            'rating': 4.7,
            'completed_exchanges': 10
        },
        {
            'name': 'Emma Rodriguez',
            'email': 'emma@example.com',
            'avatar': '👩‍🏫',
            'bio': 'Language teacher passionate about cultural exchange and digital skills',
            'skills_offered': ['Spanish', 'French', 'Public Speaking', 'Writing'],
            'skills_wanted': ['Web Development', 'Social Media Marketing', 'Photography'],
            'rating': 5.0,
            'completed_exchanges': 25
        },
        {
            'name': 'David Kim',
            'email': 'david@example.com',
            'avatar': '👨‍💼',
            'bio': 'Digital marketer looking to expand into development and design',
            'skills_offered': ['Digital Marketing', 'SEO', 'Content Writing', 'Social Media'],
            'skills_wanted': ['JavaScript', 'UI/UX Design', 'Data Analysis'],
            'rating': 4.6,
            'completed_exchanges': 8
        }
    ]
    for u in users:
        user = User(
            name=u['name'],
            email=u['email'],
            password=generate_password_hash('password'),
            avatar=u['avatar'],
            bio=u['bio'],
            skills_offered=u['skills_offered'],
            skills_wanted=u['skills_wanted'],
            rating=u['rating'],
            completed_exchanges=u['completed_exchanges']
        )
        db.session.add(user)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_users()
        print('Seeded users')
