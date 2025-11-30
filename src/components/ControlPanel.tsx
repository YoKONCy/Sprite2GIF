import React from 'react';
import { ControlPanelProps } from '../types/gif';

const ControlPanel: React.FC<ControlPanelProps> = ({
  rows,
  cols,
  duration,
  loopMode,
  direction,
  scale,
  onParameterChange
}) => {
  const handleParameterChange = (key: string, value: any) => {
    // 统一参数更新
    onParameterChange({
      rows,
      cols,
      duration,
      loopMode,
      direction,
      scale,
      [key]: value
    });
  };

  const setRows = (n: number) => {
    onParameterChange({
      rows: n,
      cols,
      duration,
      loopMode,
      direction,
      scale
    });
  };

  const setCols = (n: number) => {
    onParameterChange({
      rows,
      cols: n,
      duration,
      loopMode,
      direction,
      scale
    });
  };

  return (
    <div className="bg-white rounded-lg card-shadow p-6 space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">参数设置</h2>
      
      {/* 网格行列 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">网格行列</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">行数: {rows}</label>
            <input
              type="range"
              min="1"
              max="8"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">列数: {cols}</label>
            <input
              type="range"
              min="1"
              max="8"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">当前: {rows} × {cols}</p>
      </div>

      {/* 动画参数 */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">动画参数</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            帧间隔: {duration}秒
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={duration}
            onChange={(e) => handleParameterChange('duration', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            循环模式
          </label>
          <select
            value={loopMode}
            onChange={(e) => handleParameterChange('loopMode', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="once">播放一次</option>
            <option value="infinite">无限循环</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            播放方向
          </label>
          <select
            value={direction}
            onChange={(e) => handleParameterChange('direction', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="forward">正向播放</option>
            <option value="reverse">反向播放</option>
            <option value="pingpong">乒乓模式</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            缩放比例: {scale * 100}%
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => handleParameterChange('scale', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
