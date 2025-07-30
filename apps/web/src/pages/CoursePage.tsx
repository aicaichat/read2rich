import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Clock, Users, Star, CheckCircle, ArrowRight, 
  BookOpen, Code, Zap, Target, Award, TrendingUp,
  Calendar, MapPin, Video, FileText, Download,
  Heart, Share2, MessageCircle, Eye
} from 'lucide-react';
import Button from '../components/ui/Button';

interface CourseModule {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  isFree: boolean;
  topics: string[];
}

interface CourseReview {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const CoursePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const courseModules: CourseModule[] = [
    {
      id: 1,
      title: "第1章：AI时代的产品思维",
      description: "掌握AI驱动的产品设计思维，从0到1构建产品愿景",
      duration: "2小时",
      lessons: 8,
      isFree: true,
      topics: ["AI产品思维", "用户需求分析", "市场定位", "竞品分析"]
    },
    {
      id: 2,
      title: "第2章：需求澄清与PRD撰写",
      description: "学会用AI工具快速澄清需求，生成专业的产品需求文档",
      duration: "3小时",
      lessons: 12,
      isFree: false,
      topics: ["需求澄清技巧", "PRD模板", "用户故事", "验收标准"]
    },
    {
      id: 3,
      title: "第3章：技术架构设计",
      description: "掌握现代技术栈选择，设计可扩展的系统架构",
      duration: "4小时",
      lessons: 15,
      isFree: false,
      topics: ["技术选型", "架构设计", "数据库设计", "API设计"]
    },
    {
      id: 4,
      title: "第4章：AI代码生成实战",
      description: "使用AI工具快速生成高质量代码，提升开发效率10倍",
      duration: "5小时",
      lessons: 18,
      isFree: false,
      topics: ["AI代码生成", "代码优化", "测试编写", "部署流程"]
    },
    {
      id: 5,
      title: "第5章：产品上线与运营",
      description: "从产品发布到用户增长，掌握完整的运营策略",
      duration: "3小时",
      lessons: 10,
      isFree: false,
      topics: ["产品发布", "用户获取", "数据分析", "迭代优化"]
    }
  ];

  const courseReviews: CourseReview[] = [
    {
      id: 1,
      name: "张小明",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      rating: 5,
      comment: "这门课程彻底改变了我的开发方式，AI工具让我的效率提升了5倍！",
      date: "2024-01-15",
      verified: true
    },
    {
      id: 2,
      name: "李小红",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      rating: 5,
      comment: "从产品经理的角度学习AI开发，思路非常清晰，强烈推荐！",
      date: "2024-01-10",
      verified: true
    },
    {
      id: 3,
      name: "王大力",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      rating: 5,
      comment: "学完这门课，我已经成功开发了3个应用，收入翻了一番！",
      date: "2024-01-08",
      verified: true
    }
  ];

  const courseStats = {
    students: 2847,
    rating: 4.9,
    reviews: 156,
    completionRate: 89,
    avgSalary: 15000
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 课程头部 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                热门课程
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                人人都该上的
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400">
                  百万应用创作课
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                从产品思维到技术实现，从0到1掌握AI时代的应用开发全流程。
                学会用AI工具10倍提升开发效率，打造属于自己的百万级应用。
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-2 text-emerald-400" />
                  <span>17小时课程</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  <span>{courseStats.students.toLocaleString()} 学员</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Star className="w-5 h-5 mr-2 text-emerald-400" />
                  <span>{courseStats.rating} 分 ({courseStats.reviews} 评价)</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setShowEnrollModal(true)}
                  className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  立即报名
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <Video className="w-5 h-5 mr-2" />
                  免费试看
                </Button>
              </div>
            </motion.div>
            
