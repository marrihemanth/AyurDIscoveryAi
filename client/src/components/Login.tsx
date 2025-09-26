import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
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
  Visibility,
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';
import LoginWithGoogleButton from './LoginWithGoogleButton';

interface LoginProps {
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log('✅ User signed in successfully:', userCredential.user);
      
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to main app
      window.location.href = '/';

    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign up first.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Failed to sign in. Please try again.');
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
          <LoginIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" textAlign="center">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Sign in to continue your AyurDiscovery AI journey
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

          <Box component="form" onSubmit={handleSubmit}>
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
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box textAlign="center">
              <Button
                variant="text"
                onClick={onSwitchToSignUp}
                sx={{ textTransform: 'none' }}
              >
                Don't have an account? Sign Up
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
    </Box>
  );
};

export default Login;