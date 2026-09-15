import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/index.js';
import { AuthService } from '../services/auth.service.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<User>;
  logout: () => void;
  quickLogin: (role: 'student' | 'kitchen' | 'admin') => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('campusbite_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('campusbite_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('campusbite_token');
      if (storedToken) {
        try {
          const freshUser = await AuthService.getMe();
          setUser(freshUser);
          localStorage.setItem('campusbite_user', JSON.stringify(freshUser));
        } catch (e) {
          localStorage.removeItem('campusbite_token');
          localStorage.removeItem('campusbite_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await AuthService.login({ email, password });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('campusbite_token', res.token);
    localStorage.setItem('campusbite_user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (data: { name: string; email: string; phone?: string; password: string }): Promise<User> => {
    const res = await AuthService.register(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('campusbite_token', res.token);
    localStorage.setItem('campusbite_user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = () => {
    AuthService.logout();
    localStorage.removeItem('campusbite_token');
    localStorage.removeItem('campusbite_user');
    setUser(null);
    setToken(null);
  };

  const quickLogin = async (role: 'student' | 'kitchen' | 'admin'): Promise<User> => {
    const credentials = {
      admin: { email: 'admin@campusbite.local', password: 'Admin@123' },
      kitchen: { email: 'kitchen@campusbite.local', password: 'Kitchen@123' },
      student: { email: 'student@campusbite.local', password: 'Student@123' },
    };

    const creds = credentials[role];
    return login(creds.email, creds.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
