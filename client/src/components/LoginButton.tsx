// Create a 'LoginButton.tsx' component. Inside, use the 'useAuth0' hook to get the 'loginWithRedirect' function and call it onClick.
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const LoginButton: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (isAuthenticated) {
    return null; // Don't show login button if already authenticated
  }

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<LoginIcon />}
      onClick={() => loginWithRedirect()}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
        }
      }}
    >
      Log In / Sign Up
    </Button>
  );
};

export default LoginButton;