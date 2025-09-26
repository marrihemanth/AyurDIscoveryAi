import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
          Authenticating...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to access page with return URL
    return <Navigate to="/access" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;