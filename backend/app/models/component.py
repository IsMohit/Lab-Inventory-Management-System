"""
Component model
"""
from datetime import datetime
from bson import ObjectId
from app.utils.database import Database

class Component:
    """Component model"""
    
    @staticmethod
    def create(data):
        """Create new component"""
        component = {
            'name': data.get('name'),
            'category': data.get('category'),
            'partNumber': data.get('partNumber'),
            'manufacturer': data.get('manufacturer'),
            'quantity': data.get('quantity', 0),
            'unitPrice': data.get('unitPrice', 0),
            'criticalLowThreshold': data.get('criticalLowThreshold', 10),
            'location': data.get('location', ''),
            'description': data.get('description', ''),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        db = Database.get_connection()
        result = db.components.insert_one(component)
        component['_id'] = str(result.inserted_id)
        return component
    
    @staticmethod
    def get_by_id(component_id):
        """Get component by ID"""
        db = Database.get_connection()
        try:
            component = db.components.find_one({'_id': ObjectId(component_id)})
            if component:
                component['_id'] = str(component['_id'])
            return component
        except:
            return None
    
    @staticmethod
    def get_all(filters=None):
        """Get all components with optional filters"""
        db = Database.get_connection()
        query = filters or {}
        components = list(db.components.find(query))
        for component in components:
            component['_id'] = str(component['_id'])
        return components
    
    @staticmethod
    def update(component_id, data):
        """Update component"""
        db = Database.get_connection()
        data['updatedAt'] = datetime.utcnow()
        
        result = db.components.update_one(
            {'_id': ObjectId(component_id)},
            {'$set': data}
        )
        
        if result.matched_count:
            return Component.get_by_id(component_id)
        return None
    
    @staticmethod
    def delete(component_id):
        """Delete component"""
        db = Database.get_connection()
        result = db.components.delete_one({'_id': ObjectId(component_id)})
        return result.deleted_count > 0
    
    @staticmethod
    def search(search_term, category=None):
        """Search components"""
        db = Database.get_connection()
        query = {
            '$or': [
                {'name': {'$regex': search_term, '$options': 'i'}},
                {'partNumber': {'$regex': search_term, '$options': 'i'}},
                {'manufacturer': {'$regex': search_term, '$options': 'i'}}
            ]
        }
        
        if category and category != 'All Categories':
            query['category'] = category
        
        return Component.get_all(query)
    
    @staticmethod
    def get_low_stock():
        """Get components with low stock"""
        db = Database.get_connection()
        return Component.get_all({
            '$expr': {'$lte': ['$quantity', '$criticalLowThreshold']}
        })
