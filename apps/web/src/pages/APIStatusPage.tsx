import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';

interface APIStatus {
  name: string;
  url: string;
  status: 'checking' | 'online' | 'offline' | 'error';
  message: string;
  latency?: number;
}

const APIStatusPage: React.FC = () => {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([
    {
      name: '代理服务器',
      url: 'http://localhost:8000/health',
      status: 'checking',
      message: '检查中...'
    },
    {
      name: 'Claude API',
      url: 'http://localhost:8000/claude',
      status: 'checking',
      message: '检查中...'
    },
    {
      name: 'DeepSeek API',
      url: 'http://localhost:8000/deepseek',
      status: 'checking',
      message: '检查中...'
    }
  ]);

  const checkAPIStatus = async (api: APIStatus): Promise<APIStatus> => {
    const startTime = Date.now();
    
    try {
      if (api.name === '代理服务器') {
        // 检查代理服务器健康状态
        const response = await fetch(api.url);
        const latency = Date.now() - startTime;
        
        if (response.ok) {
          const data = await response.json();
          return {
            ...api,
            status: 'online',
            message: `运行正常 (${latency}ms)`,
            latency
          };
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } else {
        // 检查AI API
        const testMessage = [{ role: 'user', content: 'Test connection' }];
        const response = await fetch(api.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: api.name.includes('Claude') ? 'claude-3-haiku-20240307' : 'deepseek-chat',
            messages: testMessage,
            max_tokens: 10
          })
        });
        
        const latency = Date.now() - startTime;
        
        if (response.ok) {
          return {
            ...api,
            status: 'online',
            message: `API可用 (${latency}ms)`,
            latency
          };
        } else {
          const errorData = await response.json();
          
          if (response.status === 401) {
            return {
              ...api,
              status: 'error',
              message: errorData.error?.message || 'API密钥无效',
              latency
            };
          } else {
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
          }
        }
      }
    } catch (error: any) {
      const latency = Date.now() - startTime;
      return {
        ...api,
        status: 'offline',
        message: error.message || '连接失败',
        latency
      };
    }
  };

  const checkAllAPIs = async () => {
    console.log('🔍 开始检查API状态...');
    
    setApiStatuses(prev => prev.map(api => ({
      ...api,
      status: 'checking',
      message: '检查中...'
    })));

    // 并行检查所有API
    const promises = apiStatuses.map(checkAPIStatus);
    const results = await Promise.all(promises);
    
    setApiStatuses(results);
    console.log('✅ API状态检查完成:', results);
  };

  useEffect(() => {
    checkAllAPIs();
  }, []);

  const getStatusIcon = (status: APIStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'offline':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      case 'checking':
        return <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: APIStatus['status']) => {
    switch (status) {
      case 'online':
        return 'border-green-500/20 bg-green-500/10';
      case 'offline':
        return 'border-red-500/20 bg-red-500/10';
      case 'error':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'checking':
        return 'border-blue-500/20 bg-blue-500/10';
    }
  };

  const overallStatus = apiStatuses.every(api => api.status === 'online') ? 'healthy' :
                      apiStatuses.some(api => api.status === 'online') ? 'partial' : 'down';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">🔍 系统状态监控</h1>
          <p className="text-gray-400">检查AI系统各组件运行状态</p>
        </motion.div>

        {/* 总体状态 */}
        <motion.div
          className={`p-6 rounded-2xl border mb-8 ${
            overallStatus === 'healthy' ? 'border-green-500/20 bg-green-500/10' :
            overallStatus === 'partial' ? 'border-yellow-500/20 bg-yellow-500/10' :
            'border-red-500/20 bg-red-500/10'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {overallStatus === 'healthy' ? '🟢 系统运行正常' :
                 overallStatus === 'partial' ? '🟡 部分服务可用' :
                 '🔴 系统异常'}
              </h2>
              <p className="text-gray-400">
                {overallStatus === 'healthy' ? '所有组件运行正常' :
                 overallStatus === 'partial' ? '部分API可用，建议检查配置' :
                 '多个组件异常，请检查配置'}
              </p>
            </div>
            <Button
              onClick={checkAllAPIs}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新状态
            </Button>
          </div>
        </motion.div>

        {/* API状态列表 */}
        <div className="space-y-4">
          {apiStatuses.map((api, index) => (
            <motion.div
              key={api.name}
              className={`p-6 rounded-2xl border ${getStatusColor(api.status)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusIcon(api.status)}
                  <div>
                    <h3 className="text-lg font-semibold">{api.name}</h3>
                    <p className="text-sm text-gray-400">{api.url}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{api.message}</p>
                  {api.latency && (
                    <p className="text-xs text-gray-400">{api.latency}ms</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 帮助信息 */}
        <motion.div
          className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4">💡 故障排除指南</h3>
          
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">🚫 代理服务器离线</h4>
              <p>运行命令: <code className="bg-black/20 px-2 py-1 rounded">python3 simple_proxy_server.py</code></p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">🔐 API密钥问题</h4>
              <p>访问相应平台获取有效密钥：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  <a 
                    href="https://console.anthropic.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    Claude API密钥 <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://platform.deepseek.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    DeepSeek API密钥 <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">🔧 快速启动</h4>
              <p>使用一键启动脚本: <code className="bg-black/20 px-2 py-1 rounded">./start_dev_servers.sh</code></p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default APIStatusPage; 