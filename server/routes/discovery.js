const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const EnhancedBedrockAIService = require('../services/enhancedBedrockAI');
const DiscoverySession = require('../models/DiscoverySession');
const Agent = require('../models/Agent');
const { v4: uuidv4 } = require('uuid');

// Initialize Enhanced Bedrock AI Service
const aiService = new EnhancedBedrockAIService();

// Using the 'express-validator' library, add a validation and sanitization chain to this route.
// It should check that the 'query' field from the request body is not empty.
// Then, it should sanitize the 'query' field by trimming whitespace and escaping special characters.
// Add logic to return a 400 error if validation fails.
const validateDiscoveryQuery = [
  body('query')
    .notEmpty()
    .withMessage('Query is required and cannot be empty')
    .isLength({ min: 2, max: 1000 })
    .withMessage('Query must be between 2 and 1000 characters')
    .trim() // Trim whitespace from beginning and end
    .escape(), // Escape special characters to prevent XSS attacks
  
  body('language')
    .optional()
    .isIn(['en', 'te'])
    .withMessage('Language must be either en (English) or te (Telugu)'),
  
  body('voiceInput')
    .optional()
    .isBoolean()
    .withMessage('Voice input must be a boolean value')
];

// Start a new discovery session with multi-agent analysis
router.post('/analyze', validateDiscoveryQuery, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { query, language = 'en', voiceInput = false } = req.body;
    
    // Additional security check: Reject queries that contain only special characters
    const cleanQuery = query.replace(/[^\w\s]/gi, '').trim();
    if (cleanQuery.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Query must contain at least 2 alphanumeric characters'
      });
    }
    const sessionId = uuidv4();
    
    // Create new discovery session
    const session = new DiscoverySession({
      sessionId,
      originalQuery: {
        text: query,
        language,
        voiceInput,
        timestamp: new Date()
      },
      sessionStatus: 'initiated'
    });
    
    // Initialize agents
    const agentTypes = ['literature', 'compound', 'research', 'voice', 'coordinator'];
    const agents = [];
    
    for (const type of agentTypes) {
      const agent = new Agent({
        id: `${sessionId}-${type}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
        type,
        sessionId,
        status: 'idle'
      });
      agents.push(agent);
    }
    
    // Save session and agents (with error handling for demo mode)
    try {
      await session.save();
      await Agent.insertMany(agents);
      console.log('✅ Session saved to database');
    } catch (dbError) {
      console.log('⚠️  Database unavailable, continuing in demo mode:', dbError.message);
      // Continue without database - agents will still work
    }
    
    // Start async processing
    processDiscoverySession(sessionId, query, language, voiceInput);
    
    res.json({
      success: true,
      sessionId,
      message: 'Discovery session initiated',
      agents: agents.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        status: a.status
      }))
    });
    
  } catch (error) {
    console.error('Analysis initiation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate analysis',
      details: error.message
    });
  }
});

// Get session status and results
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    let session = null;
    let agents = [];
    
    if (process.env.MONGODB_URI) {
      session = await DiscoverySession.findOne({ sessionId });
      agents = await Agent.find({ sessionId });
    } else {
      // Demo mode - return mock data
      session = getMockSession(sessionId);
      agents = getMockAgents(sessionId);
    }
    
    res.json({
      success: true,
      session,
      agents
    });
    
  } catch (error) {
    console.error('Session retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve session',
      details: error.message
    });
  }
});

// Get agent status updates (for real-time dashboard)
router.get('/agents/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    let agents = [];
    
    if (process.env.MONGODB_URI) {
      agents = await Agent.find({ sessionId }).sort({ lastUpdate: -1 });
    } else {
      agents = getMockAgents(sessionId);
    }
    
    res.json({
      success: true,
      agents: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        type: agent.type,
        status: agent.status,
        progress: agent.progress,
        currentTask: agent.currentTask,
        confidence: agent.confidence,
        lastUpdate: agent.lastUpdate,
        processingTime: agent.processingTime
      }))
    });
    
  } catch (error) {
    console.error('Agent status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve agent status',
      details: error.message
    });
  }
});

// Process voice input
router.post('/voice', async (req, res) => {
  try {
    const { transcript, language = 'en' } = req.body;
    
    const result = await aiService.generateContent(transcript, 'research');
    
    res.json({
      success: true,
      result
    });
    
  } catch (error) {
    console.error('Voice processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process voice input',
      details: error.message
    });
  }
});

// Async function to process discovery session
async function processDiscoverySession(sessionId, query, language, voiceInput) {
  try {
    console.log(`🚀 Starting discovery session ${sessionId} for query: "${query}"`);
    
    // Update session status
    await updateSessionStatus(sessionId, 'processing');
    
    // Process voice input if needed
    let processedQuery = query;
    if (voiceInput) {
      await updateAgentStatus(sessionId, 'voice', 'processing', 'Processing voice input...');
      console.log('🎤 Processing voice input...');
      // Voice processing would be implemented here
      processedQuery = query; // For now, use original query
      await updateAgentStatus(sessionId, 'voice', 'completed', null, { processed: processedQuery });
    }

    // Update all agents to processing status
    await updateAgentStatus(sessionId, 'literature', 'processing', 'Accessing Ayurvedic knowledge base...');
    await updateAgentStatus(sessionId, 'compound', 'processing', 'Analyzing compounds with Nova Premier...');
    await updateAgentStatus(sessionId, 'research', 'processing', 'Analyzing research evidence...');
    await updateAgentStatus(sessionId, 'coordinator', 'processing', 'Preparing multi-agent analysis...');

    // Run comprehensive multi-agent analysis
    console.log('🤖 Invoking multi-agent analysis...');
    const analysisResult = await aiService.runMultiAgentAnalysis(processedQuery, {
      language,
      sessionId,
      voiceInput
    });

    if (!analysisResult.success) {
      throw new Error(analysisResult.error || 'Multi-agent analysis failed');
    }

    // Update individual agent statuses with results
    const responses = analysisResult.responses;

    if (responses.literature) {
      await updateAgentStatus(sessionId, 'literature', 'completed', null, responses.literature);
      console.log('✅ Literature Agent completed');
    } else {
      await updateAgentStatus(sessionId, 'literature', 'error', 'Literature analysis failed');
    }

    if (responses.compound) {
      await updateAgentStatus(sessionId, 'compound', 'completed', null, responses.compound);
      console.log('✅ Compound Agent completed');
    } else {
      await updateAgentStatus(sessionId, 'compound', 'error', 'Compound analysis failed');
    }

    if (responses.research) {
      await updateAgentStatus(sessionId, 'research', 'completed', null, responses.research);
      console.log('✅ Research Agent completed');
    } else {
      await updateAgentStatus(sessionId, 'research', 'error', 'Research analysis failed');
    }

    if (responses.coordinator) {
      await updateAgentStatus(sessionId, 'coordinator', 'completed', null, responses.coordinator);
      console.log('✅ Coordinator Agent completed');
    } else {
      await updateAgentStatus(sessionId, 'coordinator', 'error', 'Coordination failed');
    }

    // Update final session with comprehensive results
    await updateSessionResults(sessionId, {
      literatureResults: responses.literature,
      compoundResults: responses.compound,
      researchResults: responses.research,
      finalSynthesis: responses.coordinator,
      metadata: analysisResult.metadata,
      analysisComplete: true
    });

    await updateSessionStatus(sessionId, 'completed');
    console.log(`✅ Discovery session ${sessionId} completed successfully`);
    
  } catch (error) {
    console.error('❌ Discovery session processing error:', error);
    await updateSessionStatus(sessionId, 'error');
    
    // Update agent statuses to reflect error
    try {
      await updateAgentStatus(sessionId, 'literature', 'error', error.message);
      await updateAgentStatus(sessionId, 'compound', 'error', error.message);
      await updateAgentStatus(sessionId, 'research', 'error', error.message);
      await updateAgentStatus(sessionId, 'coordinator', 'error', error.message);
    } catch (statusError) {
      console.error('Error updating agent statuses:', statusError);
    }
  }
}

// Helper functions
async function updateAgentStatus(sessionId, agentType, status, task = null, results = null) {
  try {
    // Always try to update agent status, with fallback if database unavailable
    const update = {
      status,
      lastUpdate: new Date(),
      ...(task && { currentTask: task }),
      ...(results && { 
        results: results, // Store as 'results' field (matches model)
        confidence: results.confidence || 0,
        processingTime: results.processingTime || 0
      })
    };

    if (process.env.MONGODB_URI) {
      await Agent.findOneAndUpdate(
        { sessionId, type: agentType },
        update
      );
      console.log(`✅ Updated ${agentType} agent: ${status}${results ? ' (with results)' : ''}`);
    } else {
      console.log(`⚠️  Demo mode: ${agentType} agent ${status}${results ? ' (results generated but not stored)' : ''}`);
    }
  } catch (error) {
    console.error('Agent status update error:', error);
  }
}

async function updateSessionStatus(sessionId, status) {
  try {
    if (!process.env.MONGODB_URI) return;
    
    await DiscoverySession.findOneAndUpdate(
      { sessionId },
      { sessionStatus: status, lastUpdate: new Date() }
    );
  } catch (error) {
    console.error('Session status update error:', error);
  }
}

async function updateSessionResults(sessionId, results) {
  try {
    if (!process.env.MONGODB_URI) return;
    
    await DiscoverySession.findOneAndUpdate(
      { sessionId },
      { ...results }
    );
  } catch (error) {
    console.error('Session results update error:', error);
  }
}

// Mock data for demo mode
function getMockSession(sessionId) {
  return {
    sessionId,
    originalQuery: {
      text: "Analyze turmeric for inflammation treatment",
      language: "en",
      voiceInput: false
    },
    sessionStatus: "completed",
    overallConfidence: 0.87,
    totalProcessingTime: 8500
  };
}

function getMockAgents(sessionId) {
  return [
    {
      id: `${sessionId}-literature`,
      name: "Literature Agent",
      type: "literature", 
      status: "completed",
      progress: 100,
      confidence: 0.85,
      currentTask: "Analysis complete",
      processingTime: 2000
    },
    {
      id: `${sessionId}-compound`,
      name: "Compound Agent",
      type: "compound",
      status: "completed", 
      progress: 100,
      confidence: 0.82,
      currentTask: "Molecular analysis complete",
      processingTime: 2500
    },
    {
      id: `${sessionId}-research`,
      name: "Research Agent", 
      type: "research",
      status: "completed",
      progress: 100,
      confidence: 0.88,
      currentTask: "Literature search complete",
      processingTime: 3000
    },
    {
      id: `${sessionId}-coordinator`,
      name: "Coordinator Agent",
      type: "coordinator",
      status: "completed",
      progress: 100, 
      confidence: 0.90,
      currentTask: "Synthesis complete",
      processingTime: 1500
    }
  ];
}

// Health check endpoint for AI service
router.get('/health', async (req, res) => {
  try {
    const healthStatus = await aiService.healthCheck();
    res.json({
      success: true,
      health: healthStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint for individual agents
router.post('/test-agent/:agentType', async (req, res) => {
  try {
    const { agentType } = req.params;
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    let result;
    const startTime = Date.now();

    switch (agentType) {
      case 'literature':
        result = await aiService.invokeLiteratureAgent(query);
        break;
      case 'compound':
        result = await aiService.invokeCompoundAgent(query);
        break;
      case 'research':
        result = await aiService.invokeResearchAgent(query);
        break;
      case 'multi':
        result = await aiService.runMultiAgentAnalysis(query);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid agent type. Use: literature, compound, research, or multi'
        });
    }

    res.json({
      success: true,
      agentType,
      query,
      result,
      totalTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;