import { instructorManagerFixed as instructorManager } from './instructor-management';

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  instructor: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    bio: string;
  };
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  status: 'draft' | 'published' | 'archived';
  isHot: boolean;
  isNew: boolean;
  isFree: boolean;
  tags: string[];
  image: string;
  videoUrl?: string;
  modules: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  lessons: CourseLesson[];
  order: number;
}

export interface CourseLesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  isFree: boolean;
  order: number;
}

export interface CourseFormData {
  title: string;
  subtitle: string;
  description: string;
  instructorId: number;
  price: number;
  originalPrice: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  status: 'draft' | 'published' | 'archived';
  isHot: boolean;
  isNew: boolean;
  isFree: boolean;
  tags: string[];
  image: string;
  videoUrl?: string;
}

// 模拟数据存储
class CourseManager {
  private courses: Course[] = [
    {
      id: 1,
      title: "价值百万的AI应用创新课程",
      subtitle: "5周创业营：从0到1打造可收费AI应用",
      description: "免费公开课帮你锁定'真需求'，5周创业营把它变成能赚钱的AI应用。每周3小时工作坊，5周内完成可收费MVP、ROI仪表盘、3分钟Demo+Pitch Deck，实现首批真实营收或50 DAU。",
      instructor: {
        id: 1,
        name: "张教授",
        email: "zhang@deepneed.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang",
        bio: "资深AI产品专家，拥有10年+产品开发经验，曾主导多个百万级用户产品。"
      },
      price: 6499,
      originalPrice: 6999,
      discount: 500,
      rating: 4.9,
      students: 2847,
      duration: "15小时",
      lessons: 25,
      level: "intermediate",
      category: "AI开发",
      status: "published",
      isHot: true,
      isNew: true,
      isFree: false,
      tags: ["AI开发", "创业", "产品设计", "商业模式", "MVP"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      modules: [
        {
          id: 1,
          title: "免费公开课：抓住AI红利的100分钟",
          description: "认知升级、选题清单、入营测试",
          order: 1,
          lessons: [
            {
              id: 1,
              title: "开篇三问：为何此刻AI应用是'低垂果实'？",
              description: "数据+案例秒杀焦虑",
              duration: "10分钟",
              isFree: true,
              order: 1
            },
            {
              id: 2,
              title: "AI真需求三角：价值·共识·模式",
              description: "梁宁方法×产品思维",
              duration: "20分钟",
              isFree: true,
              order: 2
            },
            {
              id: 3,
              title: "六维打分法：现场挑选10个'万元一夜'场景",
              description: "互动投票生成榜单",
              duration: "30分钟",
              isFree: true,
              order: 3
            },
            {
              id: 4,
              title: "10行代码跑首个Prompt-Only Demo",
              description: "让0基础也能'跑起来'",
              duration: "20分钟",
              isFree: true,
              order: 4
            },
            {
              id: 5,
              title: "营收公式拆解：DAU×转化×ARPU",
              description: "给出3档订阅Benchmark",
              duration: "10分钟",
              isFree: true,
              order: 5
            },
            {
              id: 6,
              title: "创业营介绍+入营测验",
              description: "在线测完即显示适配度",
              duration: "10分钟",
              isFree: true,
              order: 6
            }
          ]
        },
        {
          id: 2,
          title: "Week 1：定位&需求",
          description: "选题落地——方向焦虑清零",
          order: 2,
          lessons: [
            {
              id: 7,
              title: "课前预热：阅读《真需求三角》+访谈示范",
              description: "准备工作和学习方法",
              duration: "15分钟",
              isFree: false,
              order: 1
            },
            {
              id: 8,
              title: "直播工作坊：红利&方法论",
              description: "30分钟深度解析",
              duration: "30分钟",
              isFree: false,
              order: 2
            },
            {
              id: 9,
              title: "痛点池共创+六维打分",
              description: "90分钟实战演练",
              duration: "90分钟",
              isFree: false,
              order: 3
            },
            {
              id: 10,
              title: "访谈脚本演练",
              description: "30分钟技巧训练",
              duration: "30分钟",
              isFree: false,
              order: 4
            },
            {
              id: 11,
              title: "Q&A+布置任务",
              description: "30分钟答疑和作业",
              duration: "30分钟",
              isFree: false,
              order: 5
            }
          ]
        },
        {
          id: 3,
          title: "Week 2：MVP成型",
          description: "首个可跑Demo，上线测试链接",
          order: 3,
          lessons: [
            {
              id: 12,
              title: "课前预热：观看Prompt五段式Demo",
              description: "技术准备和演示",
              duration: "15分钟",
              isFree: false,
              order: 1
            },
            {
              id: 13,
              title: "用神&指标讲解",
              description: "30分钟理论指导",
              duration: "30分钟",
              isFree: false,
              order: 2
            },
            {
              id: 14,
              title: "Live Coding：10行代码跑Demo",
              description: "90分钟实战编程",
              duration: "90分钟",
              isFree: false,
              order: 3
            },
            {
              id: 15,
              title: "Evals介绍",
              description: "30分钟评估方法",
              duration: "30分钟",
              isFree: false,
              order: 4
            },
            {
              id: 16,
              title: "反馈&任务",
              description: "30分钟总结和作业",
              duration: "30分钟",
              isFree: false,
              order: 5
            }
          ]
        },
        {
          id: 4,
          title: "Week 3：工具+RAG",
          description: "'能用→好用'体验跳级",
          order: 4,
          lessons: [
            {
              id: 17,
              title: "课前预热：注册必用API Key",
              description: "技术环境准备",
              duration: "15分钟",
              isFree: false,
              order: 1
            },
            {
              id: 18,
              title: "Function Calling实演",
              description: "30分钟技术演示",
              duration: "30分钟",
              isFree: false,
              order: 2
            },
            {
              id: 19,
              title: "接2个外部API",
              description: "60分钟集成实战",
              duration: "60分钟",
              isFree: false,
              order: 3
            },
            {
              id: 20,
              title: "Mini-RAG架构+实操",
              description: "30分钟RAG实现",
              duration: "30分钟",
              isFree: false,
              order: 4
            },
            {
              id: 21,
              title: "部署到Cloudflare",
              description: "30分钟部署实战",
              duration: "30分钟",
              isFree: false,
              order: 5
            },
            {
              id: 22,
              title: "Q&A答疑",
              description: "30分钟问题解答",
              duration: "30分钟",
              isFree: false,
              order: 6
            }
          ]
        },
        {
          id: 5,
          title: "Week 4：付费验证&ROI",
          description: "第一次真实收入+实时成本收益",
          order: 5,
          lessons: [
            {
              id: 23,
              title: "课前预热：完成Stripe/Gumroad KYC",
              description: "支付环境准备",
              duration: "15分钟",
              isFree: false,
              order: 1
            },
            {
              id: 24,
              title: "定价公式&案例",
              description: "45分钟定价策略",
              duration: "45分钟",
              isFree: false,
              order: 2
            },
            {
              id: 25,
              title: "快速接入支付",
              description: "45分钟支付集成",
              duration: "45分钟",
              isFree: false,
              order: 3
            },
            {
              id: 26,
              title: "Grafana Dashboard实操",
              description: "45分钟监控搭建",
              duration: "45分钟",
              isFree: false,
              order: 4
            },
            {
              id: 27,
              title: "诊断漏斗",
              description: "30分钟数据分析",
              duration: "30分钟",
              isFree: false,
              order: 5
            },
            {
              id: 28,
              title: "任务布置",
              description: "15分钟作业安排",
              duration: "15分钟",
              isFree: false,
              order: 6
            }
          ]
        },
        {
          id: 6,
          title: "Week 5：成本&路演",
          description: "可复制盈利模型+投资人渠道对接",
          order: 6,
          lessons: [
            {
              id: 29,
              title: "课前预热：跑量化脚本对比",
              description: "成本分析准备",
              duration: "15分钟",
              isFree: false,
              order: 1
            },
            {
              id: 30,
              title: "降本三板斧：量化/缓存/本地GGUF",
              description: "45分钟成本优化",
              duration: "45分钟",
              isFree: false,
              order: 2
            },
            {
              id: 31,
              title: "单次成本压测",
              description: "45分钟性能测试",
              duration: "45分钟",
              isFree: false,
              order: 3
            },
            {
              id: 32,
              title: "Demo Day彩排+投融资FAQ",
              description: "60分钟路演准备",
              duration: "60分钟",
              isFree: false,
              order: 4
            },
            {
              id: 33,
              title: "评委即席点评",
              description: "30分钟专业反馈",
              duration: "30分钟",
              isFree: false,
              order: 5
            }
          ]
        }
      ],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z"
    },
    {
      id: 2,
      title: "AI产品经理实战课程",
      subtitle: "掌握AI时代的产品设计思维",
      description: "专为产品经理设计的AI时代产品设计课程，从用户需求到产品落地，全方位提升产品设计能力。",
      instructor: {
        id: 2,
        name: "李老师",
        email: "li@deepneed.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=li",
        bio: "资深产品经理，专注于AI产品设计，曾负责多个知名AI产品。"
      },
      price: 0,
      originalPrice: 799,
      discount: 799,
      rating: 4.8,
      students: 1567,
      duration: "12小时",
      lessons: 45,
      level: "intermediate",
      category: "产品设计",
      status: "published",
      isHot: false,
      isNew: true,
      isFree: true,
      tags: ["产品设计", "AI产品", "用户体验"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      modules: [
        {
          id: 2,
          title: "第1章：AI产品设计基础",
          description: "AI产品设计的基础知识和方法",
          order: 1,
          lessons: [
            {
              id: 3,
              title: "1.1 AI产品设计概述",
              description: "AI产品设计的基本概念",
              duration: "18分钟",
              isFree: true,
              order: 1
            }
          ]
        }
      ],
      createdAt: "2024-01-18T09:00:00Z",
      updatedAt: "2024-01-22T16:00:00Z"
    },
    {
      id: 3,
      title: "ChatGPT编程实战",
      subtitle: "用AI助手提升编程效率",
      description: "学习如何使用ChatGPT等AI工具提升编程效率，从代码生成到调试优化，全面提升开发技能。",
      instructor: {
        id: 3,
        name: "王工程师",
        email: "wang@deepneed.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wang",
        bio: "全栈工程师，AI编程专家，专注于AI辅助开发技术。"
      },
      price: 399,
      originalPrice: 599,
      discount: 200,
      rating: 4.7,
      students: 2134,
      duration: "15小时",
      lessons: 52,
      level: "intermediate",
      category: "编程",
      status: "published",
      isHot: true,
      isNew: false,
      isFree: false,
      tags: ["编程", "ChatGPT", "AI开发", "效率提升"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      modules: [
        {
          id: 3,
          title: "第1章：ChatGPT编程基础",
          description: "ChatGPT编程的基本使用方法",
          order: 1,
          lessons: [
            {
              id: 4,
              title: "1.1 ChatGPT编程入门",
              description: "ChatGPT编程的基本概念",
              duration: "22分钟",
              isFree: false,
              order: 1
            }
          ]
        }
      ],
      createdAt: "2024-01-10T11:00:00Z",
      updatedAt: "2024-01-25T10:00:00Z"
    },
    {
      id: 4,
      title: "AI创业实战指南",
      subtitle: "从想法到商业化的完整路径",
      description: "为想要在AI领域创业的创业者提供完整的指导，从想法验证到产品落地，从融资到商业化。",
      instructor: {
        id: 4,
        name: "陈导师",
        email: "chen@deepneed.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen",
        bio: "连续创业者，AI领域投资专家，曾成功创办多个AI公司。"
      },
      price: 799,
      originalPrice: 1299,
      discount: 500,
      rating: 4.9,
      students: 892,
      duration: "20小时",
      lessons: 78,
      level: "advanced",
      category: "创业",
      status: "draft",
      isHot: false,
      isNew: false,
      isFree: false,
      tags: ["创业", "AI商业", "融资", "商业化"],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      modules: [
        {
          id: 4,
          title: "第1章：AI创业概述",
          description: "AI创业的基本概念和趋势",
          order: 1,
          lessons: [
            {
              id: 5,
              title: "1.1 AI创业机会分析",
              description: "分析AI领域的创业机会",
              duration: "25分钟",
              isFree: false,
              order: 1
            }
          ]
        }
      ],
      createdAt: "2024-01-20T08:00:00Z",
      updatedAt: "2024-01-20T08:00:00Z"
    }
  ];

  private nextId = 5;

  // 获取所有课程
  async getAllCourses(): Promise<Course[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.courses]);
      }, 300);
    });
  }

  // 根据ID获取课程
  async getCourseById(id: number): Promise<Course | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const course = this.courses.find(c => c.id === id);
        resolve(course ? { ...course } : null);
      }, 200);
    });
  }

  // 创建新课程
  async createCourse(data: CourseFormData): Promise<Course> {
    return new Promise(async (resolve, reject) => {
      try {
        // 从讲师管理系统中获取讲师信息
        const instructor = await instructorManager.getInstructorById(data.instructorId);
        if (!instructor) {
          reject(new Error('讲师不存在'));
          return;
        }

        const newCourse: Course = {
          id: this.nextId++,
          ...data,
          instructor: {
            id: instructor.id,
            name: instructor.name,
            email: instructor.email,
            avatar: instructor.avatar,
            bio: instructor.bio
          },
          rating: 0,
          students: 0,
          duration: "0小时",
          lessons: 0,
          discount: data.originalPrice - data.price,
          modules: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        this.courses.push(newCourse);
        resolve({ ...newCourse });
      } catch (error) {
        reject(error);
      }
    });
  }

  // 更新课程
  async updateCourse(id: number, data: Partial<CourseFormData>): Promise<Course> {
    return new Promise(async (resolve, reject) => {
      try {
        const index = this.courses.findIndex(c => c.id === id);
        if (index === -1) {
          reject(new Error('课程不存在'));
          return;
        }

        let updatedCourse = {
          ...this.courses[index],
          ...data,
          updatedAt: new Date().toISOString()
        };

        // 如果更新了讲师ID，需要从讲师管理系统中获取新的讲师信息
        if (data.instructorId) {
          const instructor = await instructorManager.getInstructorById(data.instructorId);
          if (!instructor) {
            reject(new Error('讲师不存在'));
            return;
          }
          
          updatedCourse.instructor = {
            id: instructor.id,
            name: instructor.name,
            email: instructor.email,
            avatar: instructor.avatar,
            bio: instructor.bio
          };
        }

        this.courses[index] = updatedCourse;
        resolve({ ...updatedCourse });
      } catch (error) {
        reject(error);
      }
    });
  }

  // 删除课程
  async deleteCourse(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.courses.findIndex(c => c.id === id);
        if (index !== -1) {
          this.courses.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  // 批量删除课程
  async deleteCourses(ids: number[]): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        ids.forEach(id => {
          const index = this.courses.findIndex(c => c.id === id);
          if (index !== -1) {
            this.courses.splice(index, 1);
          }
        });
        resolve(true);
      }, 500);
    });
  }

  // 更新课程状态
  async updateCourseStatus(id: number, status: Course['status']): Promise<Course> {
    return this.updateCourse(id, { status });
  }

  // 搜索课程
  async searchCourses(query: string): Promise<Course[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.courses.filter(course =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          course.instructor.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按分类筛选课程
  async getCoursesByCategory(category: string): Promise<Course[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.courses.filter(course => course.category === category);
        resolve([...filtered]);
      }, 200);
    });
  }

  // 按状态筛选课程
  async getCoursesByStatus(status: Course['status']): Promise<Course[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.courses.filter(course => course.status === status);
        resolve([...filtered]);
      }, 200);
    });
  }

  // 获取课程统计
  async getCourseStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: this.courses.length,
          published: this.courses.filter(c => c.status === 'published').length,
          draft: this.courses.filter(c => c.status === 'draft').length,
          archived: this.courses.filter(c => c.status === 'archived').length,
          hot: this.courses.filter(c => c.isHot).length,
          new: this.courses.filter(c => c.isNew).length,
          free: this.courses.filter(c => c.isFree).length
        };
        resolve(stats);
      }, 100);
    });
  }

  // 获取所有分类
  async getCategories(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = [...new Set(this.courses.map(c => c.category))];
        resolve(categories);
      }, 100);
    });
  }

  // 获取所有讲师
  async getInstructors() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const instructors = this.courses.map(c => c.instructor);
        const uniqueInstructors = instructors.filter((instructor, index, self) =>
          index === self.findIndex(i => i.id === instructor.id)
        );
        resolve(uniqueInstructors);
      }, 200);
    });
  }
}

export const courseManager = new CourseManager(); 