import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
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

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: string;
  profileComplete?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Get additional user data from Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // If no Firestore document exists, create basic profile from Firebase Auth
            setUserProfile({
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || undefined,
              photoURL: currentUser.photoURL || undefined,
            });
          }
        } catch (err) {
          setError('Failed to load user profile');
          console.error('Profile loading error:', err);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        Authentication error: {error}
      </Alert>
    );
  }

  if (!user) {
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
            src={user.photoURL || userProfile?.photoURL}
            alt={user.displayName || userProfile?.displayName || user.email || 'User'}
            sx={{ 
              width: 80, 
              height: 80,
              border: '3px solid rgba(255,255,255,0.3)'
            }}
          >
            <PersonIcon />
          </Avatar>
          
          <Typography variant="h5" component="h2" textAlign="center">
            {user.displayName || userProfile?.displayName || 'Anonymous User'}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          
          {user.emailVerified && (
            <Chip 
              label="Email Verified" 
              color="success" 
              size="small"
              icon={<BadgeIcon />}
            />
          )}
          
          {/* Display user role if available */}
          {userProfile?.role && (
            <Chip 
              label={`Role: ${userProfile.role}`} 
              color="primary" 
              size="small"
            />
          )}
          
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Member since: {userProfile?.createdAt ? new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 'N/A'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Profile;