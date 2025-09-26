/**
 * Advanced Confidence Scoring System for AyurDiscovery AI
 * Calculates real confidence based on content quality, source reliability, and cross-validation
 */

class ConfidenceCalculator {
  constructor() {
    this.weights = {
      contentQuality: 0.35,      // Content completeness and structure
      sourceReliability: 0.25,   // Data source quality
      crossValidation: 0.20,     // Agreement between agents
      queryMatching: 0.15,       // How well response addresses query
      modelPerformance: 0.05     // Model-specific reliability
    };
  }

  /**
   * Calculate comprehensive confidence score for an agent response
   */
  calculateAgentConfidence(response, query, agentType, context = {}) {
    const metrics = {
      contentQuality: this.assessContentQuality(response, agentType),
      sourceReliability: this.assessSourceReliability(response, agentType, context),
      queryMatching: this.assessQueryMatching(response, query),
      modelPerformance: this.assessModelPerformance(response, agentType, context)
    };

    // Calculate weighted score
    const weightedScore = Object.entries(metrics).reduce((total, [metric, score]) => {
      return total + (score * this.weights[metric]);
    }, 0);

    return {
      overall: Math.round(weightedScore * 100) / 100,
      breakdown: metrics,
      qualityIndicators: this.getQualityIndicators(metrics)
    };
  }

  /**
   * Calculate cross-validation confidence between multiple agents
   */
  calculateCrossValidation(responses, query) {
    if (responses.length < 2) return 0.5;

    const validResponses = responses.filter(r => r && r.response && r.response.length > 100);
    if (validResponses.length < 2) return 0.4;

    let totalAgreement = 0;
    let comparisonCount = 0;

    // Compare each pair of responses
    for (let i = 0; i < validResponses.length; i++) {
      for (let j = i + 1; j < validResponses.length; j++) {
        const agreement = this.calculateSemanticAgreement(
          validResponses[i].response, 
          validResponses[j].response,
          query
        );
        totalAgreement += agreement;
        comparisonCount++;
      }
    }

    return comparisonCount > 0 ? totalAgreement / comparisonCount : 0.5;
  }

  /**
   * Assess content quality based on structure, completeness, and depth
   */
  assessContentQuality(response, agentType) {
    if (!response || !response.response) return 0.1;

    const text = response.response;
    const metrics = {
      length: this.scoreLengthAdequacy(text, agentType),
      structure: this.scoreStructure(text),
      depth: this.scoreDepth(text, agentType),
      clarity: this.scoreClarity(text),
      completeness: this.scoreCompleteness(text, agentType)
    };

    return Object.values(metrics).reduce((a, b) => a + b, 0) / Object.keys(metrics).length;
  }

  /**
   * Assess source reliability based on data sources and method used
   */
  assessSourceReliability(response, agentType, context) {
    let baseScore = 0.5;

    // Check method used
    const method = response.method || context.method || '';
    switch (method) {
      case 'aws_sdk':
      case 'direct_knowledge_base':
        baseScore = 0.9;
        break;
      case 'structured_template':
      case 'structured_fallback':
        baseScore = 0.7;
        break;
      case 'error':
        baseScore = 0.1;
        break;
      default:
        baseScore = 0.6;
    }

    // Adjust based on agent type expertise
    const expertiseBonus = this.getAgentExpertiseBonus(agentType, response);
    
    // Check for specific quality indicators
    const qualityBonus = this.getSourceQualityBonus(response, agentType);

    return Math.min(0.95, baseScore + expertiseBonus + qualityBonus);
  }

  /**
   * Assess how well the response matches the query intent
   */
  assessQueryMatching(response, query) {
    if (!response || !response.response || !query) return 0.3;

    const text = response.response.toLowerCase();
    const queryTerms = this.extractKeyTerms(query.toLowerCase());
    
    // Check direct term coverage
    const termCoverage = queryTerms.filter(term => text.includes(term)).length / queryTerms.length;
    
    // Check semantic relevance
    const semanticRelevance = this.assessSemanticRelevance(text, query);
    
    // Check response completeness for query type
    const completenessScore = this.assessQueryCompleteness(text, query);

    return (termCoverage * 0.4 + semanticRelevance * 0.4 + completenessScore * 0.2);
  }

