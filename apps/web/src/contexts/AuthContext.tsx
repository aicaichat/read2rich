import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import type { User, LoginForm, RegisterForm } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查本地存储中的令牌并验证
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Token validation failed:', error);
          // 令牌无效，清除本地存储
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data: LoginForm) => {
    try {
      console.log('🌐 使用真实登录API');
      const tokens = await authAPI.login(data);
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.detail || error.message || '登录失败');
    }
  };

  const register = async (data: RegisterForm) => {
    try {
      console.log('🌐 使用真实注册API');
      const userData = await authAPI.register(data);
      setUser(userData);
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.detail || error.message || '注册失败');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('Logout API call failed, but clearing local storage');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 