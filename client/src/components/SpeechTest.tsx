import React, { useState, useRef } from 'react';
import { Button, Typography, Box, Alert } from '@mui/material';

const SpeechTest: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<any>(null);

  const testSpeechRecognition = () => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition API is not supported in this browser');
      return;
    }

    if (isListening) {
      // Stop recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    // Create new recognition instance
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setError('');
      setTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      console.log('Speech result:', event);
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setTranscript(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    // Start recognition
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('Failed to start speech recognition');
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Speech Recognition Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testSpeechRecognition}
        color={isListening ? 'secondary' : 'primary'}
      >
        {isListening ? 'Stop Listening' : 'Test Speech Recognition'}
      </Button>

      {isListening && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Listening... Speak now!
        </Alert>
      )}

      {transcript && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <strong>Transcript:</strong> {transcript}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default SpeechTest;