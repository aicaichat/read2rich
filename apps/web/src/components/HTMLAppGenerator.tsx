import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Download, 
  Eye, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  FileCode,
  Palette,
  Smartphone
} from 'lucide-react';
import Button from './ui/Button';
import { htmlAppGenerator, type GeneratedHTMLApp } from '../lib/html-generator';

interface HTMLAppGeneratorProps {
  prdContent: string;
  projectInfo: any;
  isOpen: boolean;
  onClose: () => void;
}

const HTMLAppGenerator: React.FC<HTMLAppGeneratorProps> = ({
  prdContent,
  projectInfo,
  isOpen,
  onClose
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<GeneratedHTMLApp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<string>('');

  const handleGenerateHTMLApp = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedApp(null);
    
    try {
      setGenerationStep('分析PRD文档...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGenerationStep('生成HTML结构...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGenerationStep('设计CSS样式...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGenerationStep('编写JavaScript功能...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGenerationStep('组合完整应用...');
      const app = await htmlAppGenerator.generateHTMLApp(prdContent, projectInfo);
      
      setGeneratedApp(app);
      setGenerationStep('');
      
    } catch (err) {
      console.error('HTML应用生成失败:', err);
      setError('生成HTML应用时出现错误，请稍后重试');
      setGenerationStep('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    if (generatedApp) {
      htmlAppGenerator.previewHTMLApp(generatedApp);
    }
  };

  const handleDownload = () => {
    if (generatedApp) {
      htmlAppGenerator.downloadHTMLApp(generatedApp);
    }
  };

  const handleDownloadCSS = () => {
    if (generatedApp) {
      const blob = new Blob([generatedApp.css], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedApp.metadata.title}-styles.css`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadJS = () => {
    if (generatedApp) {
      const blob = new Blob([generatedApp.js], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedApp.metadata.title}-script.js`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">HTML单页面应用生成器</h2>
                    <p className="text-blue-100">基于PRD文档生成可访问的Web应用</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {!generatedApp && !isGenerating && (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">生成HTML单页面应用</h3>
                    <p className="text-gray-600 mb-6">
                      基于您的PRD文档，AI将生成一个完整的、可访问的HTML单页面应用
                    </p>
                  </div>

                  {/* 功能特性 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <FileCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-blue-900">完整HTML结构</h4>
                      <p className="text-sm text-blue-700">语义化标签，SEO优化</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <Palette className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-purple-900">现代化CSS样式</h4>
                      <p className="text-sm text-purple-700">响应式设计，动画效果</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <Smartphone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-green-900">交互功能</h4>
                      <p className="text-sm text-green-700">表单验证，主题切换</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateHTMLApp}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    开始生成HTML应用
                  </Button>
                </div>
              )}

              {/* 生成中状态 */}
              {isGenerating && (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-6"
                  >
                    <Loader2 className="w-16 h-16 text-blue-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4">正在生成HTML应用...</h3>
                  <p className="text-gray-600 mb-6">{generationStep}</p>
                  
                  {/* 生成步骤指示器 */}
                  <div className="flex justify-center gap-2 mb-6">
                    {['分析', 'HTML', 'CSS', 'JS', '完成'].map((step, index) => (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full ${
                          index < (generationStep ? 
                            (generationStep.includes('分析') ? 1 : 
                             generationStep.includes('HTML') ? 2 :
                             generationStep.includes('CSS') ? 3 :
                             generationStep.includes('JavaScript') ? 4 : 5) : 0
                          ) ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    这可能需要几秒钟时间，请耐心等待...
                  </p>
                </div>
              )}

              {/* 错误状态 */}
              {error && (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-900 mb-2">生成失败</h3>
                  <p className="text-red-700 mb-6">{error}</p>
                  <Button
                    onClick={handleGenerateHTMLApp}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    重试生成
                  </Button>
                </div>
              )}

              {/* 生成结果 */}
              {generatedApp && (
                <div className="space-y-6">
                  {/* 成功提示 */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-900">HTML应用生成成功！</h3>
                        <p className="text-green-700">
                          {generatedApp.metadata.title} - 包含完整的HTML、CSS和JavaScript代码
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 应用信息 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">应用信息</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">标题:</span>
                        <span className="ml-2">{generatedApp.metadata.title}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">版本:</span>
                        <span className="ml-2">{generatedApp.metadata.version}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">生成时间:</span>
                        <span className="ml-2">
                          {new Date(generatedApp.metadata.generatedAt).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">功能数量:</span>
                        <span className="ml-2">{generatedApp.metadata.features.length}个</span>
                      </div>
                    </div>
                  </div>

                  {/* 功能列表 */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-blue-900">核心功能</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {generatedApp.metadata.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-blue-800">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                      onClick={handlePreview}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      预览应用
                    </Button>
                    
                    <Button
                      onClick={handleDownload}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载完整HTML
                    </Button>
                    
                    <Button
                      onClick={handleDownloadCSS}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <FileCode className="w-4 h-4 mr-2" />
                      下载CSS
                    </Button>
                    
                    <Button
                      onClick={handleDownloadJS}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      下载JavaScript
                    </Button>
                  </div>

                  {/* 使用说明 */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">使用说明</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• 点击"预览应用"在新窗口中查看效果</li>
                      <li>• 点击"下载完整HTML"获取可直接使用的单文件</li>
                      <li>• 可以分别下载CSS和JavaScript文件进行自定义修改</li>
                      <li>• 生成的HTML文件可以直接在浏览器中打开使用</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HTMLAppGenerator; 