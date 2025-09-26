import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Home,
  MenuBook,
  Security,
  AccountCircle,
  Logout,
  Science
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ onThemeToggle, isDarkMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const navItems = [
    { 
      label: 'Home', 
      path: '/', 
      icon: <Home /> 
    },
    { 
      label: 'Guide', 
      path: '/guide', 
      icon: <MenuBook /> 
    },
    { 
      label: 'Access', 
      path: '/access', 
      icon: <Security /> 
    }
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.9)
          : alpha(theme.palette.primary.main, 0.95),
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Brand */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => navigate('/')}
        >
          <Science 
            sx={{ 
              mr: 1, 
              fontSize: 28,
              color: theme.palette.mode === 'dark' ? '#4CAF50' : '#fff'
            }} 
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(45deg, #4CAF50, #81C784)'
                : 'linear-gradient(45deg, #fff, #f0f0f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            AyurDiscovery AI
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.text.primary
                  : 'white',
                fontWeight: isCurrentPath(item.path) ? 600 : 400,
                backgroundColor: isCurrentPath(item.path) 
                  ? alpha(theme.palette.background.paper, 0.2)
                  : 'transparent',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.15),
                },
                mx: 0.5,
                px: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.95rem'
              }}
            >
              {item.label}
            </Button>
          ))}

          {/* User Menu */}
          {isAuthenticated ? (
            <Box sx={{ ml: 2 }}>
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  color: theme.palette.mode === 'dark' 
                    ? theme.palette.text.primary
                    : 'white'
                }}
              >
                <Avatar 
                  src={user?.photoURL} 
                  sx={{ width: 32, height: 32, fontSize: '0.9rem' }}
                >
                  {user?.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }
                }}
              >
                <MenuItem disabled>
                  <AccountCircle sx={{ mr: 2 }} />
                  {user?.name}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              variant="outlined"
              onClick={() => navigate('/access')}
              sx={{
                ml: 2,
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.text.primary
                  : 'white',
                borderColor: theme.palette.mode === 'dark' 
                  ? theme.palette.text.primary
                  : 'white',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.15),
                  borderColor: theme.palette.mode === 'dark' 
                    ? theme.palette.text.primary
                    : 'white',
                },
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;