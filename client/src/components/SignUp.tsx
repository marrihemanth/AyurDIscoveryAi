// Create a 'SignUp.tsx' component with email and password fields.
// On form submission, import the 'auth' object from your firebase config and use the 'createUserWithEmailAndPassword' function to sign up a new user.

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  AccountCircle
} from '@mui/icons-material';
import LoginWithGoogleButton from './LoginWithGoogleButton';

interface SignUpProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        createdAt: new Date(),
        profileComplete: false
      });

      console.log('✅ User signed up successfully:', userCredential.user);
      
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to complete profile
      window.location.href = '/complete-profile';

    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please try logging in instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please choose a stronger password.');
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, #0F0F23 0%, #1A1B3A 50%, #2D2E5F 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.default} 0%, #f1f5f9 100%)`,
        px: 2
      }}
    >
      <Card 
        sx={{ 
          maxWidth: 400,
          width: '100%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            : '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        }}
      >
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <AccountCircle sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" textAlign="center">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Join AyurDiscovery AI to start your journey
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <LoginWithGoogleButton 
            onSuccess={onSuccess}
            onError={setError}
          />
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>

          <Box textAlign="center">
            <Button
              variant="text"
              onClick={onSwitchToLogin}
              sx={{ textTransform: 'none' }}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
    </Box>
  );
};

export default SignUp;