import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { Science, Mic, LightMode, DarkMode, AutoAwesome } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backdropFilter: 'blur(20px)',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'rgba(15, 23, 42, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
        borderBottom: (theme) => theme.palette.mode === 'dark'
          ? '1px solid rgba(71, 85, 105, 0.3)'
          : '1px solid rgba(226, 232, 240, 0.3)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1, #8b7cf6)',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
            }}
          >
            <AutoAwesome sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #8b7cf6, #6366f1)'
                  : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AyurDiscovery AI
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Professional AI Research Platform
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label="आयुर्वेदिक खोज AI"
            size="small"
            sx={{
              display: { xs: 'none', md: 'flex' },
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(139, 124, 246, 0.15)'
                : 'rgba(99, 102, 241, 0.1)',
              color: (theme) => theme.palette.mode === 'dark'
                ? '#8b7cf6'
                : '#6366f1',
              fontWeight: 600,
              border: (theme) => theme.palette.mode === 'dark'
                ? '1px solid rgba(139, 124, 246, 0.3)'
                : '1px solid rgba(99, 102, 241, 0.2)',
            }}
          />
          
          <Tooltip title="Voice Input" arrow>
            <IconButton 
              sx={{
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(71, 85, 105, 0.3)'
                  : 'rgba(248, 250, 252, 0.8)',
                border: (theme) => theme.palette.mode === 'dark'
                  ? '1px solid rgba(71, 85, 105, 0.5)'
                  : '1px solid rgba(226, 232, 240, 0.8)',
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(139, 124, 246, 0.2)'
                    : 'rgba(99, 102, 241, 0.1)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Mic sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#8b7cf6' : '#6366f1' }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} arrow>
            <IconButton 
              onClick={toggleTheme}
              sx={{
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(71, 85, 105, 0.3)'
                  : 'rgba(248, 250, 252, 0.8)',
                border: (theme) => theme.palette.mode === 'dark'
                  ? '1px solid rgba(71, 85, 105, 0.5)'
                  : '1px solid rgba(226, 232, 240, 0.8)',
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(251, 191, 36, 0.2)'
                    : 'rgba(217, 119, 6, 0.1)',
                  transform: 'translateY(-1px) rotate(180deg)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {isDarkMode ? 
                <LightMode sx={{ color: '#fbbf24' }} /> : 
                <DarkMode sx={{ color: '#d97706' }} />
              }
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;