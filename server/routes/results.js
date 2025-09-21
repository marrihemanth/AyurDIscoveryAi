const express = require('express');
const router = express.Router();

// Mock results storage for demo
let mockResults = [];

// GET /api/results - Get all discovery results
router.get('/', (req, res) => {
  try {
    const { agentId, limit = 50, page = 1 } = req.query;
    
    let filteredResults = mockResults;
    
    if (agentId) {
      filteredResults = filteredResults.filter(result => result.agentId === agentId);
    }
    
    const startIndex = (page - 1) * limit;
    const paginatedResults = filteredResults
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(startIndex, startIndex + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedResults,
      pagination: {
        currentPage: parseInt(page),
        totalResults: filteredResults.length,
        resultsPerPage: parseInt(limit),
        totalPages: Math.ceil(filteredResults.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/results/:id - Get specific result
router.get('/:id', (req, res) => {
  try {
    const result = mockResults.find(r => r.id === req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Result not found'
      });
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/results - Add new discovery result
router.post('/', (req, res) => {
  try {
    const { agentId, title, description, confidence, data, searchQuery, searchType } = req.body;
    
    if (!agentId || !title || !description || confidence === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: agentId, title, description, confidence'
      });
    }
    
    const newResult = {
      id: `result-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      agentId,
      title,
      description,
      confidence: Math.max(0, Math.min(1, confidence)), // Ensure 0-1 range
      data: data || {},
      searchQuery: searchQuery || '',
      searchType: searchType || 'general',
      timestamp: new Date()
    };
    
    mockResults.push(newResult);
    
    // Emit socket event for real-time updates
    const io = req.app.get('socketio');
    io.emit('new_result', newResult);
    
    res.status(201).json({
      success: true,
      data: newResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/results/:id - Delete specific result
router.delete('/:id', (req, res) => {
  try {
    const resultIndex = mockResults.findIndex(r => r.id === req.params.id);
    if (resultIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Result not found'
      });
    }
    
    const deletedResult = mockResults.splice(resultIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Result deleted successfully',
      data: deletedResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/results - Clear all results
router.delete('/', (req, res) => {
  try {
    const count = mockResults.length;
    mockResults = [];
    
    // Emit socket event for real-time updates
    const io = req.app.get('socketio');
    io.emit('results_cleared');
    
    res.json({
      success: true,
      message: `Cleared ${count} results`,
      clearedCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/results/stats/summary - Get results statistics
router.get('/stats/summary', (req, res) => {
  try {
    const stats = {
      totalResults: mockResults.length,
      resultsByAgent: {},
      averageConfidence: 0,
      recentActivity: mockResults
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10)
        .map(r => ({
          id: r.id,
          agentId: r.agentId,
          title: r.title,
          confidence: r.confidence,
          timestamp: r.timestamp
        }))
    };
    
    // Calculate stats by agent
    mockResults.forEach(result => {
      if (!stats.resultsByAgent[result.agentId]) {
        stats.resultsByAgent[result.agentId] = 0;
      }
      stats.resultsByAgent[result.agentId]++;
    });
    
    // Calculate average confidence
    if (mockResults.length > 0) {
      const totalConfidence = mockResults.reduce((sum, result) => sum + result.confidence, 0);
      stats.averageConfidence = totalConfidence / mockResults.length;
    }
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;