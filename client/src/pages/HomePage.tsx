import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Chip,
  Stack
} from '@mui/material';
import {
  Science,
  Psychology,
  Biotech,
  Timeline,
  Security,
  Language,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Science />,
      title: 'Multi-Agent AI System',
      description: 'Advanced coordination between Literature, Compound, Research, and Voice agents for comprehensive analysis.'
    },
    {
      icon: <Psychology />,
      title: 'Traditional Knowledge Integration',
      description: 'Authentic Ayurvedic literature analysis powered by AWS Knowledge Base RAG technology.'
    },
    {
      icon: <Biotech />,
      title: 'Chemical Compound Analysis',
      description: 'Real-time molecular structure analysis with AWS Bedrock Nova Premier AI.'
    },
    {
      icon: <Timeline />,
      title: 'Advanced Confidence Scoring',
      description: 'Sophisticated accuracy metrics with 70-90% confidence validation across all analyses.'
    },
    {
      icon: <Security />,
      title: 'Enterprise Security',
      description: 'Production-ready with rate limiting, input validation, and JWT authentication.'
    },
    {
      icon: <Language />,
      title: 'Telugu Language Support',
      description: 'Native Telugu processing for authentic traditional medicine research context.'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Years of Ayurvedic Wisdom' },
    { number: '4', label: 'AI Agents Working in Harmony' },
    { number: '90%', label: 'Analysis Confidence Score' },
    { number: '2', label: 'Languages Supported' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha('#1a1a2e', 0.9)} 0%, ${alpha('#16213e', 0.9)} 100%)`
            : `linear-gradient(135deg, ${alpha('#667eea', 0.9)} 0%, ${alpha('#764ba2', 0.9)} 100%)`,
          minHeight: '70vh',
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
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Chip
                  label="🏆 Award-Winning AI Platform"
                  sx={{
                    alignSelf: 'flex-start',
                    backgroundColor: alpha(theme.palette.success.main, 0.2),
                    color: theme.palette.success.main,
                    fontWeight: 600
                  }}
                />
                
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}
                >
                  AyurDiscovery AI
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    color: alpha('#fff', 0.9),
                    fontWeight: 300,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    lineHeight: 1.4
                  }}
                >
                  Bridging 5000 years of Ayurvedic wisdom with cutting-edge AI technology
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha('#fff', 0.8),
                    fontSize: '1.1rem',
                    maxWidth: '500px'
                  }}
                >
                  Production-ready multi-agent AI system for traditional medicine research, 
                  powered by AWS Bedrock Nova Premier, Knowledge Base RAG, and advanced 
                  confidence scoring.
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/guide')}
                    sx={{
                      backgroundColor: theme.palette.success.main,
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: theme.palette.success.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/access')}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: alpha('#fff', 0.1),
                        borderColor: 'white',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Try Now
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '400px'
                }}
              >
                <Science
                  sx={{
                    fontSize: '15rem',
                    color: alpha('#fff', 0.2),
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-20px)' },
                      '100%': { transform: 'translateY(0px)' }
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      mb: 1
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2
              }}
            >
              Revolutionary AI Features
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Experience the power of advanced AI technology combined with 
              traditional Ayurvedic knowledge for unprecedented research capabilities.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 40px rgba(0,0,0,0.3)'
                        : '0 20px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        mb: 2,
                        color: theme.palette.primary.main,
                        '& svg': { fontSize: 40 }
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.primary.main, 0.05)
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Ready to Transform Your Research?
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.secondary, mb: 4 }}
            >
              Join researchers worldwide who trust AyurDiscovery AI for 
              authentic traditional medicine insights.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/access')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none'
              }}
            >
              Start Your Research Journey
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;