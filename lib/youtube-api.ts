import ytdl from "ytdl-core";
import { extractYouTubeVideoId, isYouTubeShort } from "./validators";

// Types for our YouTube API responses
export interface YouTubeVideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  uploadDate: string;
  description: string;
  isShort: boolean;
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

export interface DownloadFormat {
  type: "MP4" | "WEBM" | "MP3" | "M4A";
  quality: string;
  size: string;
  itag?: number;
  url?: string;
  hasAudio: boolean;
  hasVideo: boolean;
  recommended?: boolean;
  bitrate?: number;
  fps?: number;
}

export interface YouTubeApiResponse {
  success: boolean;
  data?: {
    videoInfo: YouTubeVideoInfo;
    downloadOptions: DownloadFormat[];
  };
  error?: string;
}

// Helper functions
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatNumber(num: string | number): string {
  const number = typeof num === "string" ? parseInt(num, 10) : num;
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getBestThumbnail(thumbnails: any[]): string {
  // Try to get the highest quality thumbnail
  const preferredOrder = ["maxresdefault", "hqdefault", "mqdefault", "default"];

  for (const quality of preferredOrder) {
    const thumbnail = thumbnails.find(t => t.url.includes(quality));
    if (thumbnail) return thumbnail.url;
  }

  // Fallback to the first available thumbnail
  return thumbnails[0]?.url || "";
}

function getQualityLabel(format: any): string {
  if (format.qualityLabel) return format.qualityLabel;
  if (format.height) return `${format.height}p`;
  if (format.audioBitrate) return `${format.audioBitrate}kbps`;
  return "Unknown";
}

/**
 * Main function to get YouTube video information and download options
 */
export async function getYouTubeVideoData(url: string): Promise<YouTubeApiResponse> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return {
        success: false,
        error: "Invalid YouTube URL or could not extract video ID",
      };
    }

    // Check if video is available
    const isValid = await ytdl.validateURL(url);
    if (!isValid) {
      return {
        success: false,
        error: "Video is not available or accessible",
      };
    }

    // Get video info
    const info = await ytdl.getInfo(videoId);
    const videoDetails = info.videoDetails;
    const formats = info.formats;

    // Check if it's a short
    const isShort = isYouTubeShort(url);

    // Parse video information
    const videoInfo: YouTubeVideoInfo = {
      id: videoId,
      title: videoDetails.title || "Unknown Title",
      thumbnail: getBestThumbnail(videoDetails.thumbnails),
      duration: formatDuration(parseInt(videoDetails.lengthSeconds || "0", 10)),
      views: formatNumber(videoDetails.viewCount || "0"),
      likes: formatNumber(videoDetails.likes || "0"),
      uploadDate: videoDetails.uploadDate || new Date().toISOString().split("T")[0],
      description: videoDetails.description || "",
      isShort,
      channel: {
        name: videoDetails.author?.name || "Unknown Channel",
        avatar: videoDetails.author?.thumbnails?.[0]?.url || "",
        subscribers: formatNumber(videoDetails.author?.subscriber_count || "0"),
        verified: videoDetails.author?.verified || false,
        bio: (videoDetails.author as any)?.description || undefined,
        socialLinks: {
          youtube: videoDetails.author?.channel_url,
        },
      },
    };

    // Process download formats
    const downloadOptions: DownloadFormat[] = [];

    // Video formats (MP4)
    const videoFormats = formats.filter(
      format => format.hasVideo && format.container === "mp4" && format.qualityLabel,
    );

    // Sort by quality (highest first)
    videoFormats.sort((a, b) => {
      const heightA = parseInt(a.qualityLabel?.replace("p", "") || "0", 10);
      const heightB = parseInt(b.qualityLabel?.replace("p", "") || "0", 10);
      return heightB - heightA;
    });

    // Add unique video qualities
    const addedQualities = new Set<string>();
    videoFormats.forEach((format, index) => {
      const quality = getQualityLabel(format);
      if (!addedQualities.has(quality)) {
        addedQualities.add(quality);
        downloadOptions.push({
          type: "MP4",
          quality,
          size: format.contentLength
            ? formatFileSize(parseInt(format.contentLength, 10))
            : "Unknown",
          itag: format.itag,
          url: format.url,
          hasAudio: format.hasAudio || false,
          hasVideo: format.hasVideo || false,
          recommended: index === 0, // First (highest quality) is recommended
          fps: format.fps,
        });
      }
    });

    // Audio formats (MP3 equivalent - get audio-only formats)
    const audioFormats = formats.filter(format => format.hasAudio && !format.hasVideo);

    // Sort by bitrate (highest first)
    audioFormats.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

    // Add unique audio qualities
    const addedAudioQualities = new Set<string>();
    audioFormats.forEach(format => {
      const quality = `${format.audioBitrate}kbps`;
      if (!addedAudioQualities.has(quality) && format.audioBitrate) {
        addedAudioQualities.add(quality);
        // Determine the best format type based on container
        let formatType: "MP3" | "WEBM" | "M4A" | "MP4" = "M4A";
        if (format.container === "webm") formatType = "WEBM";
        else if (format.container === "mp4") formatType = "MP4";

        downloadOptions.push({
          type: formatType,
          quality,
          size: format.contentLength
            ? formatFileSize(parseInt(format.contentLength, 10))
            : "Unknown",
          itag: format.itag,
          url: format.url,
          hasAudio: true,
          hasVideo: false,
          bitrate: format.audioBitrate,
        });
      }
    });

    // Add some common audio qualities if not present
    if (
      !downloadOptions.some(opt => opt.type === "M4A" || opt.type === "MP4" || opt.type === "WEBM")
    ) {
      const bestAudio = audioFormats[0];
      if (bestAudio) {
        let formatType: "MP3" | "WEBM" | "M4A" | "MP4" = "M4A";
        if (bestAudio.container === "webm") formatType = "WEBM";
        else if (bestAudio.container === "mp4") formatType = "MP4";

        downloadOptions.push({
          type: formatType,
          quality: "Best Available",
          size: bestAudio.contentLength
            ? formatFileSize(parseInt(bestAudio.contentLength, 10))
            : "Unknown",
          itag: bestAudio.itag,
          url: bestAudio.url,
          hasAudio: true,
          hasVideo: false,
          bitrate: bestAudio.audioBitrate,
        });
      }
    }

    return {
      success: true,
      data: {
        videoInfo,
        downloadOptions,
      },
    };
  } catch (error: any) {
    console.error("YouTube API Error:", error);

    // Handle specific error types
    if (error.statusCode === 410) {
      return {
        success: false,
        error: "Video is no longer available",
      };
    }

    if (error.statusCode === 403) {
      return {
        success: false,
        error: "Video is private or restricted",
      };
    }

    if (error.message?.includes("Video unavailable")) {
      return {
        success: false,
        error: "Video is unavailable in your region or has been removed",
      };
    }

    return {
      success: false,
      error: error.message || "Failed to fetch video information",
    };
  }
}

