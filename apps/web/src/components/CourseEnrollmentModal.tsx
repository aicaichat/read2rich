import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CreditCard, User, Mail, Phone, MapPin,
  CheckCircle, AlertCircle, Shield, Clock,
  Gift, Zap, Star, Users, Award,
  Calendar, BookOpen, Video, FileText
} from 'lucide-react';
import Button from './ui/Button';

interface CourseEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface EnrollmentStep {
  id: string;
  title: string;
  completed: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface CoursePackage {
  id: string;
  name: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  features: string[];
  isPopular?: boolean;
  bonuses?: string[];
}

const CourseEnrollmentModal: React.FC<CourseEnrollmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const [selectedPayment, setSelectedPayment] = useState('alipay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: 'student-tech',
    experience: '',
    goals: ''
  });

  const steps: EnrollmentStep[] = [
    { id: 'info', title: '基本信息', completed: currentStep > 1 },
    { id: 'package', title: '选择套餐', completed: currentStep > 2 },
    { id: 'payment', title: '支付方式', completed: currentStep > 3 },
    { id: 'confirm', title: '确认订单', completed: false }
  ];

  const packages: CoursePackage[] = [
    {
      id: 'basic',
      name: '基础版',
      originalPrice: 999,
      currentPrice: 299,
      discount: 70,
      features: [
        '6周完整课程内容',
        '在线学习平台权限',
        '课程回放（6个月）',
        '学习社群交流',
        '课程资料下载'
      ]
    },
    {
      id: 'premium',
      name: '进阶版',
      originalPrice: 2999,
      currentPrice: 1999,
      discount: 33,
      isPopular: true,
      features: [
        '6周完整课程内容',
        '1对1导师指导（2次）',
        '课程回放（永久）',
        '专属学习社群',
        '项目实战指导',
        'Demo Day展示机会',
        'API沙箱额度',
        '专业Prompt模板库'
      ],
      bonuses: [
        '价值1999元的AI工具包',
        '投资人对接资源',
        '毕业证书认证'
      ]
    },
    {
      id: 'vip',
      name: 'VIP版',
      originalPrice: 6999,
      currentPrice: 4999,
      discount: 28,
      features: [
        '包含进阶版所有内容',
        '1对1导师指导（5次）',
        '私人定制学习计划',
        '专属项目孵化支持',
        '创业资源对接',
        '融资指导服务',
        '终身学习社群',
        '优先参与新课程'
      ],
      bonuses: [
        '价值3999元的创业工具包',
        '专属投资人推介',
        '创业导师终身指导',
        '同城创业者聚会'
      ]
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'alipay',
      name: '支付宝',
      icon: <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center">支</div>,
      description: '推荐使用，支持花呗分期'
    },
    {
      id: 'wechat',
      name: '微信支付',
      icon: <div className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center">微</div>,
      description: '安全便捷，即时到账'
    },
    {
      id: 'credit',
      name: '信用卡',
      icon: <CreditCard className="w-6 h-6 text-purple-500" />,
      description: '支持Visa、MasterCard等'
    }
  ];

  const categories = [
    { id: 'student-tech', label: '学生-技术方向' },
    { id: 'student-business', label: '学生-商业方向' },
    { id: 'entrepreneur-0to1', label: '创业者-0到1阶段' },
    { id: 'entrepreneur-growth', label: '创业者-增长期' }
  ];

  const selectedPackageData = packages.find(p => p.id === selectedPackage);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEnroll = async () => {
    setIsProcessing(true);
    
    // 模拟支付处理
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess?.();
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-slate-800 border border-slate-700 rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">报名AI应用创新课程</h2>
                <p className="text-gray-400">Step {currentStep} of 4</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index + 1 === currentStep 
                        ? 'bg-emerald-500 text-white' 
                        : step.completed 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-700 text-gray-400'
                    }`}>
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-1 w-20 mx-2 ${
                        step.completed ? 'bg-emerald-500' : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                {steps.map(step => (
                  <span key={step.id}>{step.title}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: 基本信息 */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">请填写您的基本信息</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      姓名 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="请输入您的真实姓名"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      邮箱 *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="your@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      手机号 *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="13800138000"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      公司/学校
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="您的公司或学校名称"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    您的背景类型 *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map(category => (
                      <label key={category.id} className="relative">
                        <input
                          type="radio"
                          name="category"
                          value={category.id}
                          checked={formData.category === category.id}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="sr-only"
                        />
                        <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          formData.category === category.id
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}>
                          <div className="text-white font-medium">{category.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    学习目标
                  </label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="请简要描述您希望通过这个课程达到的目标..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: 选择套餐 */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">选择适合您的学习套餐</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {packages.map(pkg => (
                    <motion.div
                      key={pkg.id}
                      className={`relative border rounded-2xl p-6 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-600 hover:border-slate-500'
                      } ${pkg.isPopular ? 'ring-2 ring-emerald-500/50' : ''}`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            🔥 最受欢迎
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <h4 className="text-lg font-bold text-white mb-2">{pkg.name}</h4>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-gray-400 line-through">¥{pkg.originalPrice}</span>
                          <span className="text-2xl font-bold text-emerald-400">¥{pkg.currentPrice}</span>
                        </div>
                        <div className="text-sm text-emerald-400 mt-1">
                          立省 ¥{pkg.originalPrice - pkg.currentPrice} ({pkg.discount}% OFF)
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-gray-300">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {pkg.bonuses && (
                        <div className="border-t border-slate-600 pt-4">
                          <div className="text-yellow-400 font-medium text-sm mb-2 flex items-center">
                            <Gift className="w-4 h-4 mr-2" />
                            限时赠送
                          </div>
                          <div className="space-y-2">
                            {pkg.bonuses.map((bonus, index) => (
                              <div key={index} className="flex items-center text-yellow-300">
                                <Star className="w-3 h-3 mr-2 flex-shrink-0" />
                                <span className="text-xs">{bonus}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: 支付方式 */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">选择支付方式</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {paymentMethods.map(method => (
                    <label key={method.id} className="relative">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}>
                        <div className="flex items-center">
                          <div className="mr-4">{method.icon}</div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{method.name}</div>
                            <div className="text-gray-400 text-sm">{method.description}</div>
                          </div>
                          {selectedPayment === method.id && (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-blue-400 font-medium text-sm">安全保障</div>
                      <div className="text-gray-300 text-sm mt-1">
                        我们使用SSL加密技术保护您的支付信息，支持30天无理由退款
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: 确认订单 */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-6">确认订单信息</h3>
                
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-4">课程套餐</h4>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-white font-medium">{selectedPackageData?.name}</div>
                      <div className="text-gray-400 text-sm">价值百万的AI应用创新课程</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 line-through text-sm">¥{selectedPackageData?.originalPrice}</div>
                      <div className="text-emerald-400 font-bold text-lg">¥{selectedPackageData?.currentPrice}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-4">学员信息</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">姓名：</span>
                      <span className="text-white">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">邮箱：</span>
                      <span className="text-white">{formData.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">手机：</span>
                      <span className="text-white">{formData.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">类型：</span>
                      <span className="text-white">
                        {categories.find(c => c.id === formData.category)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-emerald-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-emerald-400 font-medium text-sm">限时优惠</div>
                      <div className="text-gray-300 text-sm mt-1">
                        早鸟价仅限前100名，立即报名享受最大优惠！
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {currentStep > 1 && (
                  <Button variant="ghost" onClick={handlePrev}>
                    上一步
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {selectedPackageData && (
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">总价</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ¥{selectedPackageData.currentPrice}
                    </div>
                  </div>
                )}

                {currentStep < 4 ? (
                  <Button 
                    variant="gradient" 
                    onClick={handleNext}
                    disabled={!formData.name || !formData.email || !formData.phone}
                  >
                    下一步
                  </Button>
                ) : (
                  <Button 
                    variant="gradient" 
                    onClick={handleEnroll}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        处理中...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        立即报名
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CourseEnrollmentModal;