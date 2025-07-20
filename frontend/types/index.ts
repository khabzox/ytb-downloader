export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  uploadDate: string;
  description: string;
  channel: {
    name: string;
    avatar: string;
    subscribers: string;
    verified: boolean;
    bio?: string;
    socialLinks?: {
      youtube?: string;
      twitter?: string;
      website?: string;
    };
  };
}

export interface DownloadOption {
  type: string;
  quality: string;
  size: string;
  icon: any;
  recommended: boolean;
  itag?: number;
  format: "video" | "audio";
  hasVideo?: boolean;
  hasAudio?: boolean;
  contentLength?: string | number;
}

export interface DownloadProgress {
  percentage: number;
  downloadedBytes: number;
  totalBytes: number;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
}

export interface DownloadRequest {
  url: string;
  itag?: number;
  quality?: string;
  format: "video" | "audio";
  filename?: string;
}

export interface DownloadResponse {
  success: boolean;
  filename?: string;
  size?: number;
  error?: string;
}

export interface VideoInfoResponse {
  success: boolean;
  data?: {
    videoInfo: any;
    downloadOptions: DownloadOption[];
  };
  error?: string;
}

export interface ValidationResponse {
  success: boolean;
  title?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

// YouTube API related types
export interface YouTubeFormat {
  itag: number;
  quality: string;
  qualityLabel?: string;
  container: string;
  hasVideo: boolean;
  hasAudio: boolean;
  contentLength?: string;
}

export interface YouTubeVideoDetails {
  videoId: string;
  title: string;
  lengthSeconds: string;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
    subscribers?: string;
  };
  description: string;
  thumbnail: string;
  uploadDate: string;
  views: string;
  likes?: string;
}

export interface YouTubeVideoInfo {
  videoDetails: YouTubeVideoDetails;
  formats: YouTubeFormat[];
}

// Hook return types
export interface UseVideoInfoReturn {
  videoInfo: VideoInfo | null;
  downloadOptions: DownloadOption[];
  loading: boolean;
  error: string | null;
  validateUrl: (url: string) => Promise<ValidationResponse>;
  fetchVideoInfo: (url: string) => Promise<void>;
  clearData: () => void;
}

export interface UseDownloadReturn {
  downloading: boolean;
  progress: DownloadProgress | null;
  error: string | null;
  downloadFile: (params: DownloadRequest) => Promise<void>;
  cancelDownload: () => void;
  clearError: () => void;
}
