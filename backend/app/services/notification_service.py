"""
Notification service
"""
from app.models.notification import Notification
import logging

logger = logging.getLogger(__name__)

def send_notification(user_id, notification_type, message, component_id=None):
    """Send notification to user"""
    notification_data = {
        'userId': user_id,
        'type': notification_type,
        'message': message,
        'componentId': component_id
    }
    
    notification = Notification.create(notification_data)
    logger.info(f"Notification sent to user {user_id}: {message}")
    return notification

def get_user_notifications(user_id, unread_only=False):
    """Get user notifications"""
    return Notification.get_by_user(user_id, unread_only)

def mark_notification_as_read(notification_id):
    """Mark notification as read"""
    return Notification.mark_as_read(notification_id)

def delete_notification(notification_id):
    """Delete notification"""
    return Notification.delete(notification_id)
