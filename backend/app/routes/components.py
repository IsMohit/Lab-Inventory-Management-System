"""
Component routes
"""
from flask import request, jsonify
from app.routes import components_bp
from app.models.component import Component
from app.services.component_service import (
    create_component, update_component_quantity, get_low_stock_components,
    search_components, get_component_history
)
from app.utils.decorators import token_required, validate_json
from app.utils.validators import validate_component
import logging

logger = logging.getLogger(__name__)

@components_bp.route('/', methods=['GET'])
@token_required
def get_components():
    """Get all components with optional search and filter"""
    try:
        search_term = request.args.get('search', '')
        category = request.args.get('category', None)
        
        if search_term:
            components = search_components(search_term, category)
        else:
            filters = {}
            if category and category != 'All Categories':
                filters['category'] = category
            components = Component.get_all(filters)
        
        return jsonify({
            'message': 'Components retrieved successfully',
            'data': components
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching components: {e}")
        return jsonify({'message': 'Server error'}), 500

@components_bp.route('/<component_id>', methods=['GET'])
@token_required
def get_component(component_id):
    """Get component by ID"""
    try:
        component = Component.get_by_id(component_id)
        
        if not component:
            return jsonify({'message': 'Component not found'}), 404
        
        return jsonify({
            'message': 'Component retrieved successfully',
            'data': component
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching component: {e}")
        return jsonify({'message': 'Server error'}), 500

@components_bp.route('/', methods=['POST'])
@token_required
@validate_json(['name', 'category'])
def create_new_component():
    """Create new component"""
    try:
        data = request.get_json()
        
        # Validate data
        errors = validate_component(data)
        if errors:
            return jsonify({'message': 'Validation error', 'errors': errors}), 400
        
        component = create_component(data)
        
        return jsonify({
            'message': 'Component created successfully',
            'data': component
        }), 201
    
    except Exception as e:
        logger.error(f"Error creating component: {e}")
        return jsonify({'message': 'Server error'}), 500

@components_bp.route('/<component_id>', methods=['PUT'])
@token_required
def update_component(component_id):
    """Update component"""
    try:
        data = request.get_json()
        
        # Validate data
        errors = validate_component(data)
        if errors:
            return jsonify({'message': 'Validation error', 'errors': errors}), 400
        
        component = Component.update(component_id, data)
        
        if not component:
            return jsonify({'message': 'Component not found'}), 404
        
        return jsonify({
            'message': 'Component updated successfully',
            'data': component
        }), 200
    
    except Exception as e:
        logger.error(f"Error updating component: {e}")
        return jsonify({'message': 'Server error'}), 500

@components_bp.route('/<component_id>', methods=['DELETE'])
@token_required
def delete_component(component_id):
    """Delete component"""
    try:
        if not Component.delete(component_id):
            return jsonify({'message': 'Component not found'}), 404
        
        return jsonify({'message': 'Component deleted successfully'}), 200
    
    except Exception as e:
        logger.error(f"Error deleting component: {e}")
        return jsonify({'message': 'Server error'}), 500

@components_bp.route('/low-stock', methods=['GET'])
@token_required
def get_low_stock():
    """Get components with low stock"""
    try:
        components = get_low_stock_components()
        
        return jsonify({
            'message': 'Low stock components retrieved',
            'data': components
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching low stock components: {e}")
        return jsonify({'message': 'Server error'}), 500

@components_bp.route('/<component_id>/history', methods=['GET'])
@token_required
def get_history(component_id):
    """Get component transaction history"""
    try:
        transactions = get_component_history(component_id)
        
        return jsonify({
            'message': 'Component history retrieved',
            'data': transactions
        }), 200
    
    except Exception as e:
        logger.error(f"Error fetching component history: {e}")
        return jsonify({'message': 'Server error'}), 500
