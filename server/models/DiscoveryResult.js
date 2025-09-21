const mongoose = require('mongoose');

const discoveryResultSchema = new mongoose.Schema({
  agentId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  searchQuery: {
    type: String,
    required: true
  },
  searchType: {
    type: String,
    enum: ['compound', 'literature', 'general'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DiscoveryResult', discoveryResultSchema);