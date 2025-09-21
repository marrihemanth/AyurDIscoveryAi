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
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
        🔬 AI-Powered Ayurvedic Discovery
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Multi-agent AI system analyzing traditional knowledge with modern science
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Main Search Input */}
          <TextField
            label="Research Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter compound name, condition, or research question..."
            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
            disabled={isLoading}
            multiline
            rows={2}
            fullWidth
          />

          {/* Options Row */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Analysis Type</InputLabel>
              <Select
                value={searchType}
                label="Analysis Type"
                onChange={(e) => setSearchType(e.target.value)}
                disabled={isLoading}
                sx={{ backgroundColor: 'white' }}
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

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoading}
                sx={{ backgroundColor: 'white' }}
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
              sx={{ 
                minWidth: 140,
                backgroundColor: '#27ae60',
                '&:hover': { backgroundColor: '#219a52' }
              }}
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Box>

          {/* Analysis Type Description */}
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {searchTypeDescriptions[searchType as keyof typeof searchTypeDescriptions]}
          </Typography>

          {/* Example Queries */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Try these examples:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {exampleQueries.map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  onClick={() => setQuery(example)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#e8f5e8' }
                  }}
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