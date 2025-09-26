import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { CustomThemeProvider, useTheme } from './theme/ThemeContext';
import { AuthProvider } from './hooks/useAuth';
import { AuthProvider as NewAuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import AccessPage from './pages/AccessPage';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Profile from './components/Profile';
import CompleteProfile from './components/CompleteProfile';
import SignUp from './components/SignUp';
import Login from './components/Login';
import GoogleRedirectHandler from './components/GoogleRedirectHandler';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const AppContent: React.FC = () => {
  const { currentTheme, toggleTheme, isDarkMode } = useTheme();

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <GoogleRedirectHandler />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/access" element={<AccessPage />} />
              
              {/* Legacy Routes - Redirect to new structure */}
              <Route path="/dashboard" element={<AccessPage />} />
              <Route path="/signup" element={<AccessPage />} />
              <Route path="/login" element={<AccessPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/complete-profile" 
                element={
                  <ProtectedRoute>
                    <CompleteProfile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NewAuthProvider>
          <CustomThemeProvider>
            <AppContent />
          </CustomThemeProvider>
        </NewAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;