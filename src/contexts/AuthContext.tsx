'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type AuthView = 'main' | 'login' | 'register';

interface AuthContextType {
  isAuthenticated: boolean;
  currentView: AuthView;
  login: (token: string) => void;
  logout: () => void;
  setCurrentView: (view: AuthView) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentView, setCurrentView] = useState<AuthView>('main');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has valid token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setCurrentView('main');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setCurrentView('main');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentView,
        login,
        logout,
        setCurrentView,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
