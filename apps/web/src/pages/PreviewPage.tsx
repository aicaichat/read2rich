import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Copy, Download, ArrowLeft, Check, Sparkles, FileText, Code, 
  Lightbulb, Target, Award, BookOpen, Palette, Users, Calendar,
  Zap, Eye, Settings, Globe, Star, ThumbsUp, ThumbsDown, MessageSquare, Plus
} from 'lucide-react';
import Button from '../components/ui/Button';
import type { GeneratedPrompts } from '../lib/prompt-generator';
import { promptOptimizationEngine, type UserFeedback } from '../lib/prompt-optimization-engine';

const PreviewPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // 用户反馈状态
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [usageResult, setUsageResult] = useState<'success' | 'partial' | 'failed' | null>(null);
  const [improvementSuggestions, setImprovementSuggestions] = useState<string[]>([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  // 智能数据获取：优先从location.state，然后从localStorage
  const getPromptsData = (): GeneratedPrompts | null => {
    // 1. 优先使用路由传递的数据
    if (location.state) {
      return location.state as GeneratedPrompts;
    }
    
    // 2. 尝试从localStorage恢复
    try {
      const savedPrompts = localStorage.getItem(`generated-prompts-${sessionId}`);
      if (savedPrompts) {
        return JSON.parse(savedPrompts);
      }
    } catch (error) {
      console.warn('无法从localStorage恢复提示词数据:', error);
    }
    
    return null;
  };

  const prompts = getPromptsData();
  
  // 调试信息
  React.useEffect(() => {
    console.log('🔍 PreviewPage - 提示词数据检查:');
    console.log('📋 Location state:', location.state);
    console.log('📦 Prompts data:', prompts);
    
    if (prompts?.professional_prompts) {
      console.log('✅ 专业提示词存在');
      console.log('📝 PRD提示词长度:', prompts.professional_prompts.prd.prompt?.length || 0);
      console.log('🔧 技术提示词长度:', prompts.professional_prompts.technical_implementation.prompt?.length || 0);
      console.log('🎨 设计提示词长度:', prompts.professional_prompts.visual_design.prompt?.length || 0);
      console.log('📊 管理提示词长度:', prompts.professional_prompts.project_management.prompt?.length || 0);
    } else {
      console.warn('⚠️ 未找到专业提示词数据');
    }
  }, [prompts, location.state]);
  
  // 保存数据到localStorage（如果有数据的话）
  React.useEffect(() => {
    if (prompts && sessionId) {
      try {
        localStorage.setItem(`generated-prompts-${sessionId}`, JSON.stringify(prompts));
      } catch (error) {
        console.warn('无法保存提示词数据到localStorage:', error);
      }
    }
  }, [prompts, sessionId]);
  
  if (!prompts) {
    return (
      <div className="min-h-screen pt-20 pb-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="mb-6">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">🔍 没有找到提示词数据</h2>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                <p className="text-yellow-200 text-sm">
                  <strong>可能的原因：</strong>
                  <br />• 页面被刷新导致数据丢失
                  <br />• 直接访问预览链接但没有生成过提示词
                  <br />• 浏览器存储被清除
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-blue-200 font-semibold mb-2">💡 解决方案</h3>
                <p className="text-blue-100 text-sm">
                  返回对话页面，确保有足够的对话内容（建议3-5轮），然后重新点击"生成专业提示词"按钮
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => navigate(`/chat/${sessionId}`)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回对话页面
                </Button>
                <Button 
                  onClick={() => navigate('/chat')}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  开始新对话
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const downloadPrompts = () => {
    const templateInfo = prompts.selected_template ? `
## 🎯 智能模板匹配

**选中模板**: ${prompts.selected_template.template.name}
**模板描述**: ${prompts.selected_template.template.description}
**技术标签**: ${prompts.selected_template.template.tags.join(', ')}
**匹配度**: 高度匹配

### 自动填充变量
${Object.entries(prompts.selected_template.extracted_variables)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n')}

### 推荐理由
基于对话内容智能分析，此模板与项目需求高度匹配，建议优先使用。

` : '';

    const recommendedTemplatesInfo = prompts.recommended_templates && prompts.recommended_templates.length > 0 ? `
## 📚 其他推荐模板

${prompts.recommended_templates.slice(0, 3).map((match, index) => `
### ${index + 1}. ${match.template.name} (${match.score}分)
- **描述**: ${match.template.description}
- **推荐理由**: ${match.recommendationReason}
- **匹配关键词**: ${match.matchedKeywords.join(', ')}
`).join('')}
` : '';

    // 生成四个专业维度的内容
    const professionalPromptsContent = prompts.professional_prompts ? `
## 🎯 四个专业维度的AI提示词

### 1. 📋 产品需求文档(PRD)生成提示词
**使用说明**: ${prompts.professional_prompts.prd.usage_guide}

\`\`\`
${prompts.professional_prompts.prd.prompt}
\`\`\`

### 2. ⚙️ 技术架构实现提示词
**使用说明**: ${prompts.professional_prompts.technical_implementation.usage_guide}

\`\`\`
${prompts.professional_prompts.technical_implementation.prompt}
\`\`\`

### 3. 🎨 UI/UX设计提示词
**使用说明**: ${prompts.professional_prompts.visual_design.usage_guide}

\`\`\`
${prompts.professional_prompts.visual_design.prompt}
\`\`\`

### 4. 📊 项目管理提示词
**使用说明**: ${prompts.professional_prompts.project_management.usage_guide}

\`\`\`
${prompts.professional_prompts.project_management.prompt}
\`\`\`

` : '';

    const content = `# DeepNeed 专业提示词完整套件
${templateInfo}
${professionalPromptsContent}
## 📋 基础生成内容

### 系统提示词
${prompts.system_prompt}

### 用户提示词
${prompts.user_prompt}

### 技术需求
${prompts.technical_requirements}

### 项目总结
${prompts.project_summary}

### 下一步建议
${prompts.next_steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
${recommendedTemplatesInfo}
---
🤖 生成时间: ${new Date().toLocaleString()}
🔗 会话ID: ${sessionId}
⚡ 生成方式: ${prompts.selected_template ? '智能模板匹配' : '传统AI生成'}
📦 提示词类型: 完整专业套件 (PRD + 技术 + 设计 + 管理)
    `;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepneed-professional-prompts-${sessionId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 提交用户反馈
  const submitFeedback = () => {
    if (!feedbackRating || !usageResult) {
      alert('请完成评分和使用结果选择');
      return;
    }

    const feedback: UserFeedback = {
      prompt_id: `prompt-${sessionId}-${Date.now()}`,
      session_id: sessionId!,
      rating: feedbackRating,
      feedback_text: feedbackText,
      usage_result: usageResult,
      improvement_suggestions: improvementSuggestions.filter(s => s.trim()),
      created_at: new Date().toISOString()
    };

    // 提交反馈给优化引擎
    promptOptimizationEngine.recordUserFeedback(feedback);
    
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSubmitted(false);
    }, 2000);
  };

  // 添加改进建议
  const addImprovementSuggestion = () => {
    const suggestion = prompt('请输入您的改进建议：');
    if (suggestion && suggestion.trim()) {
      setImprovementSuggestions(prev => [...prev, suggestion.trim()]);
    }
  };

  // 移除改进建议
  const removeImprovementSuggestion = (index: number) => {
    setImprovementSuggestions(prev => prev.filter((_, i) => i !== index));
  };

  // 下载文档
  const downloadDocument = (doc: { title: string; content: string }, type: string) => {
    const content = `# ${doc.title}

${doc.content}

---
🤖 生成时间: ${new Date().toLocaleString()}
🔗 会话ID: ${sessionId}
⚡ 文档类型: ${type}
    `;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.toLowerCase().replace(/\s/g, '-')}-${sessionId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-20 pb-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* 页面标题 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">
              专业提示词套件生成完成
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-300 text-lg">
            基于您的需求对话，生成了完整的四维度专业提示词套件
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>PRD文档</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-green-400" />
              <span>技术实现</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>视觉设计</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>项目管理</span>
            </div>
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div 
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={downloadPrompts}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            下载 Markdown
          </Button>
          <Button
            onClick={() => setShowFeedback(true)}
            variant="secondary"
            className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
          >
            <Star className="w-4 h-4" />
            反馈评价
          </Button>
          <Button
            onClick={() => navigate(`/chat/${sessionId}`)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回对话
          </Button>
        </motion.div>

        {/* 四个专业维度的提示词展示 */}
        {prompts.professional_prompts && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">🎯 专业提示词套件</h2>
              <p className="text-gray-400">四个专业维度的AI提示词，可直接使用或提交给AI生成完整项目</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PRD文档提示词 */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">PRD需求文档</h3>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(prompts.professional_prompts!.prd.prompt, 'prd')}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedSection === 'prd' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-300 mb-4">{prompts.professional_prompts.prd.description}</p>
                
                {/* 实际的提示词内容 */}
                <div className="bg-black/20 rounded-lg p-4 border border-white/5 mb-4">
                  <p className="text-xs text-gray-400 mb-2">📝 提示词内容：</p>
                  <div className="text-xs text-gray-100 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {prompts.professional_prompts.prd.prompt}
                  </div>
                </div>
                
                {/* 使用指南 */}
                <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                  <p className="text-xs text-emerald-400 mb-1">💡 使用指南：</p>
                  <p className="text-xs text-emerald-200">{prompts.professional_prompts.prd.usage_guide}</p>
                </div>
              </motion.div>

              {/* 技术实现提示词 */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Code className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">技术架构实现</h3>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(prompts.professional_prompts!.technical_implementation.prompt, 'tech')}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedSection === 'tech' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-300 mb-4">{prompts.professional_prompts.technical_implementation.description}</p>
                
                {/* 实际的提示词内容 */}
                <div className="bg-black/20 rounded-lg p-4 border border-white/5 mb-4">
                  <p className="text-xs text-gray-400 mb-2">📝 提示词内容：</p>
                  <div className="text-xs text-gray-100 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {prompts.professional_prompts.technical_implementation.prompt}
                  </div>
                </div>
                
                {/* 使用指南 */}
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                  <p className="text-xs text-green-400 mb-1">💡 使用指南：</p>
                  <p className="text-xs text-green-200">{prompts.professional_prompts.technical_implementation.usage_guide}</p>
                </div>
              </motion.div>

              {/* 视觉设计提示词 */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">UI/UX设计</h3>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(prompts.professional_prompts!.visual_design.prompt, 'design')}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedSection === 'design' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-300 mb-4">{prompts.professional_prompts.visual_design.description}</p>
                
                {/* 实际的提示词内容 */}
                <div className="bg-black/20 rounded-lg p-4 border border-white/5 mb-4">
                  <p className="text-xs text-gray-400 mb-2">📝 提示词内容：</p>
                  <div className="text-xs text-gray-100 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {prompts.professional_prompts.visual_design.prompt}
                  </div>
                </div>
                
                {/* 使用指南 */}
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-xs text-purple-400 mb-1">💡 使用指南：</p>
                  <p className="text-xs text-purple-200">{prompts.professional_prompts.visual_design.usage_guide}</p>
                </div>
              </motion.div>

              {/* 项目管理提示词 */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">项目管理</h3>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(prompts.professional_prompts!.project_management.prompt, 'pm')}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedSection === 'pm' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-300 mb-4">{prompts.professional_prompts.project_management.description}</p>
                
                {/* 实际的提示词内容 */}
                <div className="bg-black/20 rounded-lg p-4 border border-white/5 mb-4">
                  <p className="text-xs text-gray-400 mb-2">📝 提示词内容：</p>
                  <div className="text-xs text-gray-100 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {prompts.professional_prompts.project_management.prompt}
                  </div>
                </div>
                
                {/* 使用指南 */}
                <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                  <p className="text-xs text-orange-400 mb-1">💡 使用指南：</p>
                  <p className="text-xs text-orange-200">{prompts.professional_prompts.project_management.usage_guide}</p>
                </div>
              </motion.div>
            </div>
            
            {/* 使用建议 */}
            <motion.div
              className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">使用建议</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">📋 直接使用</h4>
                  <p className="text-gray-300">复制任意维度的提示词，直接粘贴到Claude、GPT等AI工具中使用</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">🔄 组合使用</h4>
                  <p className="text-gray-300">按照PRD→技术→设计→管理的顺序，逐步完善项目各个维度</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">⚡ 团队协作</h4>
                  <p className="text-gray-300">不同角色使用对应的提示词：产品经理用PRD，技术团队用架构实现</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">📈 迭代优化</h4>
                  <p className="text-gray-300">基于生成结果，结合实际情况调整和完善提示词内容</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 模板推荐信息 */}
        {prompts.selected_template && (
          <motion.div
            className="mb-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-semibold text-white">智能模板匹配</h3>
              <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                推荐
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-emerald-300 font-medium">选中模板</p>
                <p className="text-white text-lg">{prompts.selected_template.template.name}</p>
                <p className="text-gray-300 text-sm mt-1">{prompts.selected_template.template.description}</p>
              </div>
              <div>
                <p className="text-emerald-300 font-medium">自动填充变量</p>
                <div className="text-gray-300 text-sm">
                  {Object.keys(prompts.selected_template.extracted_variables).length} 个变量已自动识别
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {prompts.selected_template.template.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 其他推荐模板 */}
        {prompts.recommended_templates && prompts.recommended_templates.length > 1 && (
          <motion.div
            className="mb-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">其他推荐模板</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prompts.recommended_templates.slice(1, 4).map((match, index) => (
                <div key={match.template.id} className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{match.template.name}</h4>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                      {match.score}分
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{match.template.description}</p>
                  <p className="text-gray-500 text-xs">{match.recommendationReason}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 提示词内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 系统提示词 */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">系统提示词</h3>
              </div>
              <Button
                onClick={() => copyToClipboard(prompts.system_prompt, 'system')}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                {copiedSection === 'system' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-white/10">
              <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono">
                {prompts.system_prompt}
              </pre>
            </div>
          </motion.div>

          {/* 用户提示词 */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-semibold text-white">用户提示词</h3>
              </div>
              <Button
                onClick={() => copyToClipboard(prompts.user_prompt, 'user')}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                {copiedSection === 'user' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-white/10">
              <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono">
                {prompts.user_prompt}
              </pre>
            </div>
          </motion.div>

          {/* 技术需求 */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">技术需求</h3>
              </div>
              <Button
                onClick={() => copyToClipboard(prompts.technical_requirements, 'technical')}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                {copiedSection === 'technical' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-white/10 max-h-64 overflow-y-auto">
              <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono">
                {prompts.technical_requirements}
              </pre>
            </div>
          </motion.div>

          {/* 项目总结 */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">项目总结</h3>
              </div>
              <Button
                onClick={() => copyToClipboard(prompts.project_summary, 'summary')}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                {copiedSection === 'summary' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="bg-black/20 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-gray-200 leading-relaxed">
                {prompts.project_summary}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 下一步建议 */}
        <motion.div
          className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-semibold text-white">下一步建议</h3>
            </div>
            <Button
              onClick={() => copyToClipboard(prompts.next_steps.join('\n'), 'steps')}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              {copiedSection === 'steps' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompts.next_steps.map((step, index) => (
              <div
                key={index}
                className="bg-black/20 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 完整生成文档区域 */}
        {prompts.generated_documents && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">📋 完整项目文档</h2>
              <p className="text-gray-400">基于需求对话生成的完整专业文档，可直接使用</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              
              {/* PRD完整文档 */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">{prompts.generated_documents.prd_document.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(prompts.generated_documents!.prd_document.content, 'prd-doc')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedSection === 'prd-doc' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => downloadDocument(prompts.generated_documents!.prd_document, 'prd')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-blue-400 mb-2">📄 完整PRD文档内容：</p>
                  <div className="text-xs text-gray-100 whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {prompts.generated_documents.prd_document.content}
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-400">
                  文档长度: {prompts.generated_documents.prd_document.content.length} 字符
                </div>
              </motion.div>

              {/* 技术文档 */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Code className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">{prompts.generated_documents.technical_document.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(prompts.generated_documents!.technical_document.content, 'tech-doc')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedSection === 'tech-doc' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => downloadDocument(prompts.generated_documents!.technical_document, 'tech')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-green-400 mb-2">🔧 完整技术文档内容：</p>
                  <div className="text-xs text-gray-100 whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {prompts.generated_documents.technical_document.content}
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-400">
                  文档长度: {prompts.generated_documents.technical_document.content.length} 字符
                </div>
              </motion.div>

              {/* 设计文档 */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Palette className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">{prompts.generated_documents.design_document.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(prompts.generated_documents!.design_document.content, 'design-doc')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedSection === 'design-doc' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => downloadDocument(prompts.generated_documents!.design_document, 'design')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-purple-400 mb-2">🎨 完整设计文档内容：</p>
                  <div className="text-xs text-gray-100 whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {prompts.generated_documents.design_document.content}
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-400">
                  文档长度: {prompts.generated_documents.design_document.content.length} 字符
                </div>
              </motion.div>

              {/* 项目管理文档 */}
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-semibold text-white">{prompts.generated_documents.project_plan.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(prompts.generated_documents!.project_plan.content, 'project-doc')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedSection === 'project-doc' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => downloadDocument(prompts.generated_documents!.project_plan, 'project')}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-orange-400 mb-2">📊 完整项目管理文档内容：</p>
                  <div className="text-xs text-gray-100 whitespace-pre-wrap max-h-80 overflow-y-auto">
                    {prompts.generated_documents.project_plan.content}
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-400">
                  文档长度: {prompts.generated_documents.project_plan.content.length} 字符
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 用户反馈弹窗 */}
      {showFeedback && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-slate-800 rounded-2xl border border-white/10 p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {!feedbackSubmitted ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-semibold text-white">帮助我们改进提示词质量</h3>
                  </div>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* 评分区域 */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white mb-3">整体评分</h4>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className={`w-8 h-8 ${
                          star <= feedbackRating ? 'text-yellow-400' : 'text-gray-600'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <Star className="w-full h-full fill-current" />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {feedbackRating === 0 && '请为提示词质量评分'}
                    {feedbackRating === 1 && '很差 - 需要大幅改进'}
                    {feedbackRating === 2 && '较差 - 有明显问题'}
                    {feedbackRating === 3 && '一般 - 基本可用'}
                    {feedbackRating === 4 && '较好 - 质量不错'}
                    {feedbackRating === 5 && '很好 - 非常专业'}
                  </p>
                </div>

                {/* 使用结果 */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white mb-3">使用结果</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setUsageResult('success')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        usageResult === 'success'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:border-green-500/30'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      成功使用
                    </button>
                    <button
                      onClick={() => setUsageResult('partial')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        usageResult === 'partial'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:border-yellow-500/30'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      部分有用
                    </button>
                    <button
                      onClick={() => setUsageResult('failed')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        usageResult === 'failed'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:border-red-500/30'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      未能使用
                    </button>
                  </div>
                </div>

                {/* 详细反馈 */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white mb-3">详细反馈 (可选)</h4>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="请分享您使用提示词的体验，遇到的问题，或者改进建议..."
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                {/* 改进建议 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-white">改进建议</h4>
                    <Button
                      onClick={addImprovementSuggestion}
                      variant="ghost"
                      size="sm"
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加建议
                    </Button>
                  </div>
                  {improvementSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 mb-2 p-3 bg-white/5 rounded-lg"
                    >
                      <span className="flex-1 text-sm text-gray-200">{suggestion}</span>
                      <button
                        onClick={() => removeImprovementSuggestion(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {improvementSuggestions.length === 0 && (
                    <p className="text-sm text-gray-500 italic">暂无改进建议</p>
                  )}
                </div>

                {/* 提交按钮 */}
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setShowFeedback(false)}
                    variant="ghost"
                    className="text-gray-400"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={submitFeedback}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    disabled={!feedbackRating || !usageResult}
                  >
                    提交反馈
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">感谢您的反馈！</h3>
                <p className="text-gray-400">您的反馈将帮助我们持续改进提示词质量</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PreviewPage; 