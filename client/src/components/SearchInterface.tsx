import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import { Search, Science, Psychology, Translate } from '@mui/icons-material';

interface SearchInterfaceProps {
  onSearch: (query: string, type: string, language?: string) => void;
  isLoading?: boolean;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('comprehensive');
  const [language, setLanguage] = useState('en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), searchType, language);
    }
  };

  const searchTypeDescriptions = {
    comprehensive: 'Full multi-agent analysis with all AI services',
    literature: 'Focus on traditional Ayurvedic texts and research papers',
    compound: 'Molecular analysis and drug prediction',
    research: 'Live literature search and verification'
  };

  const exampleQueries = [
    'Analyze turmeric for inflammation treatment',
    'పసుపు వాడకం మరియు వైద్య గుణాలు',
    'Ashwagandha stress management properties',
    'Traditional fever remedies in Telugu medicine'
  ];

  return (
    <Box sx={(theme) => ({ 
      p: theme.spacing(5), 
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(51, 65, 85, 0.4)'
        : 'rgba(248, 250, 252, 0.8)',
      borderRadius: 3,
      border: theme.palette.mode === 'dark'
        ? '1px solid rgba(71, 85, 105, 0.3)'
        : '1px solid rgba(226, 232, 240, 0.6)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 16px rgba(0, 0, 0, 0.2)'
        : '0 2px 12px rgba(0,0,0,0.08)',
    })}>
      <Typography 
        variant="h5" 
        sx={(theme) => ({ 
          color: theme.palette.text.primary,
          fontWeight: 600,
          mb: theme.spacing(2)
        })}
      >
        🔬 AI-Powered Ayurvedic Discovery
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: (theme) => theme.spacing(5)
        }}
      >
        Multi-agent AI system analyzing traditional knowledge with modern science
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Main Search Input */}
          <TextField
            label="Research Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter compound name, condition, or research question..."
            sx={(theme) => ({ 
              '& .MuiOutlinedInput-root': { 
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(51, 65, 85, 0.6)'
                  : 'white',
                padding: theme.spacing(1),
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(71, 85, 105, 0.5)'
                    : 'rgba(203, 213, 225, 0.8)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputBase-input': {
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: theme.palette.text.primary,
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.secondary,
                '&.Mui-focused': {
                  color: theme.palette.primary.main,
                },
              },
            })}
            disabled={isLoading}
            multiline
            rows={3}
            fullWidth
          />

          {/* Options Row */}
          <Box sx={{ 
            display: 'flex', 
            gap: (theme) => theme.spacing(3), 
            flexWrap: 'wrap', 
            alignItems: 'center',
            pt: (theme) => theme.spacing(1)
          }}>
            <FormControl sx={{ 
              minWidth: 220,
              '& .MuiInputBase-root': {
                height: 56
              }
            }}>
              <InputLabel>Analysis Type</InputLabel>
              <Select
                value={searchType}
                label="Analysis Type"
                onChange={(e) => setSearchType(e.target.value)}
                disabled={isLoading}
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(51, 65, 85, 0.6)'
                    : 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(71, 85, 105, 0.5)'
                      : 'rgba(203, 213, 225, 0.8)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '& .MuiSelect-select': {
                    color: theme.palette.text.primary,
                  },
                })}
              >
                <MenuItem value="comprehensive">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Science fontSize="small" />
                    Comprehensive Analysis
                  </Box>
                </MenuItem>
                <MenuItem value="literature">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Psychology fontSize="small" />
                    Literature Focus
                  </Box>
                </MenuItem>
                <MenuItem value="compound">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    🧬 Compound Analysis
                  </Box>
                </MenuItem>
                <MenuItem value="research">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    📚 Research Search
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ 
              minWidth: 140,
              '& .MuiInputBase-root': {
                height: 56
              }
            }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoading}
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(51, 65, 85, 0.6)'
                    : 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(71, 85, 105, 0.5)'
                      : 'rgba(203, 213, 225, 0.8)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '& .MuiSelect-select': {
                    color: theme.palette.text.primary,
                  },
                })}
              >
                <MenuItem value="en">🇺🇸 English</MenuItem>
                <MenuItem value="te">🇮🇳 Telugu</MenuItem>
                <MenuItem value="mixed">🌐 Mixed</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Search />}
              disabled={!query.trim() || isLoading}
              sx={(theme) => ({ 
                minWidth: 160,
                height: 56,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                transition: 'all 0.3s ease-in-out',
                fontSize: '1rem',
                fontWeight: 600,
                px: theme.spacing(4),
                '&:hover': { 
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 8px 25px ${theme.palette.mode === 'dark' 
                    ? 'rgba(99, 102, 241, 0.4)' 
                    : 'rgba(99, 102, 241, 0.3)'}, 0 0 20px ${theme.palette.mode === 'dark' 
                    ? 'rgba(99, 102, 241, 0.3)' 
                    : 'rgba(99, 102, 241, 0.2)'}`,
                  transform: 'translateY(-2px)'
                }
              })}
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Box>

          {/* Analysis Type Description */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={(theme) => ({ 
              fontStyle: 'italic',
              mt: theme.spacing(3),
              px: theme.spacing(2),
              py: theme.spacing(1.5),
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(99, 102, 241, 0.1)'
                : 'rgba(255, 255, 255, 0.7)',
              borderRadius: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(99, 102, 241, 0.2)'
                : 'none',
            })}
          >
            {searchTypeDescriptions[searchType as keyof typeof searchTypeDescriptions]}
          </Typography>

          {/* Example Queries */}
          <Box sx={{ mt: (theme) => theme.spacing(4) }}>
            <Typography 
              variant="body2" 
              sx={(theme) => ({ 
                mb: theme.spacing(2), 
                fontWeight: 500,
                color: theme.palette.text.primary
              })}
            >
              Try these examples:
            </Typography>
            <Stack 
              direction="row" 
              spacing={1.5} 
              sx={{ 
                flexWrap: 'wrap', 
                gap: (theme) => theme.spacing(1.5)
              }}
            >
              {exampleQueries.map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  onClick={() => setQuery(example)}
                  variant="outlined"
                  size="medium"
                  sx={(theme) => ({ 
                    cursor: 'pointer',
                    px: theme.spacing(1),
                    py: theme.spacing(0.5),
                    fontSize: '0.875rem',
                    borderRadius: 3,
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(71, 85, 105, 0.3)'
                      : 'rgba(248, 250, 252, 0.8)',
                    borderColor: theme.palette.mode === 'dark'
                      ? 'rgba(99, 102, 241, 0.3)'
                      : 'rgba(203, 213, 225, 0.8)',
                    color: theme.palette.text.primary,
                    '&:hover': { 
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(99, 102, 241, 0.2)'
                        : '#e8f5e8',
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-1px)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0,0,0,0.3)'
                        : '0 2px 8px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  })}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default SearchInterface;