  /**
   * Assess model-specific performance indicators
   */
  assessModelPerformance(response, agentType, context) {
    let baseScore = 0.7;

    // Check processing time (faster often means more confident)
    const processingTime = response.processingTime || 0;
    const timeScore = this.scoreProcessingTime(processingTime, agentType);

    // Check for error indicators
    const errorPenalty = response.error ? 0.3 : 0;

    // Model-specific scoring
    const modelUsed = response.modelUsed || '';
    const modelScore = this.getModelReliabilityScore(modelUsed);

    return Math.max(0.1, baseScore + timeScore + modelScore - errorPenalty);
  }

  /**
   * Score length adequacy based on agent type expectations
   */
  scoreLengthAdequacy(text, agentType) {
    const length = text.length;
    const expectations = {
      'literature': { min: 300, optimal: 800, max: 2000 },
      'compound': { min: 500, optimal: 1200, max: 3000 },
      'research': { min: 400, optimal: 1000, max: 2500 },
      'coordinator': { min: 600, optimal: 1500, max: 4000 }
    };

    const exp = expectations[agentType] || expectations['research'];
    
    if (length < exp.min) return Math.max(0.1, length / exp.min);
    if (length > exp.max) return Math.max(0.7, 1 - (length - exp.max) / exp.max);
    if (length >= exp.optimal) return 1.0;
    
    return 0.8 + (length - exp.min) / (exp.optimal - exp.min) * 0.2;
  }

