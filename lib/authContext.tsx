
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/app/types/gen';
import { db } from './db';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
  refreshUser: () => { },
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshUser = () => {
      const currentUser = db.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    refreshUser();
  }, []);

  const refreshUser = () => {
    const currentUser = db.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  const login = (u: User) => {
    setUser(u);
    db.persistSession(u);
  };

  const logout = () => {
    db.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
