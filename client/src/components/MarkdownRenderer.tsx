import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Typography, useTheme } from '@mui/material';

interface MarkdownRendererProps {
  content: string;
  sx?: object;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, sx = {} }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Box sx={sx}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 'bold', 
              mb: 2, 
              mt: 3,
              color: isDarkMode ? '#ffffff !important' : '#000000 !important'
            }}>
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 'bold', 
              mb: 1.5, 
              mt: 2.5,
              color: isDarkMode ? '#ffffff !important' : '#000000 !important'
            }}>
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography variant="h6" component="h3" sx={{ 
              fontWeight: 'bold', 
              mb: 1, 
              mt: 2,
              color: isDarkMode ? '#ffffff !important' : '#000000 !important'
            }}>
              {children}
            </Typography>
          ),
          h4: ({ children }) => (
            <Typography variant="subtitle1" component="h4" sx={{ 
              fontWeight: 'bold', 
              mb: 0.5, 
              mt: 1.5,
              color: theme.palette.text.primary
            }}>
              {children}
            </Typography>
          ),
          p: ({ children }) => (
            <Typography variant="body1" sx={{ 
              mb: 1, 
              lineHeight: 1.7,
              color: isDarkMode ? '#ffffff !important' : '#000000 !important',
              opacity: 1
            }}>
              {children}
            </Typography>
          ),
          ul: ({ children }) => (
            <Box component="ul" sx={{ pl: 3, mb: 1 }}>
              {children}
            </Box>
          ),
          ol: ({ children }) => (
            <Box component="ol" sx={{ pl: 3, mb: 1 }}>
              {children}
            </Box>
          ),
          li: ({ children }) => (
            <Typography component="li" variant="body1" sx={{ 
              mb: 0.5, 
              lineHeight: 1.6,
              color: isDarkMode ? '#ffffff !important' : '#000000 !important',
              opacity: 1
            }}>
              {children}
            </Typography>
          ),
          strong: ({ children }) => (
            <Typography component="strong" sx={{ 
              fontWeight: 'bold', 
              color: isDarkMode ? '#ffffff !important' : '#000000 !important'
            }}>
              {children}
            </Typography>
          ),
          em: ({ children }) => (
            <Typography component="em" sx={{ 
              fontStyle: 'italic', 
              color: theme.palette.text.secondary
            }}>
              {children}
            </Typography>
          ),
          code: ({ children }) => (
            <Typography 
              component="code" 
              sx={{ 
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9em',
                color: theme.palette.primary.main
              }}
            >
              {children}
            </Typography>
          ),
          blockquote: ({ children }) => (
            <Box
              sx={{
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                pl: 2,
                py: 1,
                my: 2,
                backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.08)',
                borderRadius: '0 4px 4px 0'
              }}
            >
              {children}
            </Box>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;