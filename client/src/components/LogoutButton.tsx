// Create a 'LogoutButton.tsx' component. Use the 'useAuth0' hook to get the 'logout' function.
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

const LogoutButton: React.FC = () => {
  const { logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (!isAuthenticated) {
    return null; // Don't show logout button if not authenticated
  }

  return (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<LogoutIcon />}
      onClick={() => logout({ 
        logoutParams: { 
          returnTo: window.location.origin 
        } 
      })}
      sx={{
        borderColor: '#f44336',
        color: '#f44336',
        '&:hover': {
          borderColor: '#d32f2f',
          backgroundColor: 'rgba(244, 67, 54, 0.04)',
        }
      }}
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;