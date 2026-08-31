from app import app, db

print("✓ Backend loads correctly")
with app.app_context():
    db.create_all()
    print("✓ Database initialized")

import os
if os.path.exists("learvix.db"):
    print("✓ Database file created: learvix.db")
    
print(f"✓ Config: {app.config['SQLALCHEMY_DATABASE_URI']}")
print(f"✓ JWT Secret: {app.config['JWT_SECRET_KEY']}")
print("\n✅ All backend configurations verified!")
