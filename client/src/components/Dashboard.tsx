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
} from '@mui/material';
import { useAgents } from '../hooks/useAgents';
import AgentStatus from './AgentStatus';
import SearchInterface from './SearchInterface';
import ResultsDisplay from './ResultsDisplay';
import VoiceInput from './VoiceInput';
import { discoveryAPI } from '../services/api';
import type { DiscoveryResult } from '../types';

function Dashboard() {
  const { agents, updateAgent } = useAgents();
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, language: string = 'en') => {
    try {
      setError(null);
      setIsAnalyzing(true);
      setResults([]);

      // Update all agents to processing state
      const agentTypes = ['literature', 'compound', 'crossreference', 'voice', 'coordinator'];
      agentTypes.forEach(type => {
        updateAgent(type, { status: 'processing', progress: 10 });
      });

      // For demo - create a mock result while backend is being fixed
      setTimeout(() => {
        const mockResult = {
          id: `result-${Date.now()}`,
          agentId: 'literature',
          title: `Analysis: ${query}`,
          description: `Comprehensive Ayurvedic analysis for "${query}" showing traditional wisdom meets modern science.`,
          confidence: 0.87,
          data: {
            traditionalNames: ['हल्दी (Haldi)', 'పసుపు (Pasupu)'],
            compounds: ['Curcumin', 'Turmerone', 'Bisdemethoxycurcumin'],
            therapeuticUses: ['Anti-inflammatory', 'Antioxidant', 'Hepatoprotective'],
            culturalContext: 'Used in Ayurvedic medicine for over 4000 years'
          },
          timestamp: new Date()
        };

        setResults([mockResult]);
        
        // Update agents to completed
        agentTypes.forEach((type, index) => {
          setTimeout(() => {
            updateAgent(type, { status: 'completed', progress: 100 });
          }, index * 500);
        });
        
        setIsAnalyzing(false);
      }, 3000);

      // Uncomment this when backend is ready:
      // const analysisResults = await discoveryAPI.analyzeQuery(query, language);
      // setResults(analysisResults);

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
              🌿 AyurDiscovery AI
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
              Bridging Traditional Ayurvedic Wisdom with Modern AI Research
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Chip label="అయుర్వేదం" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label="AI-Powered" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label="Multi-Agent" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🔍 Discovery Interface
            </Typography>
            <SearchInterface onSearch={handleSearch} isLoading={isAnalyzing} />
            
            <Box sx={{ mt: 2 }}>
              <VoiceInput onVoiceInput={handleVoiceInput} />
            </Box>

            {isAnalyzing && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  AI Agents Analyzing...
                </Typography>
                <LinearProgress />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🤖 Agent Status
            </Typography>
            <AgentStatus agents={agents} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 Analysis Results
            </Typography>
            
            {results.length > 0 ? (
              <ResultsDisplay results={results} />
            ) : (
              <Box sx={{ 
                textAlign: 'center',
                py: 6,
                color: 'text.secondary' 
              }}>
                <Typography variant="h6" gutterBottom>
                  🔬 Ready for Analysis
                </Typography>
                <Typography variant="body1">
                  Enter a query above to start your AI-powered Ayurvedic research discovery
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;