import React, { useState, useRef, useEffect } from 'react';
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
  onTranscriptFinalized: (transcript: string) => void;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onVoiceInput, onTranscriptFinalized }) => {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('english');
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition on component mount
  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = false; // Change to false for better control
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = language === 'telugu' ? 'te-IN' : 'en-US';
      
      // Set up event handlers
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        console.log('Speech recognition result received:', event);
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          console.log(`Result ${i}: "${transcriptText}" (final: ${event.results[i].isFinal})`);
          
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText;
          } else {
            interimTranscript += transcriptText;
          }
        }
        
        // Update transcript state with interim and final results
        const currentTranscript = finalTranscript + interimTranscript;
        console.log('Current transcript:', currentTranscript);
        setTranscript(currentTranscript);
        
        // If we have a final result, process it
        if (finalTranscript.trim()) {
          console.log('Final transcript:', finalTranscript.trim());
          onTranscriptFinalized(finalTranscript.trim());
          onVoiceInput(finalTranscript.trim(), 'comprehensive');
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error, event);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'no-speech') {
          console.log('No speech detected');
        }
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
      console.log('Speech recognition not supported');
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onVoiceInput, onTranscriptFinalized]);

  // Update language when language selection changes
  useEffect(() => {
    if (recognitionRef.current) {
      const languageCode = language === 'telugu' ? 'te-IN' : 'en-US';
      recognitionRef.current.lang = languageCode;
      console.log('Language updated to:', languageCode);
    }
  }, [language]);

  // Function to toggle listening state and start/stop speech recognition
  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) {
      console.error('Speech recognition not supported');
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      // Stop listening
      console.log('Stopping speech recognition');
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      // Start listening
      console.log('Starting speech recognition');
      setTranscript('');
      
      // Update language before starting
      const languageCode = language === 'telugu' ? 'te-IN' : 'en-US';
      recognitionRef.current.lang = languageCode;
      console.log('Set language to:', languageCode);
      
      try {
        recognitionRef.current.start();
        console.log('Speech recognition start() called');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        alert('Failed to start speech recognition. Please try again.');
      }
    }
  };

  const startListening = () => {
    toggleListening();
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
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
          onClick={toggleListening}
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