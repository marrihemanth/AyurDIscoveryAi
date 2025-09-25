import { createTheme, Theme } from '@mui/material/styles';

// Premium Professional Design System
const colors = {
  // Premium Purple-Blue Gradient System
  primary: {
    light: '#8B7CF6',      // Light purple
    main: '#6366F1',       // Indigo primary
    dark: '#4F46E5',       // Deep indigo
    contrastText: '#FFFFFF',
  },
  // Sophisticated Accent Colors
  accent: {
    light: '#F59E0B',      // Warm amber
    main: '#D97706',       // Rich amber
    dark: '#B45309',       // Deep amber
    contrastText: '#FFFFFF',
  },
  // Professional Neutrals
  neutral: {
    50: '#F8FAFC',         // Lightest gray
    100: '#F1F5F9',        // Very light gray
    200: '#E2E8F0',        // Light gray
    300: '#CBD5E1',        // Medium light gray
    400: '#94A3B8',        // Medium gray
    500: '#64748B',        // Base gray
    600: '#475569',        // Dark gray
    700: '#334155',        // Darker gray
    800: '#1E293B',        // Very dark gray
    900: '#0F172A',        // Darkest gray
  },
  // Semantic Colors
  success: {
    light: '#34D399',
    main: '#10B981',
    dark: '#059669',
  },
  warning: {
    light: '#FBBF24',
    main: '#F59E0B',
    dark: '#D97706',
  },
  error: {
    light: '#F87171',
    main: '#EF4444',
    dark: '#DC2626',
  },
  // Pure Colors
  white: '#FFFFFF',
  black: '#000000',
};

// Light theme - Professional & Clean
export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      ...colors.primary,
    },
    secondary: {
      ...colors.accent,
    },
    background: {
      default: colors.neutral[50],     // Subtle off-white background
      paper: colors.white,            // Pure white for cards/papers
    },
    text: {
      primary: colors.neutral[900],    // Very dark text for readability
      secondary: colors.neutral[600],  // Medium gray for secondary text
    },
    divider: colors.neutral[200],      // Light gray dividers
    error: colors.error,
    warning: colors.warning,
    success: colors.success,
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      color: colors.neutral[900],
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      color: colors.neutral[900],
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      color: colors.neutral[800],
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: colors.neutral[800],
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: colors.neutral[700],
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: colors.neutral[700],
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.neutral[700],
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.neutral[600],
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          backdropFilter: 'blur(20px)',
          borderBottom: 'none',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
          '& .MuiToolbar-root': {
            minHeight: '72px',
            padding: '0 24px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '12px 24px',
          boxShadow: 'none',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: colors.white,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(99, 102, 241, 0.25)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        outlined: {
          borderColor: colors.neutral[300],
          color: colors.neutral[700],
          '&:hover': {
            borderColor: colors.primary.main,
            backgroundColor: `${colors.primary.main}08`,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: colors.white,
          border: `1px solid ${colors.neutral[200]}`,
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)',
        },
        elevation1: {
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        },
        elevation2: {
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)',
        },
        elevation3: {
          boxShadow: '0 12px 48px rgba(15, 23, 42, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.white,
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 64px rgba(15, 23, 42, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: colors.white,
            borderRadius: 16,
            fontSize: '0.95rem',
            '& fieldset': {
              borderColor: colors.neutral[300],
              borderWidth: 1.5,
            },
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.neutral[600],
            '&.Mui-focused': {
              color: colors.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          '&.MuiChip-filled': {
            backgroundColor: colors.neutral[100],
            color: colors.neutral[700],
            '&:hover': {
              backgroundColor: colors.neutral[200],
            },
          },
        },
      },
    },
  },
});

// Dark theme (default) - Harmonious Dark Experience
export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#A78BFA',      // Softer purple-light
      main: '#8B7CF6',       // Warmer purple
      dark: '#7C3AED',       // Deep purple
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#FCD34D',      // Warm yellow
      main: '#F59E0B',       // Amber
      dark: '#D97706',       // Deep amber
      contrastText: '#000000',
    },
    background: {
      default: '#0F0F23',        // Deep navy blue background
      paper: '#1A1B3A',          // Slightly lighter navy for cards
    },
    text: {
      primary: '#E2E8F0',        // Soft white text
      secondary: '#94A3B8',      // Muted blue-gray text
    },
    divider: '#334155',          // Subtle blue-gray dividers
    error: {
      light: '#FCA5A5',
      main: '#EF4444',
      dark: '#DC2626',
    },
    warning: {
      light: '#FDE68A',
      main: '#F59E0B',
      dark: '#D97706',
    },
    success: {
      light: '#86EFAC',
      main: '#22C55E',
      dark: '#16A34A',
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      color: '#F1F5F9',          // Soft white
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      color: '#F1F5F9',          // Soft white
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      color: '#E2E8F0',          // Slightly dimmer white
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#E2E8F0',          // Slightly dimmer white
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#CBD5E1',          // Muted white
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#CBD5E1',          // Muted white
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#94A3B8',          // Blue-gray text
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#64748B',          // Darker blue-gray
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, #1A1B3A 0%, #2D2E5F 100%)`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid rgba(139, 124, 246, 0.1)`,
          boxShadow: '0 4px 20px rgba(15, 15, 35, 0.4)',
          '& .MuiToolbar-root': {
            minHeight: '72px',
            padding: '0 24px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '12px 24px',
          boxShadow: 'none',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, #8B7CF6 0%, #7C3AED 100%)`,
          color: '#FFFFFF',
          '&:hover': {
            background: `linear-gradient(135deg, #A78BFA 0%, #8B7CF6 100%)`,
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(139, 124, 246, 0.5)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        outlined: {
          borderColor: '#475569',
          color: '#E2E8F0',
          '&:hover': {
            borderColor: '#8B7CF6',
            backgroundColor: 'rgba(139, 124, 246, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: `rgba(26, 27, 58, 0.85)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(139, 124, 246, 0.15)`,
          boxShadow: '0 8px 32px rgba(15, 15, 35, 0.3)',
        },
        elevation1: {
          boxShadow: '0 4px 16px rgba(15, 15, 35, 0.2)',
        },
        elevation2: {
          boxShadow: '0 8px 32px rgba(15, 15, 35, 0.25)',
        },
        elevation3: {
          boxShadow: '0 12px 48px rgba(15, 15, 35, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: `rgba(26, 27, 58, 0.85)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(139, 124, 246, 0.15)`,
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(15, 15, 35, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 64px rgba(15, 15, 35, 0.4)',
            borderColor: '#8B7CF6',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: `rgba(45, 46, 95, 0.6)`,
            borderRadius: 16,
            fontSize: '0.95rem',
            '& fieldset': {
              borderColor: '#475569',
              borderWidth: 1.5,
            },
            '&:hover fieldset': {
              borderColor: '#8B7CF6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B7CF6',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#94A3B8',
            '&.Mui-focused': {
              color: '#8B7CF6',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#E2E8F0',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          '&.MuiChip-filled': {
            backgroundColor: 'rgba(139, 124, 246, 0.2)',
            color: '#CBD5E1',
            border: '1px solid rgba(139, 124, 246, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(139, 124, 246, 0.3)',
            },
          },
        },
      },
    },
  },
});

export { colors };