import React, { useState } from 'react';
import PPTViewer from '../components/PPTViewer';
import { millionDollarCourseSlides } from '../data/millionDollarCourseSlides';
import Button from '../components/ui/Button';
import { Presentation } from 'lucide-react';

const FullscreenTestPage: React.FC = () => {
  const [showPPT, setShowPPT] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          PPT全屏功能测试
        </h1>
        
        <div className="bg-white/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl text-emerald-400 mb-4">
            测试PPT查看器的全屏功能
          </h2>
          
          <p className="text-gray-300 mb-8">
            点击下面的按钮打开PPT查看器，然后使用F键或点击全屏按钮进入全屏模式
          </p>
          
          <Button
            onClick={() => setShowPPT(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg"
          >
            <Presentation className="w-5 h-5 mr-2" />
            打开PPT查看器
          </Button>
          
          <div className="mt-8 text-sm text-gray-400">
            <h3 className="text-white mb-2">使用说明：</h3>
            <ul className="space-y-1 text-left max-w-md mx-auto">
              <li>• 点击"打开PPT查看器"按钮</li>
              <li>• 按F键或点击全屏按钮进入全屏</li>
              <li>• 使用左右箭头键切换幻灯片</li>
              <li>• 按ESC键退出全屏或关闭查看器</li>
              <li>• 空格键切换自动播放</li>
            </ul>
          </div>
        </div>
      </div>
      
      <PPTViewer
        isOpen={showPPT}
        onClose={() => setShowPPT(false)}
        slides={millionDollarCourseSlides}
        title="价值百万的AI应用公开课 - 全屏测试"
      />
    </div>
  );
};

export default FullscreenTestPage; 