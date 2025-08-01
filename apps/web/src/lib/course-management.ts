import { apiClient } from './api-client';
import { instructorManager } from './instructor-management';

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
  description?: string;
  duration?: string;
  videoUrl?: string;
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
  modules: CourseModule[];
}

// 后端API课程管理器
class CourseManager {
  // 获取所有课程
  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<{courses: Course[], total: number, page: number, size: number}>('/courses/');
      const courses = response.courses || [];
      
      // 为每个课程获取讲师信息
      const coursesWithInstructor = await Promise.all(
        courses.map(async (course) => {
          const instructor = await instructorManager.getInstructorById(course.instructor_id);
          return {
            ...course,
            instructor: instructor ? {
              id: instructor.id,
              name: instructor.name,
              email: instructor.email,
              avatar: instructor.avatar,
              bio: instructor.bio
            } : {
              id: 0,
              name: '未知讲师',
              email: '',
              avatar: '',
              bio: ''
            }
          };
        })
      );
      
      return coursesWithInstructor;
    } catch (error) {
      console.error('获取课程列表失败:', error);
      throw error;
    }
  }

  // 根据ID获取课程
  async getCourseById(id: number): Promise<Course | null> {
    try {
      const response = await apiClient.get<Course>(`/courses/${id}/with-instructor`);
      return response;
    } catch (error) {
      console.error(`获取课程 ${id} 失败:`, error);
      return null;
    }
  }

  // 创建新课程
  async createCourse(data: CourseFormData): Promise<Course> {
    try {
      // 转换数据格式以匹配后端API
      const apiData = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        instructor_id: data.instructorId,
        price: data.price,
        original_price: data.originalPrice,
        level: data.level,
        category: data.category,
        status: data.status,
        is_hot: data.isHot,
        is_new: data.isNew,
        is_free: data.isFree,
        tags: data.tags,
        image: data.image,
        video_url: data.videoUrl,
        modules: data.modules
      };

      const response = await apiClient.post<Course>('/courses/', apiData);
      console.log('✅ 新课程创建成功:', response.title);
      
      // 获取完整的课程信息（包含讲师）
      const fullCourse = await this.getCourseById(response.id);
      return fullCourse || response;
    } catch (error) {
      console.error('❌ 创建课程失败:', error);
      throw error;
    }
  }

  // 更新课程
  async updateCourse(id: number, data: Partial<CourseFormData>): Promise<Course> {
    try {
      // 转换数据格式以匹配后端API
      const apiData: any = {};
      if (data.title !== undefined) apiData.title = data.title;
      if (data.subtitle !== undefined) apiData.subtitle = data.subtitle;
      if (data.description !== undefined) apiData.description = data.description;
      if (data.instructorId !== undefined) apiData.instructor_id = data.instructorId;
      if (data.price !== undefined) apiData.price = data.price;
      if (data.originalPrice !== undefined) apiData.original_price = data.originalPrice;
      if (data.level !== undefined) apiData.level = data.level;
      if (data.category !== undefined) apiData.category = data.category;
      if (data.status !== undefined) apiData.status = data.status;
      if (data.isHot !== undefined) apiData.is_hot = data.isHot;
      if (data.isNew !== undefined) apiData.is_new = data.isNew;
      if (data.isFree !== undefined) apiData.is_free = data.isFree;
      if (data.tags !== undefined) apiData.tags = data.tags;
      if (data.image !== undefined) apiData.image = data.image;
      if (data.videoUrl !== undefined) apiData.video_url = data.videoUrl;
      if (data.modules !== undefined) apiData.modules = data.modules;

      const response = await apiClient.put<Course>(`/courses/${id}`, apiData);
      console.log('✅ 课程更新成功:', response.title);
      
      // 获取完整的课程信息（包含讲师）
      const fullCourse = await this.getCourseById(response.id);
      return fullCourse || response;
    } catch (error) {
      console.error('❌ 更新课程失败:', error);
      throw error;
    }
  }

  // 删除课程
  async deleteCourse(id: number): Promise<boolean> {
    try {
      await apiClient.delete(`/courses/${id}`);
      console.log('✅ 课程删除成功');
      return true;
    } catch (error) {
      console.error('❌ 删除课程失败:', error);
      throw error;
    }
  }

  // 批量删除课程
  async deleteCourses(ids: number[]): Promise<boolean> {
    try {
      await apiClient.delete(`/courses/bulk-delete/`, { ids });
      console.log('✅ 批量课程删除成功');
      return true;
    } catch (error) {
      console.error('❌ 批量删除课程失败:', error);
      throw error;
    }
  }

  // 更新课程状态
  async updateCourseStatus(id: number, status: Course['status']): Promise<Course> {
    return this.updateCourse(id, { status });
  }

  // 获取课程统计
  async getCourseStats() {
    try {
      const response = await apiClient.get<{
        total: number;
        published: number;
        draft: number;
        archived: number;
        total_students: number;
        avg_rating: number;
        total_revenue: number;
      }>('/courses/stats/summary');
      
      return {
        total: response.total,
        published: response.published,
        draft: response.draft,
        archived: response.archived,
        totalStudents: response.total_students,
        avgRating: response.avg_rating,
        totalRevenue: response.total_revenue
      };
    } catch (error) {
      console.error('获取课程统计失败:', error);
      return {
        total: 0,
        published: 0,
        draft: 0,
        archived: 0,
        totalStudents: 0,
        avgRating: 0,
        totalRevenue: 0
      };
    }
  }

  // 获取课程分类
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<{categories: string[]}>('/courses/categories/list');
      return response.categories || [];
    } catch (error) {
      console.error('获取课程分类失败:', error);
      return [];
    }
  }

  // 获取所有讲师
  async getInstructors() {
    return instructorManager.getInstructors();
  }
}

// 导出单例实例
export const courseManager = new CourseManager(); 