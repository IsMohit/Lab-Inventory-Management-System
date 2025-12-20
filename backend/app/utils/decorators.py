"""
Utility decorators for authentication and validation
"""
from functools import wraps
from flask import request, jsonify
from app.services.auth_service import verify_token
import logging

logger = logging.getLogger(__name__)

def token_required(f):
    """Decorator to verify JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            user_data = verify_token(token)
            request.user_id = user_data['user_id']
            request.user_role = user_data['role']
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return jsonify({'message': 'Invalid or expired token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

def admin_required(f):
    """Decorator to verify admin role"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # token_required should be applied first
        if not hasattr(request, 'user_role'):
            return jsonify({'message': 'Unauthorized'}), 401
        
        if request.user_role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    
    return decorated

def validate_json(required_fields):
    """Decorator to validate JSON request"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            data = request.get_json()
            
            if not data:
                return jsonify({'message': 'No JSON data provided'}), 400
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return jsonify({
                    'message': f'Missing required fields: {", ".join(missing_fields)}'
                }), 400
            
            return f(*args, **kwargs)
        return decorated
    return decorator
