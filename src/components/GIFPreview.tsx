import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { GIFPreviewProps } from '../types/gif';

const GIFPreview: React.FC<GIFPreviewProps> = ({
  frames,
  duration,
  loopMode,
  direction,
  scale
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const processedFrames = React.useMemo(() => {
    if (frames.length === 0) return [];
    
    let result = [...frames];
    
    if (direction === 'reverse') {
      result = result.reverse();
    } else if (direction === 'pingpong') {
      const reversed = [...result].reverse();
      result = [...result, ...reversed.slice(1, -1)];
    }
    
    return result;
  }, [frames, direction]);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const frameDuration = duration * 1000;
    const totalDuration = frameDuration * processedFrames.length;
    
    let progress = elapsed % totalDuration;
    let currentFrameIndex = Math.floor(progress / frameDuration);
    
    setCurrentFrame(currentFrameIndex);
    
    if (loopMode === 'once' && elapsed >= totalDuration) {
      setIsPlaying(false);
      return;
    }
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlaying && processedFrames.length > 0) {
      startTimeRef.current = undefined;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, processedFrames.length, duration, loopMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || processedFrames.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    };
    
    img.src = processedFrames[currentFrame] || processedFrames[0];
  }, [currentFrame, processedFrames, scale]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
    startTimeRef.current = undefined;
  };

  if (processedFrames.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-gray-500 text-lg">暂无图片</div>
        <div className="text-gray-400 text-sm mt-2">请先上传图片以预览动画效果</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg card-shadow p-6 animate-fade-in">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">预览</h3>
      
      <div className="flex justify-center mb-4">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg max-w-full h-auto"
          style={{ maxWidth: '400px' }}
        />
      </div>

      <div className="flex justify-center items-center space-x-4 mb-4">
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        
        <button
          onClick={handleStop}
          className="flex items-center justify-center w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
        >
          <Square className="h-6 w-6" />
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        帧数: {currentFrame + 1} / {processedFrames.length}
      </div>
    </div>
  );
};

export default GIFPreview;