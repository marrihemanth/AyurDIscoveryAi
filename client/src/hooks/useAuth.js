// Authentication Hook with User Document Management
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import userService from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDocument, setUserDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);
      
      try {
        if (firebaseUser) {
          console.log('🔥 Firebase User authenticated:', firebaseUser.email);
          setUser(firebaseUser);
          
          // Try to create/get user document
          try {
            const userDoc = await userService.createUserDocument(firebaseUser);
            setUserDocument(userDoc);
            console.log('✅ User document ready');
          } catch (docError) {
            console.error('❌ User document error:', docError);
            setError(`Firestore Error: ${docError.message}`);
            
            // Set debug info for troubleshooting
            setDebugInfo({
              authStatus: 'Authenticated',
              firestoreStatus: 'Error',
              errorCode: docError.code,
              errorMessage: docError.message,
              suggestion: docError.code === 'permission-denied' 
                ? 'Update Firestore security rules'
                : 'Check network connection'
            });
          }
        } else {
          console.log('🔥 User signed out');
          setUser(null);
          setUserDocument(null);
          setDebugInfo(null);
        }
      } catch (authError) {
        console.error('❌ Auth error:', authError);
        setError(`Authentication Error: ${authError.message}`);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Google sign-in successful:', result.user.email);
      
      // User document will be created by the auth state listener
      return result;
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      setError(`Sign-in Error: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      console.log('✅ Sign-out successful');
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      setError(`Sign-out Error: ${error.message}`);
      throw error;
    }
  };

  const incrementSearchCount = async (searchQuery) => {
    if (user) {
      try {
        await userService.incrementSearchCount(user.uid, searchQuery);
      } catch (error) {
        console.warn('⚠️  Search count increment failed:', error);
        // Don't throw error for analytics failure
      }
    }
  };

  const updatePreferences = async (preferences) => {
    if (user) {
      try {
        await userService.updateUserPreferences(user.uid, preferences);
        // Update local state
        setUserDocument(prev => ({
          ...prev,
          preferences: { ...prev.preferences, ...preferences }
        }));
      } catch (error) {
        console.error('❌ Preferences update failed:', error);
        throw error;
      }
    }
  };

  const debugFirebaseConnection = async () => {
    try {
      const debug = await userService.debugFirebaseConnection();
      setDebugInfo(debug);
      return debug;
    } catch (error) {
      const debug = {
        status: 'Debug Error',
        error: error.message
      };
      setDebugInfo(debug);
      return debug;
    }
  };

  const value = {
    user,
    userDocument,
    loading,
    error,
    debugInfo,
    signInWithGoogle,
    signOut,
    incrementSearchCount,
    updatePreferences,
    debugFirebaseConnection,
    
    // Helper properties
    isAuthenticated: !!user,
    hasUserDocument: !!userDocument,
    preferences: userDocument?.preferences || { theme: 'dark', language: 'en' }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;