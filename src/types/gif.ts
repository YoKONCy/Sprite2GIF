export interface GIFParameters {
  rows: number;
  cols: number;
  duration: number;
  loopMode: 'once' | 'infinite';
  direction: 'forward' | 'reverse' | 'pingpong';
  scale: number;
}

export interface AppState {
  images: File[];
  previewFrames: string[];
  gifParameters: GIFParameters;
  isGenerating: boolean;
  generatedGIF: Blob | null;
}

export interface ImageUploaderProps {
  onImagesLoaded: (images: File[]) => void;
  maxImages?: number;
  acceptedFormats?: string[];
}

export interface GIFPreviewProps {
  frames: string[];
  duration: number;
  loopMode: 'once' | 'infinite';
  direction: 'forward' | 'reverse' | 'pingpong';
  scale: number;
}

export interface ControlPanelProps {
  rows: number;
  cols: number;
  duration: number;
  loopMode: 'once' | 'infinite';
  direction: string;
  scale: number;
  onParameterChange: (params: GIFParameters) => void;
}
