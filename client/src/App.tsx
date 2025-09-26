import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider, useTheme } from './theme/ThemeContext';
import { AuthProvider } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Profile from './components/Profile';
import CompleteProfile from './components/CompleteProfile';
import SignUp from './components/SignUp';
import Login from './components/Login';
import GoogleRedirectHandler from './components/GoogleRedirectHandler';
import './App.css';

const AppContent: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <GoogleRedirectHandler />
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CustomThemeProvider>
          <AppContent />
        </CustomThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;