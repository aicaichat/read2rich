export interface Instructor {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  title: string;
  expertise: string[];
  experience: number; // 工作年限
  courses: number; // 课程数量
  students: number; // 学生总数
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InstructorFormData {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  title: string;
  expertise: string[];
  experience: number;
  status: 'active' | 'inactive' | 'pending';
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

// 模拟数据存储
class InstructorManager {
  private instructors: Instructor[] = [];
  private storageKey = 'deepneed_instructors';
  
  constructor() {
    this.loadFromStorage();
  }
  
  // 从本地存储加载数据
  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.instructors = JSON.parse(stored);
        } else {
          // 如果没有存储的数据，使用默认数据
          this.instructors = this.getDefaultInstructors();
          this.saveToStorage();
        }
      } else {
        // 服务器端使用默认数据
        this.instructors = this.getDefaultInstructors();
      }
    } catch (error) {
      console.error('加载讲师数据失败:', error);
      this.instructors = this.getDefaultInstructors();
    }
  }
  
  // 保存到本地存储
  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.instructors));
      }
    } catch (error) {
      console.error('保存讲师数据失败:', error);
    }
  }
  
  // 获取默认讲师数据
  private getDefaultInstructors(): Instructor[] {
    return [
    {
      id: 1,
      name: "张教授",
      email: "zhang@deepneed.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang",
      bio: "资深AI产品专家，拥有10年+产品开发经验，曾主导多个百万级用户产品。专注于AI时代的产品设计和商业模式创新。",
      title: "AI产品专家",
      expertise: ["AI产品设计", "产品管理", "商业模式", "用户体验"],
      experience: 12,
      courses: 3,
      students: 2847,
      rating: 4.9,
      status: "active",
      socialLinks: {
        linkedin: "https://linkedin.com/in/zhang-professor",
        twitter: "https://twitter.com/zhang_ai",
        website: "https://zhang-ai.com"
      },
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z"
    },
    {
      id: 2,
      name: "李老师",
      email: "li@deepneed.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=li",
      bio: "资深产品经理，专注于AI产品设计，曾负责多个知名AI产品。擅长用户研究和产品策略制定。",
      title: "产品经理",
      expertise: ["产品设计", "AI产品", "用户体验", "用户研究"],
      experience: 8,
      courses: 2,
      students: 1567,
      rating: 4.8,
      status: "active",
      socialLinks: {
        linkedin: "https://linkedin.com/in/li-pm",
        github: "https://github.com/li-pm"
      },
      createdAt: "2024-01-05T09:00:00Z",
      updatedAt: "2024-01-22T16:00:00Z"
    },
    {
      id: 3,
      name: "王工程师",
      email: "wang@deepneed.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wang",
      bio: "全栈工程师，AI编程专家，专注于AI辅助开发技术。拥有丰富的实战经验和教学经验。",
      title: "全栈工程师",
      expertise: ["编程", "AI开发", "ChatGPT", "效率提升"],
      experience: 6,
      courses: 1,
      students: 2134,
      rating: 4.7,
      status: "active",
      socialLinks: {
        linkedin: "https://linkedin.com/in/wang-engineer",
        github: "https://github.com/wang-engineer",
        website: "https://wang-dev.com"
      },
      createdAt: "2024-01-10T11:00:00Z",
      updatedAt: "2024-01-25T10:00:00Z"
    },
    {
      id: 4,
      name: "陈导师",
      email: "chen@deepneed.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen",
      bio: "连续创业者，AI领域投资专家，曾成功创办多个AI公司。专注于AI创业指导和投资咨询。",
      title: "创业导师",
      expertise: ["创业", "AI商业", "融资", "商业化"],
      experience: 15,
      courses: 1,
      students: 892,
      rating: 4.9,
      status: "pending",
      socialLinks: {
        linkedin: "https://linkedin.com/in/chen-mentor",
        twitter: "https://twitter.com/chen_mentor"
      },
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-20T08:00:00Z"
    },
    {
      id: 5,
      name: "刘博士",
      email: "liu@deepneed.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liu",
      bio: "机器学习博士，专注于深度学习和大模型应用。在多个顶级会议发表论文，拥有丰富的学术和工业经验。",
      title: "机器学习专家",
      expertise: ["机器学习", "深度学习", "大模型", "算法优化"],
      experience: 10,
      courses: 0,
      students: 0,
      rating: 0,
      status: "inactive",
      socialLinks: {
        linkedin: "https://linkedin.com/in/liu-phd",
        github: "https://github.com/liu-ml",
        website: "https://liu-ml.com"
      },
      createdAt: "2024-01-25T12:00:00Z",
      updatedAt: "2024-01-25T12:00:00Z"
    }
  ];

  private nextId = 6;

  // 获取所有讲师
  async getAllInstructors(): Promise<Instructor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.instructors]);
      }, 300);
    });
  }

  // 根据ID获取讲师
  async getInstructorById(id: number): Promise<Instructor | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const instructor = this.instructors.find(i => i.id === id);
        resolve(instructor ? { ...instructor } : null);
      }, 200);
    });
  }

  // 创建新讲师
  async createInstructor(data: InstructorFormData): Promise<Instructor> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const newInstructor: Instructor = {
            id: this.nextId++,
            ...data,
            courses: 0,
            students: 0,
            rating: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          this.instructors.push(newInstructor);
          this.saveToStorage(); // 保存到本地存储
          resolve({ ...newInstructor });
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  // 更新讲师
  async updateInstructor(id: number, data: Partial<InstructorFormData>): Promise<Instructor> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const index = this.instructors.findIndex(i => i.id === id);
          if (index === -1) {
            reject(new Error('讲师不存在'));
            return;
          }

          const updatedInstructor = {
            ...this.instructors[index],
            ...data,
            updatedAt: new Date().toISOString()
          };

          this.instructors[index] = updatedInstructor;
          this.saveToStorage(); // 保存到本地存储
          resolve({ ...updatedInstructor });
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  // 删除讲师
  async deleteInstructor(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.instructors.findIndex(i => i.id === id);
        if (index !== -1) {
          this.instructors.splice(index, 1);
          this.saveToStorage(); // 保存到本地存储
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  // 批量删除讲师
  async deleteInstructors(ids: number[]): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        ids.forEach(id => {
          const index = this.instructors.findIndex(i => i.id === id);
          if (index !== -1) {
            this.instructors.splice(index, 1);
          }
        });
        resolve(true);
      }, 500);
    });
  }

  // 更新讲师状态
  async updateInstructorStatus(id: number, status: Instructor['status']): Promise<Instructor> {
    return this.updateInstructor(id, { status });
  }

  // 搜索讲师
  async searchInstructors(query: string): Promise<Instructor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.instructors.filter(instructor =>
          instructor.name.toLowerCase().includes(query.toLowerCase()) ||
          instructor.title.toLowerCase().includes(query.toLowerCase()) ||
          instructor.expertise.some(exp => exp.toLowerCase().includes(query.toLowerCase()))
        );
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按状态筛选讲师
  async getInstructorsByStatus(status: Instructor['status']): Promise<Instructor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.instructors.filter(instructor => instructor.status === status);
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按专业领域筛选讲师
  async getInstructorsByExpertise(expertise: string): Promise<Instructor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.instructors.filter(instructor => 
          instructor.expertise.includes(expertise)
        );
        resolve([...filtered]);
      }, 200);
    });
  }

  // 获取讲师统计
  async getInstructorStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: this.instructors.length,
          active: this.instructors.filter(i => i.status === 'active').length,
          inactive: this.instructors.filter(i => i.status === 'inactive').length,
          pending: this.instructors.filter(i => i.status === 'pending').length,
          totalStudents: this.instructors.reduce((sum, i) => sum + i.students, 0),
          totalCourses: this.instructors.reduce((sum, i) => sum + i.courses, 0),
          avgRating: this.instructors.length > 0 
            ? this.instructors.reduce((sum, i) => sum + i.rating, 0) / this.instructors.length 
            : 0
        };
        resolve(stats);
      }, 100);
    });
  }

  // 获取所有专业领域
  async getExpertiseAreas(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expertise = [...new Set(this.instructors.flatMap(i => i.expertise))];
        resolve(expertise);
      }, 100);
    });
  }

  // 获取所有职称
  async getTitles(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const titles = [...new Set(this.instructors.map(i => i.title))];
        resolve(titles);
      }, 100);
    });
  }
}

export const instructorManager = new InstructorManager(); 