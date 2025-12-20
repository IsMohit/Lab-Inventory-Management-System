"""
Notification routes
"""
from flask import request, jsonify
from app.routes import notifications_bp
from app.models.notification import Notification
from app.utils.decorators import token_required
import logging

logger = logging.getLogger(__name__)

@notifications_bp.route('/', methods=['GET'])
@token_required
def get_notifications():
    """Get notifications for current user"""
    try:
        unread_only = request.args.get('unread', 'false').lower() == 'true'
        notifications = Notification.get_by_user(request.user_id, unread_only)
        
        return jsonify({
            'message': 'Notifications retrieved successfully',
            'data': notifications
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching notifications: {e}")
        return jsonify({'message': 'Server error'}), 500

@notifications_bp.route('/<notification_id>', methods=['GET'])
@token_required
def get_notification(notification_id):
    """Get notification by ID"""
    try:
        notification = Notification.get_by_id(notification_id)
        
        if not notification:
            return jsonify({'message': 'Notification not found'}), 404
        
        # Verify ownership
        if notification['userId'] != request.user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        return jsonify({
            'message': 'Notification retrieved successfully',
            'data': notification
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching notification: {e}")
        return jsonify({'message': 'Server error'}), 500

@notifications_bp.route('/<notification_id>/read', methods=['PUT'])
@token_required
def mark_as_read(notification_id):
    """Mark notification as read"""
    try:
        notification = Notification.get_by_id(notification_id)
        
        if not notification:
            return jsonify({'message': 'Notification not found'}), 404
        
        # Verify ownership
        if notification['userId'] != request.user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        if Notification.mark_as_read(notification_id):
            return jsonify({'message': 'Notification marked as read'}), 200
        else:
            return jsonify({'message': 'Failed to mark notification'}), 500
    
    except Exception as e:
        logger.error(f"Error marking notification as read: {e}")
        return jsonify({'message': 'Server error'}), 500

@notifications_bp.route('/<notification_id>', methods=['DELETE'])
@token_required
def delete_notification(notification_id):
    """Delete notification"""
    try:
        notification = Notification.get_by_id(notification_id)
        
        if not notification:
            return jsonify({'message': 'Notification not found'}), 404
        
        # Verify ownership
        if notification['userId'] != request.user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        if Notification.delete(notification_id):
            return jsonify({'message': 'Notification deleted successfully'}), 200
        else:
            return jsonify({'message': 'Failed to delete notification'}), 500
    
    except Exception as e:
        logger.error(f"Error deleting notification: {e}")
        return jsonify({'message': 'Server error'}), 500
