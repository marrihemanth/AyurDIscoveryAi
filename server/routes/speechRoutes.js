const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Test endpoint to check if API key is loaded
router.get('/test-config', (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  console.log('🔍 Config test - API Key:', apiKey ? `Found (${apiKey.length} chars)` : 'NOT FOUND');
  
  res.json({
    hasApiKey: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    keyPreview: apiKey ? apiKey.substring(0, 20) + '...' : 'NONE'
  });
});

// Simple test TTS endpoint
router.get('/test-tts', async (req, res) => {
  try {
    console.log('🧪 Testing TTS with simple text');
    
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'No API key' });
    }

    const testText = "Hello, this is a test of the text to speech system.";
    const voiceId = '21m00Tcm4TlvDq8ikWAM';
    
    console.log('🌐 Making test request to ElevenLabs...');
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: testText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8
        }
      })
    });

    console.log('📡 Test response status:', response.status);
    console.log('📡 Test response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Test TTS error:', errorText);
      return res.json({ 
        success: false, 
        status: response.status, 
        error: errorText 
      });
    }

    console.log('✅ Test TTS success!');
    return res.json({ 
      success: true, 
      status: response.status,
      message: 'TTS test successful' 
    });

  } catch (error) {
    console.error('❌ Test TTS exception:', error);
    return res.json({ 
      success: false, 
      error: error.message 
    });
  }
});

// TTS endpoint
router.post('/synthesize-speech', async (req, res) => {
  console.log('🎤 TTS Request received');
  console.log('📄 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      console.warn('❌ No text provided');
      return res.status(400).json({ error: 'Text is required' });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    console.log('🔑 API Key status:', apiKey ? `Found (${apiKey.length} chars)` : 'NOT FOUND');
    
    if (!apiKey) {
      console.error('❌ ElevenLabs API key not found');
      return res.status(500).json({ error: 'ElevenLabs API key not configured' });
    }

    // Clean and truncate text - be more aggressive with cleaning
    let cleanText = text
      .replace(/[#*_`]/g, '') // Remove markdown
      .replace(/\n+/g, ' ')    // Replace newlines with spaces
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
    
    // Truncate if too long
    const maxLength = 1000; // Reduce to 1000 chars for testing
    if (cleanText.length > maxLength) {
      cleanText = cleanText.substring(0, maxLength) + '...';
    }
    
    console.log('� Clean text preview:', cleanText.substring(0, 100) + '...');
    console.log('📏 Text length:', cleanText.length);

    const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const requestBody = {
      text: cleanText,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8
      }
    };
    
    console.log('🌐 Calling ElevenLabs API...');
    console.log('📤 Request URL:', url);
    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📡 ElevenLabs response status:', response.status);
    console.log('📡 ElevenLabs response statusText:', response.statusText);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ElevenLabs detailed error:', errorText);
      console.error('❌ Response status:', response.status);
      console.error('❌ Response statusText:', response.statusText);
      
      return res.status(500).json({ 
        error: `Speech synthesis failed`,
        details: `ElevenLabs API error: ${response.status} - ${errorText}`
      });
    }

    // Set headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-cache');
    
    console.log('✅ Streaming audio to client');
    
    // Stream response to client
    response.body.pipe(res);
    
    response.body.on('end', () => {
      console.log('✅ Audio streaming completed');
    });
    
    response.body.on('error', (streamError) => {
      console.error('❌ Streaming error:', streamError);
    });

  } catch (error) {
    console.error('❌ TTS exception:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Speech synthesis failed',
      details: error.message 
    });
  }
});

module.exports = router;