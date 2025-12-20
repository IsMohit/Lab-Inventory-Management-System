"""
Transaction model
"""
from datetime import datetime
from bson import ObjectId
from app.utils.database import Database

class Transaction:
    """Transaction model"""
    
    @staticmethod
    def create(data):
        """Create new transaction"""
        transaction = {
            'componentId': ObjectId(data.get('componentId')),
            'type': data.get('type'),  # 'inward' or 'outward'
            'quantity': data.get('quantity'),
            'reason': data.get('reason', ''),
            'userId': ObjectId(data.get('userId')),
            'timestamp': datetime.utcnow(),
            'notes': data.get('notes', '')
        }
        
        db = Database.get_connection()
        result = db.transactions.insert_one(transaction)
        transaction['_id'] = str(result.inserted_id)
        transaction['componentId'] = str(transaction['componentId'])
        transaction['userId'] = str(transaction['userId'])
        return transaction
    
    @staticmethod
    def get_by_id(transaction_id):
        """Get transaction by ID"""
        db = Database.get_connection()
        try:
            transaction = db.transactions.find_one({'_id': ObjectId(transaction_id)})
            if transaction:
                transaction['_id'] = str(transaction['_id'])
                transaction['componentId'] = str(transaction['componentId'])
                transaction['userId'] = str(transaction['userId'])
            return transaction
        except:
            return None
    
    @staticmethod
    def get_all(filters=None):
        """Get all transactions"""
        db = Database.get_connection()
        query = filters or {}
        transactions = list(db.transactions.find(query).sort('timestamp', -1))
        for transaction in transactions:
            transaction['_id'] = str(transaction['_id'])
            transaction['componentId'] = str(transaction['componentId'])
            transaction['userId'] = str(transaction['userId'])
        return transactions
    
    @staticmethod
    def get_by_component(component_id):
        """Get transactions for a component"""
        return Transaction.get_all({'componentId': ObjectId(component_id)})
    
    @staticmethod
    def get_by_user(user_id):
        """Get transactions by user"""
        return Transaction.get_all({'userId': ObjectId(user_id)})
