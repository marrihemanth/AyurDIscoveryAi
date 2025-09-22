import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Debug log to verify environment variable
console.log('🔧 API_BASE_URL being used:', API_BASE_URL);
console.log('🔧 Environment variable REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for AI operations
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Discovery API endpoints
export const discoveryAPI = {
  // Start new analysis session
  analyzeQuery: async (query: string, language = 'en', voiceInput = false) => {
    const response = await api.post('/discovery/analyze', {
      query,
      language,
      voiceInput
    });
    return response.data;
  },

  // Get session status and results
  getSession: async (sessionId: string) => {
    const response = await api.get(`/discovery/session/${sessionId}`);
    return response.data;
  },

  // Get agent status updates
  getAgentStatus: async (sessionId: string) => {
    const response = await api.get(`/discovery/agents/${sessionId}`);
    return response.data;
  },

  // Process voice input
  processVoice: async (transcript: string, language = 'en') => {
    const response = await api.post('/discovery/voice', {
      transcript,
      language
    });
    return response.data;
  }
};

// Legacy API endpoints (keeping for backward compatibility)
export const searchAPI = {
  search: async (query: string) => {
    const response = await api.post('/search', { query });
    return response.data;
  }
};

export const agentsAPI = {
  getStatus: async () => {
    const response = await api.get('/agents');
    return response.data;
  }
};

export const resultsAPI = {
  getResults: async (sessionId?: string) => {
    const url = sessionId ? `/results/${sessionId}` : '/results';
    const response = await api.get(url);
    return response.data;
  }
};

export default api;