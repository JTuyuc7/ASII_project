'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type AuthView = 'main' | 'login' | 'register';

interface AuthContextType {
  isAuthenticated: boolean;
  currentView: AuthView;
  isAdmin: boolean;
  login: (token: string, userRole?: string) => void;
  logout: () => void;
  setCurrentView: (view: AuthView) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true); // Por defecto true para pruebas
  const [currentView, setCurrentView] = useState<AuthView>('main');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has valid token on mount
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === 'admin');
    }
    setLoading(false);
  }, []);

  const login = (token: string, userRole: string = 'user') => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', userRole);
    setIsAuthenticated(true);
    setIsAdmin(userRole === 'admin');
    setCurrentView('main');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentView('main');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentView,
        isAdmin,
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
