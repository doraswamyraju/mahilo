import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleType } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeRole: RoleType;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (fullName: string, phone: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: RoleType) => void;
  refreshUser: () => Promise<void>;
  isSellerApproved: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('mahilo_token'));
  const [activeRole, setActiveRole] = useState<RoleType>(
    (localStorage.getItem('mahilo_active_role') as RoleType) || 'CUSTOMER'
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      if (!token) {
        setIsLoading(false);
        return;
      }
      const res: any = await api.get('/auth/me');
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/login', { identifier, password });
      if (res.success && res.data) {
        const { user: userData, token: jwtToken } = res.data;
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('mahilo_token', jwtToken);

        // Auto-route based on roles:
        if (userData.roles.includes('ADMIN') || userData.roles.includes('SUPER_ADMIN')) {
          setActiveRole('ADMIN');
          localStorage.setItem('mahilo_active_role', 'ADMIN');
        } else if (userData.sellerStatus === 'APPROVED' && userData.roles.includes('SELLER')) {
          // Defaults to Customer with quick switcher active
          setActiveRole('CUSTOMER');
          localStorage.setItem('mahilo_active_role', 'CUSTOMER');
        } else {
          setActiveRole('CUSTOMER');
          localStorage.setItem('mahilo_active_role', 'CUSTOMER');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, phone: string, password: string, email?: string) => {
    setIsLoading(true);
    try {
      const res: any = await api.post('/auth/register', { fullName, phone, password, email });
      if (res.success && res.data) {
        const { user: userData, token: jwtToken } = res.data;
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('mahilo_token', jwtToken);
        setActiveRole('CUSTOMER');
        localStorage.setItem('mahilo_active_role', 'CUSTOMER');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setActiveRole('CUSTOMER');
    localStorage.removeItem('mahilo_token');
    localStorage.removeItem('mahilo_active_role');
  };

  const switchRole = (role: RoleType) => {
    setActiveRole(role);
    localStorage.setItem('mahilo_active_role', role);
  };

  const isSellerApproved = !!(user?.roles.includes('SELLER') && user?.sellerStatus === 'APPROVED');
  const isAdmin = !!(user?.roles.includes('ADMIN') || user?.roles.includes('SUPER_ADMIN'));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeRole,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        refreshUser,
        isSellerApproved,
        isAdmin,
      }}
    >
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
