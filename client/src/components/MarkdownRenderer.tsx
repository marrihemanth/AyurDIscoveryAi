import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Typography } from '@mui/material';

interface MarkdownRendererProps {
  content: string;
  sx?: object;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, sx = {} }) => {
  return (
    <Box sx={sx}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2, mt: 3 }}>
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1.5, mt: 2.5 }}>
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
              {children}
            </Typography>
          ),
          h4: ({ children }) => (
            <Typography variant="subtitle1" component="h4" sx={{ fontWeight: 'bold', mb: 0.5, mt: 1.5 }}>
              {children}
            </Typography>
          ),
          p: ({ children }) => (
            <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>
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
            <Typography component="li" variant="body1" sx={{ mb: 0.5, lineHeight: 1.6 }}>
              {children}
            </Typography>
          ),
          strong: ({ children }) => (
            <Typography component="strong" sx={{ fontWeight: 'bold', color: '#fff' }}>
              {children}
            </Typography>
          ),
          em: ({ children }) => (
            <Typography component="em" sx={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.8)' }}>
              {children}
            </Typography>
          ),
          code: ({ children }) => (
            <Typography 
              component="code" 
              sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9em',
                color: '#4CAF50'
              }}
            >
              {children}
            </Typography>
          ),
          blockquote: ({ children }) => (
            <Box
              sx={{
                borderLeft: '4px solid #4CAF50',
                pl: 2,
                py: 1,
                my: 2,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
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