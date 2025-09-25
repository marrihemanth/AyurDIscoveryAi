import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  Download,
  Science,
  MenuBook,
  Search,
  RecordVoiceOver,
  Hub,
  FilterList,
  PictureAsPdf,
} from '@mui/icons-material';
import { DiscoveryResult } from '../types';
import TextToSpeechButton from './TextToSpeechButton';

interface ResultsDisplayProps {
  results: DiscoveryResult[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  // Group results by Traditional vs Modern categories
  const traditionalResults = results.filter(result => 
    result.agentId.toLowerCase().includes('literature')
  );
  
  const modernResults = results.filter(result => 
    result.agentId.toLowerCase().includes('compound') || 
    result.agentId.toLowerCase().includes('research')
  );

  const getAgentIcon = (agentType: string) => {
    switch (agentType?.toLowerCase()) {
      case 'literature':
        return <MenuBook />;
      case 'compound':
        return <Science />;
      case 'research':
        return <Search />;
      case 'voice':
        return <RecordVoiceOver />;
      case 'coordinator':
        return <Hub />;
      default:
        return <Science />;
    }
  };

  const getAgentColor = (agentType: string) => {
    switch (agentType?.toLowerCase()) {
      case 'literature':
        return '#2E7D32'; // Dark green
      case 'compound':
        return '#1976D2'; // Blue
      case 'research':
        return '#F57C00'; // Orange
      case 'voice':
        return '#7B1FA2'; // Purple
      case 'coordinator':
        return '#D32F2F'; // Red
      default:
        return '#757575'; // Grey
    }
  };

  const filteredResults = results.filter(result => 
    filterAgent === 'all' || result.agentId.toLowerCase().includes(filterAgent.toLowerCase())
  );

  // Apply filter to both traditional and modern results
  const filteredTraditionalResults = traditionalResults.filter(result => 
    filterAgent === 'all' || filterAgent === 'literature' || result.agentId.toLowerCase().includes(filterAgent.toLowerCase())
  );
  
  const filteredModernResults = modernResults.filter(result => 
    filterAgent === 'all' || filterAgent === 'compound' || filterAgent === 'research' || 
    result.agentId.toLowerCase().includes(filterAgent.toLowerCase())
  );

  const generatePDF = () => {
    // Create a printable version of the results
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AyurDiscovery AI - Research Report</title>
        <style>
          body { font-family: Georgia, serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 40px; }
          .result { margin-bottom: 30px; page-break-inside: avoid; }
          .agent { color: #1976D2; font-weight: bold; font-size: 18px; }
          .confidence { color: #666; font-size: 14px; }
          .description { margin: 15px 0; }
          .separator { border-top: 1px solid #ddd; margin: 20px 0; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AyurDiscovery AI - Research Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Total Results: ${filteredResults.length}</p>
        </div>
        ${filteredResults.map(result => `
          <div class="result">
            <div class="agent">${result.agentId}: ${result.title}</div>
            <div class="confidence">Confidence: ${Math.round(result.confidence * 100)}%</div>
            <div class="description">${result.description.replace(/\n/g, '<br>')}</div>
            <div style="color: #999; font-size: 12px;">Generated at ${result.timestamp.toLocaleString()}</div>
            <div class="separator"></div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('Please allow popups to generate PDF reports.');
    }
  };

  return (
    <Box>
      {/* Header with filters and actions */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'rgba(102, 126, 234, 0.3)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Science sx={{ color: 'white', fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              Analysis Results
            </Typography>
          </Box>
          <Chip 
            label={`${filteredResults.length} Results`} 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }} 
          />
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: 'white' }}>Filter by Agent</InputLabel>
              <Select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                sx={{ 
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                  '& .MuiSvgIcon-root': { color: 'white' }
                }}
              >
                <MenuItem value="all">All Agents</MenuItem>
                <MenuItem value="literature">Literature Agent</MenuItem>
                <MenuItem value="compound">Compound Agent</MenuItem>
                <MenuItem value="research">Research Agent</MenuItem>
                <MenuItem value="voice">Voice Agent</MenuItem>
                <MenuItem value="coordinator">Coordinator Agent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              startIcon={<PictureAsPdf />}
              onClick={generatePDF}
              disabled={filteredResults.length === 0}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Print/Save as PDF
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Two-Column Results Layout */}
      {results.length === 0 ? (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
          }}
        >
          <Science sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No results yet. Start a search to see AI agent discoveries.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Left Column - Traditional Ayurvedic Perspective */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(46, 125, 50, 0.15)', // Green tint for traditional
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(46, 125, 50, 0.3)',
                borderRadius: 3,
                minHeight: '400px',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <MenuBook sx={{ color: '#4CAF50', fontSize: 32 }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Traditional Ayurvedic Perspective
                  </Typography>
                </Box>
                
                {filteredTraditionalResults.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {traditionalResults.length === 0 
                      ? "Traditional analysis results will appear here..." 
                      : "No traditional results match the current filter."
                    }
                  </Typography>
                ) : (
                  <Box>
                    {filteredTraditionalResults.map((result, index) => (
                      <Box key={result.id} sx={{ mb: index < traditionalResults.length - 1 ? 3 : 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                            {result.title}
                          </Typography>
                          <TextToSpeechButton analysisResult={result.description} />
                          <Chip
                            label={`${Math.round(result.confidence * 100)}% confidence`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(76, 175, 80, 0.2)',
                              color: '#4CAF50',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.8,
                            fontSize: '1rem',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'Georgia, serif',
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}
                        >
                          {result.description}
                        </Typography>
                        
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Generated at {result.timestamp.toLocaleString()}
                        </Typography>
                        
                        {index < filteredTraditionalResults.length - 1 && (
                          <Divider sx={{ my: 3, borderColor: 'rgba(76, 175, 80, 0.3)' }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Modern Scientific Analysis */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(25, 118, 210, 0.15)', // Blue tint for modern
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(25, 118, 210, 0.3)',
                borderRadius: 3,
                minHeight: '400px',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Science sx={{ color: '#2196F3', fontSize: 32 }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Modern Scientific Analysis
                  </Typography>
                </Box>
                
                {filteredModernResults.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {modernResults.length === 0 
                      ? "Scientific analysis results will appear here..." 
                      : "No scientific results match the current filter."
                    }
                  </Typography>
                ) : (
                  <Box>
                    {filteredModernResults.map((result, index) => (
                      <Box key={result.id} sx={{ mb: index < modernResults.length - 1 ? 3 : 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          {getAgentIcon(result.agentId)}
                          <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                            {result.agentId}: {result.title}
                          </Typography>
                          <TextToSpeechButton analysisResult={result.description} />
                          <Chip
                            label={`${Math.round(result.confidence * 100)}% confidence`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(33, 150, 243, 0.2)',
                              color: '#2196F3',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                        
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.8,
                            fontSize: '1rem',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'Georgia, serif',
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}
                        >
                          {result.description}
                        </Typography>
                        
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Generated at {result.timestamp.toLocaleString()}
                        </Typography>
                        
                        {index < filteredModernResults.length - 1 && (
                          <Divider sx={{ my: 3, borderColor: 'rgba(33, 150, 243, 0.3)' }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ResultsDisplay;