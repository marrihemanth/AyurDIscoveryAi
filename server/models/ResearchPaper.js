const mongoose = require('mongoose');

// Research Paper and Literature Schema
const researchPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  authors: [String],
  journal: String,
  year: Number,
  doi: String,
  pmid: String,
  
  abstract: {
    type: String,
    required: true
  },
  
  keywords: [String],
  
  // Categorization
  researchType: {
    type: String,
    enum: ['traditional', 'modern', 'clinical', 'review', 'meta-analysis', 'case-study']
  },
  
  // Ayurvedic Context
  ayurvedicContext: {
    hasTraditionalReference: Boolean,
    traditionalTerms: [String],
    teluguTerms: [String],
    prakritis: [String], // Body constitutions
    doshas: [String] // Vata, Pitta, Kapha
  },
  
  // Compounds Mentioned
  compounds: [{
    name: String,
    role: { type: String, enum: ['primary', 'secondary', 'control'] },
    dosage: String,
    effect: String
  }],
  
  // Study Details
  studyDetails: {
    sampleSize: Number,
    duration: String,
    methodology: String,
    results: String,
    conclusions: String,
    limitations: String
  },
  
  // AI Analysis
  aiExtraction: {
    geminiAnalysis: String,
    extractedCompounds: [String],
    therapeuticTargets: [String],
    confidence: { type: Number, min: 0, max: 1 },
    relevanceScore: { type: Number, min: 0, max: 1 },
    lastAnalyzed: { type: Date, default: Date.now }
  },
  
  // Quality Metrics
  impactFactor: Number,
  citationCount: Number,
  reliability: { type: Number, min: 0, max: 1, default: 0.5 },
  
  // Cross-references
  relatedPapers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ResearchPaper' }],
  relatedCompounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compound' }],
  
  tags: [String],
  verified: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Text search index
researchPaperSchema.index({
  title: 'text',
  abstract: 'text',
  keywords: 'text',
  'ayurvedicContext.traditionalTerms': 'text',
  'ayurvedicContext.teluguTerms': 'text'
});

// Research quality index
researchPaperSchema.index({ reliability: -1, year: -1 });

module.exports = mongoose.model('ResearchPaper', researchPaperSchema);