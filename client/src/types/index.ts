export interface Agent {
  id: string;
  name: string;
  type: 'literature' | 'compound' | 'crossreference' | 'voice' | 'coordinator';
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  lastUpdate: Date;
  results?: any;
}

export interface DiscoveryResult {
  id: string;
  agentId: string;
  title: string;
  description: string;
  confidence: number;
  data: any;
  timestamp: Date;
}

export interface VoiceInput {
  text: string;
  language: 'english' | 'telugu';
  confidence: number;
  timestamp: Date;
}

export interface SearchQuery {
  query: string;
  type: 'compound' | 'literature' | 'general';
  language?: 'english' | 'telugu';
}