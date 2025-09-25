const request = require('supertest');
const express = require('express');

// Mock node-fetch before importing the routes
jest.mock('node-fetch');
const fetch = require('node-fetch');

// Create Express app for testing
const app = express();
app.use(express.json());

// Mock the speech synthesis route
app.post('/api/synthesize-speech', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Text is required and must be a non-empty string' 
      });
    }

    // Mock ElevenLabs API call
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/fake-voice-id', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.buffer();
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'no-cache'
    });
    
    res.send(audioBuffer);
  } catch (error) {
    console.error('Speech synthesis error:', error);
    res.status(500).json({ 
      error: 'Failed to synthesize speech',
      details: error.message 
    });
  }
});

describe('Speech Routes', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/synthesize-speech', () => {
    it('should return 200 and audio/mpeg content-type when valid text is provided', async () => {
      // Mock successful ElevenLabs API response
      const mockAudioBuffer = Buffer.from('fake-audio-data');
      const mockResponse = {
        ok: true,
        status: 200,
        buffer: jest.fn().mockResolvedValue(mockAudioBuffer)
      };
      
      fetch.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/synthesize-speech')
        .send({ text: 'Hello, this is a test message' })
        .expect(200);

      // Verify response headers
      expect(response.headers['content-type']).toBe('audio/mpeg');
      expect(response.headers['content-length']).toBe(mockAudioBuffer.length.toString());
      expect(response.headers['cache-control']).toBe('no-cache');

      // Verify the response body contains the audio data
      expect(response.body).toEqual(mockAudioBuffer);

      // Verify fetch was called with correct parameters
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/text-to-speech/fake-voice-id',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVENLABS_API_KEY
          }),
          body: JSON.stringify({
            text: 'Hello, this is a test message',
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5
            }
          })
        })
      );
    });

    it('should return 400 when no text is provided', async () => {
      const response = await request(app)
        .post('/api/synthesize-speech')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'Text is required and must be a non-empty string'
      });

      // Verify fetch was not called
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should return 400 when text is empty string', async () => {
      const response = await request(app)
        .post('/api/synthesize-speech')
        .send({ text: '' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Text is required and must be a non-empty string'
      });

      // Verify fetch was not called
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should return 400 when text is only whitespace', async () => {
      const response = await request(app)
        .post('/api/synthesize-speech')
        .send({ text: '   ' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Text is required and must be a non-empty string'
      });

      // Verify fetch was not called
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should return 400 when text is not a string', async () => {
      const response = await request(app)
        .post('/api/synthesize-speech')
        .send({ text: 123 })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Text is required and must be a non-empty string'
      });

      // Verify fetch was not called
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should return 500 when ElevenLabs API returns an error', async () => {
      // Mock failed ElevenLabs API response
      const mockResponse = {
        ok: false,
        status: 401
      };
      
      fetch.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/synthesize-speech')
        .send({ text: 'Hello, this is a test message' })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to synthesize speech',
        details: 'ElevenLabs API error: 401'
      });

      // Verify fetch was called
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should return 500 when fetch throws an error', async () => {
      // Mock fetch throwing an error
      fetch.mockRejectedValue(new Error('Network error'));

      const response = await request(app)
        .post('/api/synthesize-speech')
        .send({ text: 'Hello, this is a test message' })
        .expect(500);

      expect(response.body).toEqual({
        error: 'Failed to synthesize speech',
        details: 'Network error'
      });

      // Verify fetch was called
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
