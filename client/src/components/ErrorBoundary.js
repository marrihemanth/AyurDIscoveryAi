// Error Boundary Component to catch React errors
import React from 'react';
import { Alert, Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <ErrorIcon />
              <Typography variant="h6">Something went wrong!</Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              The application encountered an error. Here are the details:
            </Typography>
            
            {this.state.error && (
              <Box sx={{ 
                background: 'rgba(0,0,0,0.1)', 
                p: 2, 
                borderRadius: 1,
                textAlign: 'left',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                mb: 2
              }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Error:</Typography>
                <br />
                {this.state.error.toString()}
                <br /><br />
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Stack Trace:</Typography>
                <br />
                {this.state.errorInfo.componentStack}
              </Box>
            )}
            
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Reload Page
            </Button>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;