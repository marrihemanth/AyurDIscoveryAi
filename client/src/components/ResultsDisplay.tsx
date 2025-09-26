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
import MarkdownRenderer from './MarkdownRenderer';

// Helper function to process response text and convert escaped characters
const processResponseText = (text: string): string => {
  if (!text) return '';
  
  return text
    // Convert escaped newlines to actual newlines
    .replace(/\\n/g, '\n')
    // Convert escaped hashtags to actual hashtags for headers
    .replace(/\\#/g, '#')
    // Convert escaped asterisks to actual asterisks for emphasis
    .replace(/\\\*/g, '*')
    // Remove extra backslashes
    .replace(/\\\\/g, '\\')
    // Clean up any double newlines to single
    .replace(/\n\n+/g, '\n\n')
    .trim();
};

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
    result.agentId.toLowerCase().includes('research') ||
    result.agentId.toLowerCase().includes('coordinator')
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
    filterAgent === 'all' || filterAgent === 'literature'
  );
  
  const filteredModernResults = modernResults.filter(result => 
    filterAgent === 'all' || 
    (filterAgent === 'compound' && result.agentId.toLowerCase().includes('compound')) ||
    (filterAgent === 'research' && result.agentId.toLowerCase().includes('research')) ||
    (filterAgent === 'coordinator' && result.agentId.toLowerCase().includes('coordinator'))
  );

  const generatePDF = () => {
    // Create a printable version of the results
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AyurDiscovery AI - Research Report</title>
        <style>
          body { font-family: Georgia, serif; margin: 40px; line-height: 1.6; color: #333; }
          .header { text-align: center; margin-bottom: 40px; }
          .result { margin-bottom: 30px; page-break-inside: avoid; }
          .agent { color: #1976D2; font-weight: bold; font-size: 18px; }
          .confidence { color: #666; font-size: 14px; }
          .description { margin: 15px 0; }
          .description h1, .description h2, .description h3 { 
            color: #2c5aa0; margin: 20px 0 10px 0; font-weight: bold; 
          }
          .description h1 { font-size: 24px; }
          .description h2 { font-size: 20px; }
          .description h3 { font-size: 16px; }
          .description strong { font-weight: bold; color: #1565C0; }
          .description em { font-style: italic; color: #424242; }
          .description ul { margin: 10px 0; padding-left: 25px; }
          .description li { margin: 5px 0; }
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
        ${filteredResults.map(result => {
          // Process the response text to clean up markdown formatting
          const processedText = processResponseText(result.description);
          
          // Convert basic markdown to HTML for PDF
          const htmlText = processedText
            // Headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic text
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Bullet points
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            // Convert newlines to breaks
            .replace(/\n/g, '<br>')
            // Wrap consecutive <li> elements in <ul>
            .replace(/(<li>.*?<\/li>)(<br>)*(?=<li>)/gs, '$1')
            .replace(/(<li>.*?<\/li>)(<br>)*/gs, '<ul>$1</ul>');
          
          return `
            <div class="result">
              <div class="agent">${result.agentId}: ${result.title}</div>
              <div class="confidence">Confidence: ${Math.round(result.confidence * 100)}%</div>
              <div class="description">${htmlText}</div>
              <div style="color: #999; font-size: 12px;">Generated at ${result.timestamp.toLocaleString()}</div>
              <div class="separator"></div>
            </div>
          `;
        }).join('')}
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
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(102, 126, 234, 0.3)' 
            : 'rgba(102, 126, 234, 0.1)',
          backdropFilter: 'blur(15px)',
          border: (theme) => theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.2)'
            : '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Science sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'white' : '#667EEA',
              fontSize: 32 
            }} />
            <Typography variant="h4" sx={{ 
              color: (theme) => theme.palette.mode === 'dark' ? 'white' : '#333',
              fontWeight: 'bold' 
            }}>
              Analysis Results
            </Typography>
          </Box>
          <Chip 
            label={`${filteredResults.length} Results`} 
            sx={{ 
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(102, 126, 234, 0.2)', 
              color: (theme) => theme.palette.mode === 'dark' ? 'white' : '#333',
              fontWeight: 'bold',
              fontSize: '1rem'
            }} 
          />
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'white' : '#666'
              }}>Filter by Agent</InputLabel>
              <Select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                sx={{ 
                  color: (theme) => theme.palette.mode === 'dark' ? 'white' : '#333',
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: (theme) => theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.5)' 
                      : 'rgba(102, 126, 234, 0.5)'
                  },
                  '& .MuiSvgIcon-root': { 
                    color: (theme) => theme.palette.mode === 'dark' ? 'white' : '#666'
                  }
                }}
              >
                <MenuItem value="all">All Agents</MenuItem>
                <MenuItem value="literature">📚 Literature Agent</MenuItem>
                <MenuItem value="compound">🧪 Compound Agent</MenuItem>
                <MenuItem value="research">🔬 Research Agent</MenuItem>
                <MenuItem value="coordinator">🎯 Coordinator Agent</MenuItem>
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
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(102, 126, 234, 0.8)',
                color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'white',
                '&:hover': { 
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(102, 126, 234, 0.9)'
                }
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
                          <Tooltip 
                            title={
                              result.data?.confidenceBreakdown ? (
                                <Box>
                                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Confidence Breakdown:</Typography>
                                  <br />
                                  <Typography variant="caption">Content Quality: {Math.round(result.data.confidenceBreakdown.contentQuality * 100)}%</Typography>
                                  <br />
                                  <Typography variant="caption">Source Reliability: {Math.round(result.data.confidenceBreakdown.sourceReliability * 100)}%</Typography>
                                  <br />
                                  <Typography variant="caption">Query Matching: {Math.round(result.data.confidenceBreakdown.queryMatching * 100)}%</Typography>
                                  <br />
                                  <Typography variant="caption">Model Performance: {Math.round(result.data.confidenceBreakdown.modelPerformance * 100)}%</Typography>
                                  {result.data.qualityIndicators && result.data.qualityIndicators.length > 0 && (
                                    <>
                                      <br />
                                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Quality: {result.data.qualityIndicators.join(', ')}</Typography>
                                    </>
                                  )}
                                </Box>
                              ) : 'Advanced confidence calculation based on content quality, sources, and relevance'
                            }
                            arrow
                          >
                            <Chip
                              label={`${Math.round(result.confidence * 100)}% confidence`}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                color: '#4CAF50',
                                fontWeight: 'bold',
                                cursor: 'help'
                              }}
                            />
                          </Tooltip>
                        </Box>
                        
                        <MarkdownRenderer 
                          content={processResponseText(result.description)}
                          sx={{ 
                            lineHeight: 1.8,
                            fontSize: '1rem',
                            fontFamily: 'Georgia, serif',
                            color: 'rgba(255, 255, 255, 0.9)',
                            '& p': { color: 'rgba(255, 255, 255, 0.9)' },
                            '& h1, & h2, & h3, & h4, & h5, & h6': { 
                              color: '#4CAF50'
                            },
                            '& li': { color: 'rgba(255, 255, 255, 0.9)' }
                          }}
                        />
                        
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
                          <Tooltip 
                            title={
                              result.data?.confidenceBreakdown ? (
                                <Box>
                                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Confidence Breakdown:</Typography>
                                  <br />
                                  <Typography variant="caption">Content Quality: {Math.round(result.data.confidenceBreakdown.contentQuality * 100)}%</Typography>
                                  <br />
                                  <Typography variant="caption">Source Reliability: {Math.round(result.data.confidenceBreakdown.sourceReliability * 100)}%</Typography>
                                  <br />
                                  <Typography variant="caption">Query Matching: {Math.round(result.data.confidenceBreakdown.queryMatching * 100)}%</Typography>
                                  <br />
                                  <Typography variant="caption">Model Performance: {Math.round(result.data.confidenceBreakdown.modelPerformance * 100)}%</Typography>
                                  {result.data.qualityIndicators && result.data.qualityIndicators.length > 0 && (
                                    <>
                                      <br />
                                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Quality: {result.data.qualityIndicators.join(', ')}</Typography>
                                    </>
                                  )}
                                </Box>
                              ) : 'Advanced confidence calculation based on content quality, sources, and relevance'
                            }
                            arrow
                          >
                            <Chip
                              label={`${Math.round(result.confidence * 100)}% confidence`}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                color: '#2196F3',
                                fontWeight: 'bold',
                                cursor: 'help'
                              }}
                            />
                          </Tooltip>
                        </Box>
                        
                        <MarkdownRenderer 
                          content={processResponseText(result.description)}
                          sx={{ 
                            lineHeight: 1.8,
                            fontSize: '1rem',
                            fontFamily: 'Georgia, serif',
                            color: 'rgba(255, 255, 255, 0.9)',
                            '& p': { color: 'rgba(255, 255, 255, 0.9)' },
                            '& h1, & h2, & h3, & h4, & h5, & h6': { 
                              color: '#2196F3'
                            },
                            '& li': { color: 'rgba(255, 255, 255, 0.9)' }
                          }}
                        />
                        
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