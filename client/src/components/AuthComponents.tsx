import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Link,
  useTheme,
  alpha,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Google,
  Email,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthComponentsProps {
  onToggleMode: () => void;
  isLogin: boolean;
}

const AuthComponents: React.FC<AuthComponentsProps> = ({ onToggleMode, isLogin }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          navigate('/access');
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          navigate('/access');
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const success = await loginWithGoogle();
      if (success) {
        navigate('/access');
      } else {
        setError('Google login failed');
      }
    } catch (error) {
      setError('Google login failed');
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 450,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 20px 40px rgba(0,0,0,0.3)' 
          : '0 20px 40px rgba(0,0,0,0.1)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1
            }}
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.text.secondary 
            }}
          >
            {isLogin 
              ? 'Sign in to access AyurDiscovery AI' 
              : 'Join the future of Ayurvedic research'
            }
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Google Login Button */}
        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<Google />}
          onClick={handleGoogleLogin}
          disabled={isLoading}
          sx={{
            mb: 3,
            py: 1.5,
            borderColor: alpha(theme.palette.divider, 0.3),
            color: theme.palette.text.primary,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.05)
            }
          }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            or {isLogin ? 'sign in' : 'sign up'} with email
          </Typography>
        </Divider>

        {/* Email/Password Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                )
              }}
            />
          )}

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: !isLogin ? 2 : 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {!isLogin && (
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              component="button"
              variant="body2"
              onClick={onToggleMode}
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AuthComponents;