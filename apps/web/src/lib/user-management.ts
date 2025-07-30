export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'instructor' | 'student' | 'guest';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string;
  loginCount: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  totalSpent: number;
  points: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  bio?: string;
  location?: string;
  website?: string;
  socialLinks: {
    wechat?: string;
    qq?: string;
    weibo?: string;
    github?: string;
  };
  preferences: {
    language: 'zh-CN' | 'en-US';
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'instructor' | 'student' | 'guest';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  bio?: string;
  location?: string;
  website?: string;
  socialLinks: {
    wechat?: string;
    qq?: string;
    weibo?: string;
    github?: string;
  };
  preferences: {
    language: 'zh-CN' | 'en-US';
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

// 模拟数据存储
class UserManager {
  private users: User[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@deepneed.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      firstName: "管理员",
      lastName: "系统",
      role: "admin",
      status: "active",
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: "2024-01-25T10:30:00Z",
      loginCount: 156,
      coursesEnrolled: 0,
      coursesCompleted: 0,
      totalSpent: 0,
      points: 1000,
      level: "diamond",
      bio: "系统管理员",
      location: "北京",
      website: "https://deepneed.com.cn",
      socialLinks: {
        github: "https://github.com/deepneed-admin"
      },
      preferences: {
        language: "zh-CN",
        timezone: "Asia/Shanghai",
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-25T10:30:00Z"
    },
    {
      id: 2,
      username: "zhangsan",
      email: "zhangsan@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
      firstName: "张三",
      lastName: "",
      phone: "13800138001",
      role: "student",
      status: "active",
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: "2024-01-25T09:15:00Z",
      loginCount: 45,
      coursesEnrolled: 3,
      coursesCompleted: 2,
      totalSpent: 1597,
      points: 850,
      level: "gold",
      bio: "AI产品经理，正在学习AI应用开发",
      location: "上海",
      socialLinks: {
        wechat: "zhangsan_ai",
        github: "https://github.com/zhangsan-ai"
      },
      preferences: {
        language: "zh-CN",
        timezone: "Asia/Shanghai",
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      createdAt: "2024-01-05T10:00:00Z",
      updatedAt: "2024-01-25T09:15:00Z"
    },
    {
      id: 3,
      username: "lisi",
      email: "lisi@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisi",
      firstName: "李四",
      lastName: "",
      phone: "13800138002",
      role: "instructor",
      status: "active",
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: "2024-01-24T16:30:00Z",
      loginCount: 89,
      coursesEnrolled: 0,
      coursesCompleted: 0,
      totalSpent: 0,
      points: 1200,
      level: "platinum",
      bio: "资深产品经理，专注于AI产品设计",
      location: "深圳",
      website: "https://lisi-product.com",
      socialLinks: {
        wechat: "lisi_pm",
        github: "https://github.com/lisi-pm"
      },
      preferences: {
        language: "zh-CN",
        timezone: "Asia/Shanghai",
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      createdAt: "2024-01-10T14:00:00Z",
      updatedAt: "2024-01-24T16:30:00Z"
    },
    {
      id: 4,
      username: "wangwu",
      email: "wangwu@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu",
      firstName: "王五",
      lastName: "",
      phone: "13800138003",
      role: "student",
      status: "active",
      emailVerified: true,
      phoneVerified: false,
      lastLoginAt: "2024-01-23T11:45:00Z",
      loginCount: 23,
      coursesEnrolled: 1,
      coursesCompleted: 0,
      totalSpent: 399,
      points: 150,
      level: "silver",
      bio: "前端开发工程师，正在学习AI编程",
      location: "杭州",
      socialLinks: {
        github: "https://github.com/wangwu-dev"
      },
      preferences: {
        language: "zh-CN",
        timezone: "Asia/Shanghai",
        notifications: {
          email: true,
          sms: false,
          push: false
        }
      },
      createdAt: "2024-01-15T09:30:00Z",
      updatedAt: "2024-01-23T11:45:00Z"
    },
    {
      id: 5,
      username: "zhaoliu",
      email: "zhaoliu@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu",
      firstName: "赵六",
      lastName: "",
      phone: "13800138004",
      role: "student",
      status: "inactive",
      emailVerified: false,
      phoneVerified: false,
      lastLoginAt: "2024-01-20T08:20:00Z",
      loginCount: 5,
      coursesEnrolled: 0,
      coursesCompleted: 0,
      totalSpent: 0,
      points: 50,
      level: "bronze",
      bio: "新用户",
      location: "广州",
      socialLinks: {},
      preferences: {
        language: "zh-CN",
        timezone: "Asia/Shanghai",
        notifications: {
          email: false,
          sms: false,
          push: false
        }
      },
      createdAt: "2024-01-18T15:00:00Z",
      updatedAt: "2024-01-20T08:20:00Z"
    },
    {
      id: 6,
      username: "qianqi",
      email: "qianqi@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=qianqi",
      firstName: "钱七",
      lastName: "",
      phone: "13800138005",
      role: "guest",
      status: "pending",
      emailVerified: false,
      phoneVerified: false,
      lastLoginAt: "2024-01-25T07:10:00Z",
      loginCount: 1,
      coursesEnrolled: 0,
      coursesCompleted: 0,
      totalSpent: 0,
      points: 10,
      level: "bronze",
      bio: "访客用户",
      location: "成都",
      socialLinks: {},
      preferences: {
        language: "zh-CN",
        timezone: "Asia/Shanghai",
        notifications: {
          email: false,
          sms: false,
          push: false
        }
      },
      createdAt: "2024-01-25T07:00:00Z",
      updatedAt: "2024-01-25T07:10:00Z"
    }
  ];

  private nextId = 7;

  // 获取所有用户
  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.users]);
      }, 300);
    });
  }

  // 根据ID获取用户
  async getUserById(id: number): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === id);
        resolve(user ? { ...user } : null);
      }, 200);
    });
  }

  // 创建新用户
  async createUser(data: UserFormData): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const newUser: User = {
            id: this.nextId++,
            username: data.username,
            email: data.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: data.role,
            status: data.status,
            emailVerified: false,
            phoneVerified: false,
            loginCount: 0,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            points: 0,
            level: "bronze",
            bio: data.bio,
            location: data.location,
            website: data.website,
            socialLinks: data.socialLinks,
            preferences: data.preferences,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          this.users.push(newUser);
          resolve({ ...newUser });
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  // 更新用户
  async updateUser(id: number, data: Partial<UserFormData>): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const index = this.users.findIndex(u => u.id === id);
          if (index === -1) {
            reject(new Error('用户不存在'));
            return;
          }

          const updatedUser = {
            ...this.users[index],
            ...data,
            updatedAt: new Date().toISOString()
          };

          this.users[index] = updatedUser;
          resolve({ ...updatedUser });
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  // 删除用户
  async deleteUser(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  // 批量删除用户
  async deleteUsers(ids: number[]): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        ids.forEach(id => {
          const index = this.users.findIndex(u => u.id === id);
          if (index !== -1) {
            this.users.splice(index, 1);
          }
        });
        resolve(true);
      }, 500);
    });
  }

  // 更新用户状态
  async updateUserStatus(id: number, status: User['status']): Promise<User> {
    return this.updateUser(id, { status });
  }

  // 更新用户角色
  async updateUserRole(id: number, role: User['role']): Promise<User> {
    return this.updateUser(id, { role });
  }

  // 搜索用户
  async searchUsers(query: string): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.users.filter(user =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.firstName.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName.toLowerCase().includes(query.toLowerCase())
        );
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按角色筛选用户
  async getUsersByRole(role: User['role']): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.users.filter(user => user.role === role);
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按状态筛选用户
  async getUsersByStatus(status: User['status']): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.users.filter(user => user.status === status);
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按等级筛选用户
  async getUsersByLevel(level: User['level']): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.users.filter(user => user.level === level);
        resolve([...filtered]);
      }, 200);
    });
  }

  // 获取用户统计
  async getUserStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: this.users.length,
          active: this.users.filter(u => u.status === 'active').length,
          inactive: this.users.filter(u => u.status === 'inactive').length,
          suspended: this.users.filter(u => u.status === 'suspended').length,
          pending: this.users.filter(u => u.status === 'pending').length,
          admin: this.users.filter(u => u.role === 'admin').length,
          instructor: this.users.filter(u => u.role === 'instructor').length,
          student: this.users.filter(u => u.role === 'student').length,
          guest: this.users.filter(u => u.role === 'guest').length,
          verified: this.users.filter(u => u.emailVerified).length,
          totalSpent: this.users.reduce((sum, u) => sum + u.totalSpent, 0),
          totalPoints: this.users.reduce((sum, u) => sum + u.points, 0),
          totalCoursesEnrolled: this.users.reduce((sum, u) => sum + u.coursesEnrolled, 0),
          totalCoursesCompleted: this.users.reduce((sum, u) => sum + u.coursesCompleted, 0)
        };
        resolve(stats);
      }, 100);
    });
  }

  // 获取等级分布
  async getLevelDistribution() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const distribution = {
          bronze: this.users.filter(u => u.level === 'bronze').length,
          silver: this.users.filter(u => u.level === 'silver').length,
          gold: this.users.filter(u => u.level === 'gold').length,
          platinum: this.users.filter(u => u.level === 'platinum').length,
          diamond: this.users.filter(u => u.level === 'diamond').length
        };
        resolve(distribution);
      }, 100);
    });
  }

  // 获取活跃用户（最近7天登录）
  async getActiveUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const activeUsers = this.users.filter(user => {
          if (!user.lastLoginAt) return false;
          return new Date(user.lastLoginAt) > sevenDaysAgo;
        });
        
        resolve([...activeUsers]);
      }, 200);
    });
  }

  // 获取新注册用户（最近30天）
  async getNewUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newUsers = this.users.filter(user => {
          return new Date(user.createdAt) > thirtyDaysAgo;
        });
        
        resolve([...newUsers]);
      }, 200);
    });
  }
}

export const userManager = new UserManager(); 