import api from './api';
import { Agent, DiscoveryResult, SearchQuery } from '../types';

export const agentService = {
  // Get all agents
  getAgents: async (): Promise<Agent[]> => {
    const response = await api.get('/agents');
    return response.data.data;
  },

  // Get specific agent
  getAgent: async (id: string): Promise<Agent> => {
    const response = await api.get(`/agents/${id}`);
    return response.data.data;
  },

  // Update agent status
  updateAgent: async (id: string, updates: Partial<Agent>): Promise<Agent> => {
    const response = await api.put(`/agents/${id}`, updates);
    return response.data.data;
  },

  // Reset all agents
  resetAgents: async (): Promise<Agent[]> => {
    const response = await api.post('/agents/reset');
    return response.data.data;
  },
};

export const searchService = {
  // Perform search
  search: async (searchQuery: SearchQuery): Promise<{
    query: string;
    type: string;
    language?: string;
    resultsCount: number;
    results: DiscoveryResult[];
  }> => {
    const response = await api.post('/search', searchQuery);
    return response.data.data;
  },

  // Get search status
  getSearchStatus: async (): Promise<{
    availableAgents: string[];
    supportedLanguages: string[];
    searchTypes: string[];
  }> => {
    const response = await api.get('/search/status');
    return response.data.data;
  },
};

export const resultsService = {
  // Get all results
  getResults: async (filters?: {
    agentId?: string;
    limit?: number;
    page?: number;
  }): Promise<{
    data: DiscoveryResult[];
    pagination: {
      currentPage: number;
      totalResults: number;
      resultsPerPage: number;
      totalPages: number;
    };
  }> => {
    const params = new URLSearchParams();
    if (filters?.agentId) params.append('agentId', filters.agentId);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    
    const response = await api.get(`/results?${params}`);
    return response.data;
  },

  // Get specific result
  getResult: async (id: string): Promise<DiscoveryResult> => {
    const response = await api.get(`/results/${id}`);
    return response.data.data;
  },

  // Add new result
  addResult: async (result: Omit<DiscoveryResult, 'id' | 'timestamp'>): Promise<DiscoveryResult> => {
    const response = await api.post('/results', result);
    return response.data.data;
  },

  // Delete result
  deleteResult: async (id: string): Promise<void> => {
    await api.delete(`/results/${id}`);
  },

  // Clear all results
  clearResults: async (): Promise<void> => {
    await api.delete('/results');
  },

  // Get results statistics
  getResultsStats: async (): Promise<{
    totalResults: number;
    resultsByAgent: Record<string, number>;
    averageConfidence: number;
    recentActivity: Array<{
      id: string;
      agentId: string;
      title: string;
      confidence: number;
      timestamp: Date;
    }>;
  }> => {
    const response = await api.get('/results/stats/summary');
    return response.data.data;
  },
};