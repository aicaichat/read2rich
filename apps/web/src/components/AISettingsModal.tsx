import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Zap, Brain, RotateCcw, Check, AlertTriangle, Eye, EyeOff, Key } from 'lucide-react';
import Button from './ui/Button';
import { 
  getAIConfig, 
  saveAIConfig, 
  resetAIConfig, 
  toggleProvider, 
  setProviderPriority,
  setProviderAPIKey,
  getProviderAPIKey,
  isProviderAPIKeyConfigured,
  type AIConfig 
} from '../lib/ai-config';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAPIKeys, setShowAPIKeys] = useState<Record<string, boolean>>({});

  // 加载配置
  useEffect(() => {
    if (isOpen) {
      const currentConfig = getAIConfig();
      setConfig(currentConfig);
      setHasChanges(false);
      
      // 初始化API密钥显示状态
      const initialShowState: Record<string, boolean> = {};
      Object.keys(currentConfig.providers).forEach(name => {
        initialShowState[name] = false;
      });
      setShowAPIKeys(initialShowState);
    }
  }, [isOpen]);

  const handleToggleProvider = (providerName: string, enabled: boolean) => {
    if (!config) return;
    
    const newConfig = {
      ...config,
      providers: {
        ...config.providers,
        [providerName]: {
          ...config.providers[providerName],
          enabled
        }
      }
    };
    
    setConfig(newConfig);
    setHasChanges(true);
  };

  const handlePriorityChange = (providerName: string, priority: number) => {
    if (!config) return;
    
    const newConfig = {
      ...config,
      providers: {
        ...config.providers,
        [providerName]: {
          ...config.providers[providerName],
          priority
        }
      }
    };
    
    setConfig(newConfig);
    setHasChanges(true);
  };

  const handleAPIKeyChange = (providerName: string, apiKey: string) => {
    if (!config) return;
    
    const newConfig = {
      ...config,
      providers: {
        ...config.providers,
        [providerName]: {
          ...config.providers[providerName],
          apiKey,
          apiKeyConfigured: !!apiKey
        }
      }
    };
    
    setConfig(newConfig);
    setHasChanges(true);
  };

  const toggleAPIKeyVisibility = (providerName: string) => {
    setShowAPIKeys(prev => ({
      ...prev,
      [providerName]: !prev[providerName]
    }));
  };

  const handleSave = () => {
    if (!config) return;
    
    // 保存配置到localStorage
    saveAIConfig(config);
    
    // 保存API密钥到localStorage（加密存储）
    Object.entries(config.providers).forEach(([name, provider]) => {
      if (provider.apiKey) {
        setProviderAPIKey(name, provider.apiKey);
      }
    });
    
    setHasChanges(false);
    
    // 显示保存成功提示
    console.log('✅ AI设置已保存');
  };

  const handleReset = () => {
    resetAIConfig();
    const defaultConfig = getAIConfig();
    setConfig(defaultConfig);
    setHasChanges(true);
  };

  const getProviderIcon = (providerName: string) => {
    switch (providerName) {
      case 'claude':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'deepseek':
        return <Zap className="w-5 h-5 text-blue-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'text-green-400' : 'text-gray-500';
  };

  if (!config) return null;

  const enabledCount = Object.values(config.providers).filter(p => p.enabled).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-slate-800 rounded-2xl border border-white/10 max-w-3xl w-full max-h-[85vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">AI 服务设置</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 overflow-y-auto max-h-[65vh]">
              {/* 总览 */}
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">多重 AI 保障</span>
                </div>
                <p className="text-gray-300 text-sm">
                  当前启用 {enabledCount} 个 AI 服务，确保高可用性和服务连续性。
                  系统会按优先级自动切换，提供最佳体验。
                </p>
              </div>

              {/* API 提供商列表 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">AI 服务提供商</h3>
                
                {Object.entries(config.providers).map(([name, provider]) => (
                  <motion.div
                    key={name}
                    className={`p-4 rounded-xl border transition-all ${
                      provider.enabled 
                        ? 'bg-white/5 border-emerald-500/30' 
                        : 'bg-white/2 border-white/10'
                    }`}
                    layout
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getProviderIcon(name)}
                        <div>
                          <h4 className="text-white font-medium">{provider.displayName}</h4>
                          <p className="text-gray-400 text-sm">{provider.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* 优先级设置 */}
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">优先级:</span>
                          <select
                            value={provider.priority}
                            onChange={(e) => handlePriorityChange(name, parseInt(e.target.value))}
                            disabled={!provider.enabled}
                            className="bg-slate-700 text-white text-sm rounded px-2 py-1 border border-white/20 disabled:opacity-50"
                          >
                            <option value={1}>1 (最高)</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                          </select>
                        </div>
                        
                        {/* 启用/禁用开关 */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={provider.enabled}
                            onChange={(e) => handleToggleProvider(name, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${
                            provider.enabled ? 'bg-emerald-500' : 'bg-gray-600'
                          }`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform m-1 ${
                              provider.enabled ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* API密钥配置 */}
                    {provider.enabled && (
                      <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-white">API 密钥</span>
                          <div className={`w-2 h-2 rounded-full ${
                            provider.apiKeyConfigured ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                          <span className={`text-xs ${
                            provider.apiKeyConfigured ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {provider.apiKeyConfigured ? '已配置' : '未配置'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type={showAPIKeys[name] ? 'text' : 'password'}
                            value={provider.apiKey || ''}
                            onChange={(e) => handleAPIKeyChange(name, e.target.value)}
                            placeholder="请输入您的API密钥"
                            className="flex-1 bg-slate-600 text-white text-sm rounded px-3 py-2 border border-white/20 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                          />
                          <button
                            onClick={() => toggleAPIKeyVisibility(name)}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            type="button"
                          >
                            {showAPIKeys[name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-400 mt-2">
                          {name === 'claude' 
                            ? 'Claude API密钥格式: sk-ant-api03-...' 
                            : 'DeepSeek API密钥格式: sk-...'
                          }
                        </p>
                      </div>
                    )}
                    
                    {/* 状态指示 */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className={`w-2 h-2 rounded-full ${
                        provider.enabled ? 'bg-green-400' : 'bg-gray-500'
                      }`} />
                      <span className={`text-sm ${getStatusColor(provider.enabled)}`}>
                        {provider.enabled ? '已启用' : '已禁用'}
                      </span>
                      {provider.enabled && !provider.apiKeyConfigured && (
                        <span className="text-xs text-red-400 ml-2">
                          ⚠️ 需要配置API密钥
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 警告信息 */}
              {enabledCount === 0 && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">警告</span>
                  </div>
                  <p className="text-red-300 text-sm mt-1">
                    至少需要启用一个 AI 服务提供商才能正常使用功能。
                  </p>
                </div>
              )}

              {/* API密钥配置警告 */}
              {Object.values(config.providers).some(p => p.enabled && !p.apiKeyConfigured) && (
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">配置提醒</span>
                  </div>
                  <p className="text-yellow-300 text-sm mt-1">
                    部分启用的AI服务尚未配置API密钥，可能影响功能正常使用。
                  </p>
                </div>
              )}
            </div>

            {/* 底部操作栏 */}
            <div className="flex items-center justify-between p-6 border-t border-white/10">
              <Button
                onClick={handleReset}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重置默认
              </Button>
              
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="secondary"
                >
                  取消
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || enabledCount === 0}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  保存设置
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AISettingsModal; 