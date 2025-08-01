import { apiClient } from './api-client';

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

// 后端API讲师管理器
class InstructorManager {
  // 获取所有讲师
  async getAllInstructors(): Promise<Instructor[]> {
    try {
      const response = await apiClient.get<{instructors: Instructor[], total: number, page: number, size: number}>('/instructors/');
      return response.instructors || [];
    } catch (error) {
      console.error('获取讲师列表失败:', error);
      throw error;
    }
  }

  // 根据ID获取讲师
  async getInstructorById(id: number): Promise<Instructor | null> {
    try {
      const response = await apiClient.get<Instructor>(`/instructors/${id}`);
      return response;
    } catch (error) {
      console.error(`获取讲师 ${id} 失败:`, error);
      return null;
    }
  }

  // 创建新讲师
  async createInstructor(data: InstructorFormData): Promise<Instructor> {
    try {
      const response = await apiClient.post<Instructor>('/instructors/', data);
      console.log('✅ 新讲师创建成功:', response.name);
      return response;
    } catch (error) {
      console.error('❌ 创建讲师失败:', error);
      throw error;
    }
  }

  // 更新讲师
  async updateInstructor(id: number, data: Partial<InstructorFormData>): Promise<Instructor> {
    try {
      const response = await apiClient.put<Instructor>(`/instructors/${id}`, data);
      console.log('✅ 讲师信息更新成功:', response.name);
      return response;
    } catch (error) {
      console.error('❌ 更新讲师失败:', error);
      throw error;
    }
  }

  // 删除讲师
  async deleteInstructor(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/instructors/${id}`);
      console.log('✅ 讲师删除成功');
      return true;
    } catch (error) {
      console.error('❌ 删除讲师失败:', error);
      throw error;
    }
  }

  // 批量删除讲师
  async deleteInstructors(ids: number[]): Promise<boolean> {
    try {
      // 逐个删除，因为后端没有批量删除接口
      for (const id of ids) {
        await this.deleteInstructor(id);
      }
      return true;
    } catch (error) {
      console.error('❌ 批量删除讲师失败:', error);
      throw error;
    }
  }

  // 更新讲师状态
  async updateInstructorStatus(id: number, status: Instructor['status']): Promise<Instructor> {
    return this.updateInstructor(id, { status });
  }

  // 搜索讲师
  async searchInstructors(query: string): Promise<Instructor[]> {
    try {
      // 后端API不支持搜索，这里在前端过滤
      const allInstructors = await this.getAllInstructors();
      return allInstructors.filter(instructor =>
        instructor.name.toLowerCase().includes(query.toLowerCase()) ||
        instructor.title.toLowerCase().includes(query.toLowerCase()) ||
        instructor.expertise.some(exp => exp.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error('搜索讲师失败:', error);
      return [];
    }
  }

  // 按状态筛选讲师
  async getInstructorsByStatus(status: Instructor['status']): Promise<Instructor[]> {
    try {
      const response = await apiClient.get<{instructors: Instructor[], total: number, page: number, size: number}>('/instructors/', { status });
      return response.instructors || [];
    } catch (error) {
      console.error('按状态筛选讲师失败:', error);
      return [];
    }
  }

  // 按专业领域筛选讲师
  async getInstructorsByExpertise(expertise: string): Promise<Instructor[]> {
    try {
      const response = await apiClient.get<{instructors: Instructor[], total: number, page: number, size: number}>('/instructors/', { expertise });
      return response.instructors || [];
    } catch (error) {
      console.error('按专业领域筛选讲师失败:', error);
      return [];
    }
  }

  // 获取讲师统计
  async getInstructorStats() {
    try {
      const response = await apiClient.get<{
        total: number;
        active: number;
        inactive: number;
        pending: number;
        total_students: number;
        avg_rating: number;
      }>('/instructors/stats/summary');
      
      return {
        total: response.total,
        active: response.active,
        inactive: response.inactive,
        pending: response.pending,
        totalStudents: response.total_students,
        avgRating: response.avg_rating
      };
    } catch (error) {
      console.error('获取讲师统计失败:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        totalStudents: 0,
        avgRating: 0
      };
    }
  }

  // 获取专业领域列表
  async getExpertiseAreas(): Promise<string[]> {
    try {
      const response = await apiClient.get<{areas: string[]}>('/instructors/expertise/areas');
      return response.areas || [];
    } catch (error) {
      console.error('获取专业领域失败:', error);
      return [];
    }
  }

  // 获取职称列表
  async getTitles(): Promise<string[]> {
    try {
      const response = await apiClient.get<{titles: string[]}>('/instructors/titles/list');
      return response.titles || [];
    } catch (error) {
      console.error('获取职称失败:', error);
      return [];
    }
  }
}

// 导出单例实例
export const instructorManager = new InstructorManager(); 