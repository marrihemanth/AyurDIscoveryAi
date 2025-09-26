import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { Science, Mic, LightMode, DarkMode, AutoAwesome, AccountCircle } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '@mui/material';
import { ensureUserDocument } from '../utils/userUtils';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleProfileMenuClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Ensure user document exists in Firestore
        await ensureUserDocument(currentUser);
      }
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

          {/* Authentication Section */}
          {!isLoading && (
            <>
              {!user ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    href="/login"
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      bgcolor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(71, 85, 105, 0.3)'
                        : 'rgba(248, 250, 252, 0.8)',
                      border: (theme) => theme.palette.mode === 'dark'
                        ? '1px solid rgba(71, 85, 105, 0.5)'
                        : '1px solid rgba(226, 232, 240, 0.8)',
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark'
                          ? 'rgba(99, 102, 241, 0.2)'
                          : 'rgba(99, 102, 241, 0.1)',
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    href="/signup"
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#8b7cf6' : '#6366f1',
                      '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#7c3aed' : '#4f46e5',
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title="User Profile" arrow>
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{
                        bgcolor: (theme) => theme.palette.mode === 'dark'
                          ? 'rgba(71, 85, 105, 0.3)'
                          : 'rgba(248, 250, 252, 0.8)',
                        border: (theme) => theme.palette.mode === 'dark'
                          ? '1px solid rgba(71, 85, 105, 0.5)'
                          : '1px solid rgba(226, 232, 240, 0.8)',
                        '&:hover': {
                          bgcolor: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(99, 102, 241, 0.2)'
                            : 'rgba(99, 102, 241, 0.1)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {user?.photoURL ? (
                        <Avatar
                          src={user.photoURL}
                          alt={user.displayName || user.email || 'User'}
                          sx={{ width: 24, height: 24 }}
                        />
                      ) : (
                        <AccountCircle sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#8b7cf6' : '#6366f1' }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={() => { handleProfileMenuClose(); window.location.href = '/profile'; }}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => { handleProfileMenuClose(); window.location.href = '/complete-profile'; }}>
                      Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;