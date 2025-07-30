import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Play, Clock, Users, Star, BookOpen, Code, Zap, Target, 
  Award, TrendingUp, Filter, Search, ArrowRight, Video,
  FileText, Download, Heart, Share2, MessageCircle, Eye
} from 'lucide-react';
import Button from '../components/ui/Button';

interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice: number;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  image: string;
  isHot: boolean;
  isNew: boolean;
  isFree: boolean;
}

const CourseListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const courses: Course[] = [
    {
      id: 1,
      title: "价值百万的AI应用创新课程",
      subtitle: "5周创业营：从0到1打造可收费AI应用",
      description: "免费公开课帮你锁定'真需求'，5周创业营把它变成能赚钱的AI应用。每周3小时工作坊，5周内完成可收费MVP、ROI仪表盘、3分钟Demo+Pitch Deck，实现首批真实营收或50 DAU。",
      instructor: "张教授",
      price: 6499,
      originalPrice: 6999,
      rating: 4.9,
      students: 2847,
      duration: "15小时",
      lessons: 25,
      level: "intermediate",
      category: "AI开发",
      tags: ["AI开发", "创业", "产品设计", "商业模式", "MVP"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      isHot: true,
      isNew: true,
      isFree: false
    },
    {
      id: 2,
      title: "AI产品经理实战课程",
      subtitle: "掌握AI时代的产品设计思维",
      description: "学习如何设计AI驱动的产品，掌握用户需求分析、产品规划、原型设计等核心技能。",
      instructor: "李老师",
      price: 0,
      originalPrice: 799,
      rating: 4.8,
      students: 1567,
      duration: "12小时",
      lessons: 45,
      level: "intermediate",
      category: "产品设计",
      tags: ["产品经理", "AI产品", "用户研究", "原型设计"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      isHot: false,
      isNew: true,
      isFree: true
    },
    {
      id: 3,
      title: "ChatGPT编程实战",
      subtitle: "用AI助手提升编程效率",
      description: "深入学习ChatGPT在编程中的应用，掌握提示词工程，提升代码质量和开发效率。",
      instructor: "王工程师",
      price: 399,
      originalPrice: 599,
      rating: 4.7,
      students: 2134,
      duration: "15小时",
      lessons: 52,
      level: "intermediate",
      category: "编程",
      tags: ["ChatGPT", "编程", "AI助手", "效率提升"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      isHot: true,
      isNew: false,
      isFree: false
    },
    {
      id: 4,
      title: "AI创业实战指南",
      subtitle: "从想法到商业化的完整路径",
      description: "学习如何将AI创意转化为商业产品，掌握市场分析、商业模式设计、融资策略等关键技能。",
      instructor: "陈导师",
      price: 799,
      originalPrice: 1299,
      rating: 4.9,
      students: 892,
      duration: "20小时",
      lessons: 78,
      level: "advanced",
      category: "创业",
      tags: ["AI创业", "商业模式", "融资", "商业化"],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      isHot: false,
      isNew: false,
      isFree: false
    },
    {
      id: 5,
      title: "AI数据分析师",
      subtitle: "用AI工具做数据分析",
      description: "学习使用AI工具进行数据分析，掌握数据可视化、机器学习、商业智能等技能。",
      instructor: "刘分析师",
      price: 499,
      originalPrice: 799,
      rating: 4.6,
      students: 1345,
      duration: "14小时",
      lessons: 48,
      level: "intermediate",
      category: "数据分析",
      tags: ["数据分析", "AI工具", "可视化", "机器学习"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      isHot: false,
      isNew: true,
      isFree: false
    },
    {
      id: 6,
      title: "AI营销自动化",
      subtitle: "用AI提升营销效果",
      description: "学习如何使用AI工具自动化营销流程，提升客户获取和转化效率。",
      instructor: "赵营销师",
      price: 299,
      originalPrice: 499,
      rating: 4.5,
      students: 987,
      duration: "10小时",
      lessons: 35,
      level: "beginner",
      category: "营销",
      tags: ["AI营销", "自动化", "客户获取", "转化优化"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      isHot: false,
      isNew: false,
      isFree: false
    }
  ];

  const categories = [
    { id: 'all', name: '全部课程', icon: BookOpen },
    { id: 'AI开发', name: 'AI开发', icon: Code },
    { id: '产品设计', name: '产品设计', icon: Target },
    { id: '编程', name: '编程', icon: Code },
    { id: '创业', name: '创业', icon: TrendingUp },
    { id: '数据分析', name: '数据分析', icon: Award },
    { id: '营销', name: '营销', icon: Zap }
  ];

  const levels = [
    { id: 'all', name: '全部级别' },
    { id: 'beginner', name: '初级' },
    { id: 'intermediate', name: '中级' },
    { id: 'advanced', name: '高级' }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 页面头部 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              探索
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400">
                AI课程
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              精选优质AI课程，助你掌握AI时代的核心技能，实现职业转型和技能提升
            </p>
            
            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索课程、技能或讲师..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 focus:bg-white/15"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>

          {/* 级别筛选 */}
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedLevel === level.id
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        {/* 课程统计 */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-gray-300">
            找到 <span className="text-white font-semibold">{filteredCourses.length}</span> 门课程
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>排序:</span>
            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option>推荐</option>
              <option>最新</option>
              <option>最热</option>
              <option>价格</option>
            </select>
          </div>
        </div>

        {/* 课程网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/course/${course.id}`}>
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
                  {/* 课程图片 */}
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {course.isHot && (
                        <span className="px-2 py-1 bg-red-500/80 text-white text-xs rounded-full">
                          热门
                        </span>
                      )}
                      {course.isNew && (
                        <span className="px-2 py-1 bg-emerald-500/80 text-white text-xs rounded-full">
                          新课
                        </span>
                      )}
                      {course.isFree && (
                        <span className="px-2 py-1 bg-blue-500/80 text-white text-xs rounded-full">
                          免费
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* 课程内容 */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {levels.find(l => l.id === course.level)?.name}
                      </span>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm ml-1">{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {course.subtitle}
                    </p>

                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="mr-4">{course.duration}</span>
                      <FileText className="w-4 h-4 mr-1" />
                      <span className="mr-4">{course.lessons} 课时</span>
                      <Users className="w-4 h-4 mr-1" />
                      <span>{course.students.toLocaleString()} 学员</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`}
                          alt={course.instructor}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-400">{course.instructor}</span>
                      </div>
                      <div className="text-right">
                        {course.isFree ? (
                          <span className="text-emerald-400 font-semibold">免费</span>
                        ) : (
                          <div>
                            <span className="text-white font-semibold">¥{course.price}</span>
                            {course.originalPrice > course.price && (
                              <span className="text-gray-500 line-through text-sm ml-2">¥{course.originalPrice}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 加载更多 */}
        {filteredCourses.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="ghost"
              className="border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-8 py-3 rounded-xl"
            >
              加载更多课程
            </Button>
          </div>
        )}

        {/* 空状态 */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">没有找到相关课程</h3>
            <p className="text-gray-500 mb-6">尝试调整搜索条件或筛选器</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg"
            >
              重置筛选
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListPage; 