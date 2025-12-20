"""
Flask application factory
"""
from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.utils.database import init_db

def create_app(config_class=Config):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app)
    init_db(app)
    
    # Register blueprints
    from app.routes import auth_bp, components_bp, transactions_bp, users_bp, notifications_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(components_bp, url_prefix='/api/components')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        return {'status': 'healthy'}, 200
    
    return app
