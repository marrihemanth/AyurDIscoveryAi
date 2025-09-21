const express = require('express');
const router = express.Router();

// Mock agents data for demo
const mockAgents = [
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
    id: 'crossreference',
    name: 'Cross Reference Agent',
    type: 'crossreference',
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
  {
    id: 'coordinator',
    name: 'Coordinator Agent',
    type: 'coordinator',
    status: 'idle',
    progress: 0,
    lastUpdate: new Date(),
  },
];

// GET /api/agents - Get all agents
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockAgents,
      count: mockAgents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/agents/:id - Get specific agent
router.get('/:id', (req, res) => {
  try {
    const agent = mockAgents.find(a => a.id === req.params.id);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }
    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/agents/:id - Update agent status
router.put('/:id', (req, res) => {
  try {
    const agentIndex = mockAgents.findIndex(a => a.id === req.params.id);
    if (agentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    const { status, progress, results } = req.body;
    
    if (status) mockAgents[agentIndex].status = status;
    if (typeof progress === 'number') mockAgents[agentIndex].progress = progress;
    if (results) mockAgents[agentIndex].results = results;
    mockAgents[agentIndex].lastUpdate = new Date();

    // Emit socket event for real-time updates
    const io = req.app.get('socketio');
    io.emit('agent_status_update', mockAgents[agentIndex]);

    res.json({
      success: true,
      data: mockAgents[agentIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/agents/reset - Reset all agents
router.post('/reset', (req, res) => {
  try {
    mockAgents.forEach(agent => {
      agent.status = 'idle';
      agent.progress = 0;
      agent.lastUpdate = new Date();
      agent.results = null;
    });

    // Emit socket event for real-time updates
    const io = req.app.get('socketio');
    io.emit('agents_reset', mockAgents);

    res.json({
      success: true,
      message: 'All agents reset successfully',
      data: mockAgents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;