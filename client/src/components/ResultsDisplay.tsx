import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import { DiscoveryResult } from '../types';

interface ResultsDisplayProps {
  results: DiscoveryResult[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Discovery Results ({results.length})
      </Typography>
      
      {results.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No results yet. Start a search to see AI agent discoveries.
        </Typography>
      ) : (
        <List>
          {results.map((result) => (
            <ListItem key={result.id} sx={{ px: 0 }}>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" component="h3">
                      {result.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={result.agentId}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${Math.round(result.confidence * 100)}% confidence`}
                        size="small"
                        color={getConfidenceColor(result.confidence)}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {result.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" display="block">
                      Confidence Level
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={result.confidence * 100}
                      color={getConfidenceColor(result.confidence)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Generated at {result.timestamp.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ResultsDisplay;