            {/* 右侧视频预览 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="text-gray-400">课程预览视频</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <p className="font-semibold">第1章：AI时代的产品思维</p>
                      <p className="text-sm text-gray-300">免费试看</p>
                    </div>
                    <div className="text-emerald-400">
                      <Play className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 课程内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 标签页导航 */}
        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { id: 'overview', label: '课程概览', icon: BookOpen },
            { id: 'curriculum', label: '课程大纲', icon: Code },
            { id: 'reviews', label: '学员评价', icon: Star },
            { id: 'instructor', label: '讲师介绍', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 课程特色 */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">课程特色</h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Zap,
                        title: "AI驱动开发",
                        description: "掌握最新的AI工具，10倍提升开发效率"
                      },
                      {
                        icon: Target,
                        title: "实战项目",
                        description: "从0到1完成3个真实项目，积累实战经验"
                      },
                      {
                        icon: Award,
                        title: "就业指导",
                        description: "提供职业规划建议，助你找到理想工作"
                      },
                      {
                        icon: Users,
                        title: "社群支持",
                        description: "加入学员社群，与同行交流学习"
                      }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                          <p className="text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 学习成果 */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">你将学会</h3>
                  <div className="space-y-4">
                    {[
                      "掌握AI时代的产品设计思维",
                      "学会用AI工具快速生成代码",
                      "掌握现代技术栈和架构设计",
                      "学会产品上线和运营策略",
                      "获得3个完整的项目作品",
                      "建立个人技术品牌"
                    ].map((skill, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-xl border border-emerald-500/20">
                    <h4 className="text-lg font-semibold text-white mb-4">课程数据</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-400">{courseStats.completionRate}%</div>
                        <div className="text-sm text-gray-400">完成率</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-400">¥{courseStats.avgSalary.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">平均薪资</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'curriculum' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                {courseModules.map((module, index) => (
                  <div
                    key={module.id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-400 font-bold">{module.id}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
                          <p className="text-gray-300">{module.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {module.duration}
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {module.lessons} 课时
                        </div>
                        {module.isFree && (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                            免费
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {module.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {module.isFree ? '免费试看' : '查看详情'}
                      </Button>
                      {!module.isFree && (
                        <span className="text-lg font-semibold text-white">¥299</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 评价统计 */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-6">评价统计</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">总体评分</span>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-emerald-400 mr-2">{courseStats.rating}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= courseStats.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">评价数量</span>
                      <span className="text-white font-semibold">{courseStats.reviews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">学员数量</span>
                      <span className="text-white font-semibold">{courseStats.students.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 学员评价 */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">学员评价</h3>
                  {courseReviews.map((review) => (
                    <div key={review.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-start space-x-4 mb-4">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-white">{review.name}</span>
                            {review.verified && (
                              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                                已认证
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'instructor' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 讲师信息 */}
                <div>
                  <div className="bg-white/5 rounded-xl p-8 border border-white/10">
                    <div className="flex items-center space-x-6 mb-6">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=instructor"
                        alt="讲师头像"
                        className="w-24 h-24 rounded-full"
                      />
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">张教授</h3>
                        <p className="text-emerald-400 mb-2">AI产品专家 / 技术架构师</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>10年+ 经验</span>
                          <span>•</span>
                          <span>500+ 学员</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed mb-6">
                      资深AI产品专家，拥有10年以上的产品设计和开发经验。
                      曾主导多个百万级用户产品的设计和开发，对AI时代的应用开发有深入的研究和实践。
                      致力于帮助更多人掌握AI工具，实现技术创业梦想。
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-400">10+</div>
                        <div className="text-sm text-gray-400">年经验</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-400">500+</div>
                        <div className="text-sm text-gray-400">学员</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 讲师成就 */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">专业成就</h3>
                  <div className="space-y-4">
                    {[
                      "前阿里巴巴高级产品经理",
                      "多个百万级用户产品负责人",
                      "AI产品设计专家认证",
                      "技术创业导师",
                      "《AI时代产品设计》作者",
                      "多个技术大会演讲嘉宾"
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-gray-300">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 报名弹窗 */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-6">课程报名</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">课程价格</span>
                <span className="text-2xl font-bold text-emerald-400">¥999</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">优惠价格</span>
                <span className="text-xl font-bold text-white">¥599</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span>节省</span>
                <span>¥400</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => setShowEnrollModal(false)}
                className="w-full bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
              >
                立即报名
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowEnrollModal(false)}
                className="w-full text-gray-400 hover:text-white"
              >
                取消
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CoursePage; 