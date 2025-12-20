"""
Routes package initialization
"""
from flask import Blueprint

# Create blueprints
auth_bp = Blueprint('auth', __name__)
components_bp = Blueprint('components', __name__)
transactions_bp = Blueprint('transactions', __name__)
users_bp = Blueprint('users', __name__)
notifications_bp = Blueprint('notifications', __name__)

# Import route handlers
from . import auth, components, transactions, users, notifications
