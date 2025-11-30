import GIF from 'gif.js';
import GIFWorker from 'gif.js/dist/gif.worker.js?url';

export const generateGIF = async (
  images: string[],
  duration: number,
  width: number,
  height: number,
  quality: number = 10
): Promise<Blob> => {
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  };

  const gif = new GIF({
    workers: 2,
    quality: quality,
    width: Math.round(width),
    height: Math.round(height),
    workerScript: GIFWorker as unknown as string
  });

  for (const src of images) {
    const img = await loadImage(src);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    ctx?.drawImage(img, 0, 0, Math.round(width), Math.round(height));
    gif.addFrame(canvas, { delay: Math.round(duration * 1000) });
  }

  return new Promise((resolve, reject) => {
    gif.on('finished', (blob: Blob) => resolve(blob));
    gif.on('error', (error: Error) => reject(error));
    gif.render();
  });
};

export const createImageGrid = async (
  images: File[],
  rows: number,
  cols: number
): Promise<string[]> => {
  const frames: string[] = [];
  
  for (let i = 0; i < images.length; i++) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    const img = new Image();
    img.src = URL.createObjectURL(images[i]);
    
    await new Promise<void>((resolve) => {
      img.onload = () => {
        const cellWidth = img.width;
        const cellHeight = img.height;
        const canvasWidth = cellWidth * cols;
        const canvasHeight = cellHeight * rows;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // 清除画布
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // 在网格中绘制当前图片
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = col * cellWidth;
        const y = row * cellHeight;
        
        ctx.drawImage(img, x, y, cellWidth, cellHeight);
        
        // 如果还有空间，重复图片以填满网格
        if (images.length < rows * cols) {
          const repeatCount = Math.ceil((rows * cols) / images.length);
          for (let j = 1; j < repeatCount; j++) {
            const repeatIndex = (i + j * images.length) % (rows * cols);
            const repeatRow = Math.floor(repeatIndex / cols);
            const repeatCol = repeatIndex % cols;
            const repeatX = repeatCol * cellWidth;
            const repeatY = repeatRow * cellHeight;
            
            ctx.drawImage(img, repeatX, repeatY, cellWidth, cellHeight);
          }
        }
        
        frames.push(canvas.toDataURL('image/png'));
        resolve();
      };
    });
  }
  
  return frames;
};

export const sliceSpritesheet = async (
  image: File,
  rows: number,
  cols: number
): Promise<string[]> => {
  const frames: string[] = [];
  const img = new Image();
  img.src = URL.createObjectURL(image);

  await new Promise<void>((resolve) => {
    img.onload = () => {
      const frameW = Math.floor(img.width / cols);
      const frameH = Math.floor(img.height / rows);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const sx = c * frameW;
          const sy = r * frameH;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = frameW;
          canvas.height = frameH;
          if (!ctx) continue;
          ctx.clearRect(0, 0, frameW, frameH);
          ctx.drawImage(img, sx, sy, frameW, frameH, 0, 0, frameW, frameH);
          frames.push(canvas.toDataURL('image/png'));
        }
      }
      resolve();
    };
  });

  return frames;
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
