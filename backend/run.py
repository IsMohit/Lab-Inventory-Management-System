"""
Flask application entry point
"""
from app import create_app
from app.config import config
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Get configuration based on environment
flask_env = os.getenv('FLASK_ENV', 'production')
app = create_app(config.get(flask_env, config['default']))

if __name__ == '__main__':
    # Used by Flask development server
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000)),
        debug=app.config['DEBUG']
    )
# app variable is also used by gunicorn WSGI server (run:app)
