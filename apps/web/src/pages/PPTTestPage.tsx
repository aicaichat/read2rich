import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Presentation } from 'lucide-react';
import Button from '../components/ui/Button';
import PPTViewer from '../components/PPTViewer';
import { millionDollarCourseSlides } from '../data/millionDollarCourseSlides';

const PPTTestPage: React.FC = () => {
  const [showPPT, setShowPPT] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto p-8"
        >
          <h1 className="text-4xl font-bold text-white mb-6">
            价值百万的AI应用公开课 PPT 测试
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            点击下面的按钮查看完整的PPT演示
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => setShowPPT(true)}
              className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Presentation className="w-6 h-6 mr-3" />
              查看PPT演示
            </Button>
            
            <div className="text-sm text-gray-400">
              包含 {millionDollarCourseSlides.length} 张幻灯片
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {millionDollarCourseSlides.slice(0, 3).map((slide, index) => (
              <div
                key={slide.id}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all"
              >
                <div className="text-2xl mb-3">📊</div>
                <h3 className="text-white font-semibold mb-2">
                  幻灯片 {index + 1}
                </h3>
                <p className="text-gray-400 text-sm">
                  {slide.title}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
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

export default PPTTestPage; 