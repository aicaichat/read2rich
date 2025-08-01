import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Plus, Trash2, User, Mail, 
  Briefcase, Star, Users, BookOpen,
  Linkedin, Twitter, Github, Globe,
  AlertCircle, CheckCircle
} from 'lucide-react';
import Button from './ui/Button';
import { Instructor, InstructorFormData, instructorManagerFixed as instructorManager } from '../lib/instructor-management';

interface InstructorEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor?: Instructor | null;
  onSuccess: () => void;
}

const InstructorEditModal: React.FC<InstructorEditModalProps> = ({
  isOpen,
  onClose,
  instructor,
  onSuccess
}) => {
  const [formData, setFormData] = useState<InstructorFormData>({
    name: '',
    email: '',
    avatar: '',
    bio: '',
    title: '',
    expertise: [],
    experience: 0,
    status: 'pending',
    socialLinks: {}
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);

  const isEditing = !!instructor;

  useEffect(() => {
    if (isOpen) {
      loadFormData();
      loadExpertiseAreas();
      loadTitles();
    }
  }, [isOpen, instructor]);

  const loadFormData = () => {
    if (instructor) {
      setFormData({
        name: instructor.name,
        email: instructor.email,
        avatar: instructor.avatar,
        bio: instructor.bio,
        title: instructor.title,
        expertise: instructor.expertise,
        experience: instructor.experience,
        status: instructor.status,
        socialLinks: instructor.socialLinks
      });
    } else {
      setFormData({
        name: '',
        email: '',
        avatar: '',
        bio: '',
        title: '',
        expertise: [],
        experience: 0,
        status: 'pending',
        socialLinks: {}
      });
    }
    setError('');
    setSuccess('');
  };

  const loadExpertiseAreas = async () => {
    try {
      const areas = await instructorManager.getExpertiseAreas();
      setExpertiseAreas(areas);
    } catch (error) {
      console.error('加载专业领域失败:', error);
    }
  };

  const loadTitles = async () => {
    try {
      const titleList = await instructorManager.getTitles();
      setTitles(titleList);
    } catch (error) {
      console.error('加载职称失败:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const handleRemoveExpertise = (expertiseToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertiseToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditing && instructor) {
        await instructorManager.updateInstructor(instructor.id, formData);
        setSuccess('讲师信息更新成功！');
      } else {
        await instructorManager.createInstructor(formData);
        setSuccess('讲师创建成功！');
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : '操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!instructor) return;

    if (window.confirm('确定要删除这个讲师吗？此操作不可撤销。')) {
      setIsLoading(true);
      try {
        await instructorManager.deleteInstructor(instructor.id);
        setSuccess('讲师删除成功！');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } catch (error) {
        setError('删除失败');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {isEditing ? '编辑讲师' : '添加新讲师'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isEditing ? '修改讲师信息' : '填写讲师基本信息'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="输入讲师姓名"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    邮箱 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="输入邮箱地址"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    职称
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="" className="bg-slate-800">选择职称</option>
                    {titles.map((title) => (
                      <option key={title} value={title} className="bg-slate-800">
                        {title}
                      </option>
                    ))}
                    <option value="custom" className="bg-slate-800">自定义</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    工作年限
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="0"
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  个人简介
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  placeholder="详细介绍讲师的背景、经验和专长"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  头像URL
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {/* 专业领域 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  专业领域
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.expertise.map((exp, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm flex items-center gap-2"
                    >
                      {exp}
                      <button
                        type="button"
                        onClick={() => handleRemoveExpertise(exp)}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="添加专业领域"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddExpertise}
                    variant="ghost"
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-400">常用领域：</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {expertiseAreas.slice(0, 8).map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => {
                          if (!formData.expertise.includes(area)) {
                            setFormData(prev => ({
                              ...prev,
                              expertise: [...prev.expertise, area]
                            }));
                          }
                        }}
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded text-xs transition-colors"
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 社交媒体链接 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  社交媒体链接
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin || ''}
                      onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      placeholder="LinkedIn 链接"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <input
                      type="url"
                      value={formData.socialLinks.twitter || ''}
                      onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      placeholder="Twitter 链接"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.socialLinks.github || ''}
                      onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      placeholder="GitHub 链接"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <input
                      type="url"
                      value={formData.socialLinks.website || ''}
                      onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      placeholder="个人网站"
                    />
                  </div>
                </div>
              </div>

              {/* 状态设置 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  状态
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="pending" className="bg-slate-800">待审核</option>
                  <option value="active" className="bg-slate-800">活跃</option>
                  <option value="inactive" className="bg-slate-800">非活跃</option>
                </select>
              </div>

              {/* 错误和成功提示 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 text-sm">{success}</span>
                </motion.div>
              )}

              {/* 操作按钮 */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center space-x-4">
                  {isEditing && (
                    <Button
                      type="button"
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除讲师
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        {isEditing ? '更新中...' : '创建中...'}
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? '更新讲师' : '创建讲师'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InstructorEditModal; 