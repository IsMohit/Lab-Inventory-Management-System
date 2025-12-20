# 🧪 Laboratory Inventory Management System (LIMS)

A modern, responsive **full-stack web application** designed to manage laboratory inventory, streamline stock tracking, and notify users of critical levels. Built with **React**, **Flask**, **MongoDB**, and **Docker**, LIMS provides secure authentication, real-time dashboards, and alert mechanisms for effective lab resource management.

**Status**: ✅ Production Ready | **License**: MIT

---

## 🚀 Quick Start

```bash
# Clone and navigate
git clone <repo-url>
cd "Lab Inventory Management System"

# Start all services with Docker Compose
docker-compose up --build

# Access the application
Frontend:  http://localhost:4000
Backend:   http://localhost:5000/api
```

---

## 📋 Project Overview

LIMS helps laboratories efficiently manage their inventory by:
- ✅ Tracking components and stock levels
- ✅ Managing inward and outward stock movements
- ✅ Notifying users about low or critical inventory levels
- ✅ Providing role-based access control
- ✅ Enabling secure user authentication with bcrypt password hashing
- ✅ Supporting real-time dashboard and inventory management

Ideal for educational institutions, research labs, and any organization needing robust inventory management.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TailwindCSS, Axios |
| **Backend** | Python 3.11, Flask, Gunicorn |
| **Database** | MongoDB 7.0 |
| **Authentication** | JWT, bcrypt (10-round hashing) |
| **DevOps** | Docker & Docker Compose |
| **UI Framework** | React Router, Lucide Icons |

---

## 🔒 Authentication System

### Features
- ✅ **Email/Password Registration**: New users can create accounts with secure bcrypt hashing
- ✅ **JWT Sessions**: 24-hour token-based authentication
- ✅ **Role-Based Access**: Admin and Staff roles with different permissions
- ✅ **Session Persistence**: Automatic login on page refresh
- ✅ **Feedback Messages**: Clear success/error notifications
- ✅ **Password Security**: Minimum 6 characters, bcrypt 10-round hashing

### API Endpoints
```bash
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login with email/password
POST   /api/auth/verify-token      Verify JWT token
POST   /api/auth/logout            Logout and invalidate session
```

---

## 📦 Project Structure

```
Lab Inventory Management System/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Login, Register, Dashboard
│   │   ├── context/                 # AuthContext for state
│   │   ├── utils/                   # Axios API client
│   │   └── constants/               # Sample data
│   ├── Dockerfile
│   └── vite.config.js
│
├── backend/                         # Python Flask Backend
│   ├── app/
│   │   ├── routes/                  # API endpoints
│   │   ├── models/                  # MongoDB models
│   │   ├── services/                # Business logic
│   │   └── utils/                   # Helpers
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml               # Docker orchestration
├── .env                             # Environment variables
└── docs/                            # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Port 4000 (Frontend), 5000 (Backend), 27017 (MongoDB) available
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd "Lab Inventory Management System"
```

2. **Create environment file**
```bash
cp .env.example .env
```

3. **Start all services**
```bash
docker-compose up --build
```

4. **Access the application**
- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: mongodb://admin:password@localhost:27017/lims

### First-Time Setup

1. **Register a new account**
   - Visit http://localhost:4000/register
   - Create account with email, password (min 6 chars), and name
   - Success! → Redirected to dashboard

2. **Login**
   - Visit http://localhost:4000/login
   - Enter your credentials
   - Success! → Redirected to dashboard

3. **View Dashboard**
   - Your name and avatar display in the navbar
   - Access inventory, notifications, and user management

---

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ Secure user registration with email/password
- ✅ bcrypt password hashing (10 rounds)
- ✅ JWT token-based sessions (24-hour expiration)
- ✅ Role-based access control (Admin/Staff)
- ✅ Session persistence across browser refreshes
- ✅ Success/error feedback messages

### 📦 Inventory Management
- ✅ Add, edit, delete laboratory components
- ✅ Track component quantities and values
- ✅ Inward/outward stock movements
- ✅ Category-based filtering
- ✅ Search functionality
- ✅ Color-coded stock status indicators
- ✅ Supplier tracking

### 📊 Dashboard
- ✅ Real-time inventory overview
- ✅ Total components count and value
- ✅ Category distribution charts
- ✅ Low stock alerts
- ✅ Critical stock warnings
- ✅ Recent activity logs

