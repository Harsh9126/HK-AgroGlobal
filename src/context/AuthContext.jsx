import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseService } from '../services/firebaseService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase Auth changes
    const unsubscribe = FirebaseService.subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const login = (email, password) => FirebaseService.login(email, password);
  const logout = () => FirebaseService.logout();
  const resetPassword = (email) => FirebaseService.resetPassword(email);

  const value = {
    user,
    login,
    logout,
    resetPassword,
    loading
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{
        height: '100vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', background: '#f8fafc'
      }}>
        <div className="spinner" style={{
          width: '40px', height: '40px', border: '3px solid #e2e8f0', 
          borderTopColor: '#1e40af', borderRadius: '50%', animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '500' }}>Initializing HK AgroGlobal...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
