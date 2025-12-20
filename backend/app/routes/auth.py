"""
Authentication routes with simple email/password authentication
"""
from flask import request, jsonify
from app.routes import auth_bp
from app.services.auth_service import authenticate_user, register_user
from app.utils.decorators import validate_json, token_required
import logging

logger = logging.getLogger(__name__)

@auth_bp.route('/login', methods=['POST'])
@validate_json(['email', 'password'])
def login():
    """Login with email and password"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        logger.info(f"Login attempt for: {email}")
        
        result = authenticate_user(email, password)
        
        if result:
            logger.info(f"Login successful for: {email}")
            return jsonify(result), 200
        else:
            logger.warning(f"Login failed for: {email}")
            return jsonify({'message': 'Invalid email or password'}), 401
    
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'message': 'Server error during login'}), 500

@auth_bp.route('/register', methods=['POST'])
@validate_json(['email', 'password', 'name'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        logger.info(f"Registration attempt for: {email}")
        
        # Validate password strength
        if len(password) < 6:
            return jsonify({'message': 'Password must be at least 6 characters'}), 400
        
        # Validate name
        if len(name) < 2:
            return jsonify({'message': 'Name must be at least 2 characters'}), 400
        
        result = register_user(email, password, name)
        
        if result:
            logger.info(f"Registration successful for: {email}")
            return jsonify(result), 201
        else:
            logger.warning(f"Registration failed for: {email}")
            return jsonify({'message': 'Email already registered or registration failed'}), 400
    
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({'message': 'Server error during registration'}), 500

@auth_bp.route('/verify-token', methods=['POST'])
@token_required
def verify_token():
    """Verify JWT token"""
    return jsonify({
        'message': 'Token is valid',
        'user_id': request.user_id,
        'role': request.user_role
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    """Logout endpoint (token invalidated on frontend)"""
    return jsonify({'message': 'Logged out successfully'}), 200
