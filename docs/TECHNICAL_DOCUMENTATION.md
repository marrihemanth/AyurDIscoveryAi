# AyurDiscovery AI - Technical Documentation

## System Architecture

### Multi-Agent System Design

The AyurDiscovery AI platform employs a sophisticated multi-agent architecture designed to bridge traditional Ayurvedic knowledge with modern pharmaceutical research.

#### Agent Types

1. **Literature Agent**
   - Analyzes classical Ayurvedic texts (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya)
   - Extracts therapeutic properties and traditional formulations
   - Provides references to ancient medical knowledge

2. **Compound Agent**
   - Identifies active chemical compounds
   - Analyzes molecular properties and bioavailability
   - Provides compound-specific therapeutic mechanisms

3. **Cross-Reference Agent**
   - Integrates modern research with traditional knowledge
   - Validates traditional claims with contemporary studies
   - Provides evidence-based confidence levels

4. **Voice Agent**
   - Processes multilingual voice input (English/Telugu)
   - Extracts key terms and medical concepts
   - Supports accessibility for diverse user communities

5. **Coordinator Agent**
   - Orchestrates workflow between all agents
   - Manages task distribution and completion
   - Provides real-time status updates

### Technology Stack

#### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Custom hooks with React Context
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time Communication**: Socket.io-client

#### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (configurable)
- **Real-time Communication**: Socket.io
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment Management**: dotenv

#### API Design
- RESTful API architecture
- Real-time updates via WebSocket
- Comprehensive error handling
- Request/response logging

## Features Implementation

### Core Features

#### 1. Multi-Agent Visualization
- Real-time agent status monitoring
- Progress tracking with visual indicators
- Status badges (idle, processing, completed, error)
- Last updated timestamps

#### 2. Telugu Voice Input
- Dual language support (English/Telugu)
- Mock voice recognition for demonstration
- Voice-to-text processing
- Automatic language detection

#### 3. Search Interface
- Multi-type search (General, Compound, Literature)
- Query preprocessing and validation
- Real-time search status indicators
- Search history management

#### 4. Results Display
- Confidence-based result ranking
- Agent-specific result categorization
- Detailed analysis information
- Timestamp tracking

#### 5. Mobile Responsive Design
- Adaptive grid layout
- Touch-friendly interface
- Optimized for mobile devices
- Progressive Web App capabilities

### AI Services (Mock Implementation)

#### Literature Analysis Service
```javascript
// Simulates analysis of classical Ayurvedic texts
const literatureService = {
  analyzeQuery: (query) => ({
    sources: ['Charaka Samhita', 'Sushruta Samhita'],
    findings: 'Traditional therapeutic properties',
    confidence: 0.70-1.00
  })
}
```

#### Compound Analysis Service
```javascript
// Simulates chemical compound identification
const compoundService = {
  identifyCompounds: (query) => ({
    primaryCompound: 'Active ingredient',
    molecularWeight: 'Calculated value',
    bioavailability: 'Percentage',
    confidence: 0.75-1.00
  })
}
```

#### Cross-Reference Service
```javascript
// Simulates modern research validation
const crossReferenceService = {
  validateWithModernResearch: (query) => ({
    studyType: 'Clinical/Preclinical',
    evidenceLevel: 'High/Medium/Low',
    pubmedReferences: ['PMID:xxxxxxx'],
    confidence: 0.80-1.00
  })
}
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Currently implements mock authentication for demonstration. Production deployment should implement:
- JWT-based authentication
- Role-based access control
- API rate limiting

### Endpoints

#### Agents Management
```
GET    /api/agents           # Get all agents
GET    /api/agents/:id       # Get specific agent
PUT    /api/agents/:id       # Update agent status
POST   /api/agents/reset     # Reset all agents
```

#### Search Operations
```
POST   /api/search           # Initiate multi-agent search
GET    /api/search/status    # Get search capabilities
```

#### Results Management
```
GET    /api/results                    # Get discovery results
GET    /api/results/:id               # Get specific result
POST   /api/results                   # Add new result
DELETE /api/results/:id               # Delete result
GET    /api/results/stats/summary     # Get statistics
```

### WebSocket Events

#### Client → Server
- `agent_status_update`: Update agent status
- `search_initiated`: Search started
- `voice_input_received`: Voice input processed

#### Server → Client
- `agent_status_update`: Real-time agent updates
- `search_result`: New result available
- `agents_reset`: All agents reset
- `results_cleared`: Results cleared

## Development Setup

### Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB (optional)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd AyurDiscoveryAI

# Install dependencies
npm run install-all

# Setup environment
cp server/.env.example server/.env
```

### Development Commands
```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build for production
npm run build
```

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ayurdiscovery-ai
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000

# Client Configuration (optional)
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

### Production Build
```bash
# Build client
cd client && npm run build

# Start server
cd server && npm start
```

### Docker Deployment (Future Enhancement)
```dockerfile
# Multi-stage build for optimized production image
FROM node:16-alpine AS builder
# ... build configuration

FROM node:16-alpine AS production
# ... production configuration
```

### Cloud Deployment Options
- **Heroku**: Direct deployment with buildpacks
- **AWS**: EC2 with Load Balancer and RDS
- **Google Cloud**: App Engine with Cloud SQL
- **Azure**: App Service with Cosmos DB

## Testing Strategy

### Unit Testing
- Frontend: Jest + React Testing Library
- Backend: Jest + Supertest
- API endpoint testing
- Component isolation testing

### Integration Testing
- End-to-end user workflows
- Multi-agent coordination testing
- Real-time communication testing
- Voice input processing validation

### Performance Testing
- API response time benchmarking
- Frontend rendering performance
- Memory usage optimization
- Concurrent user handling

## Security Considerations

### Current Implementation
- CORS protection
- Input validation
- Environment variable protection
- Helmet security headers

### Production Requirements
- HTTPS encryption
- JWT token management
- Rate limiting
- SQL injection prevention
- XSS protection
- CSRF tokens

## Future Enhancements

### AI Integration
- Real AI/ML model integration
- Natural language processing
- Computer vision for text analysis
- Machine learning pipelines

### Advanced Features
- User authentication system
- Saved searches and favorites
- Export functionality (PDF, CSV)
- Advanced analytics dashboard
- Collaborative research tools

### Scalability
- Microservices architecture
- Container orchestration
- Database sharding
- CDN integration
- Caching layers

## Monitoring and Analytics

### Application Monitoring
- Error tracking with Sentry
- Performance monitoring with New Relic
- Uptime monitoring with Pingdom
- User analytics with Google Analytics

### Logging Strategy
- Structured logging with Winston
- Log aggregation with ELK stack
- Error alerting and notifications
- Performance metrics collection

## Contributing Guidelines

### Code Standards
- ESLint + Prettier configuration
- TypeScript strict mode
- Component documentation
- API documentation with Swagger

### Git Workflow
- Feature branch development
- Pull request reviews
- Automated testing on CI/CD
- Semantic versioning

---

This documentation provides a comprehensive overview of the AyurDiscovery AI system architecture, implementation details, and deployment guidelines for hackathon demonstration and future development.