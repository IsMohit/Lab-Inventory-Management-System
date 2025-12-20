# Lab Inventory Management System (LIMS) - Backend Architecture Plan

## 📋 Current Frontend Analysis

### Application Overview
- **Purpose**: Laboratory Inventory Management System for tracking components, stock levels, and notifications
- **Tech Stack**: React 19 + Vite, TailwindCSS, React Router, Axios, Recharts
- **Features**: 
  - Dashboard with analytics
  - Inventory management (CRUD)
  - Transactions (inward/outward)
  - User management
  - Notifications/Alerts
  - Role-based access (Admin, Staff)

### Key Frontend Components
1. **Pages**:
   - Login page
   - Dashboard (analytics, charts)
   - Inventory view (search, filter, CRUD)
   - Transactions
   - User Management
   - Notifications

2. **Authentication**:
   - Currently uses token-based auth (JWT)
   - AuthContext for state management
   - Protected routes

3. **API Endpoints Expected**:
   - `POST /auth/login` - User login
   - `GET/POST /components` - Inventory management
   - `PUT /components/:id` - Update component
   - `DELETE /components/:id` - Delete component
   - `POST /transactions` - Record transactions
   - `GET /notifications` - Fetch alerts
   - `GET/POST /users` - User management

---

## 🏗️ Backend Architecture - Python Flask + MongoDB

### Technology Stack
- **Framework**: Flask (Python)
- **Database**: MongoDB (containerized)
- **Authentication**: Firebase Auth + JWT
- **Containerization**: Docker & Docker Compose
- **Additional Libraries**:
  - Flask-CORS
  - Flask-JWT-Extended
  - Firebase Admin SDK
  - pymongo / motor (async)
  - python-dotenv
  - Marshmallow (validation)

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── component.py
│   │   ├── transaction.py
│   │   └── user.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── components.py
│   │   ├── transactions.py
│   │   ├── users.py
│   │   └── notifications.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── component_service.py
│   │   └── notification_service.py
│   └── utils/
│       ├── __init__.py
│       ├── decorators.py
│       └── validators.py
├── migrations/
├── tests/
├── .env
├── .env.example
├── requirements.txt
├── run.py
├── Dockerfile
└── docker-compose.yml
```

### Database Schema (MongoDB Collections)

#### Components Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "category": "string",
  "partNumber": "string",
  "manufacturer": "string",
  "quantity": "integer",
  "unitPrice": "float",
  "criticalLowThreshold": "integer",
  "location": "string",
  "description": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### Transactions Collection
```json
{
  "_id": ObjectId,
  "componentId": ObjectId,
  "type": "inward|outward",
  "quantity": "integer",
  "reason": "string",
  "userId": ObjectId,
  "timestamp": "datetime",
  "notes": "string"
}
```

#### Users Collection
```json
{
  "_id": ObjectId,
  "firebaseUID": "string",
  "email": "string",
  "name": "string",
  "role": "admin|staff",
  "department": "string",
  "createdAt": "datetime",
  "lastLogin": "datetime"
}
```

#### Notifications Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "type": "critical-stock|low-stock|transaction",
  "message": "string",
  "componentId": ObjectId,
  "read": "boolean",
  "createdAt": "datetime"
}
```

---

## 🔐 Authentication Flow (Firebase + JWT)

1. **Frontend**: User signs up/logs in with Firebase Auth (UI SDK)
2. **Firebase**: Returns ID Token to frontend
3. **Frontend**: Sends ID Token to Flask backend
4. **Backend**: Verifies ID Token with Firebase Admin SDK
5. **Backend**: Creates JWT token and stores user in MongoDB
6. **Frontend**: Uses JWT for subsequent API requests

---

## 🐳 Containerization Strategy

### Services to Containerize
1. **Frontend** - Node.js + Vite (dev/build)
2. **Backend** - Python Flask
3. **Database** - MongoDB
4. **Optional**: Nginx reverse proxy

### Docker Compose Setup
- Frontend container (port 3000)
- Backend container (port 5000)
- MongoDB container (port 27017)
- Bridge network for inter-service communication

---

## 🚀 Implementation Steps

### Phase 1: Backend Setup
- [ ] Create Flask project structure
- [ ] Setup MongoDB connection
- [ ] Implement models and schemas
- [ ] Create database migrations
- [ ] Setup Firebase Admin SDK

### Phase 2: API Development
- [ ] Authentication endpoints (Firebase integration)
- [ ] Components CRUD endpoints
- [ ] Transaction endpoints
- [ ] User management endpoints
- [ ] Notification endpoints

### Phase 3: Docker Configuration
- [ ] Create Dockerfile for backend
- [ ] Create docker-compose.yml
- [ ] Setup MongoDB container
- [ ] Configure environment variables

### Phase 4: Frontend Updates
- [ ] Update AuthContext for Firebase
- [ ] Update API base URL for containerized environment
- [ ] Add Firebase SDK to frontend
- [ ] Test API integration

---

## 📝 Environment Variables

### Backend (.env)
```
FLASK_ENV=production
DEBUG=False
SECRET_KEY=your-secret-key
MONGODB_URI=mongodb://mongo:27017/lims
JWT_SECRET=your-jwt-secret
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

---

## 🔗 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Firebase registration
- `POST /api/auth/login` - Firebase login
- `POST /api/auth/verify-token` - Verify JWT
- `POST /api/auth/logout` - Logout

### Components
- `GET /api/components` - List all components
- `POST /api/components` - Create component
- `GET /api/components/:id` - Get component details
- `PUT /api/components/:id` - Update component
- `DELETE /api/components/:id` - Delete component

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Record transaction
- `GET /api/transactions/:id` - Get transaction details

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### Users
- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

---

## ✅ Next Steps

1. Create Flask backend project structure
2. Setup MongoDB connection and models
3. Implement authentication with Firebase
4. Create API endpoints
5. Add Docker configuration
6. Update frontend to use new backend
7. Test containerized application
