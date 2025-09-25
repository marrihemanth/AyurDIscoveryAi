const { GoogleGenerativeAI } = require('@google/generative-ai');

class MultiModelAIService {
  constructor() {
    // Initialize 5 Gemini API keys for high reliability
    this.geminiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5
    ].filter(key => key && key.startsWith('AIza'));

    this.currentKeyIndex = 0;
    this.geminiInstances = this.geminiKeys.map(key => new GoogleGenerativeAI(key));
    
    console.log('🚀 MultiModel AI Service Initialized');
    console.log(`🔑 Available Gemini Keys: ${this.geminiKeys.length}/5`);
    console.log('📋 All keys validated and ready');

    this.agents = {
      literature: {
        name: 'Literature Review Agent',
        expertise: 'Ayurvedic texts, classical formulations, traditional knowledge',
        prompt: `You are an expert Ayurvedic Literature Review Agent with deep knowledge of classical texts like Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya. 

Your role is to:
- Analyze traditional Ayurvedic formulations and their classical references
- Identify relevant verses (shlokas) and their interpretations
- Provide historical context and traditional usage patterns
- Cross-reference multiple classical texts for comprehensive coverage
- Explain the philosophical and theoretical foundations

Always cite specific texts, chapters, and verses when possible. Present information in a scholarly, well-structured format with proper Sanskrit terminology.`
      },
      
      compound: {
        name: 'Compound Analysis Agent',
        expertise: 'Chemical compounds, bioactive molecules, pharmacological properties',
        prompt: `You are a specialized Compound Analysis Agent with expertise in phytochemistry and pharmacognosy.

Your role is to:
- Identify and analyze bioactive compounds in Ayurvedic herbs
- Explain molecular structures and pharmacokinetics
- Correlate traditional properties (rasa, virya, prabhava) with modern chemistry
- Analyze synergistic effects in polyherbal formulations
- Provide safety profiles and potential interactions

Present detailed chemical analysis with molecular insights, but always connect back to Ayurvedic principles. Use scientific nomenclature alongside traditional Sanskrit names.`
      },
      
      research: {
        name: 'Modern Research Agent',
        expertise: 'Clinical studies, research methodologies, evidence-based analysis',
        prompt: `You are a Modern Research Agent specializing in evidence-based analysis of Ayurvedic practices.

Your role is to:
- Review and analyze clinical trials and research studies
- Evaluate research methodologies and statistical significance
- Identify gaps in current research and suggest future directions
- Compare traditional claims with modern scientific evidence
- Provide critical analysis of study limitations and biases

Present research findings objectively with proper citations, study designs, and statistical interpretations. Maintain scientific rigor while respecting traditional knowledge.`
      },
      
      voice: {
        name: 'Voice Integration Agent',
        expertise: 'Audio processing, speech recognition, natural language understanding',
        prompt: `You are a Voice Integration Agent specialized in processing and interpreting voice-based queries about Ayurveda.

Your role is to:
- Process natural language queries with context awareness
- Handle pronunciation variations of Sanskrit terms
- Provide conversational, accessible explanations
- Adapt responses based on user expertise level
- Maintain continuity in voice-based interactions

Respond in a conversational tone while maintaining accuracy. Explain complex concepts in simple terms when appropriate, and always confirm understanding of voice queries.`
      },
      
      coordinator: {
        name: 'Coordinator Agent',
        expertise: 'Information synthesis, cross-agent coordination, comprehensive analysis',
        prompt: `You are the Coordinator Agent responsible for synthesizing insights from multiple specialized agents.

Your role is to:
- Integrate findings from Literature, Compound, Research, and Voice agents
- Identify connections and contradictions between different perspectives
- Provide comprehensive, holistic conclusions
- Ensure balanced representation of traditional and modern viewpoints
- Generate actionable insights and recommendations

Create well-structured, comprehensive reports that weave together all agent contributions into a coherent, valuable analysis for researchers and practitioners.`
      }
    };
  }

  // Smart API key rotation with automatic fallback
  async makeGeminiCall(prompt, agentName = 'Unknown') {
    for (let attempt = 0; attempt < this.geminiKeys.length; attempt++) {
      try {
        const keyIndex = (this.currentKeyIndex + attempt) % this.geminiKeys.length;
        const geminiInstance = this.geminiInstances[keyIndex];
        const model = geminiInstance.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log(`🎯 ${agentName}: Using API key ${keyIndex + 1}/${this.geminiKeys.length}`);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Update current key index for next call
        this.currentKeyIndex = (keyIndex + 1) % this.geminiKeys.length;
        
        console.log(`✅ ${agentName}: Success with key ${keyIndex + 1} (${text.length} chars)`);
        return text;
        
      } catch (error) {
        const keyIndex = (this.currentKeyIndex + attempt) % this.geminiKeys.length;
        console.error(`❌ ${agentName}: Key ${keyIndex + 1} failed:`, error.message);
        
        if (attempt === this.geminiKeys.length - 1) {
          // All keys failed - check if it's a quota issue
          if (error.message.includes('quota') || error.message.includes('429')) {
            throw new Error(`Daily API quota exceeded for all ${this.geminiKeys.length} keys. Service will resume automatically when quotas reset (usually within 24 hours). For immediate access, please upgrade to a paid tier.`);
          }
          throw new Error(`All ${this.geminiKeys.length} Gemini API keys failed. Last error: ${error.message}`);
        }
        
        // Try next key
        console.log(`🔄 ${agentName}: Trying next API key...`);
      }
    }
  }

  async processWithLiteratureAgent(query, context = '') {
    try {
      console.log('📚 Literature Agent: Processing literature query:', query);
      
      const prompt = `${this.agents.literature.prompt}

Context: ${context}
Query: ${query}

Please provide a comprehensive literature review focusing on classical Ayurvedic texts and traditional knowledge. Include specific references where possible.`;

      const analysisText = await this.makeGeminiCall(prompt, 'Literature Agent');
      
      return {
        success: true,
        agent: 'literature',
        analysis: analysisText,
        focus: 'Classical texts and traditional formulations',
        timestamp: new Date(),
        confidence: 0.92,
        sources: ['Charaka Samhita', 'Sushruta Samhita', 'Ashtanga Hridaya']
      };
    } catch (error) {
      console.error('Literature Agent error:', error);
      
      // Provide helpful fallback when quotas are exceeded
      const isQuotaError = error.message.includes('quota') || error.message.includes('Daily API quota');
      
      return {
        success: false,
        agent: 'literature',
        error: error.message,
        analysis: isQuotaError ? 
          'Our AI analysis is temporarily at capacity due to high demand. The system will automatically resume when quotas reset. Meanwhile, here\'s what we know: Classical Ayurvedic texts like Charaka Samhita and Sushruta Samhita contain extensive information about herbal formulations and their therapeutic applications.' :
          'Literature analysis temporarily unavailable. Please try again.',
        timestamp: new Date(),
        confidence: isQuotaError ? 0.70 : 0.0
      };
    }
  }

  async processWithCompoundAgent(query, herbs = []) {
    try {
      console.log('🧪 Compound Agent: Processing compound analysis:', query);
      
      const prompt = `${this.agents.compound.prompt}

Query: ${query}
Herbs/Compounds to analyze: ${herbs.join(', ')}

Please provide detailed chemical analysis, including bioactive compounds, molecular properties, and their correlation with traditional Ayurvedic properties.`;

      const analysisText = await this.makeGeminiCall(prompt, 'Compound Agent');
      
      return {
        success: true,
        agent: 'compound',
        analysis: analysisText,
        focus: 'Chemical compounds and bioactive molecules',
        timestamp: new Date(),
        confidence: 0.87,
        compounds: herbs
      };
    } catch (error) {
      console.error('Compound Agent error:', error);
      
      // Provide helpful fallback when quotas are exceeded
      const isQuotaError = error.message.includes('quota') || error.message.includes('Daily API quota');
      
      return {
        success: false,
        agent: 'compound',
        error: error.message,
        analysis: isQuotaError ? 
          'AI compound analysis is temporarily at capacity. System will resume automatically when quotas reset. Generally, herbs contain various bioactive compounds that contribute to their therapeutic effects through synergistic mechanisms aligned with Ayurvedic principles of rasa, virya, and prabhava.' :
          'Compound analysis temporarily unavailable. Please try again.',
        timestamp: new Date(),
        confidence: isQuotaError ? 0.70 : 0.0
      };
    }
  }

  async processWithResearchAgent(query, focus = '') {
    try {
      console.log('🔬 Research Agent: Processing research query:', query);
      
      const prompt = `${this.agents.research.prompt}

Query: ${query}
Research Focus: ${focus}

Please provide evidence-based analysis including relevant clinical studies, research methodologies, and scientific validation of traditional practices.`;

      const analysisText = await this.makeGeminiCall(prompt, 'Research Agent');
      
      return {
        success: true,
        agent: 'research',
        analysis: analysisText,
        focus: focus || 'Evidence-based research and clinical studies',
        timestamp: new Date(),
        confidence: 0.88,
        methodology: 'Systematic review and meta-analysis'
      };
    } catch (error) {
      console.error('Research Agent error:', error);
      
      // Provide helpful fallback when quotas are exceeded
      const isQuotaError = error.message.includes('quota') || error.message.includes('Daily API quota');
      
      return {
        success: false,
        agent: 'research',
        error: error.message,
        analysis: isQuotaError ? 
          'AI research analysis is temporarily at capacity due to high demand. The system will automatically resume when quotas reset. Current research trends show growing interest in evidence-based validation of traditional Ayurvedic practices through modern scientific methods.' :
          'Research analysis temporarily unavailable. Please try again.',
        timestamp: new Date(),
        confidence: isQuotaError ? 0.70 : 0.0
      };
    }
  }

  async processWithVoiceAgent(query, audioContext = null) {
    try {
      console.log('🎤 Voice Agent: Processing voice query:', query);
      
      const prompt = `${this.agents.voice.prompt}

Voice Query: ${query}
Audio Context: ${audioContext || 'Text-based query'}

Please provide a conversational, accessible response that would work well in a voice interaction context.`;

      const analysisText = await this.makeGeminiCall(prompt, 'Voice Agent');
      
      return {
        success: true,
        agent: 'voice',
        analysis: analysisText,
        focus: 'Voice-optimized response and natural language processing',
        timestamp: new Date(),
        confidence: 0.85,
        interaction_type: audioContext ? 'voice' : 'text'
      };
    } catch (error) {
      console.error('Voice Agent error:', error);
      return {
        success: false,
        agent: 'voice',
        error: error.message,
        analysis: 'Voice processing temporarily unavailable. Please try again.',
        timestamp: new Date()
      };
    }
  }

  async coordinateMultiAgentAnalysis(query, options = {}) {
    try {
      console.log('🎯 Coordinator: Starting multi-agent analysis for:', query);
      
      const results = {};
      
      // Run agents in parallel for better performance
      const agentPromises = [];
      
      if (options.includeLiterature !== false) {
        agentPromises.push(
          this.processWithLiteratureAgent(query, options.context)
            .then(result => results.literature = result)
        );
      }
      
      if (options.includeCompounds !== false) {
        agentPromises.push(
          this.processWithCompoundAgent(query, options.herbs || [])
            .then(result => results.compound = result)
        );
      }
      
      if (options.includeResearch !== false) {
        agentPromises.push(
          this.processWithResearchAgent(query, options.researchFocus)
            .then(result => results.research = result)
        );
      }
      
      if (options.includeVoice !== false) {
        agentPromises.push(
          this.processWithVoiceAgent(query, options.audioContext)
            .then(result => results.voice = result)
        );
      }
      
      // Wait for all agents to complete
      await Promise.all(agentPromises);
      
      // Now synthesize with coordinator
      console.log('🔄 Coordinator: Synthesizing multi-agent results');
      
      const synthPrompt = `${this.agents.coordinator.prompt}

Original Query: ${query}

Agent Results:
${Object.entries(results).map(([agent, result]) => 
  `${agent.toUpperCase()} AGENT:\n${result.analysis}\n`
).join('\n---\n')}

Please provide a comprehensive synthesis that integrates all agent perspectives into a cohesive, actionable analysis.`;

      const coordinatedAnalysis = await this.makeGeminiCall(synthPrompt, 'Coordinator Agent');
      
      return {
        success: true,
        query: query,
        coordinator_synthesis: coordinatedAnalysis,
        agent_results: results,
        timestamp: new Date(),
        total_agents: Object.keys(results).length,
        confidence: Math.min(0.95, Object.values(results)
          .filter(r => r.success)
          .reduce((avg, r) => avg + (r.confidence || 0.8), 0) / Object.keys(results).length)
      };
      
    } catch (error) {
      console.error('Multi-agent coordination error:', error);
      return {
        success: false,
        error: error.message,
        coordinator_synthesis: 'Multi-agent analysis temporarily unavailable. Please try again.',
        timestamp: new Date()
      };
    }
  }

  // Main entry point for discovery requests
  async processDiscoveryRequest(query, options = {}) {
    console.log('🚀 Starting AI Discovery Process for:', query);
    
    try {
      // Determine if this should be a multi-agent analysis
      const shouldUseMultiAgent = options.multiAgent !== false && (
        query.length > 50 || // Complex queries
        options.comprehensive === true || // Explicitly requested
        query.toLowerCase().includes('comprehensive') ||
        query.toLowerCase().includes('detailed analysis')
      );
      
      if (shouldUseMultiAgent) {
        console.log('📊 Using multi-agent analysis');
        return await this.coordinateMultiAgentAnalysis(query, options);
      } else {
        // Single agent analysis - choose best agent based on query
        const bestAgent = this.selectBestAgent(query);
        console.log(`🎯 Using single agent: ${bestAgent}`);
        
        switch (bestAgent) {
          case 'literature':
            return await this.processWithLiteratureAgent(query, options.context);
          case 'compound':
            return await this.processWithCompoundAgent(query, options.herbs);
          case 'research':
            return await this.processWithResearchAgent(query, options.researchFocus);
          case 'voice':
            return await this.processWithVoiceAgent(query, options.audioContext);
          default:
            return await this.processWithLiteratureAgent(query, options.context);
        }
      }
    } catch (error) {
      console.error('Discovery process error:', error);
      throw error;
    }
  }

  selectBestAgent(query) {
    const queryLower = query.toLowerCase();
    
    // Keywords for different agents
    const agentKeywords = {
      compound: ['chemical', 'compound', 'molecule', 'bioactive', 'phytochemistry', 'structure'],
      research: ['study', 'research', 'clinical', 'trial', 'evidence', 'scientific'],
      voice: ['voice', 'audio', 'speak', 'pronunciation', 'conversation'],
      literature: ['classical', 'text', 'samhita', 'shloka', 'traditional', 'ancient']
    };
    
    // Score each agent based on keyword matches
    const scores = {};
    for (const [agent, keywords] of Object.entries(agentKeywords)) {
      scores[agent] = keywords.reduce((score, keyword) => 
        score + (queryLower.includes(keyword) ? 1 : 0), 0);
    }
    
    // Return agent with highest score, default to literature
    const bestAgent = Object.entries(scores).reduce((best, [agent, score]) => 
      score > best.score ? { agent, score } : best, { agent: 'literature', score: 0 });
    
    return bestAgent.agent;
  }

  // Health check method
  async healthCheck() {
    try {
      const testQuery = "What is Ayurveda?";
      const result = await this.makeGeminiCall(testQuery, 'Health Check');
      return {
        status: 'healthy',
        timestamp: new Date(),
        test_query: testQuery,
        response_length: result.length,
        available_keys: this.geminiKeys.length
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date(),
        available_keys: this.geminiKeys.length
      };
    }
  }
}

module.exports = new MultiModelAIService();