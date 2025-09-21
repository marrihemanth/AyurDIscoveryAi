const mongoose = require('mongoose');

// Enhanced Compound Schema for Ayurvedic Drug Discovery
const compoundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  ayurvedicName: {
    type: String,
    index: true
  },
  teluguName: {
    type: String,
    index: true
  },
  sanskritName: {
    type: String
  },
  commonNames: [{
    language: String,
    name: String
  }],
  
  // Chemical Properties
  molecularFormula: String,
  molecularWeight: Number,
  structure: {
    smiles: String,
    inchi: String,
    image: String
  },
  
  // Ayurvedic Properties
  rasa: [{ // Taste
    type: String,
    enum: ['madhura', 'amla', 'lavana', 'katu', 'tikta', 'kashaya']
  }],
  virya: { // Potency
    type: String,
    enum: ['ushna', 'sheeta'] // Hot, Cold
  },
  vipaka: { // Post-digestive effect
    type: String,
    enum: ['madhura', 'amla', 'katu']
  },
  prabhava: String, // Special effect
  
  // Traditional Uses
  therapeuticUses: [{
    condition: String,
    teluguTerm: String,
    usage: String,
    dosage: String,
    preparation: String
  }],
  
  // Modern Analysis
  pharmacology: {
    bioavailability: Number,
    halfLife: Number,
    metabolism: String,
    excretion: String
  },
  
  // AI Analysis Results
  aiAnalysis: {
    geminiConfidence: { type: Number, min: 0, max: 1 },
    predictedTargets: [String],
    safetyProfile: String,
    drugLikeness: Number,
    novelty: Number,
    lastAnalyzed: { type: Date, default: Date.now }
  },
  
  // Source Information
  sources: [{
    type: { type: String, enum: ['traditional', 'research', 'clinical', 'patent'] },
    reference: String,
    reliability: { type: Number, min: 0, max: 1 }
  }],
  
  // Research Status
  researchStatus: {
    type: String,
    enum: ['unexplored', 'preliminary', 'preclinical', 'clinical', 'approved'],
    default: 'unexplored'
  },
  
  tags: [String],
  verified: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Text search index for multiple fields
compoundSchema.index({
  name: 'text',
  ayurvedicName: 'text',
  teluguName: 'text',
  'therapeuticUses.condition': 'text',
  tags: 'text'
});

module.exports = mongoose.model('Compound', compoundSchema);