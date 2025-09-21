import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Science, Mic } from '@mui/icons-material';

const Header: React.FC = () => {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Science sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AyurDiscovery AI
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            आयुर्वेदिक खोज AI | ఆయుర్వేదిక్ డిస్కవరీ AI
          </Typography>
          <IconButton color="inherit">
            <Mic />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;