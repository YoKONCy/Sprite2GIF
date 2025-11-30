import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { ImageUploaderProps } from '../types/gif';

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImagesLoaded, 
  maxImages = 1, 
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] 
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (acceptedFormats.includes(file.type)) {
        validFiles.push(file);
      }
    }
    
    // 仅允许一张雪碧图
    return validFiles.slice(0, 1);
  };

  const handleFiles = (files: File[]) => {
    const single = files.slice(0, 1);
    setImages(single);
    onImagesLoaded(single);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = validateFiles(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = validateFiles(e.target.files);
      handleFiles(files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesLoaded(newImages);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 drag-over' 
            : 'border-gray-300 hover:border-gray-400 hover:scale-[1.02]'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            拖拽或点击上传单张帧图集（雪碧图）
          </p>
          <p className="text-sm text-gray-500">
            支持 JPEG、PNG、GIF、WebP 格式，仅上传 1 张图片
          </p>
      </label>
      </div>

      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">已上传帧图集</h3>
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Frame ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="text-center text-xs text-gray-500 mt-1">
                  雪碧图
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
