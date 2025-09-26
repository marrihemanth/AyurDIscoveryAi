import { useState, useEffect } from 'react';
import { Agent } from '../types';
import { agentService } from '../services';

const initialAgents: Agent[] = [
  {
    id: 'literature',
    name: 'Literature Agent',
    type: 'literature',
    status: 'idle',
    progress: 0,
    lastUpdate: new Date(),
  },
  {
    id: 'compound',
    name: 'Compound Agent',
    type: 'compound',
    status: 'idle',
    progress: 0,
    lastUpdate: new Date(),
  },
  {
    id: 'research',
    name: 'Research Agent',
    type: 'research',
    status: 'idle',
    progress: 0,
    lastUpdate: new Date(),
  },
  {
    id: 'voice',
    name: 'Voice Agent',
    type: 'voice',
    status: 'idle',
    progress: 0,
    lastUpdate: new Date(),
  },
];

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAgent = (agentId: string, updates: Partial<Agent>) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId
          ? { ...agent, ...updates, lastUpdate: new Date() }
          : agent
      )
    );
  };

  const resetAllAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      // For demo, just reset locally
      setAgents(prevAgents =>
        prevAgents.map(agent => ({
          ...agent,
          status: 'idle' as const,
          progress: 0,
          lastUpdate: new Date(),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset agents');
    } finally {
      setLoading(false);
    }
  };

  // Simulate periodic status updates for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents =>
        prevAgents.map(agent => ({
          ...agent,
          lastUpdate: new Date(),
        }))
      );
    }, 30000); // Update timestamps every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    agents,
    updateAgent,
    resetAllAgents,
    loading,
    error,
  };
};