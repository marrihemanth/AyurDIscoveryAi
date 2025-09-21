const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Pro connection with advanced options
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayurdiscovery-ai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false // Disable mongoose buffering
    });

    console.log(`� MongoDB Pro Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    // For demo purposes, continue without database
    console.log('💡 Running in demo mode without database');
  }
};

// Create database indexes for optimal performance
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Compound search index for full-text search
    await db.collection('compounds').createIndex({ 
      name: 'text', 
      ayurvedicName: 'text', 
      properties: 'text',
      therapeuticUses: 'text',
      teluguName: 'text'
    });
    
    // Research papers index
    await db.collection('researchpapers').createIndex({
      title: 'text',
      abstract: 'text',
      keywords: 'text',
      authors: 'text'
    });
    
    // Discovery results index for fast queries
    await db.collection('discoveryresults').createIndex({
      'compound.name': 1,
      'analysis.confidence': -1,
      createdAt: -1
    });
    
    // Agent communications index
    await db.collection('agentcommunications').createIndex({
      sessionId: 1,
      timestamp: -1,
      agentType: 1
    });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.log('⚠️  Index creation warning:', error.message);
  }
};

module.exports = connectDB;