"""
Transaction routes
"""
from flask import request, jsonify
from app.routes import transactions_bp
from app.models.transaction import Transaction
from app.services.component_service import update_component_quantity
from app.utils.decorators import token_required, validate_json
from app.utils.validators import validate_transaction
import logging

logger = logging.getLogger(__name__)

@transactions_bp.route('/', methods=['GET'])
@token_required
def get_transactions():
    """Get all transactions"""
    try:
        transactions = Transaction.get_all()
        
        return jsonify({
            'message': 'Transactions retrieved successfully',
            'data': transactions
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching transactions: {e}")
        return jsonify({'message': 'Server error'}), 500

@transactions_bp.route('/<transaction_id>', methods=['GET'])
@token_required
def get_transaction(transaction_id):
    """Get transaction by ID"""
    try:
        transaction = Transaction.get_by_id(transaction_id)
        
        if not transaction:
            return jsonify({'message': 'Transaction not found'}), 404
        
        return jsonify({
            'message': 'Transaction retrieved successfully',
            'data': transaction
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching transaction: {e}")
        return jsonify({'message': 'Server error'}), 500

@transactions_bp.route('/', methods=['POST'])
@token_required
@validate_json(['componentId', 'type', 'quantity'])
def create_transaction():
    """Create new transaction and update component quantity"""
    try:
        data = request.get_json()
        
        # Validate data
        errors = validate_transaction(data)
        if errors:
            return jsonify({'message': 'Validation error', 'errors': errors}), 400
        
        # Determine quantity change
        quantity_change = data.get('quantity')
        if data.get('type') == 'outward':
            quantity_change = -quantity_change
        
        # Update component quantity
        result = update_component_quantity(
            data.get('componentId'),
            quantity_change,
            data.get('type'),
            request.user_id,
            data.get('reason', '')
        )
        
        if not result:
            return jsonify({'message': 'Component not found or insufficient quantity'}), 400
        
        return jsonify({
            'message': 'Transaction recorded successfully',
            'data': result['transaction']
        }), 201
    
    except Exception as e:
        logger.error(f"Error creating transaction: {e}")
        return jsonify({'message': 'Server error'}), 500
