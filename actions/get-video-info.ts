"use server";

import { getYouTubeVideoData, getVideoBasicInfo, checkYtdlHealth } from "@/lib/youtube-api";
import { validateYouTubeUrl } from "@/lib/validators";

export interface VideoInfoResponse {
  success: boolean;
  data?: {
    videoInfo: any;
    downloadOptions: any[];
  };
  error?: string;
  errorType?: 'YTDL_FUNCTIONS' | 'UNAVAILABLE' | 'RESTRICTED' | 'NETWORK' | 'UNKNOWN';
  suggestion?: string;
  isLimitedInfo?: boolean;
}

/**
 * Enhanced server action with comprehensive error handling
 */
export async function getVideoInfoAction(url: string): Promise<VideoInfoResponse> {
  try {
    console.log("Processing video URL:", url);

    // First validate the URL format
    const validation = validateYouTubeUrl(url);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || "Invalid YouTube URL format",
        errorType: 'UNKNOWN'
      };
    }

    // Get video data using our enhanced YouTube API
    const result = await getYouTubeVideoData(url);
    console.log("Video data result:", result);

    if (!result.success) {
      // Enhanced error response with suggestions
      let suggestion = "Please try again later.";
      
      switch (result.errorType) {
        case 'YTDL_FUNCTIONS':
          suggestion = "YouTube has updated their system. We're working on a fix. Try again in a few hours or check for app updates.";
          break;
        case 'UNAVAILABLE':
          suggestion = "This video may be deleted or set to private. Try a different video.";
          break;
        case 'RESTRICTED':
          suggestion = "Try accessing the video directly on YouTube first, or try a different video.";
          break;
        case 'NETWORK':
          suggestion = "Check your internet connection and try again.";
          break;
        default:
          suggestion = "This may be due to temporary YouTube issues. Try again in a few minutes.";
      }

      return {
        success: false,
        error: result.error || "Failed to fetch video information",
        errorType: result.errorType,
        suggestion
      };
    }

    // Check if this was a fallback response (limited info due to YouTube updates)
    const isLimitedInfo = result.error?.includes("Limited information available");

    return {
      success: true,
      data: result.data,
      isLimitedInfo,
      ...(isLimitedInfo && {
        suggestion: "Full video details are temporarily unavailable due to YouTube updates. Basic functionality may be limited."
      })
    };

  } catch (error: any) {
    console.error("Server action error:", error);
    
    // Try to provide helpful error information
    let errorType: VideoInfoResponse['errorType'] = 'UNKNOWN';
    let suggestion = "An unexpected error occurred. Please try again.";
    
    if (error.message?.includes('timeout')) {
      errorType = 'NETWORK';
      suggestion = "The request timed out. Please check your connection and try again.";
    } else if (error.message?.includes('could not extract functions')) {
      errorType = 'YTDL_FUNCTIONS';
      suggestion = "YouTube has updated their system. We're working on a fix.";
    }

    return {
      success: false,
      error: "An unexpected error occurred while fetching video information",
      errorType,
      suggestion
    };
  }
}

/**
 * Enhanced validation action with better error handling
 */
export async function validateVideoUrlAction(url: string): Promise<{
  success: boolean;
  title?: string;
  error?: string;
  errorType?: VideoInfoResponse['errorType'];
  suggestion?: string;
}> {
  try {
    console.log("Validating video URL:", url);

    // First validate URL format
    const validation = validateYouTubeUrl(url);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || "Invalid YouTube URL format",
        errorType: 'UNKNOWN',
        suggestion: "Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
      };
    }

    // Quick validation with basic info
    const result = await getVideoBasicInfo(url);
    console.log("Basic video info result:", result);
    if (!result.success) {
      let suggestion = "Please try again later.";
      
      switch (result.errorType) {
        case 'YTDL_FUNCTIONS':
          suggestion = "YouTube has updated their system. The app may need an update to work properly.";
          break;
        case 'UNAVAILABLE':
          suggestion = "This video appears to be unavailable. Try a different video.";
          break;
        case 'RESTRICTED':
          suggestion = "This video may be private or restricted in your region.";
          break;
        case 'NETWORK':
          suggestion = "Check your internet connection and try again.";
          break;
      }

      return {
        success: false,
        error: result.error || "Failed to validate video URL",
        errorType: result.errorType,
        suggestion
      };
    }

    return {
      success: true,
      title: result.title
    };

  } catch (error: any) {
    console.error("Validation error:", error);
    
    return {
      success: false,
      error: "Failed to validate video URL",
      errorType: 'UNKNOWN',
      suggestion: "An unexpected error occurred. Please try again with a different video."
    };
  }
}

/**
 * Health check action to test if the YouTube service is working
 */
export async function checkServiceHealthAction(): Promise<{
  isHealthy: boolean;
  error?: string;
  suggestion?: string;
  timestamp: string;
}> {
  try {
    const healthCheck = await checkYtdlHealth();
    
    return {
      isHealthy: healthCheck.isWorking,
      error: healthCheck.error,
      suggestion: healthCheck.suggestion,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error("Health check error:", error);
    
    return {
      isHealthy: false,
      error: "Unable to perform health check",
      suggestion: "The service may be temporarily unavailable. Try again later.",
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Action to get user-friendly status message
 */
export async function getServiceStatusAction(): Promise<{
  status: 'operational' | 'degraded' | 'down';
  message: string;
  suggestion: string;
}> {
  try {
    const health = await checkServiceHealthAction();
    
    if (health.isHealthy) {
      return {
        status: 'operational',
        message: 'YouTube downloader is working normally',
        suggestion: 'You can proceed with downloading videos.'
      };
    } else {
      // Check if it's the common "functions" error
      if (health.error?.includes('extract functions') || health.error?.includes('YouTube updates')) {
        return {
          status: 'degraded',
          message: 'YouTube downloader is experiencing issues due to YouTube updates',
          suggestion: 'Some features may be limited. We\'re working on a fix. Try again later or check for app updates.'
        };
      } else {
        return {
          status: 'down',
          message: 'YouTube downloader is currently unavailable',
          suggestion: health.suggestion || 'Please try again later.'
        };
      }
    }
  } catch (error) {
    return {
      status: 'down',
      message: 'Unable to check service status',
      suggestion: 'There may be a temporary issue. Please try again later.'
    };
  }
}