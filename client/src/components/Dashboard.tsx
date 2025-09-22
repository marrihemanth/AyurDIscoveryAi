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