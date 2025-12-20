"""
User model
"""
from datetime import datetime
from bson import ObjectId
from app.utils.database import Database

class User:
    """User model"""
    
    @staticmethod
    def create(data):
        """Create new user"""
        user = {
            'email': data.get('email'),
            'password': data.get('password'),  # Hashed password
            'name': data.get('name'),
            'role': data.get('role', 'staff'),  # 'admin' or 'staff'
            'department': data.get('department', ''),
            'createdAt': datetime.utcnow(),
            'lastLogin': datetime.utcnow()
        }
        
        db = Database.get_connection()
        result = db.users.insert_one(user)
        user['_id'] = result.inserted_id
        return user
    
    @staticmethod
    def get_by_id(user_id):
        """Get user by ID"""
        db = Database.get_connection()
        try:
            user = db.users.find_one({'_id': ObjectId(user_id)})
            return user
        except:
            return None
    
    @staticmethod
    def get_by_email(email):
        """Get user by email"""
        db = Database.get_connection()
        user = db.users.find_one({'email': email})
        return user
    
    @staticmethod
    def get_all():
        """Get all users"""
        db = Database.get_connection()
        users = list(db.users.find())
        for user in users:
            user['_id'] = str(user['_id'])
        return users
    
    @staticmethod
    def update(user_id, data):
        """Update user"""
        db = Database.get_connection()
        data['updatedAt'] = datetime.utcnow()
        
        result = db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': data}
        )
        
        if result.matched_count:
            return User.get_by_id(user_id)
        return None
    
    @staticmethod
    def update_last_login(user_id):
        """Update last login timestamp"""
        db = Database.get_connection()
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'lastLogin': datetime.utcnow()}}
        )
    
    @staticmethod
    def delete(user_id):
        """Delete user"""
        db = Database.get_connection()
        result = db.users.delete_one({'_id': ObjectId(user_id)})
        return result.deleted_count > 0
    
    @staticmethod
    def exists(firebase_uid):
        """Check if user exists"""
        db = Database.get_connection()
        return db.users.find_one({'firebaseUID': firebase_uid}) is not None
