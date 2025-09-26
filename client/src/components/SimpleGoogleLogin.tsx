// Simple authentication without Firestore
import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import {
  Button,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const SimpleGoogleLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log('✅ Google sign in successful (no Firestore):', user);
      
      // Simple success - just redirect to home
      window.location.href = '/';

    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      setError(`Google sign-in failed: ${error.message}`);
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
        {loading ? 'Signing in...' : 'Continue with Google (Simple)'}
      </Button>
    </Box>
  );
};

export default SimpleGoogleLogin;