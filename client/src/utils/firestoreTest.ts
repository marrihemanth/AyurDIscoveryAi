// Simple Firestore connectivity test
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const testFirestoreConnection = async () => {
  try {
    console.log('🔥 Testing Firestore connection...');
    
    // Try to add a simple test document
    const testCollection = collection(db, 'test');
    const docRef = await addDoc(testCollection, {
      message: 'Firestore connection test',
      timestamp: new Date()
    });
    
    console.log('✅ Firestore connection successful! Document ID:', docRef.id);
    return true;
  } catch (error: any) {
    console.error('❌ Firestore connection failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.message?.includes('offline')) {
      console.error('🔍 Issue: Client appears to be offline or Firestore is not accessible');
    }
    
    if (error.code === 'permission-denied') {
      console.error('🔍 Issue: Firestore security rules are blocking access');
    }
    
    if (error.code === 'not-found') {
      console.error('🔍 Issue: Firestore database may not be created yet');
    }
    
    return false;
  }
};

export default testFirestoreConnection;