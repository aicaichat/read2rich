import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, Calendar, Users, Award, 
  BookOpen, Play, MessageCircle, Share2,
  Linkedin, Twitter, Globe, Github,
  TrendingUp, Code, Briefcase, GraduationCap,
  ChevronRight, ArrowLeft, Video, FileText,
  Trophy, Target, Zap, Heart
} from 'lucide-react';
import Button from '../components/ui/Button';

interface InstructorDetail {
  id: number;
  name: string;
  englishName: string;
  title: string;
  company: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  joinDate: string;
  rating: number;
  students: number;
  courses: number;
  
  // 详细背景
  education: {
    degree: string;
    university: string;
    year: string;
    major: string;
  }[];
  
  experience: {
    position: string;
    company: string;
    duration: string;
    description: string;
    achievements: string[];
  }[];
  
  expertise: string[];
  certifications: string[];
  languages: string[];
  
  // 成就与数据
  achievements: {
    title: string;
    description: string;
    icon: React.ReactNode;
    metric: string;
  }[];
  
  // 社交链接
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  
  // 教学内容
  teachingAreas: string[];
  courseList: {
    id: number;
    title: string;
    students: number;
    rating: number;
    thumbnail: string;
  }[];
  
  // 学员评价
  reviews: {
    id: number;
    studentName: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
    course: string;
  }[];
  
  // 媒体内容
  videos: {
    id: number;
    title: string;
    thumbnail: string;
    duration: string;
    views: number;
  }[];
  
  articles: {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
  }[];
}

const InstructorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟讲师数据 - 这里使用我们之前定义的Neo Li作为示例
  const instructor: InstructorDetail = {
    id: 1,
    name: "栗志果",
    englishName: "Jobs Lee",
    title: "前蚂蚁科技高级产品专家 & AI应用导师",
    company: "深度需求科技",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jobslee&gender=male&facialHair=BeardMedium&facialHairColor=Black&hair=ShortHairShortCurly&hairColor=Black&accessories=Prescription02&clotheType=Hoodie&clotheColor=Black",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop",
    bio: "前蚂蚁科技高级产品专家，AI应用创新实践者，南京大学计算机硕士。专注于将前沿AI技术转化为可落地的商业产品，帮助创业者和企业在AI时代获得竞争优势。",
    location: "南京·北京",
    joinDate: "2020-01",
    rating: 4.9,
    students: 2847,
    courses: 15,
    
    education: [
      {
        degree: "计算机科学硕士",
        university: "南京大学",
        year: "2018",
        major: "人工智能与机器学习"
      },
      {
        degree: "计算机科学学士",
        university: "南京大学",
        year: "2016",
        major: "软件工程"
      }
    ],
    
    experience: [
      {
        position: "创始人 & CEO",
        company: "深度需求科技",
        duration: "2020 - 至今",
        description: "创立AI驱动的产品开发平台，帮助企业快速验证和构建AI应用",
        achievements: [
          "完成A轮5000万融资",
          "服务500+企业客户",
          "平台年收入增长300%",
          "团队规模从3人增长到80人"
        ]
      },
      {
        position: "高级产品专家",
        company: "蚂蚁科技",
        duration: "2018 - 2020",
        description: "负责蚂蚁科技AI产品线的战略规划和产品开发",
        achievements: [
          "主导3个亿级MAU产品的开发",
          "获得公司年度最佳产品奖",
          "申请AI相关专利20+项",
          "团队管理60+名工程师和产品经理"
        ]
      },
      {
        position: "产品经理",
        company: "阿里云",
        duration: "2016 - 2018",
        description: "负责云计算AI平台的产品设计和用户体验优化",
        achievements: [
          "用户留存率提升40%",
          "月活跃用户增长150%",
          "获得公司创新奖",
          "建立了第一个AI产品方法论"
        ]
      }
    ],
    
    expertise: [
      "AI产品设计", "商业模式创新", "技术架构", "团队管理", 
      "用户体验设计", "数据分析", "增长策略", "投融资"
    ],
    
    certifications: [
      "阿里云AI认证专家",
      "蚂蚁金服产品专家认证",
      "PMP项目管理认证",
      "AWS解决方案架构师"
    ],
    
    languages: ["中文(母语)", "英文(流利)", "日文(基础)"],
    
    achievements: [
      {
        title: "3个亿级产品",
        description: "成功打造并运营3个亿级AI产品",
        icon: <Users className="w-8 h-8" />,
        metric: "3 亿级产品"
      },
      {
        title: "100+发明专利",
        description: "在AI领域拥有100多项发明专利，技术创新能力突出",
        icon: <Award className="w-8 h-8" />,
        metric: "100+ 专利"
      },
      {
        title: "投资孵化记录",
        description: "投资孵化10+AI独角兽项目，累计融资超过10亿美元",
        icon: <TrendingUp className="w-8 h-8" />,
        metric: "$10亿+ 融资"
      },

    ],
    
    socialLinks: {
      linkedin: "https://linkedin.com/in/jobs-lee",
      twitter: "https://twitter.com/jobs_lee_ai",
      github: "https://github.com/jobs-lee",
      website: "https://jobslee.tech"
    },
    
    teachingAreas: [
      "AI产品设计方法论",
      "从0到1的产品创新",
      "技术创业与融资",
      "团队管理与领导力",
      "商业模式设计",
      "用户体验与增长策略"
    ],
    
    courseList: [
      {
        id: 1,
        title: "价值百万的AI应用创新课程",
        students: 2847,
        rating: 4.9,
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"
      },
      {
        id: 2,
        title: "AI产品经理实战训练营",
        students: 1254,
        rating: 4.8,
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop"
      },
      {
        id: 3,
        title: "技术创业从想法到IPO",
        students: 856,
        rating: 4.7,
        thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop"
      }
    ],
    
    reviews: [
      {
        id: 1,
        studentName: "张小明",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang",
        rating: 5,
        comment: "李老师的课程改变了我的职业轨迹！从一个技术小白到现在运营着月收入过万的AI产品，感谢老师的悉心指导。",
        date: "2024-01-15",
        course: "价值百万的AI应用创新课程"
      },
      {
        id: 2,
        studentName: "王创业",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wang",
        rating: 5,
        comment: "老师不仅技术功底深厚，更重要的是有丰富的实战经验。课程中的案例都是真实项目，受益匪浅！",
        date: "2024-01-12",
        course: "AI产品经理实战训练营"
      },
      {
        id: 3,
        studentName: "李小红",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=li",
        rating: 5,
        comment: "跟着李老师学习了6个月，不仅技术能力提升了，更重要的是学会了产品思维和商业思维。现在已经拿到了Pre-A轮融资！",
        date: "2024-01-08",
        course: "技术创业从想法到IPO"
      }
    ],
    
    videos: [
      {
        id: 1,
        title: "AI时代的产品思维革命",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
        duration: "45:32",
        views: 125000
      },
      {
        id: 2,
        title: "从Google到创业：我的AI产品心得",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
        duration: "38:15",
        views: 98000
      },
      {
        id: 3,
        title: "如何在30天内验证AI产品想法",
        thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop",
        duration: "52:20",
        views: 156000
      }
    ],
    
    articles: [
      {
        id: 1,
        title: "AI产品经理必读：从技术到商业的完整指南",
        excerpt: "本文将从AI技术基础、产品设计方法论、商业模式创新三个维度，系统性地阐述AI产品经理需要掌握的核心能力...",
        date: "2024-01-20",
        readTime: "12 分钟"
      },
      {
        id: 2,
        title: "创业公司如何在AI浪潮中找到自己的定位",
        excerpt: "在AI技术快速发展的今天，创业公司面临着前所未有的机遇和挑战。本文将分享我在Google和创业过程中的思考...",
        date: "2024-01-15",
        readTime: "8 分钟"
      },
      {
        id: 3,
        title: "从0到1亿用户：AI产品增长的底层逻辑",
        excerpt: "通过分析我参与打造的3个亿级产品，总结出AI产品增长的核心要素和实战策略，希望对产品从业者有所帮助...",
        date: "2024-01-10",
        readTime: "15 分钟"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 返回按钮 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/ai-training"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回课程页面
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-80 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${instructor.coverImage})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-purple-500/20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-24">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
              <div className="relative">
                <img 
                  src={instructor.avatar} 
                  alt={instructor.name}
                  className="w-48 h-48 rounded-2xl border-4 border-white/10 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2">
                        {instructor.name} <span className="text-gray-400 text-2xl">({instructor.englishName})</span>
                      </h1>
                      <p className="text-xl text-emerald-400 mb-3">{instructor.title}</p>
                      <div className="flex items-center text-gray-400 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="mr-6">{instructor.location}</span>
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>加入于 {instructor.joinDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:items-end gap-4">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{instructor.rating}</div>
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-gray-400 ml-1 text-sm">评分</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{instructor.students.toLocaleString()}</div>
                          <div className="text-gray-400 text-sm">学员</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{instructor.courses}</div>
                          <div className="text-gray-400 text-sm">课程</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button variant="gradient" className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          联系导师
                        </Button>
                        <Button variant="secondary" className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          关注
                        </Button>
                        <Button variant="ghost" className="flex items-center gap-2">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">{instructor.bio}</p>
                  
                  {/* 社交链接 */}
                  <div className="flex items-center gap-4 mt-6">
                    {instructor.socialLinks.linkedin && (
                      <a href={instructor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                         className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {instructor.socialLinks.twitter && (
                      <a href={instructor.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {instructor.socialLinks.github && (
                      <a href={instructor.socialLinks.github} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-white transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {instructor.socialLinks.website && (
                      <a href={instructor.socialLinks.website} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-emerald-400 transition-colors">
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'overview', label: '概览', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'achievements', label: '成就', icon: <Trophy className="w-4 h-4" /> },
              { id: 'experience', label: '经历', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'courses', label: '课程', icon: <Play className="w-4 h-4" /> },
              { id: 'reviews', label: '评价', icon: <Star className="w-4 h-4" /> },
              { id: 'content', label: '内容', icon: <Video className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 专业技能 */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">专业领域</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {instructor.expertise.map((skill, index) => (
                      <motion.div
                        key={index}
                        className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-xl p-4 text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-white font-medium">{skill}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 教学领域 */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">教学方向</h2>
                  <div className="space-y-4">
                    {instructor.teachingAreas.map((area, index) => (
                      <div key={index} className="flex items-center">
                        <Target className="w-5 h-5 text-emerald-400 mr-3" />
                        <span className="text-gray-300">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 侧边栏信息 */}
              <div className="space-y-8">
                {/* 教育背景 */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-emerald-400" />
                    教育背景
                  </h3>
                  <div className="space-y-4">
                    {instructor.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-emerald-500/30 pl-4">
                        <div className="text-white font-medium">{edu.degree}</div>
                        <div className="text-emerald-400 text-sm">{edu.university}</div>
                        <div className="text-gray-400 text-sm">{edu.year} · {edu.major}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 认证证书 */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-emerald-400" />
                    专业认证
                  </h3>
                  <div className="space-y-2">
                    {instructor.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                        <span className="text-gray-300 text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 语言能力 */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-emerald-400" />
                    语言能力
                  </h3>
                  <div className="space-y-2">
                    {instructor.languages.map((lang, index) => (
                      <div key={index} className="text-gray-300 text-sm">{lang}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {instructor.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-slate-800/80 to-purple-900/20 backdrop-blur-sm border border-slate-700 rounded-2xl p-8"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-start">
                    <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400 mr-6">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                      <p className="text-gray-300 mb-4">{achievement.description}</p>
                      <div className="text-2xl font-bold text-emerald-400">{achievement.metric}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'experience' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              {instructor.experience.map((exp, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{exp.position}</h3>
                      <div className="text-lg text-emerald-400 mb-2">{exp.company}</div>
                      <div className="text-gray-400">{exp.duration}</div>
                    </div>
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                      <Briefcase className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">{exp.description}</p>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">主要成就</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {exp.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-center">
                          <ChevronRight className="w-4 h-4 text-emerald-400 mr-2" />
                          <span className="text-gray-300">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructor.courseList.map((course) => (
                <motion.div
                  key={course.id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      热门
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3">{course.title}</h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-white text-sm">{course.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students.toLocaleString()}
                      </div>
                    </div>
                    
                    <Button variant="gradient" size="sm" className="w-full">
                      查看课程
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              {instructor.reviews.map((review) => (
                <div key={review.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <img 
                        src={review.avatar} 
                        alt={review.studentName}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-white font-semibold">{review.studentName}</h3>
                        <p className="text-gray-400 text-sm">{review.course}</p>
                        <p className="text-gray-500 text-sm">{review.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 视频内容 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">精选视频</h2>
                <div className="space-y-6">
                  {instructor.videos.map((video) => (
                    <div key={video.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                      <div className="flex items-start">
                        <div className="relative mr-4">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-32 h-20 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-current" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2">{video.title}</h3>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="mr-4">{video.duration}</span>
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{video.views.toLocaleString()} 次观看</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 文章内容 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">精选文章</h2>
                <div className="space-y-6">
                  {instructor.articles.map((article) => (
                    <div key={article.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                      <h3 className="text-white font-semibold mb-3">{article.title}</h3>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="mr-4">{article.date}</span>
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{article.readTime}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                          阅读全文
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InstructorProfilePage;