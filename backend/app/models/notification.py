"""
Notification model
"""
from datetime import datetime
from bson import ObjectId
from app.utils.database import Database

class Notification:
    """Notification model"""
    
    @staticmethod
    def create(data):
        """Create new notification"""
        notification = {
            'userId': ObjectId(data.get('userId')),
            'type': data.get('type'),  # 'critical-stock', 'low-stock', 'transaction'
            'message': data.get('message'),
            'componentId': ObjectId(data.get('componentId')) if data.get('componentId') else None,
            'read': False,
            'createdAt': datetime.utcnow()
        }
        
        db = Database.get_connection()
        result = db.notifications.insert_one(notification)
        notification['_id'] = str(result.inserted_id)
        notification['userId'] = str(notification['userId'])
        if notification['componentId']:
            notification['componentId'] = str(notification['componentId'])
        return notification
    
    @staticmethod
    def get_by_id(notification_id):
        """Get notification by ID"""
        db = Database.get_connection()
        try:
            notification = db.notifications.find_one({'_id': ObjectId(notification_id)})
            if notification:
                notification['_id'] = str(notification['_id'])
                notification['userId'] = str(notification['userId'])
                if notification['componentId']:
                    notification['componentId'] = str(notification['componentId'])
            return notification
        except:
            return None
    
    @staticmethod
    def get_by_user(user_id, unread_only=False):
        """Get notifications for user"""
        db = Database.get_connection()
        query = {'userId': ObjectId(user_id)}
        
        if unread_only:
            query['read'] = False
        
        notifications = list(db.notifications.find(query).sort('createdAt', -1))
        for notification in notifications:
            notification['_id'] = str(notification['_id'])
            notification['userId'] = str(notification['userId'])
            if notification['componentId']:
                notification['componentId'] = str(notification['componentId'])
        return notifications
    
    @staticmethod
    def mark_as_read(notification_id):
        """Mark notification as read"""
        db = Database.get_connection()
        result = db.notifications.update_one(
            {'_id': ObjectId(notification_id)},
            {'$set': {'read': True}}
        )
        return result.modified_count > 0
    
    @staticmethod
    def delete(notification_id):
        """Delete notification"""
        db = Database.get_connection()
        result = db.notifications.delete_one({'_id': ObjectId(notification_id)})
        return result.deleted_count > 0
    
    @staticmethod
    def delete_by_user(user_id):
        """Delete all notifications for user"""
        db = Database.get_connection()
        result = db.notifications.delete_many({'userId': ObjectId(user_id)})
        return result.deleted_count
