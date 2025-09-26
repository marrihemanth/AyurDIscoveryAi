// Utility to check and create user document if needed
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const ensureUserDocument = async (user: any) => {
  if (!user) return null;

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL,
        provider: user.providerData[0]?.providerId || 'unknown',
        createdAt: new Date(),
        updatedAt: new Date(),
        profileComplete: false,
        role: null
      };

      await setDoc(userDocRef, userData);
      console.log('✅ User document created:', userData);
      return userData;
    } else {
      console.log('✅ User document exists');
      return userDoc.data();
    }
  } catch (error) {
    console.error('❌ Error ensuring user document:', error);
    return null;
  }
};

export default ensureUserDocument;