import ytdl from "ytdl-core";
// Alternative import - try this if main ytdl-core fails
// import ytdl from "@distube/ytdl-core";
import { extractYouTubeVideoId, isYouTubeShort } from "./validators";

// Types (keeping your existing ones)
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
  errorType?: "YTDL_FUNCTIONS" | "UNAVAILABLE" | "RESTRICTED" | "NETWORK" | "UNKNOWN";
}

// Enhanced error handling class
class YouTubeError extends Error {
  constructor(
    message: string,
    public type: YouTubeApiResponse["errorType"] = "UNKNOWN",
    public statusCode?: number,
  ) {
    super(message);
    this.name = "YouTubeError";
  }
}

// Helper functions (keeping your existing ones)
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
  const preferredOrder = ["maxresdefault", "hqdefault", "mqdefault", "default"];
  for (const quality of preferredOrder) {
    const thumbnail = thumbnails.find(t => t.url.includes(quality));
    if (thumbnail) return thumbnail.url;
  }
  return thumbnails[0]?.url || "";
}

function getQualityLabel(format: any): string {
  if (format.qualityLabel) return format.qualityLabel;
  if (format.height) return `${format.height}p`;
  if (format.audioBitrate) return `${format.audioBitrate}kbps`;
  return "Unknown";
}

// User-friendly error messages
function getUserFriendlyError(error: any): {
  message: string;
  type: YouTubeApiResponse["errorType"];
} {
  const errorMessage = error.message?.toLowerCase() || "";

  if (errorMessage.includes("could not extract functions")) {
    return {
      message:
        "YouTube has updated their system. Please try again in a few minutes, or check back later for an app update.",
      type: "YTDL_FUNCTIONS",
    };
  }

  if (error.statusCode === 410 || errorMessage.includes("video unavailable")) {
    return {
      message: "This video is no longer available or has been removed.",
      type: "UNAVAILABLE",
    };
  }

  if (
    error.statusCode === 403 ||
    errorMessage.includes("private") ||
    errorMessage.includes("restricted")
  ) {
    return {
      message: "This video is private, restricted, or not available in your region.",
      type: "RESTRICTED",
    };
  }

  if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
    return {
      message: "Network error. Please check your connection and try again.",
      type: "NETWORK",
    };
  }

  return {
    message:
      "Unable to fetch video information. This may be due to YouTube updates or temporary issues.",
    type: "UNKNOWN",
  };
}

// Fallback method using basic video info
async function getFallbackVideoInfo(videoId: string): Promise<Partial<YouTubeVideoInfo>> {
  try {
    // Create basic video info from the video ID
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return {
      id: videoId,
      title: "Video information temporarily unavailable",
      thumbnail: thumbnailUrl,
      duration: "Unknown",
      views: "Unknown",
      likes: "Unknown",
      uploadDate: new Date().toISOString().split("T")[0],
      description: "Video details are temporarily unavailable due to YouTube updates.",
      isShort: false,
      channel: {
        name: "Unknown Channel",
        avatar: "",
        subscribers: "Unknown",
        verified: false,
      },
    };
  } catch {
    throw new YouTubeError("Unable to create fallback video info", "UNKNOWN");
  }
}

/**
 * Enhanced main function with better error handling
 */
