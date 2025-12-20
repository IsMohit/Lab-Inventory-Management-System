# Docker Deployment Guide

## Prerequisites

- Docker: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
- Docker Compose (included with Docker Desktop)
- Firebase Project with credentials

## Quick Start

### 1. Clone and Setup Environment

```bash
# Navigate to project directory
cd Lab-Inventory-Management-System

# Copy environment template
cp .env.example .env

# Edit .env with your Firebase credentials
nano .env  # or use your preferred editor
```

### 2. Update Firebase Credentials

Edit `.env` file with your Firebase service account credentials:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email@appspot.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

> **How to get Firebase credentials:**
> 1. Go to [Firebase Console](https://console.firebase.google.com/)
> 2. Select your project
> 3. Go to Project Settings → Service Accounts
> 4. Click "Generate New Private Key"
> 5. Download the JSON file and copy the values

### 3. Build and Run with Docker Compose

```bash
# Build images and start services
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

## Services Overview

### MongoDB (Port 27017)
- Container: `lims-mongo`
- Data persisted in `mongo_data` volume
- Default credentials: `admin/secure_password_change_me`

### Backend (Port 5000)
- Container: `lims-backend`
- Python Flask application
- API endpoints: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

### Frontend (Port 3000)
- Container: `lims-frontend`
- React application
- Access at: `http://localhost:3000`

## Accessing the Application

- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:5000/api/health
- **MongoDB (from container)**: mongodb://admin:secure_password_change_me@mongo:27017/lims

## Development Workflow

### Backend Development

```bash
# View backend logs
docker-compose logs -f backend

# Rebuild backend only
docker-compose up -d --build backend

# Execute command in backend container
docker-compose exec backend bash

# Run MongoDB commands
docker-compose exec mongo mongosh -u admin -p password
```

### Frontend Development

```bash
# View frontend logs
docker-compose logs -f frontend

# Rebuild frontend only
docker-compose up -d --build frontend
```

## Database Management

### Backup Database

```bash
docker-compose exec mongo mongodump --username admin --password password --authenticationDatabase admin --out /backup
```

### Restore Database

```bash
docker-compose exec mongo mongorestore --username admin --password password --authenticationDatabase admin /backup
```

### Access MongoDB Shell

```bash
docker-compose exec mongo mongosh -u admin -p password
```

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Rebuild all images
docker-compose build --no-cache

# Remove dangling images
docker image prune -f
```

### MongoDB connection issues
```bash
# Verify MongoDB is healthy
docker-compose ps

# Check MongoDB logs
docker-compose logs mongo
```

### Port conflicts
If ports 3000, 5000, or 27017 are in use, edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "5001:5000"  # Changed from 5000:5000
  frontend:
    ports:
      - "3001:3000"  # Changed from 3000:3000
```

## Production Deployment

### Environment Variables for Production

```env
FLASK_ENV=production
DEBUG=False
SECRET_KEY=generate-secure-random-key
JWT_SECRET=generate-secure-random-key
MONGO_ROOT_USER=secure_username
MONGO_ROOT_PASSWORD=very-secure-password
```

### Generate Secure Keys

```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows PowerShell
[Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Max 256 }))
```

### Deploy to Cloud

For cloud deployment (AWS, Azure, Google Cloud), refer to platform-specific documentation:
- [AWS ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_AWSCLI_Necessary_IAM_permissions.html)
- [Azure Container Instances](https://docs.microsoft.com/en-us/azure/container-instances/)
- [Google Cloud Run](https://cloud.google.com/run/docs)

## Useful Docker Commands

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View images
docker images

# Remove container
docker rm container_name

# Remove image
docker rmi image_name

# View network
docker network ls

# Inspect container
docker inspect container_name

# View resource usage
docker stats
```

## API Documentation

Once running, the backend provides these endpoints:

### Authentication
- `POST /api/auth/login` - Firebase login
- `POST /api/auth/verify-token` - Verify JWT
- `POST /api/auth/logout` - Logout

### Components
- `GET /api/components` - List all
- `POST /api/components` - Create
- `GET /api/components/:id` - Get one
- `PUT /api/components/:id` - Update
- `DELETE /api/components/:id` - Delete
- `GET /api/components/low-stock` - Low stock items

### Transactions
- `GET /api/transactions` - List all
- `POST /api/transactions` - Create
- `GET /api/transactions/:id` - Get one

### Users
- `GET /api/users` - List all (admin)
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review [documentation](./ANALYSIS_AND_PLAN.md)
3. Check Docker and Docker Compose documentation
