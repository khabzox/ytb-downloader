"use client";

import { useState, useEffect } from "react";
import { getVideoInfoAction, validateVideoUrlAction } from "@/actions/get-video-info";

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
}

interface UseVideoInfoReturn {
  videoInfo: VideoInfo | null;
  downloadOptions: DownloadOption[];
  loading: boolean;
  error: string | null;
  validateUrl: (url: string) => Promise<{ success: boolean; error?: string }>;
  fetchVideoInfo: (url: string) => Promise<void>;
  clearData: () => void;
}

export function useVideoInfo(): UseVideoInfoReturn {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [downloadOptions, setDownloadOptions] = useState<DownloadOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = async (url: string) => {
    try {
      setError(null);
      const result = await validateVideoUrlAction(url);
      if (!result.success) {
        setError(result.error || "Invalid URL");
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to validate URL";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const fetchVideoInfo = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      setVideoInfo(null);
      setDownloadOptions([]);

      const result = await getVideoInfoAction(url);
      
      if (!result.success) {
        setError(result.error || "Failed to fetch video information");
        return;
      }

      if (result.data) {
        // Transform the API response to match our VideoInfo interface
        const { videoInfo: rawVideoInfo, downloadOptions: rawDownloadOptions } = result.data;
        
        // Fallback thumbnail logic: try maxresdefault, then hqdefault
        let thumbnail = rawVideoInfo.thumbnail;
        if (!thumbnail && rawVideoInfo.videoId) {
          thumbnail = `https://img.youtube.com/vi/${rawVideoInfo.videoId}/maxresdefault.jpg`;
        }

        // If maxresdefault.jpg fails, fallback to hqdefault.jpg (handled in component or by browser)
        // Optionally, you can check for 404 with a fetch, but that's not SSR-friendly. So provide both as srcSet.

        const transformedVideoInfo: VideoInfo = {
          id: rawVideoInfo.videoId || "",
          title: rawVideoInfo.title || "Unknown Title",
          thumbnail: thumbnail || `https://img.youtube.com/vi/${rawVideoInfo.videoId}/hqdefault.jpg`,
          duration: formatDuration(rawVideoInfo.duration),
          views: formatNumber(rawVideoInfo.views),
          likes: formatNumber(rawVideoInfo.likes),
          uploadDate: formatDate(rawVideoInfo.uploadDate),
          description: rawVideoInfo.description || "",
          channel: {
            name: rawVideoInfo.channel?.name || "Unknown Channel",
            avatar: rawVideoInfo.channel?.avatar || "",
            subscribers: formatNumber(rawVideoInfo.channel?.subscribers),
            verified: rawVideoInfo.channel?.verified || false,
            bio: rawVideoInfo.channel?.bio,
            socialLinks: rawVideoInfo.channel?.socialLinks,
          },
        };

        const transformedDownloadOptions: DownloadOption[] = rawDownloadOptions.map((option: any) => ({
          type: option.hasAudio && option.hasVideo ? "MP4" : option.hasAudio ? "MP3" : "MP4",
          quality: option.quality || "Unknown",
          size: formatFileSize(option.contentLength),
          icon: option.hasAudio && !option.hasVideo ? "Music" : "FileVideo", // We'll handle icon import in component
          recommended: option.recommended || false,
          itag: option.itag,
          format: option.hasAudio && !option.hasVideo ? "audio" : "video",
        }));

        setVideoInfo(transformedVideoInfo);
        setDownloadOptions(transformedDownloadOptions);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setVideoInfo(null);
    setDownloadOptions([]);
    setError(null);
    setLoading(false);
  };

  return {
    videoInfo,
    downloadOptions,
    loading,
    error,
    validateUrl,
    fetchVideoInfo,
    clearData,
  };
}

// Helper functions
function formatDuration(seconds: string | number): string {
  if (!seconds) return "0:00";
  const num = typeof seconds === "string" ? parseInt(seconds) : seconds;
  const hours = Math.floor(num / 3600);
  const minutes = Math.floor((num % 3600) / 60);
  const secs = num % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatNumber(num: string | number): string {
  if (!num) return "0";
  const number = typeof num === "string" ? parseInt(num) : num;
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }
  return number.toString();
}

function formatFileSize(bytes: string | number): string {
  if (!bytes) return "Unknown";
  const number = typeof bytes === "string" ? parseInt(bytes) : bytes;
  if (number >= 1024 * 1024 * 1024) {
    return (number / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  }
  if (number >= 1024 * 1024) {
    return (number / (1024 * 1024)).toFixed(1) + " MB";
  }
  if (number >= 1024) {
    return (number / 1024).toFixed(1) + " KB";
  }
  return number + " B";
}

function formatDate(dateString: string): string {
  if (!dateString) return "Unknown";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  } catch {
    return "Unknown";
  }
}