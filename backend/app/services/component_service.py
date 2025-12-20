"""
Component service
"""
from app.models.component import Component
from app.models.transaction import Transaction
from app.models.notification import Notification
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

def create_component(data):
    """Create component and log transaction"""
    component = Component.create(data)
    logger.info(f"Component created: {component['_id']}")
    return component

def update_component_quantity(component_id, quantity_change, transaction_type, user_id, reason=''):
    """Update component quantity and create transaction"""
    component = Component.get_by_id(component_id)
    if not component:
        return None
    
    # Calculate new quantity
    new_quantity = component['quantity'] + quantity_change
    
    if new_quantity < 0:
        logger.warning(f"Insufficient quantity for component {component_id}")
        return None
    
    # Update component
    component = Component.update(component_id, {'quantity': new_quantity})
    
    # Create transaction record
    transaction_data = {
        'componentId': component_id,
        'type': transaction_type,
        'quantity': abs(quantity_change),
        'reason': reason,
        'userId': user_id
    }
    transaction = Transaction.create(transaction_data)
    
    # Check if stock level is critical and create notification
    if new_quantity <= component.get('criticalLowThreshold', 0):
        users = User.get_all()
        for user in users:
            if user['role'] == 'admin':  # Notify admins
                notification_data = {
                    'userId': user['_id'],
                    'type': 'critical-stock' if new_quantity == 0 else 'low-stock',
                    'message': f"{component['name']} is at critical low level (Current: {new_quantity})",
                    'componentId': component_id
                }
                Notification.create(notification_data)
    
    logger.info(f"Component {component_id} quantity updated to {new_quantity}")
    
    return {
        'component': component,
        'transaction': transaction
    }

def get_component_history(component_id):
    """Get transaction history for component"""
    transactions = Transaction.get_by_component(component_id)
    return transactions

def get_low_stock_components():
    """Get all components with low stock"""
    return Component.get_low_stock()

def search_components(search_term, category=None):
    """Search components"""
    return Component.search(search_term, category)
