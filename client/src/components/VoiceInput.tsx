import React, { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';

interface VoiceInputProps {
  onVoiceInput: (text: string, type: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('english');
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const startListening = () => {
    // Mock voice recognition for demo purposes
    setIsListening(true);
    setTranscript('');
    
    // Simulate voice recognition
    setTimeout(() => {
      const mockTranscripts = {
        english: [
          'Search for turmeric compounds',
          'Find research on ashwagandha',
          'Analyze neem medicinal properties',
          'Study tulsi therapeutic effects'
        ],
        telugu: [
          'పసుపు సమ్మేళనాలను వెతకండి',
          'అశ్వగంధపై పరిశోధనను కనుగొనండి',
          'వేప వైద్య లక్షణాలను విశ్లేషించండి'
        ]
      };
      
      const transcripts = mockTranscripts[language as keyof typeof mockTranscripts];
      const randomTranscript = transcripts[Math.floor(Math.random() * transcripts.length)];
      
      setTranscript(randomTranscript);
      setIsListening(false);
      
      // Auto-submit after a delay
      setTimeout(() => {
        onVoiceInput(randomTranscript, 'voice');
        setTranscript('');
      }, 1000);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Voice Input (Telugu/English)
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 150, mr: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            label="Language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="telugu">Telugu (తెలుగు)</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          variant={isListening ? "outlined" : "contained"}
          color={isListening ? "secondary" : "primary"}
          startIcon={isListening ? <MicOff /> : <Mic />}
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
        >
          {isListening ? 'Stop Listening' : 'Start Voice Input'}
        </Button>
      </Box>

      {isListening && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">
            Listening... Speak in {language === 'telugu' ? 'Telugu' : 'English'}
          </Typography>
        </Box>
      )}

      {transcript && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Recognized:</strong> {transcript}
          </Typography>
        </Alert>
      )}

      {!isSupported && (
        <Alert severity="warning">
          Voice recognition is not supported in this browser. Please use Chrome or Firefox.
        </Alert>
      )}
    </Box>
  );
};

export default VoiceInput;