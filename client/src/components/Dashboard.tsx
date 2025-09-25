import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  LinearProgress,
  Chip,
  Fade,
  Slide,
} from '@mui/material';
import { useAgents } from '../hooks/useAgents';
import AgentStatus from './AgentStatus';
import SearchInterface from './SearchInterface';
import ResultsDisplay from './ResultsDisplay';
import SpeechTest from './SpeechTest';
import VoiceInput from './VoiceInput';
import { discoveryAPI } from '../services/api';
import type { DiscoveryResult } from '../types';

function Dashboard() {
  const { agents, updateAgent } = useAgents();
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, searchType: string = 'comprehensive', language: string = 'en') => {
    try {
      setError(null);
      setIsAnalyzing(true);
      setResults([]);

      // Update all agents to processing state
      const agentTypes = ['literature', 'compound', 'crossreference', 'voice', 'coordinator'];
      agentTypes.forEach(type => {
        updateAgent(type, { status: 'processing', progress: 10 });
      });

      // Call real API for analysis
      console.log('🚀 Making real API call to backend...');
      const analysisResults = await discoveryAPI.analyzeQuery(query, language);
      console.log('✅ Received API results:', analysisResults);
      
      if (!analysisResults.success) {
        throw new Error(analysisResults.error || 'Analysis failed');
      }
      
      // The API returns immediately with sessionId, then processes asynchronously
      const sessionId = analysisResults.sessionId;
      console.log('📋 Session ID:', sessionId);
      
      // Poll for results every 2 seconds until complete
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds max
      const pollInterval = 2000; // 2 seconds
      
      const pollForResults = async (): Promise<any> => {
        attempts++;
        console.log(`🔄 Polling attempt ${attempts}/${maxAttempts}...`);
        
        try {
          const sessionData = await discoveryAPI.getSession(sessionId);
          console.log('📊 Session data:', sessionData);
          
          // Check if all agents are completed
          const agents = sessionData.agents || [];
          const completedAgents = agents.filter((agent: any) => agent.status === 'completed');
          const processingAgents = agents.filter((agent: any) => agent.status === 'processing');
          const totalAgents = agents.length;
          
          console.log(`✅ Completed: ${completedAgents.length}/${totalAgents} agents`);
          
          // Update progress
          const progress = totalAgents > 0 ? (completedAgents.length / totalAgents) * 100 : 0;
          agentTypes.forEach(type => {
            const agent = agents.find((a: any) => a.type === type);
            if (agent) {
              updateAgent(type, { 
                status: agent.status === 'completed' ? 'completed' : 
                        agent.status === 'processing' ? 'processing' : 'idle',
                progress: agent.status === 'completed' ? 100 : 
                         agent.status === 'processing' ? 50 : 10
              });
            }
          });
          
          // If all agents completed or max attempts reached
          if (completedAgents.length === totalAgents || attempts >= maxAttempts) {
            return sessionData;
          }
          
          // Continue polling
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          return pollForResults();
          
        } catch (pollError) {
          console.error('Polling error:', pollError);
          if (attempts >= maxAttempts) {
            throw new Error('Polling timeout - analysis may still be running');
          }
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          return pollForResults();
        }
      };
      
      // Start polling and wait for completion
      const finalSessionData = await pollForResults();
      
      // Convert completed agents to frontend format
      const agentResults: DiscoveryResult[] = [];
      console.log('🔍 Processing final session data:', finalSessionData);
      
      if (finalSessionData.agents) {
        finalSessionData.agents.forEach((agent: any) => {
          console.log(`📋 Processing agent ${agent.type}:`, agent);
          
          // Check for completed agents with results
          if (agent.status === 'completed') {
            const resultData = agent.result || agent.results || {};
            const analysisText = resultData.analysis || resultData.synthesis || resultData.processed || 
                               JSON.stringify(resultData) || 'Analysis completed';
            
            agentResults.push({
              id: `result-${sessionId}-${agent.type}`,
              agentId: agent.type,
              title: `${agent.name}: ${query}`,
              description: analysisText,
              confidence: resultData.confidence || 0.85,
              data: {
                fullResponse: resultData,
                processingTime: resultData.processingTime,
                timestamp: resultData.timestamp,
                agentType: agent.type,
                agentName: agent.name
              },
              timestamp: new Date(resultData.timestamp || Date.now())
            });
            
            console.log(`✅ Added result for ${agent.type}:`, agentResults[agentResults.length - 1]);
          } else {
            console.log(`⚠️  Agent ${agent.type} not completed, status: ${agent.status}`);
          }
        });
      }
      
      console.log(`🎯 Final results array (${agentResults.length} items):`, agentResults);
      
      console.log(`🎯 Final results array (${agentResults.length} items):`, agentResults);
      
      if (agentResults.length === 0) {
        console.warn('⚠️  No results found! This might indicate:');
        console.warn('   1. Agents completed but results not properly stored');
        console.warn('   2. Database connection issues');
        console.warn('   3. Result format mismatch');
        setError('Analysis completed but no results were returned. This may be a backend issue.');
      } else {
        setError(null);
      }
      
      setResults(agentResults);
      
      // Ensure all agents show as completed
      agentTypes.forEach(type => {
        updateAgent(type, { status: 'completed', progress: 100 });
      });
      
      setIsAnalyzing(false);

    } catch (err) {
      console.error('Search error:', err);
      setError('Analysis failed. Please try again.');
      setIsAnalyzing(false);
      
      const agentTypes = ['literature', 'compound', 'crossreference', 'voice', 'coordinator'];
      agentTypes.forEach(type => {
        updateAgent(type, { status: 'idle', progress: 0 });
      });
    }
  };

  const handleVoiceInput = (transcript: string, language: string) => {
    handleSearch(transcript, language);
  };

  const handleTranscriptFinalized = (transcript: string) => {
    // Handle the finalized transcript - could be used for additional processing
    console.log('Voice transcript finalized:', transcript);
    // The actual search is already handled by handleVoiceInput
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) => theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, #0F0F23 0%, #1A1B3A 50%, #2D2E5F 100%)`
          : `linear-gradient(135deg, ${theme.palette.background.default} 0%, #f1f5f9 100%)`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Hero Header */}
          <Grid item xs={12}>
            <Fade in timeout={800}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 6,
                  borderRadius: 6,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #8B7CF6 0%, #7C3AED 100%)'
                    : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 20px 60px rgba(139, 124, 246, 0.4)'
                    : '0 20px 60px rgba(99, 102, 241, 0.3)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 800,
                      mb: 2,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    🌿 AyurDiscovery AI
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)', 
                      mb: 4,
                      fontWeight: 400,
                      maxWidth: '600px',
                    }}
                  >
                    Bridging Traditional Ayurvedic Wisdom with Modern AI Research
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label="అయుర్వేదం" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }} 
                    />
                    <Chip 
                      label="AI-Powered" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }} 
                    />
                    <Chip 
                      label="Multi-Agent System" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }} 
                    />
                  </Box>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Search Interface */}
          <Grid item xs={12} md={8}>
            <Slide direction="up" in timeout={1000}>
              <Paper 
                elevation={0}
                sx={(theme) => ({ 
                  p: 4,
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(71, 85, 105, 0.3)'
                    : '1px solid rgba(226, 232, 240, 0.6)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 20px 40px rgba(0, 0, 0, 0.4)'
                      : '0 20px 40px rgba(15, 23, 42, 0.15)',
                  }
                })}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #A78BFA, #8B7CF6)'
                      : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🔍 Discovery Interface
                </Typography>
                
                <SearchInterface onSearch={handleSearch} isLoading={isAnalyzing} />
                
                <Box sx={{ mt: 3 }}>
                  <SpeechTest />
                  <VoiceInput 
                    onVoiceInput={handleVoiceInput} 
                    onTranscriptFinalized={handleTranscriptFinalized}
                  />
                </Box>

                {isAnalyzing && (
                  <Fade in>
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        ✨ AI Agents Analyzing...
                      </Typography>
                      <LinearProgress 
                        sx={{
                          borderRadius: 2,
                          height: 6,
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #6366f1, #8b7cf6)',
                          }
                        }}
                      />
                    </Box>
                  </Fade>
                )}

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 3,
                      borderRadius: 3,
                      '& .MuiAlert-icon': {
                        fontSize: '1.5rem',
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}
              </Paper>
            </Slide>
          </Grid>

          {/* Agent Status */}
          <Grid item xs={12} md={4}>
            <Slide direction="left" in timeout={1200}>
              <Paper 
                elevation={0}
                sx={(theme) => ({ 
                  p: 4,
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(71, 85, 105, 0.3)'
                    : '1px solid rgba(226, 232, 240, 0.6)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 20px 40px rgba(0, 0, 0, 0.4)'
                      : '0 20px 40px rgba(15, 23, 42, 0.15)',
                  }
                })}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #FCD34D, #F59E0B)'
                      : 'linear-gradient(135deg, #d97706, #b45309)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🤖 Agent Status
                </Typography>
                <AgentStatus agents={agents} />
              </Paper>
            </Slide>
          </Grid>

          {/* Analysis Results */}
          <Grid item xs={12}>
            <Slide direction="up" in timeout={1400}>
              <Paper 
                elevation={0}
                sx={(theme) => ({ 
                  p: 4,
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(71, 85, 105, 0.3)'
                    : '1px solid rgba(226, 232, 240, 0.6)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 20px 40px rgba(0, 0, 0, 0.4)'
                      : '0 20px 40px rgba(15, 23, 42, 0.15)',
                  }
                })}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 600,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #86EFAC, #22C55E)'
                      : 'linear-gradient(135deg, #059669, #047857)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  📊 Analysis Results
                </Typography>
                
                {results.length > 0 ? (
                  <ResultsDisplay results={results} />
                ) : (
                  <Box sx={{ 
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary',
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(15, 23, 42, 0.3)'
                      : 'rgba(248, 250, 252, 0.5)',
                    borderRadius: 3,
                    border: (theme) => theme.palette.mode === 'dark'
                      ? '2px dashed rgba(71, 85, 105, 0.3)'
                      : '2px dashed rgba(203, 213, 225, 0.5)',
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        opacity: 0.7,
                      }}
                    >
                      🔬
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Ready for Analysis
                    </Typography>
                    <Typography variant="body1" sx={{ maxWidth: '400px', mx: 'auto' }}>
                      Enter a query above to start your AI-powered Ayurvedic research discovery
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Slide>
          </Grid>
      </Grid>
    </Container>
    </Box>
  );
}

export default Dashboard;