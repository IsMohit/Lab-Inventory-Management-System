# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "LIMS"
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get started**
3. Enable providers:
   - **Email/Password**: Click on it, toggle enabled, save
   - **Google** (optional): Click on it, toggle enabled, add support email, save

## Step 3: Get Service Account Credentials

1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click **Generate New Private Key**
3. A JSON file will download - save it securely
4. Copy the following values to your `.env` file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key_id` → `FIREBASE_PRIVATE_KEY_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `client_id` → `FIREBASE_CLIENT_ID`

## Step 4: Get Web App Credentials

1. In Firebase Console, go to **Project Settings** → **General**
2. Scroll down to "Your apps"
3. Click the web icon `</>` to create a web app
4. Enter app name: "LIMS Client"
5. Copy the config object
6. Add to `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```

## Step 5: Create Firestore Database (Optional)

If you want to use Firestore instead of/alongside MongoDB:

1. Go to **Build** → **Firestore Database**
2. Click **Create Database**
3. Choose location
4. Choose start mode: **Start in test mode** (for development)

## Step 6: Configure Backend for Firebase

The backend automatically initializes Firebase Admin SDK. Ensure:

1. `.env` has all Firebase credentials
2. Backend has network access to Firebase API
3. Environment variables are properly set

## Step 7: Configure Frontend for Firebase

Update frontend Firebase config in `client/src/main.jsx`:

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

## Step 8: Test Authentication

### Create Test User

1. In Firebase Console, go to **Build** → **Authentication** → **Users**
2. Click **Add user**
3. Enter test email and password
4. Click **Add user**

### Test Login Flow

1. Start the application
2. Click "Sign In"
3. Use test credentials
4. Frontend sends ID token to backend
5. Backend verifies token and creates user in MongoDB
6. User is logged in to the application

## Troubleshooting

### Firebase Token Verification Fails

- Verify Firebase credentials in `.env` are correct
- Check Firebase project ID matches
- Ensure Firebase Admin SDK is initialized before use

### User Creation Fails

- Check MongoDB is running: `docker-compose ps mongo`
- Verify MONGODB_URI in backend `.env`
- Check backend logs: `docker-compose logs backend`

### Frontend Can't Connect to Backend

- Check backend is running: `docker-compose ps backend`
- Verify VITE_API_BASE_URL in frontend `.env`
- Check CORS is enabled in Flask backend

## Security Best Practices

1. **Never commit Firebase credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Enable Firestore Security Rules** for production
4. **Set up authentication** with strong password policies
5. **Enable API key restrictions** in Firebase Console:
   - Go to APIs & Services → Credentials
   - Click your API key
   - Restrict to HTTP referrer (website domain)
   - Restrict to Firebase authentication

## Next Steps

1. Install Firebase dependencies in frontend: `npm install firebase`
2. Update AuthContext to use Firebase
3. Test authentication flow end-to-end
4. Deploy to production with secure credentials
