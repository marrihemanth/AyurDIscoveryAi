// Create a new page component at '/complete-profile'.
// This page should have a form with a dropdown menu asking the user to select their role: "Researcher", "Practitioner", or "Student".
// When they submit the form, save this role to their user profile.
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [selectedRole, setSelectedRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      // Get access token to authenticate with your backend
      const token = await getAccessTokenSilently();
      
      // Call your backend API to save the user role
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?.sub,
          role: selectedRole,
          email: user?.email,
          name: user?.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

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

  if (!isAuthenticated) {
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
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Complete Your Profile
        </Typography>
        
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Welcome, {user?.name}! Please select your role to personalize your AyurDiscovery AI experience.
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
  );
};

export default CompleteProfile;