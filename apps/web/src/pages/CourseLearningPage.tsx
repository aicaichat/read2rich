import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Settings,
  ChevronLeft, ChevronRight, BookOpen, CheckCircle,
  Clock, FileText, MessageCircle, Download, Share2,
  Presentation
} from 'lucide-react';
import Button from '../components/ui/Button';
import PPTViewer from '../components/PPTViewer';
import { millionDollarCourseSlides } from '../data/millionDollarCourseSlides';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
  isCurrent: boolean;
  videoUrl?: string;
  description: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

const CourseLearningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showPPT, setShowPPT] = useState(false);

  // 模拟课程数据
  const modules: Module[] = [
    {
      id: 1,
      title: "免费公开课：抓住AI红利的100分钟",
      isExpanded: true,
      lessons: [
        {
          id: 1,
          title: "开篇三问：为何此刻AI应用是'低垂果实'？",
          duration: "10:00",
          isCompleted: true,
          isCurrent: false,
          description: "数据+案例秒杀焦虑"
        },
        {
          id: 2,
          title: "AI真需求三角：价值·共识·模式",
          duration: "20:00",
          isCompleted: true,
          isCurrent: false,
          description: "梁宁方法×产品思维"
        },
        {
          id: 3,
          title: "六维打分法：现场挑选10个'万元一夜'场景",
          duration: "30:00",
          isCompleted: false,
          isCurrent: true,
          description: "互动投票生成榜单"
        },
        {
          id: 4,
          title: "10行代码跑首个Prompt-Only Demo",
          duration: "20:00",
          isCompleted: false,
          isCurrent: false,
          description: "让0基础也能'跑起来'"
        },
        {
          id: 5,
          title: "营收公式拆解：DAU×转化×ARPU",
          duration: "10:00",
          isCompleted: false,
          isCurrent: false,
          description: "给出3档订阅Benchmark"
        },
        {
          id: 6,
          title: "创业营介绍+入营测验",
          duration: "10:00",
          isCompleted: false,
          isCurrent: false,
          description: "在线测完即显示适配度"
        }
      ]
    },
    {
      id: 2,
      title: "Week 1：定位&需求",
      isExpanded: false,
      lessons: [
        {
          id: 7,
          title: "课前预热：阅读《真需求三角》+访谈示范",
          duration: "15:00",
          isCompleted: false,
          isCurrent: false,
          description: "准备工作和学习方法"
        },
        {
          id: 8,
          title: "直播工作坊：红利&方法论",
          duration: "30:00",
          isCompleted: false,
          isCurrent: false,
          description: "30分钟深度解析"
        },
        {
          id: 9,
          title: "痛点池共创+六维打分",
          duration: "90:00",
          isCompleted: false,
          isCurrent: false,
          description: "90分钟实战演练"
        },
        {
          id: 10,
          title: "访谈脚本演练",
          duration: "30:00",
          isCompleted: false,
          isCurrent: false,
          description: "30分钟技巧训练"
        },
        {
          id: 11,
          title: "Q&A+布置任务",
          duration: "30:00",
          isCompleted: false,
          isCurrent: false,
          description: "30分钟答疑和作业"
        }
      ]
    },
    {
      id: 3,
      title: "Week 2：MVP成型",
      isExpanded: false,
      lessons: [
        {
          id: 12,
          title: "课前预热：观看Prompt五段式Demo",
          duration: "15:00",
          isCompleted: false,
          isCurrent: false,
          description: "技术准备和演示"
        },
        {
          id: 13,
          title: "用神&指标讲解",
          duration: "30:00",
          isCompleted: false,
          isCurrent: false,
          description: "30分钟理论指导"
        },
        {
          id: 14,
          title: "Live Coding：10行代码跑Demo",
          duration: "90:00",
          isCompleted: false,
          isCurrent: false,
          description: "90分钟实战编程"
        },
        {
          id: 15,
          title: "Evals介绍",
          duration: "30:00",
          isCompleted: false,
          isCurrent: false,
          description: "30分钟评估方法"
        },
        {
          id: 16,
          title: "反馈&任务",
          duration: "30:00",
          isCompleted: false,
          isCurrent: false,
          description: "30分钟总结和作业"
        }
      ]
    }
  ];

  const currentLesson = modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.isCurrent);

  const progress = modules
    .flatMap(module => module.lessons)
    .filter(lesson => lesson.isCompleted).length / 
    modules.flatMap(module => module.lessons).length * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部导航 */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/course/${id}`}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                返回课程
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-lg font-semibold text-white">价值百万的AI应用创新课程</h1>
                <p className="text-sm text-gray-400">免费公开课：抓住AI红利的100分钟</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                进度: <span className="text-emerald-400 font-semibold">{Math.round(progress)}%</span>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 左侧视频播放器 */}
        <div className="flex-1 flex flex-col">
          {/* 视频播放器 */}
          <div className="flex-1 bg-black relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-12 h-12 text-emerald-400" />
                </div>
                <p className="text-gray-400">视频播放器</p>
                <p className="text-sm text-gray-500 mt-2">当前课程：{currentLesson?.title}</p>
              </div>
            </div>

            {/* 视频控制栏 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-emerald-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-emerald-400 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="text-sm text-white">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 
                    {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-white hover:text-emerald-400 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="text-white hover:text-emerald-400 transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 课程信息 */}
          <div className="bg-slate-800/50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {currentLesson?.title}
                </h2>
                <p className="text-gray-300">{currentLesson?.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPPT(true)}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  <Presentation className="w-4 h-4 mr-2" />
                  查看PPT
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-gray-400 hover:text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  笔记
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  讨论
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
              </div>
            </div>

            {/* 笔记区域 */}
            {showNotes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="在这里记录你的学习笔记..."
                  className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* 右侧课程大纲 */}
        <div className="w-80 bg-slate-800/30 border-l border-white/10 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">课程大纲</h3>
            
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="bg-white/5 rounded-lg overflow-hidden">
                  <button
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                    onClick={() => {
                      // 这里应该切换模块展开状态
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-medium">{module.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      module.isExpanded ? 'rotate-90' : ''
                    }`} />
                  </button>
                  
                  {module.isExpanded && (
                    <div className="border-t border-white/10">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          className={`w-full p-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors ${
                            lesson.isCurrent ? 'bg-emerald-500/20 border-l-4 border-emerald-500' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center">
                              {lesson.isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400 fill-current" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm text-white font-medium">{lesson.title}</div>
                              <div className="text-xs text-gray-400">{lesson.duration}</div>
                            </div>
                          </div>
                          {lesson.isCurrent && (
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 学习进度 */}
            <div className="mt-8 p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-semibold text-white mb-3">学习进度</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">总体进度</span>
                  <span className="text-emerald-400 font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>已完成 {modules.flatMap(m => m.lessons).filter(l => l.isCompleted).length} 课时</span>
                  <span>共 {modules.flatMap(m => m.lessons).length} 课时</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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

export default CourseLearningPage; 