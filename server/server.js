const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/database');
const agentRoutes = require('./routes/agents');
const searchRoutes = require('./routes/search');
const resultsRoutes = require('./routes/results');
const discoveryRoutes = require('./routes/discovery');
const speechRoutes = require('./routes/speechRoutes');

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

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://jubilant-lamp-5gx5jgjgvw9q34q74-3000.app.github.dev",
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/discovery', discoveryRoutes);
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