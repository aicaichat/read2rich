import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Clock, Users, Star, CheckCircle, 
  BookOpen, Code, Zap, Target, Award, TrendingUp,
  Video, FileText, ArrowRight, Calendar, MapPin,
  User, Building, GraduationCap, Briefcase,
  Presentation, Trophy, Globe, MessageCircle,
  Monitor, Eye
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import CourseEnrollmentModal from '../components/CourseEnrollmentModal';
import CourseOutlinePDF from '../components/CourseOutlinePDF';

interface LearningOutcome {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface WeekModule {
  week: number;
  title: string;
  subtitle: string;
  duration: string;
  topics: string[];
  deliverables: string[];
  highlight: string;
}

interface InstructorProfile {
  name: string;
  title: string;
  avatar: string;
  background: string[];
  expertise: string[];
  achievements: string[];
}

interface TargetAudience {
  type: string;
  icon: React.ReactNode;
  pain_points: string[];
  solutions: string[];
  outcomes: string[];
}

const AITrainingCoursePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAudience, setSelectedAudience] = useState('students');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  // 学习成果
  const learningOutcomes: LearningOutcome[] = [
    {
      id: 1,
      title: "需求识别与验证",
      description: "识别AI时代指数级新增需求，运用三步验证法快速验证可行性",
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Prompt工程实战",
      description: "掌握高质量Prompt设计，运用API编排打造功能完整的MVP",
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 3,
      title: "商业化路径设计",
      description: "精通Freemium/PLG/订阅制变现模式，构建可持续盈利模型",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      id: 4,
      title: "数据驱动增长",
      description: "建立关键指标体系，运用A/B测试和数据分析实现产品迭代",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  // 6周课程模块
  const weekModules: WeekModule[] = [
    {
      week: 0,
      title: "预热周",
      subtitle: "生成式AI快速通关",
      duration: "30分钟",
      topics: ["GPT/Claude/Midjourney生态", "API调用基础", "开发环境配置"],
      deliverables: ["完成Hello World API调用", "搭建本地开发环境"],
      highlight: "零基础快速上手"
    },
    {
      week: 1,
      title: "需求金矿",
      subtitle: "从焦虑到产品机会",
      duration: "3小时工作坊",
      topics: ["焦虑→商机思维框架", "需求三步法", "机会评估矩阵", "用户访谈技巧"],
      deliverables: ["痛点清单", "机会评估报告", "目标用户画像"],
      highlight: "发现你的百万商机"
    },
    {
      week: 2,
      title: "Prompt工程",
      subtitle: "从想法到可用工具",
      duration: "3小时工作坊",
      topics: ["4C框架(Clear/Context/Constraints/Creativity)", "跨模态Prompt技巧", "PRD生成实战"],
      deliverables: ["PRD草案", "3个增长Hack Prompt", "功能演示视频"],
      highlight: "Prompt是AI时代的编程入口"
    },
    {
      week: 3,
      title: "MVP实战",
      subtitle: "从Prompt到产品",
      duration: "3小时工作坊",
      topics: ["AI平台 API 集成", "无代码工具链", "用户体验设计", "快速部署"],
      deliverables: ["可用MVP", "10位真实用户反馈", "使用数据报告"],
      highlight: "7天上线你的AI产品"
    },
    {
      week: 4,
      title: "商业化设计",
      subtitle: "从产品到营收",
      duration: "3小时工作坊",
      topics: ["盈利模式设计", "付费墙策略", "LTV-CAC计算", "定价心理学"],
      deliverables: ["3套价格方案", "收费漏斗设计", "财务预测模型"],
      highlight: "设计你的百万收入公式"
    },
    {
      week: 5,
      title: "增长飞轮",
      subtitle: "数据驱动迭代",
      duration: "3小时工作坊",
      topics: ["关键指标体系", "A/B测试设计", "社区驱动增长", "病毒式传播"],
      deliverables: ["增长实验计划", "数据监控仪表盘", "社区运营策略"],
      highlight: "构建自动化增长引擎"
    },
    {
      week: 6,
      title: "Demo Day",
      subtitle: "路演与融资",
      duration: "3小时路演",
      topics: ["Pitch Deck制作", "投资人问答", "商业计划完善", "下一步规划"],
      deliverables: ["5分钟Demo", "完整商业计划书", "投资人反馈"],
      highlight: "向世界展示你的创新"
    }
  ];

  // 讲师团队
  const instructors: InstructorProfile[] = [
    {
      name: "栗志果(Jobs Lee)",
      title: "前蚂蚁科技高级产品专家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jobslee&gender=male&facialHair=BeardMedium&facialHairColor=Black&hair=ShortHairShortCurly&hairColor=Black&accessories=Prescription02&clotheType=Hoodie&clotheColor=Black",
      background: [
        "前蚂蚁科技高级产品专家",
        "南京大学计算机科学硕士",
        "AI应用创新实践者"
      ],
      expertise: ["AI产品设计", "商业模式创新", "技术架构", "团队管理"],
      achievements: [
        "3个亿级产品缔造者",
        "100+发明专利持有人",
        "投资孵化10+AI独角兽项目"
      ]
    },
    {
      name: "张雯(Wen Zhang)",
      title: "前Remini增长总监",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wen",
      background: [
        "前Facebook产品经理",
        "UC Berkeley工程硕士",
        "增长黑客实战专家"
      ],
      expertise: ["用户增长", "产品运营", "数据分析", "A/B测试"],
      achievements: [
        "帮助Remini实现2周$700万收入",
        "设计病毒式传播机制",
        "PLG增长模式践行者",
        "服务50+独角兽公司"
      ]
    },
    {
      name: "王浩(Hao Wang)",
      title: "Sequoia前投资经理",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hao",
      background: [
        "红杉资本投资经理",
        "清华大学工学学士",
        "沃顿商学院MBA"
      ],
      expertise: ["商业尽调", "财务建模", "融资策略", "市场分析"],
      achievements: [
        "主导投资20+AI独角兽",
        "累计管理资金50亿美元",
        "帮助创业者融资10亿+",
        "AI投资领域意见领袖"
      ]
    }
  ];

  // 目标人群
  const targetAudiences: TargetAudience[] = [
    {
      type: "学生群体",
      icon: <GraduationCap className="w-8 h-8" />,
      pain_points: [
        "技术储备充足但缺乏落地场景",
        "没有真实项目经验和作品集",
        "不知道如何将技术转化为商业价值",
        "缺乏创业资源和导师指导"
      ],
      solutions: [
        "提供真实需求挖掘模板和方法",
        "API沙箱额度&专业Prompt模板库",
        "1对1导师指导和项目review",
        "Demo Day投资人直接对接"
      ],
      outcomes: [
        "完成1个可展示的AI产品Demo",
        "获得1份专业的商业计划书",
        "建立个人品牌和作品集",
        "掌握从技术到商业的完整路径"
      ]
    },
    {
      type: "创业者0-1阶段",
      icon: <Briefcase className="w-8 h-8" />,
      pain_points: [
        "需求验证成本高，试错成本大",
        "技术门槛高，团队招募困难",
        "不知道如何快速构建MVP",
        "缺乏有效的用户获取渠道"
      ],
      solutions: [
        "快速市场验证脚本和用户访谈模板",
        "无代码/低代码AI开发工具链",
        "轻量级监控指标和分析方案",
        "社区驱动的用户获取策略"
      ],
      outcomes: [
        "4周内完成需求验证，获得200+活跃用户",
        "打造可收费的MVP产品",
        "建立数据驱动的决策体系",
        "掌握可复制的增长方法论"
      ]
    },
    {
      type: "创业者Growth阶段",
      icon: <TrendingUp className="w-8 h-8" />,
      pain_points: [
        "用户留存率低，付费转化困难",
        "增长瓶颈明显，难以规模化",
        "竞争激烈，缺乏差异化优势",
        "团队效率低，资源浪费严重"
      ],
      solutions: [
        "高阶留存/转化漏斗指标设计",
        "PLG产品主导增长实战策略",
        "AI驱动的个性化用户体验",
        "数据驱动的团队协作工具"
      ],
      outcomes: [
        "提升留存率20%，转化率5%+",
        "建立自动化增长引擎",
        "打造竞争壁垒和护城河",
        "实现团队效率倍数级提升"
      ]
    }
  ];

  const testimonials = [
    {
      name: "张小明",
      role: "清华大学研究生",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student1",
      content: "通过6周课程，我从一个纯技术背景的学生，成功打造了一个月收入过万的AI写作助手。最重要的是学会了如何发现真正的用户需求。",
      result: "月收入 ¥12,000"
    },
    {
      name: "李创业",
      role: "独立开发者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=entrepreneur1",
      content: "课程的商业化模块太实用了！按照老师的方法设计了Freemium模式，付费转化率从2%提升到了8%，用户LTV增长了3倍。",
      result: "转化率提升 300%"
    },
    {
      name: "王小红",
      role: "产品经理转型",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pm1",
      content: "Demo Day上我的AI教育产品获得了2家VC的投资意向，现在正在进行A轮融资谈判。感谢课程给了我系统的创业方法论。",
      result: "获得投资意向 ¥500万"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-purple-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
                <Trophy className="w-4 h-4 mr-2" />
                世界级AI应用培训师·6周密集营
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                价值<span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">百万</span>的
                <br />
                AI应用创新课程
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                从焦虑到掌控 · 从想法到产品 · 从产品到营收
                <br />
                6周时间，帮你打造第一个可收费的AI应用
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-8 py-4 text-lg"
                  onClick={() => setShowEnrollmentModal(true)}
                >
                  <Play className="w-6 h-6 mr-2" />
                  立即报名
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg"
                >
                  <Video className="w-6 h-6 mr-2" />
                  观看介绍视频
                </Button>
              </div>
              
              {/* 核心数据展示 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">6周</div>
                  <div className="text-gray-400">密集训练</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">100+</div>
                  <div className="text-gray-400">成功案例</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">90%</div>
                  <div className="text-gray-400">完课率</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">¥500万</div>
                  <div className="text-gray-400">学员总营收</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: '课程概览', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'curriculum', label: '课程大纲', icon: <Calendar className="w-4 h-4" /> },
              { id: 'instructors', label: '导师团队', icon: <Users className="w-4 h-4" /> },
              { id: 'audience', label: '适合人群', icon: <Target className="w-4 h-4" /> },
              { id: 'presentation', label: '演示PPT', icon: <Presentation className="w-4 h-4" /> },
              { id: 'testimonials', label: '学员案例', icon: <Award className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 学习成果 */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">你将获得什么？</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {learningOutcomes.map((outcome) => (
                  <motion.div
                    key={outcome.id}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                        {outcome.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{outcome.title}</h3>
                    <p className="text-gray-400">{outcome.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 课程特色 */}
            <div className="bg-gradient-to-br from-slate-800/80 to-purple-900/20 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-16">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">课程亮点</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">实战导向</h3>
                  <p className="text-gray-400">每周都有实际项目输出，6周后你将拥有一个完整的AI产品</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">导师制度</h3>
                  <p className="text-gray-400">世界级导师1对1指导，每周Office Hour深度答疑</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">资源对接</h3>
                  <p className="text-gray-400">投资人直接对接，Demo Day展示机会，终身学习社群</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'curriculum' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">6周密集训练大纲</h2>
              <div className="flex gap-4">
                <CourseOutlinePDF weekModules={weekModules} instructors={instructors} />
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex items-center gap-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                  onClick={() => setActiveTab('instructors')}
                >
                  <Users className="w-5 h-5" />
                  查看讲师团队
                </Button>
              </div>
            </div>
            <div className="space-y-8">
              {weekModules.map((module, index) => (
                <motion.div
                  key={module.week}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-lg mr-4">
                        W{module.week}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{module.title}</h3>
                        <p className="text-purple-400 font-medium">{module.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">时长</div>
                      <div className="text-white font-medium">{module.duration}</div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
                    <div className="text-emerald-400 font-medium text-sm mb-1">本周亮点</div>
                    <div className="text-white">{module.highlight}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">学习内容</h4>
                      <ul className="space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center text-gray-300">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-3">交付成果</h4>
                      <ul className="space-y-2">
                        {module.deliverables.map((deliverable, deliverableIndex) => (
                          <li key={deliverableIndex} className="flex items-center text-gray-300">
                            <Target className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'instructors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">世界级导师团队</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {instructors.map((instructor, index) => (
                <motion.div
                  key={instructor.name}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="text-center mb-6">
                    <img 
                      src={instructor.avatar} 
                      alt={instructor.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-emerald-500/20"
                    />
                    <h3 className="text-2xl font-bold text-white mb-2">{instructor.name}</h3>
                    <p className="text-emerald-400 font-medium">{instructor.title}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">教育背景</h4>
                      <ul className="space-y-1">
                        {instructor.background.map((bg, bgIndex) => (
                          <li key={bgIndex} className="text-gray-300 text-sm">• {bg}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-3">专业领域</h4>
                      <div className="flex flex-wrap gap-2">
                        {instructor.expertise.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-3">核心成就</h4>
                      <ul className="space-y-1">
                        {instructor.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex} className="flex items-start text-gray-300 text-sm">
                            <Star className="w-3 h-3 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link to={`/instructor/${index + 1}`}>
                      <Button variant="secondary" size="sm" className="w-full">
                        查看详细资料
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'audience' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">找到属于你的成长路径</h2>
            
            {/* 人群选择器 */}
            <div className="flex justify-center mb-12">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-2">
                <div className="flex space-x-2">
                  {targetAudiences.map((audience, index) => (
                    <button
                      key={audience.type}
                      onClick={() => setSelectedAudience(audience.type)}
                      className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                        selectedAudience === audience.type
                          ? 'bg-emerald-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {audience.icon}
                      <span className="ml-2">{audience.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 选中人群的详细信息 */}
            {targetAudiences.map((audience) => (
              selectedAudience === audience.type && (
                <motion.div
                  key={audience.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-red-400 mb-4">当前痛点</h3>
                    <ul className="space-y-3">
                      {audience.pain_points.map((pain, painIndex) => (
                        <li key={painIndex} className="flex items-start text-gray-300">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">我们的解决方案</h3>
                    <ul className="space-y-3">
                      {audience.solutions.map((solution, solutionIndex) => (
                        <li key={solutionIndex} className="flex items-start text-gray-300">
                          <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-emerald-400 mb-4">预期成果</h3>
                    <ul className="space-y-3">
                      {audience.outcomes.map((outcome, outcomeIndex) => (
                        <li key={outcomeIndex} className="flex items-start text-gray-300">
                          <Trophy className="w-5 h-5 text-emerald-400 mt-0.5 mr-3 flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        )}

        {activeTab === 'presentation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">价值百万的AI应用创新演示</h2>
            
            {/* PPT预览区域 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">课程核心理念展示</h3>
                  <p className="text-gray-400">通过精心制作的演示文稿，深入了解课程的核心价值和学习路径</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="secondary" 
                    className="flex items-center gap-2"
                    onClick={() => window.open('/presentation-optimized-final.html', '_blank')}
                  >
                    <Monitor className="w-5 h-5" />
                    全屏观看
                  </Button>
                  <Button 
                    variant="gradient" 
                    className="flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    开始演示
                  </Button>
                </div>
              </div>
              
              {/* 嵌入式PPT预览 */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="/presentation-optimized-final.html"
                  className="absolute top-0 left-0 w-full h-full rounded-xl border border-slate-600"
                  title="价值百万的AI应用创新演示"
                  allowFullScreen
                  allow="fullscreen"
                  loading="lazy"
                  style={{ border: 'none' }}
                />
              </div>
            </div>

            {/* PPT章节导航 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-white mb-6">演示内容导航</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "AI红利风口", description: "当下我们正站在一个巨大的红利风口", slide: 1 },
                  { title: "真需求锁定", description: "别做玩具，要做真正的需求", slide: 2 },
                  { title: "产品化思维", description: "别空谈想法，要把想法做成真正产品", slide: 3 },
                  { title: "商业化设计", description: "产品升级成真正商业", slide: 4 },
                  { title: "成功案例1", description: "Cal AI 拍照识别卡路里", slide: 5 },
                  { title: "成功案例2", description: "Cursor AI 程序员效率工具", slide: 6 },
                  { title: "成功案例3", description: "Remini AI 写真爆款", slide: 7 },
                  { title: "从焦虑到掌控", description: "总结：课程核心要点", slide: 8 }
                ].map((section, index) => (
                  <motion.div
                    key={index}
                    className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/70 transition-all duration-300 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                          {section.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{section.description}</p>
                      </div>
                      <div className="ml-3">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-400 font-bold text-sm">{section.slide}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 关键数据展示 */}
            <div className="bg-gradient-to-br from-slate-800/80 to-purple-900/20 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center">PPT核心数据亮点</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mb-1">500万+</div>
                  <div className="text-gray-400 text-sm">Cal AI下载量</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-1">$90亿</div>
                  <div className="text-gray-400 text-sm">Cursor估值</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">$1.2亿</div>
                  <div className="text-gray-400 text-sm">Remini年收入</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">6周</div>
                  <div className="text-gray-400 text-sm">完整培训周期</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'testimonials' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">学员成功案例</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{testimonial.name}</h3>
                      <p className="text-emerald-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <div className="text-emerald-400 font-semibold text-center">{testimonial.result}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-purple-500/20 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            准备好开始你的AI创业之旅了吗？
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            加入"价值百万AI应用创新课程"，让你的名字出现在下一个成功案例中！
          </p>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-white">限时早鸟价</span>
              <div className="text-right">
                <div className="text-gray-400 line-through">¥6,999</div>
                <div className="text-3xl font-bold text-emerald-400">¥4,999</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              ✓ 6周密集训练 ✓ 1对1导师指导 ✓ 终身学习社群 ✓ 投资人对接
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-12 py-4 text-xl"
              onClick={() => setShowEnrollmentModal(true)}
            >
              立即报名
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-12 py-4 text-xl"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              咨询顾问
            </Button>
          </div>
          
          <p className="text-gray-400 text-sm mt-8">
            🔥 前100名报名享受专属优惠 · 30天无理由退款保障
          </p>
        </div>
      </div>

      {/* 报名弹窗 */}
      <CourseEnrollmentModal 
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        onSuccess={() => {
          // 可以添加成功后的处理逻辑
          console.log('报名成功！');
        }}
      />
    </div>
  );
};

export default AITrainingCoursePage;