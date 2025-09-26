// Firebase User Service - Handle user document creation and management
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

class UserService {
  // Create user document if it doesn't exist
  async createUserDocument(user) {
    if (!user) return null;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user document
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          provider: user.providerData[0]?.providerId || 'unknown',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          preferences: {
            theme: 'dark',
            language: 'en',
            notifications: true
          },
          usage: {
            totalSearches: 0,
            lastSearch: null,
            favoriteAgents: [],
            searchHistory: []
          }
        };
        
        await setDoc(userRef, userData);
        console.log('✅ User document created successfully');
        return userData;
      } else {
        // Update last login
        await setDoc(userRef, {
          lastLogin: serverTimestamp(),
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        }, { merge: true });
        
        console.log('✅ User document updated');
        return userSnap.data();
      }
    } catch (error) {
      console.error('❌ Error creating/updating user document:', error);
      
      // Provide detailed error information
      if (error.code === 'permission-denied') {
        console.error('🔒 Firestore Permission Denied - Check security rules');
        console.error('Expected rule: allow read, write: if request.auth != null && request.auth.uid == userId;');
      }
      
      throw error;
    }
  }
  
  // Get user document
  async getUserDocument(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        console.log('📄 User document does not exist');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting user document:', error);
      throw error;
    }
  }
  
  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        preferences: {
          ...preferences,
          updatedAt: serverTimestamp()
        }
      }, { merge: true });
      
      console.log('✅ User preferences updated');
    } catch (error) {
      console.error('❌ Error updating user preferences:', error);
      throw error;
    }
  }
  
  // Increment search count
  async incrementSearchCount(userId, searchQuery) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentUsage = userDoc.data().usage || {};
        const searchHistory = currentUsage.searchHistory || [];
        
        // Add new search to history (keep last 10)
        searchHistory.unshift({
          query: searchQuery,
          timestamp: serverTimestamp()
        });
        
        await setDoc(userRef, {
          usage: {
            ...currentUsage,
            totalSearches: (currentUsage.totalSearches || 0) + 1,
            lastSearch: serverTimestamp(),
            searchHistory: searchHistory.slice(0, 10) // Keep last 10 searches
          }
        }, { merge: true });
        
        console.log('✅ Search count incremented');
      }
    } catch (error) {
      console.error('❌ Error incrementing search count:', error);
      // Don't throw error for analytics failure
    }
  }
  
  // Debug Firebase connection
  async debugFirebaseConnection() {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return {
        status: 'Not Authenticated',
        error: 'No current user'
      };
    }
    
    try {
      // Test Firestore connection
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      return {
        status: 'Connected',
        userId: currentUser.uid,
        documentExists: userSnap.exists(),
        userData: userSnap.exists() ? userSnap.data() : null
      };
    } catch (error) {
      return {
        status: 'Connection Error',
        error: error.message,
        code: error.code,
        suggestion: error.code === 'permission-denied' 
          ? 'Update Firestore security rules to allow authenticated access'
          : 'Check network connection and Firebase configuration'
      };
    }
  }
}

export default new UserService();