# Laboratory Inventory Management System (LIMS) - Complete Architecture

## 📋 Project Overview

This is a **containerized full-stack application** for managing laboratory inventory with:

- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Python Flask + MongoDB
- **Authentication**: Firebase Auth + JWT
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB (containerized)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  Frontend    │  │   Backend    │  │    MongoDB     │   │
│  │  React 19    │  │  Flask 3.0   │  │   Container    │   │
│  │  Port 3000   │  │  Port 5000   │  │  Port 27017    │   │
│  └──────────────┘  └──────────────┘  └────────────────┘   │
│       ↓                   ↓                    ↓             │
│   Browser            API Endpoints         Collections     │
│   Users              JWT Protected         (users, etc)    │
│   Notifications      Firebase Auth                         │
│   Dashboard          Service Account                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
        ↓
    Firebase Cloud
    (Authentication)
```

## 🚀 Quick Start

### 1. Prerequisites

- Docker & Docker Compose
- Firebase Project with credentials
- Git (optional)

### 2. Setup Environment

```bash
# Navigate to project
cd "Lab Inventory Management System"

# Copy environment template
cp .env.example .env

# Edit .env with Firebase credentials
# FIREBASE_PROJECT_ID=...
# FIREBASE_PRIVATE_KEY=...
# etc.
```

### 3. Start with Docker Compose

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# MongoDB: mongodb://admin:password@localhost:27017/lims
```

### 4. Stop Services

```bash
docker-compose down
```

## 📁 Project Structure

```
Lab-Inventory-Management-System/
├── client/                          # Frontend (React)
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── pages/                  # Page components
│   │   ├── context/                # AuthContext with Firebase
│   │   ├── config/                 # Firebase configuration
│   │   ├── utils/                  # Axios and utilities
│   │   └── constants/              # Sample data
│   ├── Dockerfile                  # Frontend container config
│   ├── package.json
│   └── vite.config.js
│
├── backend/                         # Backend (Flask)
│   ├── app/
│   │   ├── __init__.py            # Flask app factory
│   │   ├── config.py              # Configuration
│   │   ├── models/                # Database models
│   │   │   ├── component.py
│   │   │   ├── transaction.py
│   │   │   ├── user.py
│   │   │   └── notification.py
│   │   ├── routes/                # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── components.py
│   │   │   ├── transactions.py
│   │   │   ├── users.py
│   │   │   └── notifications.py
│   │   ├── services/              # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── component_service.py
│   │   │   └── notification_service.py
│   │   └── utils/                 # Helper functions
│   │       ├── decorators.py
│   │       ├── validators.py
│   │       └── database.py
│   ├── run.py                     # Application entry point
│   ├── requirements.txt           # Python dependencies
│   ├── Dockerfile                 # Backend container config
│   └── .env.example
│
├── docker-compose.yml             # Docker Compose orchestration
├── .env.example                   # Environment template
├── ANALYSIS_AND_PLAN.md          # Detailed architecture
├── DOCKER_DEPLOYMENT.md          # Docker guide
├── FIREBASE_SETUP.md             # Firebase configuration
├── FRONTEND_INTEGRATION.md       # Frontend setup
└── README.md
```

## 🔐 Authentication Flow

```
1. User Login (Frontend)
   ↓
2. Firebase Authenticates Email/Password
   ↓
3. Firebase Returns ID Token
   ↓
4. Frontend Sends ID Token → Backend
   ↓
5. Backend Verifies Token with Firebase Admin SDK
   ↓
6. Backend Creates/Updates User in MongoDB
   ↓
7. Backend Generates JWT Token
   ↓
8. Frontend Stores JWT in localStorage
   ↓
9. Frontend Includes JWT in All API Requests
   ↓
10. Backend Validates JWT for Protected Routes
```

## 📊 Database Collections

### Components
```json
{
  "name": "Resistor 1kΩ",
  "category": "Resistors",
  "partNumber": "RES-1K",
  "manufacturer": "Vishay",
  "quantity": 150,
  "unitPrice": 0.05,
  "criticalLowThreshold": 50,
  "location": "Shelf A1",
  "createdAt": "2025-12-20T10:00:00Z"
}
```

### Users
```json
{
  "firebaseUID": "abc123xyz",
  "email": "user@lab.com",
  "name": "Dr. Sarah Chen",
  "role": "admin",
  "department": "Electronics Lab",
  "lastLogin": "2025-12-20T10:00:00Z"
}
```

### Transactions
```json
{
  "componentId": "ObjectId(...)",
  "type": "inward",
  "quantity": 50,
  "reason": "Supplier delivery",
  "userId": "ObjectId(...)",
  "timestamp": "2025-12-20T10:00:00Z"
}
```

### Notifications
```json
{
  "userId": "ObjectId(...)",
  "type": "critical-stock",
  "message": "Resistor 1kΩ is at critical level",
  "componentId": "ObjectId(...)",
  "read": false,
  "createdAt": "2025-12-20T10:00:00Z"
}
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login              - Firebase login
POST   /api/auth/verify-token       - Verify JWT
POST   /api/auth/logout             - Logout
```

