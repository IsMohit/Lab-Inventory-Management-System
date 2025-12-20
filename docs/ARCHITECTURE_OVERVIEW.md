# System Architecture & Components Overview

## 🎨 High-Level Architecture Diagram

```
                          INTERNET
                              ↓
                     ┌─────────────────┐
                     │  Firebase Cloud │
                     │ Authentication  │
                     └─────────────────┘
                              ↑
                    ID Token Verification
                              ↓
        ┌─────────────────────────────────────────┐
        │         DOCKER NETWORK (Bridge)         │
        │                                         │
        │  ┌──────────────┐  ┌─────────────────┐ │
        │  │   FRONTEND   │  │  BACKEND API    │ │
        │  │  React 19    │  │  Flask 3.0      │ │
        │  │  Port 3000   │  │  Port 5000      │ │
        │  │              │  │                 │ │
        │  │ - Dashboard  │  │ - Auth Routes   │ │
        │  │ - Inventory  │  │ - Component API │ │
        │  │ - Users      │  │ - Transaction   │ │
        │  │ - Notif      │  │ - Notification  │ │
        │  └──────────────┘  └─────────────────┘ │
        │         ↓                    ↓          │
        │       AXIOS          PyMongo Driver    │
        │         ↓                    ↓          │
        │  ┌───────────────────────────────────┐ │
        │  │   MONGODB DATABASE                │ │
        │  │   Port 27017                      │ │
        │  │                                   │ │
        │  │ Collections:                      │ │
        │  │ - components    (inventory)       │ │
        │  │ - transactions  (movements)       │ │
        │  │ - users        (accounts)         │ │
        │  │ - notifications (alerts)          │ │
        │  └───────────────────────────────────┘ │
        │         Persistent Storage: mongo_data │
        │                                         │
        └─────────────────────────────────────────┘
```

---

## 🔄 Request/Response Flow

### Login Flow
```
User (Browser)
    ↓ [Email/Password]
Frontend Login Page
    ↓ [Firebase.signIn()]
Firebase Auth
    ↓ [ID Token]
Frontend (localStorage)
    ↓ [POST /auth/login + idToken]
Backend (Flask)
    ↓ [Verify with Firebase Admin SDK]
MongoDB (Create/Update User)
    ↓ [Generate JWT]
Backend
    ↓ [JWT Token + User Data]
Frontend (localStorage)
    ↓ [Set Authorization Header]
Ready for API Calls
```

### API Request Flow
```
Frontend Component
    ↓ [Needs data]
useAuth() or api.get()
    ↓ [JWT in Authorization Header]
Axios Interceptor
    ↓ [HTTP Request]
Backend Route Handler
    ↓ [@token_required decorator]
JWT Verification
    ↓ [Extract user_id, role]
Route Handler Function
    ↓ [Business Logic]
MongoDB Query
    ↓ [CRUD Operation]
Service Layer
    ↓ [Response formatting]
Flask Response
    ↓ [JSON + Status Code]
Frontend
    ↓ [Update State]
UI Update
    ↓
User Sees Result
```

---

## 📊 Data Flow: Creating a Component Transaction

```
1. User fills form in Frontend
   ├─ Component ID
   ├─ Transaction Type (inward/outward)
   ├─ Quantity
   └─ Reason

2. Frontend validates & sends POST /api/transactions
   └─ Includes JWT token

3. Backend @token_required decorator
   ├─ Verifies JWT
   └─ Extracts user_id

4. Backend @validate_json decorator
   └─ Checks required fields

5. component_service.update_component_quantity()
   ├─ Calculate new quantity
   ├─ Update MongoDB components collection
   └─ Create transaction record

6. Transaction automatically creates notification
   ├─ Check if quantity < threshold
   └─ Create notification for admin users

7. Response sent to Frontend
   ├─ Transaction ID
   ├─ Updated component data
   └─ Status 201 (Created)

8. Frontend updates state
   ├─ Refresh component list
   ├─ Show success message
   └─ Display notifications
```

---

## 🗄️ MongoDB Collections Schema

### Components Collection
```
{
  _id: ObjectId,
  name: String,                    // "Resistor 1kΩ"
  category: String,                // "Resistors"
  partNumber: String,              // "RES-1K"
  manufacturer: String,            // "Vishay"
  quantity: Integer,               // 150
  unitPrice: Float,                // 0.05
  criticalLowThreshold: Integer,   // 50
  location: String,                // "Shelf A1"
  description: String,             // Optional details
  createdAt: DateTime,
  updatedAt: DateTime
}
Index: name, partNumber, category
```

### Users Collection
```
{
  _id: ObjectId,
  firebaseUID: String,             // From Firebase
  email: String,                   // "user@lab.com"
  name: String,                    // "Dr. Sarah"
  role: String,                    // "admin" or "staff"
  department: String,              // "Electronics Lab"
  createdAt: DateTime,
  lastLogin: DateTime
}
Index: firebaseUID (unique), email (unique)
```

### Transactions Collection
```
{
  _id: ObjectId,
  componentId: ObjectId,           // Reference to component
  type: String,                    // "inward" or "outward"
  quantity: Integer,               // 50
  reason: String,                  // "Supplier delivery"
  userId: ObjectId,                // Who made the transaction
  timestamp: DateTime,
  notes: String
}
Index: componentId, userId, timestamp
```

### Notifications Collection
```
{
  _id: ObjectId,
  userId: ObjectId,                // Who gets notified
  type: String,                    // "critical-stock", "low-stock"
  message: String,                 // "Stock critically low"
  componentId: ObjectId,           // Related component
  read: Boolean,                   // false initially
  createdAt: DateTime
}
Index: userId, createdAt
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "user_id": "507f1f77bcf86cd799439011",
  "role": "admin",
  "exp": 1703084400,
  "iat": 1703000000
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "jwt-secret-key"
)
```