  /**
   * Score content structure (headers, lists, organization)
   */
  scoreStructure(text) {
    let score = 0.5;
    
    // Check for headers
    const headerCount = (text.match(/#{1,3}\s/g) || []).length;
    score += Math.min(0.2, headerCount * 0.05);
    
    // Check for lists
    const listItems = (text.match(/^[-*]\s/gm) || []).length;
    score += Math.min(0.15, listItems * 0.02);
    
    // Check for structured sections
    const sections = (text.match(/###?\s[A-Z][^#\n]*\n/g) || []).length;
    score += Math.min(0.2, sections * 0.04);
    
    // Check for emphasis (bold/italic)
    const emphasis = (text.match(/\*\*[^*]+\*\*|\*[^*]+\*/g) || []).length;
    score += Math.min(0.15, emphasis * 0.01);

    return Math.min(1.0, score);
  }

  /**
   * Score content depth based on technical terms and explanations
   */
  scoreDepth(text, agentType) {
    const indicators = {
      'literature': ['sanskrit', 'charaka', 'sushruta', 'ayurvedic', 'dosha', 'rasa', 'virya', 'prabhava'],
      'compound': ['chemical', 'molecular', 'mechanism', 'pathway', 'bioactive', 'pharmacokinetic', 'metabolite'],
      'research': ['clinical', 'study', 'trial', 'evidence', 'statistical', 'meta-analysis', 'pubmed'],
      'coordinator': ['synthesis', 'integration', 'correlation', 'validation', 'comprehensive']
    };

    const relevantTerms = indicators[agentType] || indicators['research'];
    const textLower = text.toLowerCase();
    const foundTerms = relevantTerms.filter(term => textLower.includes(term)).length;
    
    return Math.min(1.0, foundTerms / relevantTerms.length + 0.3);
  }

  /**
   * Score clarity based on readability and structure
   */
  scoreClarity(text) {
    // Simple readability metrics
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 0.1;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    // Optimal ranges for scientific content
    let clarityScore = 0.5;
    
    // Sentence length (10-25 words per sentence is optimal)
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
      clarityScore += 0.25;
    } else {
      clarityScore += Math.max(0, 0.25 - Math.abs(avgWordsPerSentence - 17.5) * 0.02);
    }
    
    // Word length (4-7 characters average is good for scientific content)
    if (avgWordLength >= 4 && avgWordLength <= 7) {
      clarityScore += 0.25;
    } else {
      clarityScore += Math.max(0, 0.25 - Math.abs(avgWordLength - 5.5) * 0.05);
    }

    return Math.min(1.0, clarityScore);
  }

  /**
   * Score completeness based on expected content for agent type
   */
  scoreCompleteness(text, agentType) {
    const requiredElements = {
      'literature': ['traditional', 'ayurvedic', 'classical', 'properties'],
      'compound': ['chemical', 'molecular', 'structure', 'mechanism'],
      'research': ['study', 'evidence', 'clinical', 'research'],
      'coordinator': ['synthesis', 'analysis', 'findings', 'recommendations']
    };

    const required = requiredElements[agentType] || requiredElements['research'];
    const textLower = text.toLowerCase();
    const coverage = required.filter(element => textLower.includes(element)).length / required.length;
    
    return Math.max(0.1, coverage);
  }

  /**
   * Calculate semantic agreement between two responses
   */
  calculateSemanticAgreement(response1, response2, query) {
    // Simple semantic similarity based on common terms and concepts
    const terms1 = this.extractKeyTerms(response1.toLowerCase());
    const terms2 = this.extractKeyTerms(response2.toLowerCase());
    
    if (terms1.length === 0 || terms2.length === 0) return 0.3;
    
    const commonTerms = terms1.filter(term => terms2.includes(term));
    const totalTerms = new Set([...terms1, ...terms2]).size;
    
    return commonTerms.length / totalTerms;
  }

  /**
   * Extract key terms from text
   */
  extractKeyTerms(text) {
    // Remove common words and extract meaningful terms
    const stopWords = new Set(['the', 'and', 'or', 'but', 'for', 'with', 'this', 'that', 'from', 'they', 'have', 'are', 'was', 'been', 'their']);
    
    return text
      .match(/\b[a-z]{3,}\b/g) || []
      .filter(word => !stopWords.has(word))
      .slice(0, 20); // Top 20 terms
  }

  /**
   * Assess semantic relevance to query
   */
  assessSemanticRelevance(text, query) {
    const queryTerms = this.extractKeyTerms(query.toLowerCase());
    const responseTerms = this.extractKeyTerms(text);
    
    if (queryTerms.length === 0) return 0.5;
    
    // Check for related terms and concepts
    const directMatches = queryTerms.filter(term => responseTerms.includes(term)).length;
    const relatedMatches = this.findRelatedTerms(queryTerms, responseTerms);
    
    return Math.min(1.0, (directMatches + relatedMatches * 0.5) / queryTerms.length);
  }

  /**
   * Find related terms using simple domain knowledge
   */
  findRelatedTerms(queryTerms, responseTerms) {
    const relations = {
      'turmeric': ['curcumin', 'haridra', 'inflammation', 'antioxidant'],
      'inflammation': ['anti-inflammatory', 'cytokine', 'nf-kb', 'cox'],
      'ayurvedic': ['traditional', 'classical', 'sanskrit', 'dosha'],
      'compound': ['chemical', 'molecular', 'structure', 'bioactive']
    };
    
    let relatedCount = 0;
    queryTerms.forEach(qTerm => {
      const related = relations[qTerm] || [];
      relatedCount += responseTerms.filter(rTerm => related.includes(rTerm)).length;
    });
    
    return relatedCount;
  }

  /**
   * Assess query completeness
   */
  assessQueryCompleteness(text, query) {
    // Check if response addresses the query type adequately
    const queryType = this.classifyQuery(query);
    const hasAppropriateContent = this.checkContentForQueryType(text, queryType);
    
    return hasAppropriateContent ? 0.8 : 0.4;
  }

  /**
   * Classify query type
   */
  classifyQuery(query) {
    const q = query.toLowerCase();
    if (q.includes('benefit') || q.includes('effect') || q.includes('use')) return 'benefits';
    if (q.includes('compound') || q.includes('chemical') || q.includes('structure')) return 'chemistry';
    if (q.includes('research') || q.includes('study') || q.includes('evidence')) return 'research';
    if (q.includes('traditional') || q.includes('ayurvedic') || q.includes('classical')) return 'traditional';
    return 'general';
  }

  /**
   * Check if content matches query type
   */
  checkContentForQueryType(text, queryType) {
    const indicators = {
      'benefits': ['benefit', 'effect', 'therapeutic', 'treatment', 'health'],
      'chemistry': ['chemical', 'compound', 'molecular', 'structure', 'active'],
      'research': ['study', 'research', 'clinical', 'trial', 'evidence'],
      'traditional': ['traditional', 'ayurvedic', 'classical', 'ancient', 'sanskrit'],
      'general': ['analysis', 'information', 'overview', 'summary']
    };
    
    const required = indicators[queryType] || indicators['general'];
    const textLower = text.toLowerCase();
    
    return required.some(indicator => textLower.includes(indicator));
  }

  /**
   * Score processing time appropriately
   */
  scoreProcessingTime(processingTime, agentType) {
    // Optimal processing times by agent type (in milliseconds)
    const optimalTimes = {
      'literature': 5000,    // 5 seconds
      'compound': 45000,     // 45 seconds (complex analysis)
      'research': 30000,     // 30 seconds
      'coordinator': 10000   // 10 seconds
    };
    
    const optimal = optimalTimes[agentType] || 20000;
    
    if (processingTime === 0) return 0; // No timing info
    if (processingTime > optimal * 3) return -0.1; // Too slow
    if (processingTime < optimal * 0.1) return -0.05; // Suspiciously fast
    
    return 0.05; // Good timing
  }

  /**
   * Get model reliability score
   */
  getModelReliabilityScore(modelUsed) {
    const scores = {
      'Nova Premier 1.0': 0.15,
      'AWS Knowledge Base': 0.1,
      'IBM Granite': 0.1,
      'Research Template': 0.05,
      'Structured Fallback': 0.02
    };
    
    return scores[modelUsed] || 0.05;
  }

  /**
   * Get agent expertise bonus
   */
  getAgentExpertiseBonus(agentType, response) {
    // Bonus for agents operating in their expertise area
    const text = (response.response || '').toLowerCase();
    
    const expertiseIndicators = {
      'literature': text.includes('classical') || text.includes('traditional') || text.includes('sanskrit'),
      'compound': text.includes('molecular') || text.includes('chemical') || text.includes('pharmacological'),
      'research': text.includes('clinical') || text.includes('evidence') || text.includes('study'),
      'coordinator': text.includes('synthesis') || text.includes('comprehensive') || text.includes('integrated')
    };
    
    return expertiseIndicators[agentType] ? 0.05 : 0;
  }

  /**
   * Get source quality bonus
   */
  getSourceQualityBonus(response, agentType) {
    const text = (response.response || '').toLowerCase();
    let bonus = 0;
    
    // Citations and references
    if (text.includes('study') || text.includes('research') || text.includes('published')) bonus += 0.02;
    if (text.includes('clinical trial') || text.includes('meta-analysis')) bonus += 0.03;
    if (text.includes('charaka') || text.includes('sushruta') || text.includes('classical')) bonus += 0.02;
    
    return Math.min(0.1, bonus);
  }

  /**
   * Get quality indicators for UI display
   */
  getQualityIndicators(metrics) {
    const indicators = [];
    
    if (metrics.contentQuality > 0.8) indicators.push('High Quality Content');
    if (metrics.sourceReliability > 0.8) indicators.push('Reliable Sources');
    if (metrics.queryMatching > 0.8) indicators.push('Relevant Response');
    if (metrics.modelPerformance > 0.8) indicators.push('Strong Model Performance');
    
    return indicators;
  }
}

module.exports = ConfidenceCalculator;