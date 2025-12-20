# Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

### 1. Initial Setup
```bash
# Navigate to project
cd "Lab Inventory Management System"

# Create .env file from template
cp .env.example .env

# Edit .env - Backend and MongoDB credentials only
# FLASK_ENV=production
# SECRET_KEY=your-secret-key
# MONGODB_URI=mongodb://admin:password@mongo:27017/lims
```

### 2. Start Everything
```bash
# Build and run all services
docker-compose up --build

# Wait for services to be healthy
# You'll see: "frontend", "backend", and "mongo" services running
```

### 3. Access Application
- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: mongodb://admin:secure_password_change_me@localhost:27017/lims

---

## 📚 Quick Navigation

| Need | File | Location |
|------|------|----------|
| Full setup | COMPLETE_SETUP.md | Root directory |
| Docker guide | DOCKER_DEPLOYMENT.md | Root directory |
| Authentication details | #authentication-system | This file |
| Frontend integration | FRONTEND_INTEGRATION.md | Root directory |
| Architecture details | ANALYSIS_AND_PLAN.md | Root directory |

---

## 🔐 Authentication System (Simple Email/Password)

### How It Works
- **Registration**: Users create account with email + password + name
  - Password hashed with bcrypt (10 rounds)
  - Email must be unique
  - Password minimum 6 characters
  
- **Login**: Users authenticate with email + password
  - Password verified against bcrypt hash
  - JWT token issued for session
  - Token stored in localStorage
  
- **Session**: Token validated on each API request
  - JWT contains user ID and role
  - Token expiration: 24 hours

### API Endpoints

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
# Response: {"token": "jwt-token", "user": {...}}

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
# Response: {"token": "jwt-token", "user": {...}}

# Verify token
curl -X POST http://localhost:5000/api/auth/verify-token \
  -H "Authorization: Bearer jwt-token"
# Response: {"valid": true, "user": {...}}

# Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer jwt-token"
# Response: {"message": "Logout successful"}
```

---

## 🐳 Docker Commands

```bash
# Start services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose up -d --build backend

# Enter container shell
docker-compose exec backend bash
docker-compose exec mongo mongosh -u admin -p password

# Check service status
docker-compose ps
```

---

## 🧪 Testing API Endpoints

### Test Backend Health
```bash
curl http://localhost:5000/api/health
# Response: {"status": "healthy"}
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### Get Components (with authorization)
```bash
curl http://localhost:5000/api/components \
  -H "Authorization: Bearer your-jwt-token"
```

---

## 🔐 Authentication Flow

```
REGISTRATION:
1. User enters email + password + name on register page
   ↓
2. Frontend sends to backend: POST /auth/register
   ↓
3. Backend validates password (min 6 chars) and name (min 2 chars)
   ↓
4. Backend hashes password with bcrypt
   ↓
5. Backend creates user in MongoDB
   ↓
6. Backend creates JWT token and returns to frontend
   ↓
7. Frontend stores token and user in localStorage
   ↓
8. Frontend redirects to dashboard

LOGIN FLOW:
1. User enters email + password on login page
   ↓
2. Frontend sends to backend: POST /auth/login
   ↓
3. Backend looks up user by email in MongoDB
   ↓
4. Backend verifies password with bcrypt
   ↓
5. Backend creates JWT token
   ↓
6. Backend returns token and user to frontend
   ↓
7. Frontend stores token and user in localStorage
   ↓
8. Frontend redirects to dashboard
   ↓
7. Backend returns JWT token
   ↓
8. Frontend stores JWT in localStorage
   ↓
9. Frontend uses JWT for all API calls

REGISTRATION FLOW:
1. User enters email, password, and name on register page
   ↓
2. Frontend validates form (password strength, match, etc.)
   ↓
3. Firebase creates new user account with createUserWithEmailAndPassword
   ↓
4. Firebase updates user profile with display name
   ↓
5. Frontend gets Firebase ID token
   ↓
6. Frontend sends to backend: POST /auth/login (same endpoint)
   ↓
7. Backend verifies token and creates user in MongoDB
   ↓
8. Backend returns JWT token
   ↓
9. Frontend stores JWT and redirects to dashboard
```

---

## 📁 Key Directories

