import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Clock, Users, Star, CheckCircle, ArrowRight, 
  BookOpen, Code, Zap, Target, Award, TrendingUp,
  Calendar, MapPin, Video, FileText, Download,
  Heart, Share2, MessageCircle, Eye, ArrowLeft,
  Presentation
} from 'lucide-react';
import Button from '../components/ui/Button';
import PPTViewer from '../components/PPTViewer';
import VideoPlayer from '../components/VideoPlayer';
import { millionDollarCourseSlides } from '../data/millionDollarCourseSlides';

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
  modules: CourseModule[];
  reviews: CourseReview[];
}

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showPPT, setShowPPT] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // 百万应用公开课视频链接
  const MILLION_DOLLAR_COURSE_VIDEO_URL = "https://ssswork.oss-cn-hangzhou.aliyuncs.com/%E7%99%BE%E4%B8%87%E5%BA%94%E7%94%A8%E5%88%9B%E6%96%B0%E5%85%AC%E5%BC%80%E8%AF%BE.mp4";

  // 模拟课程数据
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
      isFree: false,
      modules: [
        {
          id: 1,
          title: "免费公开课：抓住AI红利的100分钟",
          description: "认知升级、选题清单、入营测试",
          duration: "100分钟",
          lessons: 6,
          isFree: true,
          topics: ["AI红利分析", "真需求三角", "六维打分法", "Prompt Demo", "营收公式", "入营测验"]
        },
        {
          id: 2,
          title: "Week 1：定位&需求",
          description: "选题落地——方向焦虑清零",
          duration: "3小时",
          lessons: 5,
          isFree: false,
          topics: ["红利方法论", "痛点池共创", "六维打分", "访谈脚本", "问题陈述"]
        },
        {
          id: 3,
          title: "Week 2：MVP成型",
          description: "首个可跑Demo，上线测试链接",
          duration: "3小时",
          lessons: 5,
          isFree: false,
          topics: ["用神指标", "Live Coding", "Evals介绍", "PRD v1", "MVP v0"]
        },
        {
          id: 4,
          title: "Week 3：工具+RAG",
          description: "'能用→好用'体验跳级",
          duration: "3小时",
          lessons: 6,
          isFree: false,
          topics: ["Function Calling", "API集成", "Mini-RAG", "Cloudflare部署", "正确率提升"]
        },
        {
          id: 5,
          title: "Week 4：付费验证&ROI",
          description: "第一次真实收入+实时成本收益",
          duration: "3小时",
          lessons: 6,
          isFree: false,
          topics: ["定价公式", "支付集成", "Grafana Dashboard", "诊断漏斗", "首批营收"]
        },
        {
          id: 6,
          title: "Week 5：成本&路演",
          description: "可复制盈利模型+投资人渠道对接",
          duration: "3小时",
          lessons: 5,
          isFree: false,
          topics: ["降本三板斧", "成本压测", "Demo Day", "投融资FAQ", "增长计划"]
        }
      ],
      reviews: [
        {
          id: 1,
          name: "张小明",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
          rating: 5,
          comment: "5周创业营太棒了！我已经成功上线了第一个AI应用，月收入过万！",
          date: "2024-01-15",
          verified: true
        },
        {
          id: 2,
          name: "李小红",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
          rating: 5,
          comment: "从免费公开课到付费验证，整个流程设计非常合理，导师指导很专业！",
          date: "2024-01-10",
          verified: true
        },
        {
          id: 3,
          name: "王大力",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
          rating: 5,
          comment: "Demo Day上获得了投资人关注，现在正在谈融资，感谢这个课程！",
          date: "2024-01-08",
          verified: true
        }
      ]
    }
  ];

  useEffect(() => {
    const courseId = parseInt(id || '1');
    const foundCourse = courses.find(c => c.id === courseId);
    setCourse(foundCourse || courses[0]);
  }, [id]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 返回按钮 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/courses"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回课程列表
        </Link>
      </div>

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
                {course.isHot ? '热门课程' : course.isNew ? '新课推荐' : '精品课程'}
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {course.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-2 text-emerald-400" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  <span>{course.students.toLocaleString()} 学员</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Star className="w-5 h-5 mr-2 text-emerald-400" />
                  <span>{course.rating} 分</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/course/${course.id}/learn`}>
                  <Button
                    className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {course.isFree ? '免费学习' : '立即报名'}
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowPPT(true)}
                  className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <Presentation className="w-5 h-5 mr-2" />
                  查看PPT
                </Button>
                <Button
                  variant="ghost"
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
                {showVideo ? (
                  <VideoPlayer
                    src={MILLION_DOLLAR_COURSE_VIDEO_URL}
                    title="价值百万的AI应用公开课"
                    className="aspect-video"
                  />
                ) : (
                  <>
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer" onClick={() => setShowVideo(true)}>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-emerald-500/30 transition-colors">
                          <Play className="w-8 h-8 text-emerald-400" />
                        </div>
                        <p className="text-gray-400">点击观看课程预览视频</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <p className="font-semibold">{course.modules[0]?.title}</p>
                          <p className="text-sm text-gray-300">免费试看</p>
                        </div>
                        <div className="text-emerald-400">
                          <Play className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
                        <div className="text-2xl font-bold text-emerald-400">89%</div>
                        <div className="text-sm text-gray-400">完成率</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-400">¥15,000</div>
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
                {course.modules.map((module, index) => (
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
                        <span className="text-2xl font-bold text-emerald-400 mr-2">{course.rating}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= course.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">评价数量</span>
                      <span className="text-white font-semibold">{course.reviews.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">学员数量</span>
                      <span className="text-white font-semibold">{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 学员评价 */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">学员评价</h3>
                  {course.reviews.map((review) => (
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
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`}
                        alt={course.instructor}
                        className="w-24 h-24 rounded-full"
                      />
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{course.instructor}</h3>
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
                <span className="text-2xl font-bold text-emerald-400">¥{course.originalPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">优惠价格</span>
                <span className="text-xl font-bold text-white">¥{course.price}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span>节省</span>
                <span>¥{course.originalPrice - course.price}</span>
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
      
      {/* PPT查看器 */}
      <PPTViewer
        isOpen={showPPT}
        onClose={() => setShowPPT(false)}
        slides={millionDollarCourseSlides}
        title="价值百万的AI应用公开课"
      />
    </div>
  );
};

export default CourseDetailPage; 