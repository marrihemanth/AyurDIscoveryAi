import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ExpandMore,
  Science,
  Psychology,
  Biotech,
  Search,
  Timeline,
  CheckCircle,
  ArrowForward,
  School,
  Lightbulb,
  Speed
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const GuidePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  const researchSteps = [
    {
      label: 'Define Your Research Question',
      description: 'Start with a clear, specific question about Ayurvedic medicine.',
      details: [
        'Focus on specific herbs, compounds, or therapeutic applications',
        'Consider traditional uses vs. modern applications',
        'Frame questions that can benefit from multi-agent analysis'
      ],
      example: '"Analyze turmeric\'s anti-inflammatory mechanisms and validate with modern research"'
    },
    {
      label: 'Choose Your Language',
      description: 'Select English, Telugu, or mixed language for optimal results.',
      details: [
        'Telugu for traditional context and authentic terminology',
        'English for modern scientific analysis',
        'Mixed language for comprehensive cross-cultural insights'
      ],
      example: 'Telugu: "హల్దీ వైద్య గుణాలు విశ్లేషించండి" for traditional perspective'
    },
    {
      label: 'Initiate Multi-Agent Analysis',
      description: 'Our AI agents work simultaneously to provide comprehensive insights.',
      details: [
        'Literature Agent searches classical Ayurvedic texts',
        'Compound Agent analyzes molecular structures and mechanisms',
        'Research Agent validates with modern scientific studies',
        'Coordinator Agent synthesizes findings with confidence scores'
      ],
      example: 'Watch real-time progress as agents coordinate their analysis'
    },
    {
      label: 'Interpret Results',
      description: 'Review comprehensive analysis with confidence metrics.',
      details: [
        'Chemical structures with IUPAC nomenclature',
        'Traditional uses with textual references',
        'Modern research validation and clinical evidence',
        'Confidence scores ranging from 70-90% accuracy'
      ],
      example: 'Cross-reference traditional knowledge with peer-reviewed research'
    }
  ];

  const useCases = [
    {
      title: 'Academic Research',
      description: 'Perfect for dissertations, research papers, and academic studies',
      icon: <School />,
      applications: [
        'Literature reviews combining traditional and modern sources',
        'Chemical compound identification and analysis',
        'Cross-cultural medicine studies',
        'Evidence-based traditional medicine research'
      ]
    },
    {
      title: 'Drug Discovery',
      description: 'Accelerate pharmaceutical research with AI-powered insights',
      icon: <Science />,
      applications: [
        'Lead compound identification from traditional medicines',
        'Mechanism of action analysis',
        'Safety profile assessment',
        'Modern validation of traditional uses'
      ]
    },
    {
      title: 'Clinical Practice',
      description: 'Support evidence-based integrative medicine approaches',
      icon: <Psychology />,
      applications: [
        'Patient education with scientific backing',
        'Treatment protocol development',
        'Herb-drug interaction analysis',
        'Dosage and safety information'
      ]
    }
  ];

  const bestPractices = [
    {
      category: 'Query Formulation',
      tips: [
        'Be specific about the herb, compound, or condition',
        'Include context about traditional vs. modern applications',
        'Use scientific names when possible for accuracy',
        'Ask about mechanisms, not just general properties'
      ]
    },
    {
      category: 'Language Selection',
      tips: [
        'Use Telugu for authentic traditional medicine context',
        'Choose English for scientific and clinical applications',
        'Try mixed language for comprehensive cultural insights',
        'Voice input works excellently for both languages'
      ]
    },
    {
      category: 'Result Interpretation',
      tips: [
        'Pay attention to confidence scores (70-90% range)',
        'Cross-reference multiple agent findings',
        'Look for consensus between traditional and modern evidence',
        'Use chemical structure data for precise compound identification'
      ]
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha('#2c3e50', 0.9)} 0%, ${alpha('#3498db', 0.9)} 100%)`
            : `linear-gradient(135deg, ${alpha('#667eea', 0.9)} 0%, ${alpha('#764ba2', 0.9)} 100%)`,
          py: 8,
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              label="📚 Research Guide"
              sx={{
                mb: 3,
                backgroundColor: alpha('#fff', 0.2),
                color: 'white',
                fontWeight: 600
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Maximize Your Research
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 300,
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.9
              }}
            >
              Learn how to leverage AyurDiscovery AI's multi-agent system for 
              comprehensive traditional medicine research with modern validation.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Research Process Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 2
            }}
          >
            Research Process
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Follow this step-by-step process to get the most out of our AI-powered research platform.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {researchSteps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      <List dense>
                        {step.details.map((detail, detailIndex) => (
                          <ListItem key={detailIndex}>
                            <ListItemIcon>
                              <CheckCircle 
                                sx={{ 
                                  color: theme.palette.success.main,
                                  fontSize: 20 
                                }} 
                              />
                            </ListItemIcon>
                            <ListItemText primary={detail} />
                          </ListItem>
                        ))}
                      </List>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 2,
                          mt: 2,
                          mb: 2
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontStyle: 'italic',
                            color: theme.palette.text.secondary
                          }}
                        >
                          <strong>Example:</strong> {step.example}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === researchSteps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === researchSteps.length && (
                <Card sx={{ mt: 2, p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    🎉 Ready to Start Your Research!
                  </Typography>
                  <Typography sx={{ mb: 3 }}>
                    You now have all the knowledge needed to maximize your research 
                    with AyurDiscovery AI. Access the platform to begin your journey.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/access')}
                    sx={{ mr: 2 }}
                  >
                    Access Platform
                  </Button>
                  <Button onClick={handleReset}>
                    Reset Guide
                  </Button>
                </Card>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  position: 'sticky',
                  top: 100,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Lightbulb sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Quick Tips
                    </Typography>
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Speed sx={{ color: theme.palette.success.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Real-time Analysis" 
                        secondary="Watch agents work simultaneously"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Timeline sx={{ color: theme.palette.info.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Confidence Scores" 
                        secondary="70-90% accuracy validation"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Search sx={{ color: theme.palette.warning.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Multi-language" 
                        secondary="Telugu & English support"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Use Cases Section */}
      <Box sx={{ py: 8, backgroundColor: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 6
            }}
          >
            Research Applications
          </Typography>

          <Grid container spacing={4}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 40px rgba(0,0,0,0.3)'
                        : '0 20px 40px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        mb: 2,
                        color: theme.palette.primary.main,
                        '& svg': { fontSize: 40 }
                      }}
                    >
                      {useCase.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      {useCase.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary, mb: 3 }}
                    >
                      {useCase.description}
                    </Typography>
                    <List dense>
                      {useCase.applications.map((app, appIndex) => (
                        <ListItem key={appIndex} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <CheckCircle 
                              sx={{ 
                                color: theme.palette.success.main,
                                fontSize: 16 
                              }} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={app}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Best Practices Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 6
            }}
          >
            Best Practices
          </Typography>

          {bestPractices.map((practice, index) => (
            <Accordion 
              key={index}
              sx={{
                mb: 2,
                '&:before': { display: 'none' },
                boxShadow: 'none',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {practice.category}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {practice.tips.map((tip, tipIndex) => (
                    <ListItem key={tipIndex}>
                      <ListItemIcon>
                        <CheckCircle 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: 20 
                          }} 
                        />
                      </ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
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
              Ready to Apply These Insights?
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.secondary, mb: 4 }}
            >
              Start your research journey with our advanced AI platform.
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
              Access Research Platform
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default GuidePage;