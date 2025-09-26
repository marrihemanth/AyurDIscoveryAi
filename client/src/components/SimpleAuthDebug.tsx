// Temporary simple authentication without Firestore dependency
import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Alert
} from '@mui/material';

const SimpleAuthDebug: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ m: 2, maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔍 Simple Authentication Status
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box mb={2}>
          <Typography variant="subtitle2" color="textSecondary">
            Firebase Auth Status:
          </Typography>
          <Chip 
            label={user ? 'Authenticated' : 'Not Authenticated'} 
            color={user ? 'success' : 'error'} 
            size="small"
          />
        </Box>

        {user ? (
          <>
            <Typography variant="subtitle2" color="textSecondary">
              User Info:
            </Typography>
            <Box mb={2} sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              <div>UID: {user.uid}</div>
              <div>Email: {user.email}</div>
              <div>Display Name: {user.displayName || 'None'}</div>
              <div>Photo URL: {user.photoURL ? 'Yes' : 'None'}</div>
              <div>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</div>
              <div>Provider: {user.providerData[0]?.providerId || 'Unknown'}</div>
            </Box>
            
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Firestore Database Required:</strong> To use profile features, you need to create a Firestore database in Firebase Console.
              </Typography>
            </Alert>
            
            <Button 
              variant="outlined" 
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              You are not signed in. Try the authentication pages:
            </Typography>
            <Box display="flex" gap={1}>
              <Button variant="outlined" href="/login">Login</Button>
              <Button variant="contained" href="/signup">Sign Up</Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleAuthDebug;