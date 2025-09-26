import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AuthComponents from '../components/AuthComponents';
import Dashboard from '../components/Dashboard';

const AccessPage: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (isAuthenticated) {
    return (
      <Fade in={true} timeout={500}>
        <Box>
          <Dashboard />
        </Box>
      </Fade>
    );
  }

  return (
    <Box>
      {/* Authentication Required Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha('#1a1a2e', 0.9)} 0%, ${alpha('#16213e', 0.9)} 100%)`
            : `linear-gradient(135deg, ${alpha('#667eea', 0.9)} 0%, ${alpha('#764ba2', 0.9)} 100%)`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `radial-gradient(circle at 25px 25px, ${theme.palette.primary.main} 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: { xs: '2.5rem', md: '3rem' },
                lineHeight: 1.2,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                mb: 2
              }}
            >
              Access Required
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: alpha('#fff', 0.9),
                fontWeight: 300,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.4,
                mb: 1
              }}
            >
              Sign in to access the AyurDiscovery AI research platform
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: alpha('#fff', 0.7),
                fontSize: '1rem',
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              Join researchers worldwide using our advanced multi-agent AI system 
              for traditional medicine analysis and validation.
            </Typography>
          </Box>

          <Fade in={true} timeout={800}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <AuthComponents onToggleMode={toggleAuthMode} isLogin={isLogin} />
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default AccessPage;