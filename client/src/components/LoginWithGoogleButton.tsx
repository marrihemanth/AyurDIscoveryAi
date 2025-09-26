// Create a 'LoginWithGoogleButton.tsx' component. On button click, import 'auth' and 'GoogleAuthProvider', then use the 'signInWithPopup' function to trigger the Google login flow.

import React, { useState } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import {
  Button,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

interface LoginWithGoogleButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  useRedirect?: boolean;
}

const LoginWithGoogleButton: React.FC<LoginWithGoogleButtonProps> = ({ 
  onSuccess, 
  onError,
  useRedirect = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;
      let user;

      if (useRedirect) {
        // Use redirect method (more reliable on mobile and some browsers)
        await signInWithRedirect(auth, googleProvider);
        return; // The page will redirect and reload
      } else {
        // Use popup method (default)
        result = await signInWithPopup(auth, googleProvider);
        user = result.user;
      }

      console.log('✅ Google sign in successful:', user);

      try {
        // Check if user document already exists
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Create new user document for first-time Google users
          await setDoc(userDocRef, {
            uid: user.uid,
            name: user.displayName || 'Google User',
            email: user.email,
            photoURL: user.photoURL,
            provider: 'google',
            createdAt: new Date(),
            profileComplete: false
          });

          console.log('✅ New user document created');
          
          // Redirect to complete profile for new users
          window.location.href = '/complete-profile';
        } else {
          console.log('✅ Existing user logged in');
          
          // Check if profile is complete
          const userData = userDoc.data();
          if (!userData.profileComplete) {
            window.location.href = '/complete-profile';
          } else {
            window.location.href = '/';
          }
        }
      } catch (firestoreError: any) {
        console.warn('⚠️ Firestore error, proceeding without user document check:', firestoreError);
        
        // Handle different types of Firestore errors
        if (firestoreError.code === 'permission-denied' || firestoreError.message?.includes('permission')) {
          console.error('🔒 Firestore permission denied - check security rules');
          setError('Database permission error. Please contact support or check Firestore security rules.');
          return;
        } else if (firestoreError.message?.includes('offline') || firestoreError.message?.includes('network')) {
          console.log('📱 Network issue detected, redirecting to profile completion');
          window.location.href = '/complete-profile';
        } else {
          // For other Firestore errors, still redirect to profile completion as a safe fallback
          console.log('🔄 Firestore error, redirecting to profile completion as fallback');
          window.location.href = '/complete-profile';
        }
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in was cancelled. Please try again.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups and try again.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'This domain is not authorized. Please contact support.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Google sign-in is not enabled. Please contact support.';
          break;
        case 'permission-denied':
          errorMessage = 'Database permissions error. Please check Firestore security rules.';
          break;
        case 'firestore/permission-denied':
          errorMessage = 'Insufficient permissions. Please update Firestore security rules.';
          break;
        default:
          errorMessage = `Google sign-in failed: ${error.message}`;
          break;
      }
      
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Button
        fullWidth
        variant="outlined"
        size="large"
        onClick={handleGoogleLogin}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
        sx={{
          borderColor: '#4285f4',
          color: '#4285f4',
          '&:hover': {
            borderColor: '#3367d6',
            backgroundColor: 'rgba(66, 133, 244, 0.04)',
          },
          textTransform: 'none',
          py: 1.5
        }}
      >
        {loading ? 'Signing in...' : 'Continue with Google'}
      </Button>
      
      {error && error.includes('popup') && (
        <Button
          fullWidth
          variant="text"
          size="small"
          onClick={() => {
            setError(null);
            // Create a new instance with redirect enabled
            const redirectButton = document.createElement('button');
            redirectButton.onclick = async () => {
              try {
                await signInWithRedirect(auth, googleProvider);
              } catch (err) {
                console.error('Redirect failed:', err);
              }
            };
            redirectButton.click();
          }}
          sx={{ mt: 1, textTransform: 'none', color: '#4285f4' }}
        >
          Try with page redirect instead
        </Button>
      )}
    </Box>
  );
};

export default LoginWithGoogleButton;