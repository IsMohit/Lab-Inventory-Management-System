# Frontend Integration Guide

## Firebase Setup in Frontend

### 1. Install Firebase SDK

```bash
cd client
npm install firebase
```

### 2. Create Firebase Configuration

Create `client/src/config/firebase.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 3. Update AuthContext for Firebase

The AuthContext needs to be updated to use Firebase authentication. See updated version in documentation.

### 4. Update Login Component

Login component should use Firebase instead of username/password:

```javascript
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

// In login handler:
const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    // Send to backend
    const response = await api.post("/auth/login", { idToken });
    // Store JWT and user data...
  } catch (error) {
    setError(error.message);
  }
};
```

### 5. Environment Variables

Update `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## API Integration

### Axios Configuration

The `client/src/utils/axios.jsx` already includes:
- Authorization header with JWT token
- Base URL configuration from environment variable
- Error handling

### Using API in Components

```javascript
import api from "../utils/axios";

// Get components
const fetchComponents = async () => {
  const response = await api.get("/components");
  return response.data.data;
};

// Create component
const createComponent = async (data) => {
  const response = await api.post("/components", data);
  return response.data.data;
};

// Update component
const updateComponent = async (id, data) => {
  const response = await api.put(`/components/${id}`, data);
  return response.data.data;
};

// Delete component
const deleteComponent = async (id) => {
  await api.delete(`/components/${id}`);
};
```

## Building and Running

### Development

```bash
cd client
npm run dev
# Access at http://localhost:5173
```

### Production Build

```bash
npm run build
# Output in dist/ directory
```

### Docker Build

```bash
docker-compose build frontend
docker-compose up frontend
# Access at http://localhost:3000
```

## Authentication Flow

```
1. User enters credentials in Login page
2. Frontend sends credentials to Firebase
3. Firebase authenticates and returns ID token
4. Frontend sends ID token to backend /auth/login
5. Backend verifies token with Firebase Admin SDK
6. Backend creates/updates user in MongoDB
7. Backend returns JWT token and user data
8. Frontend stores JWT in localStorage
9. Frontend sets Authorization header for all requests
```

## Common Issues and Solutions

### API Base URL Issues

If API calls fail:
1. Check `VITE_API_BASE_URL` is set correctly
2. Verify backend is running on correct port
3. Check CORS is enabled in Flask backend
4. Test with: `curl http://localhost:5000/api/health`

### Firebase Configuration Errors

If Firebase initialization fails:
1. Verify all Firebase environment variables are set
2. Check Firebase project ID is correct
3. Ensure Firebase web app exists in console
4. Check browser console for errors

### Token Expiration

Frontend handles expired tokens:
1. If request returns 401, refresh token or redirect to login
2. Update AuthContext to refresh tokens automatically
3. Consider implementing token refresh endpoint

## Next Steps

1. Install and configure Firebase in frontend
2. Update AuthContext with Firebase integration
3. Update Login component to use Firebase
4. Test authentication flow end-to-end
5. Test API calls with real backend
6. Deploy with Docker Compose
