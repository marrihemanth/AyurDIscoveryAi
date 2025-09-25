// Create a 'Profile.tsx' component. Use the 'useAuth0' hook to get the 'user' and 'isAuthenticated' objects. If the user is authenticated, display their name and email.
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';

const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Authentication error: {error.message}
      </Alert>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Alert severity="info">
        Please log in to view your profile.
      </Alert>
    );
  }

  return (
    <Card 
      sx={{ 
        maxWidth: 400, 
        margin: '0 auto',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            src={user.picture}
            alt={user.name}
            sx={{ 
              width: 80, 
              height: 80,
              border: '3px solid rgba(255,255,255,0.3)'
            }}
          >
            <PersonIcon />
          </Avatar>
          
          <Typography variant="h5" component="h2" textAlign="center">
            {user.name}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          
          {user.email_verified && (
            <Chip 
              label="Email Verified" 
              color="success" 
              size="small"
              icon={<BadgeIcon />}
            />
          )}
          
          {/* Display user role if available */}
          {user['app_metadata']?.role && (
            <Chip 
              label={`Role: ${user['app_metadata'].role}`} 
              color="primary" 
              size="small"
            />
          )}
          
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Last updated: {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Profile;