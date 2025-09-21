const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['literature', 'compound', 'research', 'voice', 'coordinator'],
    required: true
  },
  status: {
    type: String,
    enum: ['idle', 'processing', 'completed', 'error', 'thinking'],
    default: 'idle'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  currentTask: {
    type: String,
    default: null
  },
  sessionId: {
    type: String,
    required: true
  },
  aiModel: {
    type: String,
    default: 'gemini-pro'
  },
  processingTime: {
    type: Number,
    default: 0
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  communications: [{
    toAgent: String,
    fromAgent: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    messageType: { type: String, enum: ['request', 'response', 'data', 'status'] }
  }]
}, {
  timestamps: true
});

// Index for fast agent lookups
agentSchema.index({ sessionId: 1, type: 1 });
agentSchema.index({ status: 1, lastUpdate: -1 });

module.exports = mongoose.model('Agent', agentSchema);