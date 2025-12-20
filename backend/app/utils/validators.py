"""
Input validators
"""
from datetime import datetime
import re

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_component(data):
    """Validate component data"""
    errors = []
    
    if not data.get('name'):
        errors.append('Component name is required')
    
    if not data.get('category'):
        errors.append('Category is required')
    
    if 'quantity' in data:
        if not isinstance(data['quantity'], int) or data['quantity'] < 0:
            errors.append('Quantity must be a non-negative integer')
    
    if 'unitPrice' in data:
        if not isinstance(data['unitPrice'], (int, float)) or data['unitPrice'] < 0:
            errors.append('Unit price must be a non-negative number')
    
    if 'criticalLowThreshold' in data:
        if not isinstance(data['criticalLowThreshold'], int) or data['criticalLowThreshold'] < 0:
            errors.append('Critical low threshold must be a non-negative integer')
    
    return errors

def validate_transaction(data):
    """Validate transaction data"""
    errors = []
    
    if not data.get('componentId'):
        errors.append('Component ID is required')
    
    if data.get('type') not in ['inward', 'outward']:
        errors.append('Transaction type must be "inward" or "outward"')
    
    if 'quantity' in data:
        if not isinstance(data['quantity'], int) or data['quantity'] <= 0:
            errors.append('Quantity must be a positive integer')
    
    return errors

def validate_user(data):
    """Validate user data"""
    errors = []
    
    if not data.get('email'):
        errors.append('Email is required')
    elif not validate_email(data['email']):
        errors.append('Invalid email format')
    
    if data.get('role') not in ['admin', 'staff']:
        errors.append('Role must be "admin" or "staff"')
    
    return errors