/**
 * Get video basic info quickly (for URL validation)
 */
export async function getVideoBasicInfo(
  url: string,
): Promise<{ success: boolean; title?: string; error?: string }> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return { success: false, error: "Invalid YouTube URL" };
    }

    const isValid = await ytdl.validateURL(url);
    if (!isValid) {
      return { success: false, error: "Video is not accessible" };
    }

    const basicInfo = await ytdl.getBasicInfo(videoId);
    return {
      success: true,
      title: basicInfo.videoDetails.title,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to validate video",
    };
  }
}

/**
 * Get download URL for a specific format
 */
export async function getDownloadUrl(
  videoId: string,
  itag: number,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const info = await ytdl.getInfo(videoId);
    const format = info.formats.find(f => f.itag === itag);

    if (!format) {
      return {
        success: false,
        error: "Format not found",
      };
    }

    return {
      success: true,
      url: format.url,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get download URL",
    };
  }
}

/**
 * Check if video supports specific quality
 */
export async function checkVideoQuality(url: string, quality: string): Promise<boolean> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return false;

    const info = await ytdl.getInfo(videoId);
    return info.formats.some(
      format => format.qualityLabel === quality || format.quality === quality,
    );
  } catch {
    return false;
  }
}

/**
 * Get available qualities for a video
 */
export async function getAvailableQualities(url: string): Promise<string[]> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return [];

    const info = await ytdl.getInfo(videoId);
    const qualities = new Set<string>();

    info.formats.forEach(format => {
      if (format.qualityLabel) {
        qualities.add(format.qualityLabel);
      }
    });

    return Array.from(qualities).sort((a, b) => {
      const heightA = parseInt(a.replace("p", ""), 10);
      const heightB = parseInt(b.replace("p", ""), 10);
      return heightB - heightA;
    });
  } catch {
    return [];
  }
}

/**
 * Utility function to create a readable stream for downloading
 */
export function createVideoStream(url: string, options?: ytdl.downloadOptions) {
  return ytdl(url, {
    quality: "highest",
    filter: "audioandvideo",
    ...options,
  });
}

/**
 * Utility function to create an audio-only stream
 */
export function createAudioStream(url: string, options?: ytdl.downloadOptions) {
  return ytdl(url, {
    quality: "highestaudio",
    filter: "audioonly",
    ...options,
  });
}
