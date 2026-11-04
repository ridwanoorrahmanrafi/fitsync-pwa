import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, firebaseConfigured } from '../config/firebase.config.js';

const AuthContext = createContext(null);

// Dev user used when Firebase is not configured or in local bypass mode
const DEV_USER = {
  uid: 'dev-user-001',
  email: 'dev@fitsync.local',
  displayName: 'Dev Athlete',
  getIdToken: async () => 'dev-token',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setUser(DEV_USER);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async () => {
    if (!firebaseConfigured || !auth) {
      setUser(DEV_USER);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.warn('[Auth] Google sign-in cancelled or failed:', err.message);
      // In local dev, allow falling back to dev athlete if user cancels popup
      if (import.meta.env.DEV) {
        setUser(DEV_USER);
      }
    }
  };

  const logout = async () => {
    if (!firebaseConfigured || !auth) {
      setUser(null);
      return;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isFirebaseConfigured: firebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
