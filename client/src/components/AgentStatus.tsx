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
  useTheme,
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

const getAgentIcon = (type: Agent['type'], status: Agent['status'], theme: any) => {
  // Create theme-aware glow animation
  const glowColor = theme.palette.primary.main;
  const glow = keyframes`
    0% {
      box-shadow: 0 0 5px ${glowColor}40;
    }
    50% {
      box-shadow: 0 0 20px ${glowColor}80, 0 0 30px ${glowColor}60;
    }
    100% {
      box-shadow: 0 0 5px ${glowColor}40;
    }
  `;

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
      case 'research':
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
          color: theme.palette.text.secondary
        };
    }
  };

  const animationStyles = getAnimationForAgent(type);

  switch (type) {
    case 'literature':
      return <MenuBook sx={animationStyles} />;
    case 'compound':
      return <Science sx={animationStyles} />;
    case 'research':
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
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Agent Status
      </Typography>
      <List>
        {agents.map((agent) => (
          <ListItem key={agent.id}>
            <ListItemIcon>
              {getAgentIcon(agent.type, agent.status, theme)}
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
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: theme.palette.text.secondary
                  }}>
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