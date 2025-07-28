import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Clock, Star, Award, Zap, CheckCircle } from 'lucide-react';

// 实时活动数据模拟
const realtimeActivities = [
  { user: "张明", action: "完成了项目验证", project: "智能客服系统", time: "刚刚" },
  { user: "李女士", action: "获得了投资意向", project: "宠物社交APP", time: "2分钟前" },
  { user: "王总", action: "生成了完整方案", project: "企业数字化平台", time: "5分钟前" },
  { user: "创业者小陈", action: "验证了商业想法", project: "在线教育平台", time: "8分钟前" },
  { user: "产品经理", action: "完成了需求分析", project: "电商推荐系统", time: "12分钟前" },
];

// 用户评价数据
const userTestimonials = [
  {
    name: "张明",
    role: "创业者",
    avatar: "👨‍💼",
    content: "30分钟就把我的想法变成了可执行的方案，太神奇了！已经开始找投资人了。",
    rating: 5,
    project: "智能客服系统"
  },
  {
    name: "李雪",
    role: "产品经理",
    avatar: "👩‍💻",
    content: "以前需要1周的需求分析，现在30分钟搞定，质量还更高。团队效率提升了10倍！",
    rating: 5,
    project: "用户画像系统"
  },
  {
    name: "王总",
    role: "企业主",
    avatar: "👔",
    content: "不懂技术也能快速验证商业想法，为我们节省了大量试错成本。强烈推荐！",
    rating: 5,
    project: "供应链管理平台"
  }
];

// 成功案例数据
const successCases = [
  {
    title: "宠物社交APP",
    description: "30分钟验证想法，1天完成MVP，获得50万天使投资",
    metrics: ["用户增长300%", "获得投资", "3个月盈利"],
    icon: "🐕"
  },
  {
    title: "智能客服系统",
    description: "为某电商平台节省70%客服成本，用户满意度提升40%",
    metrics: ["成本节省70%", "效率提升5倍", "满意度+40%"],
    icon: "🤖"
  },
  {
    title: "在线教育平台",
    description: "快速验证市场需求，3个月达到10万用户",
    metrics: ["10万用户", "月收入100万", "行业第3名"],
    icon: "📚"
  }
];

// 实时活动提示组件
export const RealtimeActivity: React.FC = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % realtimeActivities.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activity = realtimeActivities[currentActivity];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 left-6 bg-emerald-500/90 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-400/50 z-50 max-w-sm"
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                <span className="font-bold">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs opacity-90">
                《{activity.project}》 · {activity.time}
              </p>
            </div>
            <TrendingUp className="w-4 h-4" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 稀缺性倒计时组件
export const ScarcityCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              // 重置倒计时
              return { hours: 23, minutes: 59, seconds: 59 };
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-orange-400" />
        <span className="text-orange-400 font-bold text-sm">限时免费</span>
      </div>
      <p className="text-white text-sm mb-3">
        今日仅限前100名免费体验
      </p>
      <div className="flex justify-center gap-2">
        <div className="bg-red-500/80 px-2 py-1 rounded text-white text-xs font-mono">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <span className="text-white">:</span>
        <div className="bg-red-500/80 px-2 py-1 rounded text-white text-xs font-mono">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <span className="text-white">:</span>
        <div className="bg-red-500/80 px-2 py-1 rounded text-white text-xs font-mono">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
      <p className="text-xs text-gray-300 mt-2">
        错过今天，明天恢复原价 ¥299/月
      </p>
    </motion.div>
  );
};

// 用户评价轮播组件
export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % userTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonial = userTestimonials[currentIndex];

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">{testimonial.avatar}</div>
        <div>
          <h3 className="text-white font-semibold">{testimonial.name}</h3>
          <p className="text-gray-400 text-sm">{testimonial.role}</p>
          <div className="flex gap-1 mt-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <blockquote className="text-gray-300 italic mb-3">
            "{testimonial.content}"
          </blockquote>
          <p className="text-emerald-400 text-sm">
            项目：{testimonial.project}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-2 mt-4">
        {userTestimonials.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-emerald-400' : 'bg-gray-600'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// 成功案例展示组件
export const SuccessCases: React.FC = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {successCases.map((caseItem, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-emerald-500/50 transition-all duration-300"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-4">{caseItem.icon}</div>
          <h3 className="text-xl font-semibold text-white mb-3">
            {caseItem.title}
          </h3>
          <p className="text-gray-300 mb-4 leading-relaxed">
            {caseItem.description}
          </p>
          <div className="space-y-2">
            {caseItem.metrics.map((metric, metricIndex) => (
              <div key={metricIndex} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm">{metric}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// 信任徽章组件
export const TrustBadges: React.FC = () => {
  const badges = [
    { icon: "🔒", title: "数据安全", desc: "企业级加密保护" },
    { icon: "⚡", title: "30分钟交付", desc: "快速响应承诺" },
    { icon: "🎯", title: "95%满意度", desc: "用户认可保证" },
    { icon: "🏆", title: "大厂背书", desc: "阿里字节专家" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          className="text-center p-4 bg-white/5 rounded-xl border border-white/10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="text-2xl mb-2">{badge.icon}</div>
          <h4 className="text-white font-semibold text-sm mb-1">{badge.title}</h4>
          <p className="text-gray-400 text-xs">{badge.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

// 进度指示器组件
export const ProgressIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
      <motion.div
        className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full relative"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full -mt-1 -mr-2 shadow-lg"></div>
      </motion.div>
    </div>
  );
};

export default {
  RealtimeActivity,
  ScarcityCountdown,
  TestimonialCarousel,
  SuccessCases,
  TrustBadges,
  ProgressIndicator
}; 