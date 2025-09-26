// Debug component to show authentication state
import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { testFirestoreConnection } from '../utils/firestoreTest';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Button
} from '@mui/material';

const AuthDebug: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firestoreStatus, setFirestoreStatus] = useState<'unknown' | 'connected' | 'offline'>('unknown');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setError(null);
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUserDoc(userDocSnap.data());
          } else {
            setUserDoc(null);
          }
        } catch (err: any) {
          setError(`Firestore error: ${err.message}`);
        }
      } else {
        setUserDoc(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTestFirestore = async () => {
    const isConnected = await testFirestoreConnection();
    setFirestoreStatus(isConnected ? 'connected' : 'offline');
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
          🔍 Authentication Debug Info
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

        {user && (
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
            
            <Typography variant="subtitle2" color="textSecondary">
              Firestore Document:
            </Typography>
            <Box mb={2}>
              <Chip 
                label={userDoc ? 'Exists' : 'Missing'} 
                color={userDoc ? 'success' : 'warning'} 
                size="small"
              />
            </Box>
            
            {userDoc && (
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                <div>Role: {userDoc.role || 'Not set'}</div>
                <div>Profile Complete: {userDoc.profileComplete ? 'Yes' : 'No'}</div>
                <div>Created: {userDoc.createdAt ? new Date(userDoc.createdAt.toDate()).toLocaleString() : 'Unknown'}</div>
              </Box>
            )}
          </>
        )}

        <Divider sx={{ my: 2 }} />
        
        <Box mb={2}>
          <Typography variant="subtitle2" color="textSecondary">
            Firestore Connection:
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              label={
                firestoreStatus === 'connected' ? 'Connected' : 
                firestoreStatus === 'offline' ? 'Offline/Error' : 
                'Unknown'
              } 
              color={
                firestoreStatus === 'connected' ? 'success' : 
                firestoreStatus === 'offline' ? 'error' : 
                'default'
              } 
              size="small"
            />
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleTestFirestore}
              sx={{ textTransform: 'none' }}
            >
              Test Connection
            </Button>
          </Box>
        </Box>

        {error && (
          <Box mt={2}>
            <Typography color="error" variant="body2">
              Error: {error}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDebug;