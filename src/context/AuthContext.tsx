import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, googleProvider, createOrFetchUserInBackend } from '../lib/api';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JournalEntriesContext for real-time updates
interface JournalEntriesContextType {
  refreshToken: number;
  triggerRefresh: () => void;
}

const JournalEntriesContext = createContext<JournalEntriesContextType | undefined>(undefined);

export const JournalEntriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshToken, setRefreshToken] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshToken(t => t + 1), []);
  return (
    <JournalEntriesContext.Provider value={{ refreshToken, triggerRefresh }}>
      {children}
    </JournalEntriesContext.Provider>
  );
};

export const useJournalEntries = () => {
  const ctx = useContext(JournalEntriesContext);
  if (!ctx) throw new Error('useJournalEntries must be used within JournalEntriesProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser); // Debug log
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await createOrFetchUserInBackend();
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await createOrFetchUserInBackend();
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await signInWithPopup(auth, googleProvider);
    await createOrFetchUserInBackend();
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    setUser(null);
    setLoading(false);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};