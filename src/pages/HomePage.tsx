import React, { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import ControlPanel from '../components/ControlPanel';
import GIFPreview from '../components/GIFPreview';
import { AppState, GIFParameters } from '../types/gif';
import { generateGIF, sliceSpritesheet, downloadFile } from '../utils/gifGenerator';

const HomePage: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    images: [],
    previewFrames: [],
    gifParameters: {
      rows: 4,
      cols: 4,
      duration: 0.5,
      loopMode: 'infinite',
      direction: 'forward',
      scale: 1
    },
    isGenerating: false,
    generatedGIF: null
  });

  const handleImagesLoaded = async (images: File[]) => {
    const single = images.slice(0, 1);
    setAppState(prev => ({ ...prev, images: single }));
    
    if (single.length > 0) {
      const frames = await sliceSpritesheet(single[0], appState.gifParameters.rows, appState.gifParameters.cols);
      setAppState(prev => ({ ...prev, previewFrames: frames }));
    }
  };

  const handleParameterChange = (params: GIFParameters) => {
    setAppState(prev => ({ 
      ...prev, 
      gifParameters: params 
    }));
    
    if (appState.images.length > 0) {
      sliceSpritesheet(appState.images[0], params.rows, params.cols).then(frames => {
        setAppState(prev => ({ ...prev, previewFrames: frames }));
      });
    }
  };

  const handleGenerateGIF = async () => {
    if (appState.previewFrames.length === 0) {
      alert('请先上传图片');
      return;
    }

    setAppState(prev => ({ ...prev, isGenerating: true }));

    try {
      // 获取第一张图片的尺寸作为基准
      const img = new Image();
      img.src = appState.previewFrames[0];
      
      await new Promise<void>((resolve) => {
        img.onload = async () => {
          const gifBlob = await generateGIF(
            appState.previewFrames,
            appState.gifParameters.duration,
            img.width * appState.gifParameters.scale,
            img.height * appState.gifParameters.scale
          );
          
          setAppState(prev => ({ 
            ...prev, 
            generatedGIF: gifBlob,
            isGenerating: false 
          }));
          downloadFile(gifBlob, `animation_${Date.now()}.gif`);
          resolve();
        };
      });
    } catch (error) {
      console.error('生成GIF失败:', error);
      alert('生成GIF失败，请重试');
      setAppState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleDownloadGIF = () => {
    if (appState.generatedGIF) {
      downloadFile(appState.generatedGIF, `animation_${Date.now()}.gif`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">GIF帧图集生成器</h1>
          </div>
          <p className="text-gray-600 text-lg">上传单张帧图集，支持自定义行×列切分并生成GIF</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：图片上传和参数控制 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 图片上传 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">帧图集上传</h2>
              <ImageUploader onImagesLoaded={handleImagesLoaded} />
            </div>

            {/* 参数控制面板 */}
            <ControlPanel
              rows={appState.gifParameters.rows}
              cols={appState.gifParameters.cols}
              duration={appState.gifParameters.duration}
              loopMode={appState.gifParameters.loopMode}
              direction={appState.gifParameters.direction}
              scale={appState.gifParameters.scale}
              onParameterChange={handleParameterChange}
            />
          </div>

          {/* 右侧：预览和生成 */}
          <div className="lg:col-span-2 space-y-6">
            {/* GIF预览 */}
            <GIFPreview
              frames={appState.previewFrames}
              duration={appState.gifParameters.duration}
              loopMode={appState.gifParameters.loopMode}
              direction={appState.gifParameters.direction}
              scale={appState.gifParameters.scale}
            />

            {/* 生成和下载按钮 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex space-x-4">
                <button
                  onClick={handleGenerateGIF}
                  disabled={appState.isGenerating || appState.images.length === 0}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg btn-hover flex items-center justify-center"
                >
                  {appState.isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      下载中...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      下载到本地
                    </>
                  )}
                </button>
              </div>

              {appState.generatedGIF && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">GIF生成成功！</p>
                  <p className="text-green-600 text-sm mt-1">
                    文件大小: {(appState.generatedGIF.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
