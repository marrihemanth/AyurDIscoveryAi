import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider, useTheme } from './theme/ThemeContext';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Profile from './components/Profile';
import CompleteProfile from './components/CompleteProfile';
import './App.css';

const AppContent: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;