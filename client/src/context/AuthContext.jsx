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
    if (localStorage.getItem('fitsync_dev_auth') === 'true') {
      setUser(DEV_USER);
      setLoading(false);
      return;
    }

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

  const loginAsDemo = () => {
    localStorage.setItem('fitsync_dev_auth', 'true');
    setUser(DEV_USER);
  };

  const login = async () => {
    if (!firebaseConfigured || !auth) {
      loginAsDemo();
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.warn('[Auth] Google sign-in cancelled or failed:', err.message);
      // In local dev, allow falling back to dev athlete if user cancels popup
      if (import.meta.env.DEV) {
        loginAsDemo();
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem('fitsync_dev_auth');
    if (!firebaseConfigured || !auth) {
      setUser(null);
      return;
    }
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsDemo, logout, isFirebaseConfigured: firebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