### Components
```
GET    /api/components              - List all (with search/filter)
POST   /api/components              - Create
GET    /api/components/:id          - Get details
PUT    /api/components/:id          - Update
DELETE /api/components/:id          - Delete
GET    /api/components/low-stock    - Low stock items
GET    /api/components/:id/history  - Transaction history
```

### Transactions
```
GET    /api/transactions            - List all
POST   /api/transactions            - Create (updates quantity)
GET    /api/transactions/:id        - Get details
```

### Users
```
GET    /api/users                   - List all (admin only)
GET    /api/users/:id               - Get user
PUT    /api/users/:id               - Update user
DELETE /api/users/:id               - Delete (admin only)
GET    /api/users/profile           - Current user profile
```

### Notifications
```
GET    /api/notifications           - Get user notifications
GET    /api/notifications/:id       - Get notification
PUT    /api/notifications/:id/read  - Mark as read
DELETE /api/notifications/:id       - Delete
```

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Firebase Admin SDK**: Server-side token verification
3. **Role-Based Access**: Admin and Staff roles
4. **CORS Enabled**: Frontend-backend communication
5. **Environment Variables**: Sensitive data protected
6. **Database Indexing**: Optimized queries
7. **Input Validation**: Server-side validation
8. **Error Handling**: Graceful error responses

## 🐳 Docker Services

### MongoDB Container
- **Image**: mongo:7.0
- **Port**: 27017
- **Volume**: mongo_data (persistent)
- **Health Check**: Yes

### Backend Container
- **Image**: Custom Python Flask
- **Port**: 5000
- **Depends On**: MongoDB
- **Environment**: Flask config

### Frontend Container
- **Image**: Custom Node.js React
- **Port**: 3000
- **Depends On**: Backend

## 📝 Environment Variables

### Backend (.env)
```
FLASK_ENV=production
DEBUG=False
SECRET_KEY=random-key
MONGODB_URI=mongodb://mongo:27017/lims
JWT_SECRET=random-jwt-secret
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-key
FIREBASE_CLIENT_EMAIL=your-email
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🚀 Deployment Steps

### 1. Local Development
```bash
docker-compose up --build
```

### 2. Production Preparation
```bash
# Update .env with production values
# Generate secure keys
openssl rand -hex 32

# Review configuration
docker-compose config
```

### 3. Cloud Deployment
Choose your platform:
- **AWS ECS**: Container orchestration
- **Azure Container Instances**: Serverless containers
- **Google Cloud Run**: Fully managed containers
- **Kubernetes**: Advanced orchestration

## 🛠️ Development

### Backend Development
```bash
# Enter backend container
docker-compose exec backend bash

# Run tests
pytest

# Database access
docker-compose exec mongo mongosh -u admin -p password
```

### Frontend Development
```bash
# Enter frontend container
docker-compose exec frontend bash

# Dev server
npm run dev

# Build
npm run build
```

## 📚 Documentation Files

- **ANALYSIS_AND_PLAN.md**: Detailed architecture and planning
- **DOCKER_DEPLOYMENT.md**: Complete Docker guide
- **FIREBASE_SETUP.md**: Firebase configuration steps
- **FRONTEND_INTEGRATION.md**: Frontend setup guide

## ✅ Checklist for Setup

- [ ] Install Docker & Docker Compose
- [ ] Create Firebase project
- [ ] Get Firebase credentials
- [ ] Copy .env.example to .env
- [ ] Fill in Firebase credentials in .env
- [ ] Run `docker-compose up --build`
- [ ] Access frontend at http://localhost:3000
- [ ] Create test user in Firebase
- [ ] Test login with Firebase
- [ ] Verify API endpoints work

## 🆘 Troubleshooting

### Services won't start
```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs

# Rebuild
docker-compose build --no-cache
docker-compose up
```

### MongoDB connection fails
```bash
# Check MongoDB is running
docker-compose logs mongo

# Verify connection
docker-compose exec backend python -c "
from app.utils.database import Database
from flask import Flask
app = Flask(__name__)
app.config['MONGODB_URI'] = 'mongodb://admin:password@mongo:27017/lims'
with app.app_context():
    db = Database.get_connection()
    print('Connected:', db.list_collection_names())
"
```

### Firebase token issues
- Verify Firebase credentials in .env
- Check Firebase project is active
- Ensure web app is created in Firebase console
- Test with: `curl http://localhost:5000/api/health`

## 📞 Support

For detailed guidance:
1. See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
2. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
3. See [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
4. Check [ANALYSIS_AND_PLAN.md](ANALYSIS_AND_PLAN.md)

## 📄 License

[Add your license here]

## 👨‍💻 Contributors

[Add contributors here]

---

**Last Updated**: December 20, 2025
**Version**: 1.0.0
**Status**: Production Ready
