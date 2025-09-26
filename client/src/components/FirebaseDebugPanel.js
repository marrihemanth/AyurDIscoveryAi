// Firebase Debug Component
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Error,
  Warning,
  Info,
  BugReport,
  Security,
  Storage,
  Person
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const FirebaseDebugPanel = () => {
  let authData;
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth context error:', error);
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Authentication system not available. Please check the AuthProvider setup.
        </Typography>
      </Alert>
    );
  }
  
  const { 
    user, 
    userDocument, 
    debugInfo, 
    error: authError, 
    loading, 
    debugFirebaseConnection,
    isAuthenticated,
    hasUserDocument
  } = authData;
  
  const [debugResult, setDebugResult] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);

  const handleDebugConnection = async () => {
    setIsDebugging(true);
    try {
      const result = await debugFirebaseConnection();
      setDebugResult(result);
    } catch (error) {
      setDebugResult({
        status: 'Debug Failed',
        error: error.message
      });
    } finally {
      setIsDebugging(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Connected':
      case 'Authenticated':
        return <CheckCircle color="success" />;
      case 'Error':
      case 'Permission Denied':
        return <Error color="error" />;
      case 'Warning':
      case 'Missing':
        return <Warning color="warning" />;
      default:
        return <Info color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Connected':
      case 'Authenticated':
        return 'success';
      case 'Error':
      case 'Permission Denied':
        return 'error';
      case 'Warning':
      case 'Missing':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card 
      sx={{ 
        mt: 2, 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <BugReport color="primary" />
          <Typography variant="h6" color="primary">
            🔍 Firebase Debug Panel
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleDebugConnection}
            disabled={isDebugging}
            startIcon={<BugReport />}
          >
            {isDebugging ? 'Debugging...' : 'Run Debug'}
          </Button>
        </Box>

        {/* Authentication Status */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person />
              <Typography variant="subtitle1">Authentication Status</Typography>
              <Chip 
                label={isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                color={isAuthenticated ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  {getStatusIcon(isAuthenticated ? 'Authenticated' : 'Error')}
                </ListItemIcon>
                <ListItemText 
                  primary="Firebase Auth Status"
                  secondary={isAuthenticated ? 'User is authenticated' : 'No authenticated user'}
                />
              </ListItem>
              
              {user && (
                <>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText 
                      primary="User ID"
                      secondary={user.uid}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Email"
                      secondary={user.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Display Name"
                      secondary={user.displayName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(user.emailVerified ? 'Authenticated' : 'Warning')}
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Verified"
                      secondary={user.emailVerified ? 'Yes' : 'No'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Provider"
                      secondary={user.providerData[0]?.providerId || 'Unknown'}
                    />
                  </ListItem>
                </>
              )}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Firestore Status */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Storage />
              <Typography variant="subtitle1">Firestore Status</Typography>
              <Chip 
                label={hasUserDocument ? 'Connected' : 'Missing Document'}
                color={hasUserDocument ? 'success' : 'warning'}
                size="small"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  {getStatusIcon(hasUserDocument ? 'Connected' : 'Missing')}
                </ListItemIcon>
                <ListItemText 
                  primary="Firestore Document"
                  secondary={hasUserDocument ? 'User document exists' : 'User document missing'}
                />
              </ListItem>
              
              {userDocument && (
                <>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Document Created"
                      secondary={userDocument.createdAt?.toDate?.()?.toLocaleString() || 'Unknown'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText 
                      primary="Last Login"
                      secondary={userDocument.lastLogin?.toDate?.()?.toLocaleString() || 'Unknown'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Info color="info" /></ListItemIcon>
                    <ListItemText 
                      primary="Total Searches"
                      secondary={userDocument.usage?.totalSearches || 0}
                    />
                  </ListItem>
                </>
              )}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Error Information */}
        {authError && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Error color="error" />
                <Typography variant="subtitle1">Error Details</Typography>
                <Chip label="Error" color="error" size="small" />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2">{authError}</Typography>
              </Alert>
              
              {debugInfo && (
                <List dense>
                  <ListItem>
                    <ListItemIcon><Error color="error" /></ListItemIcon>
                    <ListItemText 
                      primary="Error Code"
                      secondary={debugInfo.errorCode || 'Unknown'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Info color="info" /></ListItemIcon>
                    <ListItemText 
                      primary="Suggestion"
                      secondary={debugInfo.suggestion || 'Check Firebase configuration'}
                    />
                  </ListItem>
                </List>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Debug Results */}
        {debugResult && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BugReport />
                <Typography variant="subtitle1">Debug Results</Typography>
                <Chip 
                  label={debugResult.status}
                  color={getStatusColor(debugResult.status)}
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                <pre>{JSON.stringify(debugResult, null, 2)}</pre>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Security Rules Help */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Security />
              <Typography variant="subtitle1">Security Rules Fix</Typography>
              <Chip label="Help" color="info" size="small" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                To fix Firestore permissions, update your security rules:
              </Typography>
            </Alert>
            
            <Box sx={{ 
              background: 'rgba(0, 0, 0, 0.3)', 
              p: 2, 
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              overflow: 'auto'
            }}>
              <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to access discovery results
    match /discoveryResults/{document} {
      allow read, write: if request.auth != null;
    }
  }
}`}</pre>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Go to Firebase Console → Firestore Database → Rules → Update and Publish
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FirebaseDebugPanel;