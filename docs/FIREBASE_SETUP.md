# Firebase Authentication Setup Guide

## Overview
This guide will help you set up Firebase Authentication for your AyurDiscovery AI application. Firebase has been integrated to replace Auth0 for better local development experience and simpler configuration.

## Prerequisites
- Firebase account (free tier is sufficient)
- Node.js and npm installed
- Project dependencies already installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `ayurdiscovery-ai` (or your preferred name)
4. Accept Google Analytics if desired (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click "Authentication" in the left sidebar
2. Click "Get started" if it's your first time
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and configure:
     - Project public-facing name: "AyurDiscovery AI"
     - Project support email: [your email]
     - Click "Save"

## Step 3: Set up Firestore Database

1. In your Firebase project console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location (preferably close to your users)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In your Firebase project console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register app:
   - App nickname: "AyurDiscovery AI Web"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
6. Copy the Firebase configuration object

## Step 5: Configure Your Application

1. Create a `.env` file in your `client` directory if it doesn't exist
2. Add your Firebase configuration:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

3. Update `client/src/firebase.js` with your actual configuration:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

## Step 6: Configure Firestore Security Rules (Optional for Development)

For development, you can use these basic rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read public data
    match /{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

## Step 7: Test Your Setup

1. Start your development servers:
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm start

   # Terminal 2 - Start frontend  
   cd client
   npm start
   ```

2. Navigate to `http://localhost:3000`
3. Test the authentication flow:
   - Go to `/signup` to create a new account
   - Go to `/login` to sign in
   - Try Google sign-in
   - Complete your profile after first login

## Available Authentication Routes

- `/signup` - User registration with email/password
- `/login` - User login with email/password and Google
- `/complete-profile` - Role selection after first login
- `/profile` - User profile management

## Components Overview

### Authentication Components
- `SignUp.tsx` - User registration form
- `Login.tsx` - Login form with Google integration  
- `LoginWithGoogleButton.tsx` - Google authentication button
- `CompleteProfile.tsx` - Profile completion after registration

### Database Structure

Users are stored in Firestore with this structure:
```javascript
{
  uid: "firebase_user_id",
  email: "user@example.com", 
  displayName: "User Name",
  role: "researcher|practitioner|student",
  profileComplete: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Troubleshooting

### Common Issues:

1. **Environment variables not loading**: 
   - Ensure `.env` file is in the `client` directory
   - Restart development server after adding environment variables
   - Verify variable names start with `REACT_APP_`

2. **Firebase configuration errors**:
   - Double-check all configuration values in Firebase console
   - Ensure no trailing spaces in environment variables

3. **Authentication not working**:
   - Check Firebase console for authentication provider status
   - Verify domain is added to authorized domains (usually automatic for localhost)

4. **Firestore permission denied**:
   - Check Firestore security rules
   - Ensure user is authenticated before database operations

## Security Notes

- Never commit `.env` files to version control
- Use restrictive Firestore security rules in production
- Enable additional security features like email verification in production
- Consider implementing rate limiting and other security measures

## Next Steps

After successful setup:
1. Test all authentication flows
2. Customize user roles and permissions
3. Implement additional user profile fields as needed
4. Set up production security rules
5. Configure email templates in Firebase console