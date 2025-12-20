"""
User management routes
"""
from flask import request, jsonify
from app.routes import users_bp
from app.models.user import User
from app.utils.decorators import token_required, admin_required
from app.utils.validators import validate_user
import logging

logger = logging.getLogger(__name__)

@users_bp.route('/', methods=['GET'])
@token_required
@admin_required
def get_users():
    """Get all users (admin only)"""
    try:
        users = User.get_all()
        
        return jsonify({
            'message': 'Users retrieved successfully',
            'data': users
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        return jsonify({'message': 'Server error'}), 500

@users_bp.route('/<user_id>', methods=['GET'])
@token_required
def get_user(user_id):
    """Get user by ID"""
    try:
        # Users can only view their own profile, admins can view anyone's
        if request.user_id != user_id and request.user_role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        user = User.get_by_id(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'message': 'User retrieved successfully',
            'data': user
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        return jsonify({'message': 'Server error'}), 500

@users_bp.route('/<user_id>', methods=['PUT'])
@token_required
def update_user(user_id):
    """Update user profile"""
    try:
        # Users can only update their own profile, admins can update anyone's
        if request.user_id != user_id and request.user_role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        # Validate data
        errors = validate_user(data)
        if errors:
            return jsonify({'message': 'Validation error', 'errors': errors}), 400
        
        user = User.update(user_id, data)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'message': 'User updated successfully',
            'data': user
        }), 200
    
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        return jsonify({'message': 'Server error'}), 500

@users_bp.route('/<user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(user_id):
    """Delete user (admin only)"""
    try:
        if not User.delete(user_id):
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({'message': 'User deleted successfully'}), 200
    
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        return jsonify({'message': 'Server error'}), 500

@users_bp.route('/profile', methods=['GET'])
@token_required
def get_current_user_profile():
    """Get current user profile"""
    try:
        user = User.get_by_id(request.user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'message': 'User profile retrieved successfully',
            'data': user
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        return jsonify({'message': 'Server error'}), 500