export async function getYouTubeVideoData(url: string): Promise<YouTubeApiResponse> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return {
        success: false,
        error: "Invalid YouTube URL or could not extract video ID",
        errorType: "UNKNOWN",
      };
    }

    // First, try to validate the URL
    let isValid: boolean;
    try {
      isValid = await Promise.race([
        ytdl.validateURL(url),
        new Promise<boolean>((_, reject) =>
          setTimeout(() => reject(new Error("Validation timeout")), 10000),
        ),
      ]);
    } catch (validationError: any) {
      console.warn("URL validation failed, attempting to continue:", validationError.message);
      // Continue anyway, as validation might fail even if video exists
      isValid = true;
    }

    if (!isValid) {
      return {
        success: false,
        error: "Video is not available or accessible",
        errorType: "UNAVAILABLE",
      };
    }

    // Try to get video info with timeout
    let info: any;
    try {
      info = await Promise.race([
        ytdl.getInfo(videoId),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 30000)),
      ]);
    } catch (infoError: any) {
      console.error("Failed to get video info:", infoError);

      const { message, type } = getUserFriendlyError(infoError);

      // If it's the "could not extract functions" error, provide fallback
      if (type === "YTDL_FUNCTIONS") {
        try {
          const fallbackInfo = await getFallbackVideoInfo(videoId);
          return {
            success: true,
            data: {
              videoInfo: fallbackInfo as YouTubeVideoInfo,
              downloadOptions: [
                {
                  type: "MP4" as const,
                  quality: "Unavailable",
                  size: "Unknown",
                  hasAudio: true,
                  hasVideo: true,
                  recommended: true,
                },
              ],
            },
            error: "Limited information available due to YouTube updates",
          };
        } catch {
          // Complete fallback failed
        }
      }

      return {
        success: false,
        error: message,
        errorType: type,
      };
    }

    const videoDetails = info.videoDetails;
    const formats = info.formats || [];
    const isShort = isYouTubeShort(url);

    // Parse video information
    const videoInfo: YouTubeVideoInfo = {
      id: videoId,
      title: videoDetails.title || "Unknown Title",
      thumbnail: getBestThumbnail(videoDetails.thumbnails || []),
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

    // Process download formats with error handling
    const downloadOptions: DownloadFormat[] = [];

    try {
      // Video formats (MP4)
      const videoFormats = formats.filter(
        (format: any) => format.hasVideo && format.container === "mp4" && format.qualityLabel,
      );

      videoFormats.sort((a: any, b: any) => {
        const heightA = parseInt(a.qualityLabel?.replace("p", "") || "0", 10);
        const heightB = parseInt(b.qualityLabel?.replace("p", "") || "0", 10);
        return heightB - heightA;
      });

      const addedQualities = new Set<string>();
      videoFormats.forEach((format: any, index: number) => {
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
            recommended: index === 0,
            fps: format.fps,
          });
        }
      });

      // Audio formats
      const audioFormats = formats.filter((format: any) => format.hasAudio && !format.hasVideo);
      audioFormats.sort((a: any, b: any) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

      const addedAudioQualities = new Set<string>();
      audioFormats.forEach((format: any) => {
        const quality = `${format.audioBitrate}kbps`;
        if (!addedAudioQualities.has(quality) && format.audioBitrate) {
          addedAudioQualities.add(quality);
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

      // Fallback if no formats found
      if (downloadOptions.length === 0) {
        downloadOptions.push({
          type: "MP4",
          quality: "Format info unavailable",
          size: "Unknown",
          hasAudio: true,
          hasVideo: true,
          recommended: true,
        });
      }
    } catch (formatError) {
      console.error("Error processing formats:", formatError);
      // Add a basic fallback format
      downloadOptions.push({
        type: "MP4",
        quality: "Format info unavailable",
        size: "Unknown",
        hasAudio: true,
        hasVideo: true,
        recommended: true,
      });
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
    const { message, type } = getUserFriendlyError(error);

    return {
      success: false,
      error: message,
      errorType: type,
    };
  }
}

/**
 * Enhanced basic info function with timeout
 */
export async function getVideoBasicInfo(
  url: string,
): Promise<{
  success: boolean;
  title?: string;
  error?: string;
  errorType?: YouTubeApiResponse["errorType"];
}> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return {
        success: false,
        error: "Invalid YouTube URL",
        errorType: "UNKNOWN",
      };
    }

    // Try with timeout
    const basicInfo = await Promise.race([
      ytdl.getBasicInfo(videoId),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 15000)),
    ]);

    return {
      success: true,
      title: (basicInfo as any).videoDetails?.title || "Unknown Title",
    };
  } catch (error: any) {
    console.error("Basic info error:", error);
    const { message, type } = getUserFriendlyError(error);

    return {
      success: false,
      error: message,
      errorType: type,
    };
  }
}

/**
 * Health check function to test if ytdl-core is working
 */
export async function checkYtdlHealth(): Promise<{
  isWorking: boolean;
  error?: string;
  suggestion?: string;
}> {
  try {
    // Test with a known working video
    const testVideoId = "dQw4w9WgXcQ"; // Rick Roll - always available for testing
    const testUrl = `https://www.youtube.com/watch?v=${testVideoId}`;

    const result = await Promise.race([
      ytdl.validateURL(testUrl),
      new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error("Health check timeout")), 10000),
      ),
    ]);

    if (result) {
      return { isWorking: true };
    } else {
      return {
        isWorking: false,
        error: "YouTube validation failed",
        suggestion: "Try updating ytdl-core or switching to @distube/ytdl-core",
      };
    }
  } catch (error: any) {
    const { message, type } = getUserFriendlyError(error);

    let suggestion = "Try again later";
    if (type === "YTDL_FUNCTIONS") {
      suggestion = "Update ytdl-core: npm install ytdl-core@latest or try @distube/ytdl-core";
    }

    return {
      isWorking: false,
      error: message,
      suggestion,
    };
  }
}

// Keep your existing utility functions
export async function getDownloadUrl(
  videoId: string,
  itag: number,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const info = await ytdl.getInfo(videoId);
    const format = info.formats.find((f: any) => f.itag === itag);

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
    const { message } = getUserFriendlyError(error);
    return {
      success: false,
      error: message,
    };
  }
}

export function createVideoStream(url: string, options?: ytdl.downloadOptions) {
  return ytdl(url, {
    quality: "highest",
    filter: "audioandvideo",
    ...options,
  });
}

export function createAudioStream(url: string, options?: ytdl.downloadOptions) {
  return ytdl(url, {
    quality: "highestaudio",
    filter: "audioonly",
    ...options,
  });
}
