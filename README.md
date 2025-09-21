# AyurDiscovery AI

Professional MERN stack multiagent AI system for Ayurvedic drug discovery, combining traditional medicine knowledge with modern research methodologies.

## 🌿 Overview

AyurDiscovery AI is an innovative platform that leverages artificial intelligence to bridge the gap between traditional Ayurvedic medicine and modern pharmaceutical research. The system employs a multi-agent architecture to process and analyze various data sources, providing comprehensive insights for drug discovery.

## 🏗️ Architecture

### Multi-Agent System
- **Literature Agent**: Analyzes classical Ayurvedic texts (Charaka Samhita, Sushruta Samhita, etc.)
- **Compound Agent**: Identifies and analyzes chemical compounds and their properties
- **Cross-Reference Agent**: Integrates modern research with traditional knowledge
- **Voice Agent**: Processes Telugu and English voice inputs for accessibility
- **Coordinator Agent**: Orchestrates the workflow between all agents

### Technology Stack
- **Frontend**: React 18 + TypeScript + Material-UI
- **Backend**: Node.js + Express + Socket.io
- **Database**: MongoDB (configurable)
- **AI Services**: Mock AI services for demonstration
- **Language Support**: English and Telugu (తెలుగు)

## 🚀 Features

### Core Features
- ✅ Real-time multi-agent visualization
- ✅ Telugu voice input support
- ✅ Mobile-responsive design
- ✅ RESTful API architecture
- ✅ Socket.io for real-time updates
- ✅ Professional UI/UX with Material-UI

### Agent Capabilities
- **Literature Analysis**: Search classical Ayurvedic texts
- **Compound Research**: Analyze chemical properties and interactions
- **Modern Research Integration**: Cross-reference with contemporary studies
- **Voice Processing**: Support for Telugu and English voice commands
- **Coordinated Discovery**: Intelligent orchestration of research tasks

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional for full functionality)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PreethamYT/AyurDiscoveryAI.git
   cd AyurDiscoveryAI
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all dependencies (client + server)
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Run both client and server concurrently
npm run dev
```

### Individual Services
```bash
# Run only the backend server
npm run server

# Run only the frontend client
npm run client
```

### Production Build
```bash
# Build the client
npm run build
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get specific agent
- `PUT /api/agents/:id` - Update agent status
- `POST /api/agents/reset` - Reset all agents

#### Search
- `POST /api/search` - Initiate multi-agent search
- `GET /api/search/status` - Get search capabilities

#### Results
- `GET /api/results` - Get discovery results
- `GET /api/results/:id` - Get specific result
- `POST /api/results` - Add new result
- `DELETE /api/results/:id` - Delete result
- `GET /api/results/stats/summary` - Get statistics

### Example API Usage

```javascript
// Perform a search
const response = await fetch('http://localhost:5000/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'turmeric anti-inflammatory properties',
    type: 'general',
    language: 'english'
  })
});
```

## 🎯 Usage Examples

### Text Search
1. Enter a query in the search interface
2. Select search type (General, Compound, Literature)
3. Click "Search" to initiate multi-agent analysis
4. View real-time agent status and results

### Voice Search (Telugu/English)
1. Select language in Voice Input section
2. Click "Start Voice Input"
3. Speak your query in selected language
4. System automatically processes and searches

### Example Queries
- **English**: "ashwagandha stress relief", "neem antibacterial properties"
- **Telugu**: "పసుపు వైద్య గుణాలు" (turmeric medicinal properties)

## 🏗️ Project Structure

```
AyurDiscoveryAI/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript definitions
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database and app config
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   └── server.js           # Main server file
├── docs/                   # Documentation
├── package.json            # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables (server/.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ayurdiscovery-ai
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

### Client Configuration
- API URL: Set `REACT_APP_API_URL` in client/.env
- Default: `http://localhost:5000/api`

## 🧪 Demo Features

The application includes mock AI services for demonstration:
- Simulated literature analysis from classical texts
- Mock compound analysis with chemical properties
- Fake modern research cross-referencing
- Telugu voice recognition simulation
- Real-time agent status updates

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
1. Build the client: `npm run build`
2. Set production environment variables
3. Start the server: `npm run server`
4. Serve client build files through a web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Hackathon Showcase

This project is designed for hackathon demonstration, showcasing:
- **Innovation**: Bridging traditional and modern medicine
- **Technology**: Modern MERN stack with AI integration
- **Accessibility**: Multi-language support including Telugu
- **Scalability**: Microservices-ready architecture
- **User Experience**: Professional, responsive interface

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**AyurDiscovery AI** - Bridging Traditional Wisdom with Modern Science 🌿🔬