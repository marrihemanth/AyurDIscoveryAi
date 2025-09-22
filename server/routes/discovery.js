const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiMultiAgent');
const DiscoverySession = require('../models/DiscoverySession');
const Agent = require('../models/Agent');
const { v4: uuidv4 } = require('uuid');

// Start a new discovery session with multi-agent analysis
router.post('/analyze', async (req, res) => {
  try {
    const { query, language = 'en', voiceInput = false } = req.body;
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
    
    const result = await geminiService.processVoiceInput(transcript, language);
    
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
    // Update session status
    await updateSessionStatus(sessionId, 'processing');
    
    // Process voice input if needed
    let processedQuery = query;
    if (voiceInput) {
      await updateAgentStatus(sessionId, 'voice', 'processing', 'Processing voice input...');
      const voiceResult = await geminiService.processVoiceInput(query, language);
      processedQuery = voiceResult.processed || query;
      await updateAgentStatus(sessionId, 'voice', 'completed', null, voiceResult);
    }
    
    // Run agents in parallel for faster processing
    const [literatureResult, compoundResult, researchResult] = await Promise.all([
      // Literature Agent
      (async () => {
        await updateAgentStatus(sessionId, 'literature', 'processing', 'Analyzing traditional literature...');
        const result = await geminiService.analyzeLiterature(processedQuery, { language });
        await updateAgentStatus(sessionId, 'literature', 'completed', null, result);
        return result;
      })(),
      
      // Compound Agent
      (async () => {
        await updateAgentStatus(sessionId, 'compound', 'processing', 'Analyzing molecular compounds...');
        const result = await geminiService.analyzeCompound(processedQuery);
        await updateAgentStatus(sessionId, 'compound', 'completed', null, result);
        return result;
      })(),
      
      // Research Agent
      (async () => {
        await updateAgentStatus(sessionId, 'research', 'processing', 'Searching research literature...');
        const result = await geminiService.searchResearch(processedQuery);
        await updateAgentStatus(sessionId, 'research', 'completed', null, result);
        return result;
      })()
    ]);
    
    // Coordinator Agent - synthesize results
    await updateAgentStatus(sessionId, 'coordinator', 'processing', 'Synthesizing results...');
    const coordinatorResult = await geminiService.coordinateAnalysis(
      literatureResult, compoundResult, researchResult, processedQuery
    );
    await updateAgentStatus(sessionId, 'coordinator', 'completed', null, coordinatorResult);
    
    // Update final session
    await updateSessionResults(sessionId, {
      literatureResults: literatureResult,
      compoundResults: compoundResult,
      researchResults: researchResult,
      finalSynthesis: coordinatorResult
    });
    
    await updateSessionStatus(sessionId, 'completed');
    
  } catch (error) {
    console.error('Discovery session processing error:', error);
    await updateSessionStatus(sessionId, 'error');
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

module.exports = router;