### 🔔 Notifications
- ✅ Critical stock alerts
- ✅ Low stock warnings
- ✅ Outdated inventory notifications
- ✅ Notification badge with count
- ✅ Detailed notification view

### 👥 User Management (Admin Only)
- ✅ View all users
- ✅ Manage user roles (Admin/Staff)
- ✅ Track user activity
- ✅ Department management

### 🎨 UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/light gradient backgrounds
- ✅ Success/error feedback messages
- ✅ Loading states
- ✅ User profile with auto-generated avatar
- ✅ Clean, modern interface with Tailwind CSS

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login with credentials
POST   /api/auth/verify-token      Verify JWT token
POST   /api/auth/logout            Logout
```

### Components
```
GET    /api/components             Get all components
POST   /api/components             Add new component (Admin)
PUT    /api/components/{id}        Update component (Admin)
DELETE /api/components/{id}        Delete component (Admin)
```

### Transactions
```
POST   /api/transactions           Record stock movement
GET    /api/transactions/{id}      Get transaction details
```

### Notifications
```
GET    /api/notifications          Get all notifications
GET    /api/notifications/recent   Get recent notifications
POST   /api/notifications/read     Mark as read
```

### Users (Admin Only)
```
GET    /api/users                  Get all users
POST   /api/users                  Create new user
PUT    /api/users/{id}             Update user
DELETE /api/users/{id}             Delete user
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Restart service
docker-compose restart backend

# Access MongoDB
docker-compose exec mongo mongosh -u admin -p password

# Check status
docker-compose ps
```

---

## 🗂️ Environment Variables

Create a `.env` file in the project root:

```env
# Frontend
VITE_API_URL=http://localhost:5000/api

# Backend
FLASK_ENV=production
DEBUG=False
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRATION_HOURS=24
MONGODB_URI=mongodb://admin:password@mongo:27017/lims

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password
```

---


## 🧪 Testing

### Register a Test User
```bash
# Via Frontend: http://localhost:4000/register
Email: test@example.com
Password: test123456
Name: Test User
```

### Login
```bash
# Via Frontend: http://localhost:4000/login
Email: test@example.com
Password: test123456
```

### API Testing
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## 📚 Documentation

For detailed documentation, see the [docs folder](./docs/):
- **QUICK_REFERENCE.md** - Quick setup and common commands
- **COMPLETE_SETUP.md** - Detailed setup instructions
- **DOCKER_DEPLOYMENT.md** - Docker deployment guide
- **ARCHITECTURE_OVERVIEW.md** - System architecture
- **START_HERE.md** - Getting started guide

---

## ⚙️ System Requirements

- Docker 20.10+
- Docker Compose 1.29+
- 2GB RAM minimum
- 500MB disk space
- Internet connection for initial setup

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Windows - Find process using port
netstat -ano | findstr :4000

# Kill the process
taskkill /PID <PID> /F
```

### MongoDB Connection Error
```bash
# Check MongoDB logs
docker-compose logs mongo

# Verify connection string
MONGODB_URI=mongodb://admin:password@mongo:27017/lims
```

### Frontend Not Loading
```bash
# Rebuild frontend
docker-compose up -d --build frontend

# Check logs
docker-compose logs -f frontend
```

### Backend API Error
```bash
# Check backend logs
docker-compose logs -f backend

# Verify services
docker-compose ps
```

---

## 🚀 Deployment Options

For production deployment, consider:
- **AWS ECS** - Managed container service
- **Azure Container Instances** - Serverless containers
- **Google Cloud Run** - Pay-per-use serverless
- **Kubernetes** - Self-managed orchestration
- **DigitalOcean App Platform** - Simple Docker deployment

See [DOCKER_DEPLOYMENT.md](./docs/DOCKER_DEPLOYMENT.md) for more details.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🙋 Support

- 📖 Check [docs folder](./docs/) for documentation
- 🐛 Report issues via GitHub Issues
- 💬 Start a discussion for questions

---

## ✨ Changelog

### v1.0.0 (Current)
- ✅ Complete authentication system with bcrypt
- ✅ Docker containerization
- ✅ Real-time inventory management
- ✅ Role-based access control
- ✅ Responsive UI with Tailwind CSS
- ✅ MongoDB integration
- ✅ JWT-based sessions

---

**Built with ❤️ for laboratory inventory management**
