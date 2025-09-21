const mongoose = require('mongoose');

// Discovery Session Schema - Tracks complete AI analysis sessions
const discoverySessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // User Query
  originalQuery: {
    text: String,
    language: { type: String, enum: ['en', 'te', 'mixed'], default: 'en' },
    voiceInput: Boolean,
    timestamp: { type: Date, default: Date.now }
  },
  
  // Agent Coordination
  agents: [{
    agentType: { type: String, enum: ['literature', 'compound', 'research', 'voice', 'coordinator'] },
    status: { type: String, enum: ['idle', 'processing', 'completed', 'error'] },
    startTime: Date,
    endTime: Date,
    processingTime: Number,
    confidence: { type: Number, min: 0, max: 1 }
  }],
  
  // Results from Each Agent
  literatureResults: {
    analysis: String,
    extractedCompounds: [String],
    traditionalKnowledge: String,
    modernCorrelations: String,
    teluguTerms: [{ original: String, translation: String }],
    confidence: { type: Number, min: 0, max: 1 }
  },
  
  compoundResults: {
    primaryCompounds: [{
      name: String,
      molecularAnalysis: String,
      drugLikeness: Number,
      safetyProfile: String,
      novelty: Number
    }],
    mechanismOfAction: String,
    targetPredictions: [String],
    confidence: { type: Number, min: 0, max: 1 }
  },
  
  researchResults: {
    relevantPapers: [{
      title: String,
      relevance: Number,
      summary: String,
      url: String
    }],
    evidenceLevel: String,
    gapsIdentified: [String],
    confidence: { type: Number, min: 0, max: 1 }
  },
  
  // Coordinator Synthesis
  finalSynthesis: {
    summary: String,
    keyFindings: [String],
    drugPotential: { type: String, enum: ['low', 'medium', 'high', 'very-high'] },
    nextSteps: [String],
    culturalConsiderations: String,
    riskAssessment: String,
    confidence: { type: Number, min: 0, max: 1 }
  },
  
  // Session Metadata
  sessionStatus: {
    type: String,
    enum: ['initiated', 'processing', 'completed', 'error'],
    default: 'initiated'
  },
  
  totalProcessingTime: Number,
  overallConfidence: { type: Number, min: 0, max: 1 },
  
  // Demo Features
  demoData: {
    isDemo: { type: Boolean, default: false },
    mockDelay: Number,
    preloadedResults: Boolean
  },
  
  tags: [String],
  bookmarked: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes for fast queries
discoverySessionSchema.index({ sessionStatus: 1, createdAt: -1 });
discoverySessionSchema.index({ 'originalQuery.language': 1 });
discoverySessionSchema.index({ overallConfidence: -1, createdAt: -1 });

module.exports = mongoose.model('DiscoverySession', discoverySessionSchema);