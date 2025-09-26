// Component to handle Google sign-in redirect results
import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const GoogleRedirectHandler = () => {
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          console.log('✅ Google sign-in redirect successful:', user);

          try {
            // Check if user document already exists
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
              // Create new user document for first-time Google users
              await setDoc(userDocRef, {
                uid: user.uid,
                name: user.displayName || 'Google User',
                email: user.email,
                photoURL: user.photoURL,
                provider: 'google',
                createdAt: new Date(),
                profileComplete: false
              });

              console.log('✅ New user document created from redirect');
              window.location.href = '/complete-profile';
            } else {
              console.log('✅ Existing user logged in from redirect');
              const userData = userDoc.data();
              if (!userData.profileComplete) {
                window.location.href = '/complete-profile';
              } else {
                window.location.href = '/';
              }
            }
          } catch (firestoreError: any) {
            console.warn('⚠️ Firestore error in redirect handler:', firestoreError);
            // Fallback: redirect to profile completion
            window.location.href = '/complete-profile';
          }
        }
      } catch (error) {
        console.error('❌ Redirect result error:', error);
      }
    };

    handleRedirectResult();
  }, []);

  return null; // This component doesn't render anything
};

export default GoogleRedirectHandler;