// After a user successfully signs up for the first time, redirect them to a '/complete-profile' page.
// On this page, create a form with a dropdown for the user to select their role: "Researcher", "Practitioner", or "Student".
// When they submit, use the Firestore database to create a new document in a 'users' collection, and save their role there.
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  School as StudentIcon,
  Science as ResearcherIcon,
  LocalHospital as PractitionerIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';

interface RoleOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const roleOptions: RoleOption[] = [
  {
    value: 'researcher',
    label: 'Researcher',
    description: 'Academic researcher or scientist studying Ayurvedic medicine',
    icon: <ResearcherIcon />
  },
  {
    value: 'practitioner',
    label: 'Practitioner',
    description: 'Healthcare professional or Ayurvedic practitioner',
    icon: <PractitionerIcon />
  },
  {
    value: 'student',
    label: 'Student',
    description: 'Student learning about Ayurvedic medicine and practices',
    icon: <StudentIcon />
  }
];

const CompleteProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Check if profile is already complete
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().profileComplete) {
          // Profile already complete, redirect to dashboard
          window.location.href = '/';
          return;
        }
      } else {
        // No user logged in, redirect to login
        window.location.href = '/auth';
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setSubmitError('Please select a role');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Update user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        role: selectedRole,
        profileComplete: true,
        updatedAt: new Date()
      });

      setSubmitSuccess(true);
      
      // Redirect to dashboard after successful profile completion
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Profile completion error:', error);
      setSubmitError('Failed to save your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Alert severity="warning">
          Please log in to complete your profile.
        </Alert>
      </Container>
    );
  }

  if (submitSuccess) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Profile Complete!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to AyurDiscovery AI. Redirecting you to the dashboard...
          </Typography>
        </Paper>
      </Container>
    );
  }

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
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              : '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
          }}
        >
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Complete Your Profile
        </Typography>
        
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Welcome, {user?.displayName || user?.email}! Please select your role to personalize your AyurDiscovery AI experience.
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="role-select-label">Select Your Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={selectedRole}
              label="Select Your Role"
              onChange={handleRoleChange}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {option.icon}
                    <Box>
                      <Typography variant="body1">{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!selectedRole || isSubmitting}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Complete Profile'}
          </Button>
        </form>
      </Paper>
    </Container>
    </Box>
  );
};

export default CompleteProfile;