```
Project Root/
├── client/               - React frontend (port 3000)
├── backend/              - Flask backend (port 5000)
├── docker-compose.yml    - Docker orchestration
└── .env                  - Environment variables (create from .env.example)

Backend Structure:
backend/
├── app/models/          - Database models
├── app/routes/          - API endpoints
├── app/services/        - Business logic
├── app/utils/           - Helpers and decorators
└── run.py               - Entry point

Frontend Structure:
client/src/
├── components/          - React components
├── pages/               - Page components
├── context/             - AuthContext with Firebase
├── config/              - Firebase configuration
└── utils/               - Axios and helpers
```

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot connect to backend"
```bash
# Check if backend is running
docker-compose ps

# Restart backend
docker-compose restart backend

# Check logs
docker-compose logs backend
```

### Issue: "MongoDB connection failed"
```bash
# Verify MongoDB is running
docker-compose logs mongo

# Check connection string in backend .env
MONGODB_URI=mongodb://admin:password@mongo:27017/lims
```

### Issue: "Firebase token invalid"
```bash
# Verify credentials in .env
# Make sure FIREBASE_PROJECT_ID is correct
# Create test user in Firebase Console
# Check backend logs for detailed error
docker-compose logs backend | grep -i firebase
```

### Issue: "Port already in use or permission denied"
```bash
# Find what's using the port
netstat -ano | grep :4000  # Check port 4000
netstat -ano | grep :5000  # Check port 5000

# Or change ports in docker-compose.yml
# Note: Windows may have port ranges reserved, use higher ports if needed
ports:
  - "4000:80"    # Frontend (changed from 3000 due to Windows port reservation)
  - "5000:5000"  # Backend
```

---

## 📊 Database Access

### Connect with MongoDB Shell
```bash
docker-compose exec mongo mongosh -u admin -p password

# Common commands:
use lims
db.components.find()
db.users.find()
db.transactions.find()
db.notifications.find()
```

### Backup Database
```bash
docker-compose exec mongo mongodump \
  -u admin -p password \
  --authenticationDatabase admin \
  --out /backup
```

---

## 🔧 Environment Variables

### Essential Variables (in .env)
```env
# Firebase (required for auth to work!)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email@appspot.gserviceaccount.com
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_CLIENT_ID=your-client-id

# Frontend Firebase Config
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id

# MongoDB Credentials (default - change in production!)
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=secure_password_change_me

# Backend Config
SECRET_KEY=generate-random-secret-key
JWT_SECRET=generate-random-jwt-secret
```

### Generate Random Keys
```bash
# On Mac/Linux
openssl rand -hex 32

# On Windows PowerShell
[Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Max 256 }))
```

---

## ✅ Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Service account credentials obtained
- [ ] `.env` file created and filled with credentials
- [ ] Docker and Docker Compose installed
- [ ] `docker-compose up --build` runs successfully
- [ ] Frontend accessible at http://localhost:4000
- [ ] Backend API responding at http://localhost:5000/api/health
- [ ] Can register new user via /register page
- [ ] Can login with registered credentials
- [ ] Components API endpoints working
- [ ] Notifications generating properly
- [ ] Database persisting data

---

## 📞 Support Resources

- **Docker Documentation**: https://docs.docker.com/
- **Firebase Documentation**: https://firebase.google.com/docs
- **Flask Documentation**: https://flask.palletsprojects.com/
- **React Documentation**: https://react.dev/
- **MongoDB Documentation**: https://docs.mongodb.com/

---

## 🎯 Next Steps After Setup

1. **Create test data**: Add components to inventory
2. **Test transactions**: Add inward/outward movements
3. **Monitor notifications**: Check low stock alerts
4. **User management**: Test admin functions
5. **Performance testing**: Load test the API
6. **Production deployment**: Choose cloud platform

---

## 🚀 Production Deployment

When ready to deploy:

1. Update `.env` with production values
2. Generate secure SECRET_KEY and JWT_SECRET
3. Change MongoDB credentials
4. Choose deployment platform:
   - **AWS ECS**: Managed container service
   - **Azure Container Instances**: Serverless
   - **Google Cloud Run**: Pay-per-use
   - **Kubernetes**: Self-managed

5. Push code to repository
6. Configure CI/CD pipeline
7. Deploy with credentials securely

---

**Quick Help**: Check COMPLETE_SETUP.md for detailed instructions
**Documentation**: See specific guide files for detailed information
**Status**: ✅ Ready to deploy!