### Authorization Matrix
```
Endpoint                    Anonymous   Staff   Admin
──────────────────────────────────────────────────────
GET  /components            ✗          ✓       ✓
POST /components            ✗          ✓       ✓
PUT  /components/:id        ✗          ✓       ✓
DELETE /components/:id      ✗          ✓       ✓
GET  /users                 ✗          ✗       ✓
POST /transactions          ✗          ✓       ✓
GET  /notifications         ✗          ✓*      ✓*
DELETE /users/:id           ✗          ✗       ✓

* Users can only access their own
```

---

## 🚀 Deployment Architecture

### Development (docker-compose)
```
Docker Host Machine
├─ MongoDB Container     (mongo:7.0)
├─ Backend Container     (Python:3.11)
├─ Frontend Container    (Node:20-alpine)
└─ Network: lims-network (bridge)
```

### Production Options

#### Option 1: AWS ECS
```
AWS Account
├─ ECR (Container Registry)
├─ ECS Cluster
│  ├─ Backend Service
│  ├─ Frontend Service
│  └─ MongoDB RDS
├─ ALB (Load Balancer)
└─ CloudFront (CDN)
```

#### Option 2: Azure Container Instances
```
Azure Account
├─ Container Registry
├─ Container Instances
│  ├─ Backend App
│  ├─ Frontend App
│  └─ MongoDB (Cosmos DB)
├─ App Gateway
└─ CDN
```

#### Option 3: Google Cloud Run
```
Google Cloud
├─ Container Registry
├─ Cloud Run Services
│  ├─ Backend
│  ├─ Frontend
│  └─ Cloud Firestore
├─ Cloud Load Balancing
└─ Cloud CDN
```

---

## 🔌 API Endpoint Structure

### Base URL
```
http://localhost:5000/api
```

### Endpoint Categories

#### 🔑 Authentication (No Auth Required)
```
POST /auth/login              - Firebase token verification
POST /auth/verify-token       - JWT validation
POST /auth/logout             - Logout (auth required)
```

#### 📦 Components (Auth Required)
```
GET    /components            - List all
POST   /components            - Create new
GET    /components/:id        - Get details
PUT    /components/:id        - Update
DELETE /components/:id        - Delete
GET    /components/low-stock  - Filtered list
GET    /components/:id/history - Transactions
```

#### 📋 Transactions (Auth Required)
```
GET    /transactions          - List all
POST   /transactions          - Create & update qty
GET    /transactions/:id      - Get details
```

#### 👥 Users (Auth Required, Admin Required)
```
GET    /users                 - List (admin only)
GET    /users/:id             - Self or admin
PUT    /users/:id             - Self or admin
DELETE /users/:id             - Admin only
GET    /users/profile         - Current user
```

#### 🔔 Notifications (Auth Required)
```
GET    /notifications         - User's notifications
GET    /notifications/:id     - Specific
PUT    /notifications/:id/read - Mark read
DELETE /notifications/:id     - Delete
```

---

## 📈 Performance Considerations

### Database Indexes
```
Collection    Field              Index Type   Why
─────────────────────────────────────────────────────
components    name               Ascending    Search
components    partNumber         Ascending    Search
components    category           Ascending    Filter
users         firebaseUID        Unique       Auth
users         email              Unique       Lookup
transactions  componentId        Ascending    History
transactions  userId             Ascending    User queries
transactions  timestamp          Descending   Recent first
notifications userId             Ascending    User queries
notifications createdAt          Descending   Recent first
```

### Caching Strategy
- JWT tokens cached in localStorage (24 hours)
- Component list cached in React state
- Refresh on mutations (POST, PUT, DELETE)

### API Response Times (Target)
- GET requests: < 200ms
- POST requests: < 300ms
- Search queries: < 500ms
- Transactions: < 1s

---

## 🛡️ Security Layers

```
Layer 1: Firebase Authentication
├─ Email verification
├─ Password hashing
└─ Multi-factor auth (optional)

Layer 2: JWT Token
├─ Expiration (24 hours)
├─ Signature verification
└─ Payload validation

Layer 3: Role-Based Access
├─ Route-level authorization
├─ Resource ownership check
└─ Admin-only endpoints

Layer 4: Input Validation
├─ JSON schema validation
├─ Type checking
└─ Range validation

Layer 5: Database
├─ Connection encryption
├─ Credential protection
└─ Read-only replicas
```

---

## 📱 Frontend Component Structure

```
App.jsx (Main)
├─ Routes
│  ├─ /login → Login.jsx
│  ├─ / → DashboardView.jsx
│  ├─ /inventory → InventoryView.jsx
│  ├─ /notifications → NotificationsView.jsx
│  └─ /users → UserManagement.jsx
├─ Header.jsx
├─ Navigation.jsx
├─ ProtectedRoute.jsx
└─ AuthContext.Provider
   └─ Firebase Integration

Components
├─ ComponentModal.jsx (Add/Edit form)
├─ TransactionModal.jsx (Movement form)
└─ Navigation.jsx (Sidebar)
```

---

## 🔄 Notification System

### Automatic Triggers
```
Event                           Notification Type
──────────────────────────────────────────────────
Quantity = 0                    critical-stock
Quantity ≤ threshold            low-stock
Transaction created             transaction
User added                      welcome
```

### Notification Flow
```
Transaction created
    ↓
Check quantity < threshold
    ↓
Query admin users
    ↓
Create notification records
    ↓
Frontend polls /notifications
    ↓
Display in UI
    ↓
User marks read or deletes
```

---

**Architecture Version**: 1.0
**Last Updated**: December 20, 2025
**Status**: Production Ready ✅
