import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { USING_MOCK_API } from '@/lib/mock-api';
import { enhancedAuthAPI } from '@/lib/enhanced-mock-api';
import { optimizedAuthAPI, USING_OPTIMIZED_API } from '@/lib/optimized-mock-api';
import { ultraFastAuthAPI, USING_ULTRA_FAST_API } from '@/lib/ultra-fast-mock-api';
import type { User, LoginForm, RegisterForm, AuthTokens } from '@/types';

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
      if (USING_MOCK_API) {
        const mockUser = localStorage.getItem('mock_user');
        if (mockUser) {
          try {
            const userData = JSON.parse(mockUser);
            setUser(userData);
          } catch (error) {
            localStorage.removeItem('mock_user');
          }
        }
      } else {
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            const userData = await authAPI.getCurrentUser();
            setUser(userData);
          } catch (error) {
            // 令牌无效，清除本地存储
            localStorage.removeItem('access_token');
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data: LoginForm) => {
    try {
      if (USING_ULTRA_FAST_API) {
        console.log('🚀 使用超快速登录API');
        await ultraFastAuthAPI.login(data);
        const userData = await ultraFastAuthAPI.getCurrentUser();
        setUser(userData);
      } else if (USING_OPTIMIZED_API) {
        console.log('⚡ 使用优化登录API');
        await optimizedAuthAPI.login(data);
        const userData = await optimizedAuthAPI.getCurrentUser();
        setUser(userData);
      } else if (USING_MOCK_API) {
        console.log('🔧 使用增强Mock登录API');
        await enhancedAuthAPI.login(data);
        const userData = await enhancedAuthAPI.getCurrentUser();
        setUser(userData);
      } else {
        console.log('🌐 使用真实登录API');
        const tokens: AuthTokens = await authAPI.login(data);
        localStorage.setItem('access_token', tokens.access_token);
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      }
    } catch (error: any) {
      throw new Error(error.message || '登录失败');
    }
  };

  const register = async (data: RegisterForm) => {
    try {
      if (USING_ULTRA_FAST_API) {
        console.log('🚀 使用超快速注册API');
        await ultraFastAuthAPI.register(data);
      } else if (USING_OPTIMIZED_API) {
        console.log('⚡ 使用优化注册API');
        await optimizedAuthAPI.register(data);
      } else if (USING_MOCK_API) {
        console.log('🔧 使用增强Mock注册API');
        await enhancedAuthAPI.register(data);
      } else {
        console.log('🌐 使用真实注册API');
        await authAPI.register(data);
      }
    } catch (error: any) {
      throw new Error(error.message || '注册失败');
    }
  };

  const logout = () => {
    if (USING_MOCK_API) {
      localStorage.removeItem('mock_user');
    } else {
      localStorage.removeItem('access_token');
    }
    setUser(null);
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