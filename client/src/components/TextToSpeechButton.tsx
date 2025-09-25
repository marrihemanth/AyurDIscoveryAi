import React, { useState, useRef } from 'react';
import { IconButton, CircularProgress, Tooltip, Box } from '@mui/material';
import { VolumeUp as VolumeUpIcon } from '@mui/icons-material';
import { synthesizeSpeech } from '../services/api';

interface TextToSpeechButtonProps {
  analysisResult: string;
}

// This component receives an 'analysisResult' string prop.
// Using Material-UI, add an IconButton with a VolumeUpIcon that is only visible when 'analysisResult' has text.
// The button should show a CircularProgress indicator instead of the icon when an 'isSpeaking' state is true.
const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ analysisResult }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTextToSpeech = async () => {
    if (!analysisResult?.trim()) {
      console.warn('No text to speak');
      return;
    }

    try {
      setIsSpeaking(true);
      console.log('🔊 Starting TTS for text:', analysisResult.substring(0, 100) + '...');
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Call the TTS API
      const audioBlob = await synthesizeSpeech(analysisResult);
      console.log('✅ Got audio blob, size:', audioBlob.size, 'bytes');

      if (audioBlob.size === 0) {
        throw new Error('Received empty audio response');
      }

      // Create audio URL and play
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Add event listeners
      audio.addEventListener('ended', () => {
        console.log('✅ Audio playback finished');
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      });
      
      audio.addEventListener('error', (e) => {
        console.error('❌ Audio playback error:', e);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      });

      // Start playback
      await audio.play();
      
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      setIsSpeaking(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Speech synthesis failed: ${errorMessage}`);
    }
  };

  // Don't render if no text
  if (!analysisResult?.trim()) {
    return null;
  }

  const buttonContent = isSpeaking ? (
    <CircularProgress size={20} color="primary" />
  ) : (
    <VolumeUpIcon />
  );

  return (
    <Tooltip title={isSpeaking ? "Generating speech..." : "Listen to analysis"}>
      <Box component="span">
        <IconButton
          onClick={handleTextToSpeech}
          disabled={isSpeaking}
          size="small"
          sx={{ 
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white'
            }
          }}
        >
          {buttonContent}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default TextToSpeechButton;