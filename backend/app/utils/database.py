"""
Database initialization and connection
"""
from pymongo import MongoClient
from flask import current_app
import logging

logger = logging.getLogger(__name__)

class Database:
    """MongoDB database handler"""
    _client = None
    _db = None
    
    @classmethod
    def get_connection(cls):
        """Get database connection"""
        if cls._db is None:
            try:
                cls._client = MongoClient(current_app.config['MONGODB_URI'])
                cls._db = cls._client.get_database()
                logger.info("Connected to MongoDB")
            except Exception as e:
                logger.error(f"MongoDB connection failed: {e}")
                raise
        return cls._db
    
    @classmethod
    def close(cls):
        """Close database connection"""
        if cls._client:
            cls._client.close()
            cls._db = None
            logger.info("MongoDB connection closed")

def init_db(app):
    """Initialize database with Flask app"""
    with app.app_context():
        try:
            Database.get_connection()
            
            # Create indexes
            db = Database.get_connection()
            
            # Components indexes
            db.components.create_index([('name', 1)])
            db.components.create_index([('partNumber', 1)])
            db.components.create_index([('category', 1)])
            
            # Users indexes
            db.users.create_index([('firebaseUID', 1)], unique=True)
            db.users.create_index([('email', 1)], unique=True)
            
            # Transactions indexes
            db.transactions.create_index([('componentId', 1)])
            db.transactions.create_index([('userId', 1)])
            db.transactions.create_index([('timestamp', -1)])
            
            # Notifications indexes
            db.notifications.create_index([('userId', 1)])
            db.notifications.create_index([('createdAt', -1)])
            
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.error(f"Database initialization failed: {e}")
            raise
    
    @app.teardown_appcontext
    def close_db(error):
        """Close database connection on app teardown"""
        Database.close()
