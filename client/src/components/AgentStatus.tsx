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
import {
  MenuBook,
  Science,
  Compare,
  RecordVoiceOver,
  Hub,
} from '@mui/icons-material';
import { Agent } from '../types';

interface AgentStatusProps {
  agents: Agent[];
}

const getAgentIcon = (type: Agent['type']) => {
  switch (type) {
    case 'literature':
      return <MenuBook />;
    case 'compound':
      return <Science />;
    case 'crossreference':
      return <Compare />;
    case 'voice':
      return <RecordVoiceOver />;
    case 'coordinator':
      return <Hub />;
    default:
      return <Hub />;
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
              {getAgentIcon(agent.type)}
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