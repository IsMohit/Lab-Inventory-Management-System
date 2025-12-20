"""
Authentication service with simple password-based authentication
"""
import jwt
import bcrypt
from flask import current_app
from app.models.user import User
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

def hash_password(password):
    """Hash a password using bcrypt"""
    try:
        salt = bcrypt.gensalt(rounds=10)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    except Exception as e:
        logger.error(f"Error hashing password: {e}")
        return None

def verify_password(password, hashed_password):
    """Verify a password against its hash"""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        logger.error(f"Error verifying password: {e}")
        return False

def create_jwt_token(user_id, role):
    """Create JWT token"""
    payload = {
        'user_id': str(user_id),
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=current_app.config['JWT_EXPIRATION_HOURS']),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(
        payload,
        current_app.config['JWT_SECRET'],
        algorithm=current_app.config['JWT_ALGORITHM']
    )
    
    return token

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET'],
            algorithms=[current_app.config['JWT_ALGORITHM']]
        )
        return payload
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        raise Exception("Token expired")
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {e}")
        raise Exception("Invalid token")

def authenticate_user(email, password):
    """Authenticate user with email and password"""
    try:
        # Check if user exists
        user = User.get_by_email(email)
        
        if not user:
            logger.warning(f"Login attempt for non-existent user: {email}")
            return None
        
        # Verify password
        if not verify_password(password, user.get('password', '')):
            logger.warning(f"Invalid password for user: {email}")
            return None
        
        # Update last login
        User.update_last_login(user['_id'])
        
        # Generate JWT token
        jwt_token = create_jwt_token(user['_id'], user['role'])
        
        logger.info(f"User logged in successfully: {email}")
        
        return {
            'token': jwt_token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'role': user['role'],
                'department': user.get('department', '')
            }
        }
    except Exception as e:
        logger.error(f"Authentication failed: {e}")
        return None

def register_user(email, password, name):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = User.get_by_email(email)
        if existing_user:
            logger.warning(f"Registration attempt with existing email: {email}")
            return None
        
        # Hash password
        hashed_password = hash_password(password)
        if not hashed_password:
            return None
        
        # Create new user
        user = User.create({
            'email': email,
            'password': hashed_password,
            'name': name,
            'role': 'staff'  # Default role for new users
        })
        
        logger.info(f"New user registered: {email}")
        
        # Generate JWT token
        jwt_token = create_jwt_token(user['_id'], user['role'])
        
        return {
            'token': jwt_token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'role': user['role'],
                'department': user.get('department', '')
            }
        }
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        return None
