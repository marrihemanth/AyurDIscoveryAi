const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Load environment variables from the server directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/database');
const agentRoutes = require('./routes/agents');
const searchRoutes = require('./routes/search');
const resultsRoutes = require('./routes/results');
const discoveryRoutes = require('./routes/discovery');
const speechRoutes = require('./routes/speechRoutes');

// Security middleware imports (temporarily disabled for debugging)
// const { generalLimiter, aiLimiter } = require('./middleware/rateLimiter');
// const { securityHeaders, sanitizeRequest } = require('./middleware/security');
const userRoutes = require('./routes/users');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://jubilant-lamp-5gx5jgjgvw9q34q74-3000.app.github.dev",
      process.env.CORS_ORIGIN
    ].filter(Boolean),
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://bedrock.us-east-1.amazonaws.com", "wss://localhost:*"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(morgan('combined'));
// app.use(securityHeaders);
// app.use(sanitizeRequest);

// Apply general rate limiting to all requests (disabled for development)
// app.use(generalLimiter);

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://jubilant-lamp-5gx5jgjgvw9q34q74-3000.app.github.dev",
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-Requested-With'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Additional JSON validation
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new Error('Invalid JSON payload');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  socket.on('agent_status_update', (data) => {
    socket.broadcast.emit('agent_status_update', data);
  });
});

// Make io available to routes
app.set('socketio', io);

// Routes (rate limiting disabled for development)
app.use('/api/agents', agentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/discovery', discoveryRoutes); // AI rate limiter disabled for dev
app.use('/api', speechRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0' 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AyurDiscovery AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      agents: '/api/agents',
      search: '/api/search',
      results: '/api/results',
      discovery: '/api/discovery',
      speech: '/api/synthesize-speech'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 AyurDiscovery AI Server running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;