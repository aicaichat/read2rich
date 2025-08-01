import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Maximize, Minimize, 
  Play, Pause, RotateCcw, Download, Share2
} from 'lucide-react';
import Button from './ui/Button';

interface Slide {
  id: number;
  title: string;
  content: React.ReactNode;
}

interface PPTViewerProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  title?: string;
}

const PPTViewer: React.FC<PPTViewerProps> = ({ 
  isOpen, 
  onClose, 
  slides, 
  title = "价值百万的AI应用公开课" 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动播放逻辑
  useEffect(() => {
    if (isAutoPlay && isOpen) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // 5秒切换一次
      setAutoPlayInterval(interval);
    } else if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }

    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [isAutoPlay, isOpen, slides.length]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPreviousSlide();
          break;
        case 'ArrowRight':
          goToNextSlide();
          break;
        case 'Escape':
          onClose();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case ' ':
          e.preventDefault();
          setIsAutoPlay(!isAutoPlay);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isFullscreen, isAutoPlay]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  // 全屏切换函数
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // 进入全屏
        if (containerRef.current) {
          // 支持多种浏览器的全屏API
          if (containerRef.current.requestFullscreen) {
            await containerRef.current.requestFullscreen();
          } else if ((containerRef.current as any).webkitRequestFullscreen) {
            await (containerRef.current as any).webkitRequestFullscreen();
          } else if ((containerRef.current as any).mozRequestFullScreen) {
            await (containerRef.current as any).mozRequestFullScreen();
          } else if ((containerRef.current as any).msRequestFullscreen) {
            await (containerRef.current as any).msRequestFullscreen();
          }
          setIsFullscreen(true);
        }
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('全屏切换失败:', error);
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFullscreenNow);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black ${isFullscreen ? 'p-0' : 'p-4'}`}
      style={{ 
        width: isFullscreen ? '100vw' : 'auto',
        height: isFullscreen ? '100vh' : 'auto'
      }}
    >
      {/* 顶部控制栏 */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-white font-semibold">{title}</h1>
            <span className="text-gray-400">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="text-white hover:text-emerald-400"
            >
              {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:text-emerald-400"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentSlide(0)}
              className="text-white hover:text-emerald-400"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-emerald-400"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-emerald-400"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:text-red-400"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>

      {/* 幻灯片内容 */}
      <div className={`h-full flex items-center justify-center ${isFullscreen ? 'p-4 pt-16' : 'p-8 pt-20'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="h-full flex flex-col">
              {/* 幻灯片内容区域 */}
              <div className="flex-1 p-12 overflow-y-auto">
                {slides[currentSlide]?.content}
              </div>
              
              {/* 底部进度条 */}
              <div className="h-2 bg-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 导航按钮 */}
      <button
        onClick={goToPreviousSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 缩略图导航 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-emerald-400' 
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* 快捷键提示 */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-black/50 px-3 py-2 rounded">
        <div>← → 切换幻灯片</div>
        <div>空格 自动播放</div>
        <div>F 全屏</div>
        <div>ESC 退出</div>
        {isFullscreen && (
          <div className="mt-1 text-emerald-400 font-semibold">全屏模式</div>
        )}
      </div>
    </div>
  );
};

export default PPTViewer; 