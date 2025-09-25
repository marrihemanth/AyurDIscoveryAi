import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Box,
  Chip,
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
  MenuBook,
  Science,
  Compare,
  RecordVoiceOver,
  Hub,
} from '@mui/icons-material';
import { Agent } from '../types';

// Define keyframe animations for processing agents
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 193, 7, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 193, 7, 0.8), 0 0 30px rgba(255, 193, 7, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 193, 7, 0.5);
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface AgentStatusProps {
  agents: Agent[];
}

const getAgentIcon = (type: Agent['type'], status: Agent['status']) => {
  const getAnimationForAgent = (agentType: Agent['type']) => {
    if (status !== 'processing') return {};
    
    switch (agentType) {
      case 'literature':
        return {
          animation: `${pulse} 2s ease-in-out infinite`,
          color: '#1976d2'
        };
      case 'compound':
        return {
          animation: `${rotate} 3s linear infinite`,
          color: '#2e7d32'
        };
      case 'crossreference':
        return {
          animation: `${glow} 1.5s ease-in-out infinite`,
          borderRadius: '50%',
          color: '#ed6c02'
        };
      case 'voice':
        return {
          animation: `${pulse} 1s ease-in-out infinite`,
          color: '#9c27b0'
        };
      case 'coordinator':
        return {
          animation: `${glow} 2s ease-in-out infinite, ${pulse} 3s ease-in-out infinite`,
          borderRadius: '50%',
          color: '#d32f2f'
        };
      default:
        return {
          animation: `${pulse} 2s ease-in-out infinite`,
          color: '#757575'
        };
    }
  };

  const animationStyles = getAnimationForAgent(type);

  switch (type) {
    case 'literature':
      return <MenuBook sx={animationStyles} />;
    case 'compound':
      return <Science sx={animationStyles} />;
    case 'crossreference':
      return <Compare sx={animationStyles} />;
    case 'voice':
      return <RecordVoiceOver sx={animationStyles} />;
    case 'coordinator':
      return <Hub sx={animationStyles} />;
    default:
      return <Hub sx={animationStyles} />;
  }
};

const getStatusColor = (status: Agent['status']) => {
  switch (status) {
    case 'idle':
      return 'default';
    case 'processing':
      return 'warning';
    case 'completed':
      return 'success';
    case 'error':
      return 'error';
    default:
      return 'default';
  }
};

const AgentStatus: React.FC<AgentStatusProps> = ({ agents }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agent Status
      </Typography>
      <List>
        {agents.map((agent) => (
          <ListItem key={agent.id}>
            <ListItemIcon>
              {getAgentIcon(agent.type, agent.status)}
            </ListItemIcon>
            <ListItemText
              primary={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{agent.name}</span>
                  <Chip
                    label={agent.status}
                    size="small"
                    color={getStatusColor(agent.status)}
                    variant="outlined"
                  />
                </div>
              }
              secondary={
                <div style={{ marginTop: '8px' }}>
                  <LinearProgress
                    variant="determinate"
                    value={agent.progress}
                    style={{ marginBottom: '8px' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)' }}>
                    Progress: {agent.progress}% | Last updated: {agent.lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              }
              primaryTypographyProps={{ component: 'div' }}
              secondaryTypographyProps={{ component: 'div' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AgentStatus;