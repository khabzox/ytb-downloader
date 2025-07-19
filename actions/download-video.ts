"use server";

import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { extractYouTubeVideoId, validateYouTubeUrl } from "@/lib/validators";
import { getDownloadUrl } from "@/lib/youtube-api";
import { Readable } from "stream";

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

/**
 * Server action to initiate video download
 */
export async function downloadVideoAction(request: DownloadRequest): Promise<DownloadResponse> {
  try {
    // Validate URL
    const validation = validateYouTubeUrl(request.url);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || "Invalid YouTube URL",
      };
    }

    const videoId = extractYouTubeVideoId(request.url);
    if (!videoId) {
      return {
        success: false,
        error: "Could not extract video ID",
      };
    }

    // Validate video availability
    const isValid = await ytdl.validateURL(request.url);
    if (!isValid) {
      return {
        success: false,
        error: "Video is not available or accessible",
      };
    }

    // Get video info for filename generation
    const info = await ytdl.getInfo(videoId);
    const videoDetails = info.videoDetails;

    // Generate filename
    const sanitizedTitle =
      videoDetails.title
        ?.replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .substring(0, 100) || "video"; // Limit length

    const extension = request.format === "audio" ? "mp4" : "mp4"; // ytdl-core typically gives mp4
    const filename = request.filename || `${sanitizedTitle}_${videoId}.${extension}`;

    // Return download initiation success
    // The actual download will be handled by a separate API route
    return {
      success: true,
      filename,
      size: parseInt(videoDetails.lengthSeconds || "0") * 1000, // Approximate size
    };
  } catch (error: any) {
    console.error("Download action error:", error);

    if (error.statusCode === 410) {
      return { success: false, error: "Video is no longer available" };
    }

    if (error.statusCode === 403) {
      return { success: false, error: "Video is private or restricted" };
    }

    return {
      success: false,
      error: error.message || "Failed to initiate download",
    };
  }
}

/**
 * Get direct download stream (for API routes)
 */
export async function getDownloadStream(
  url: string,
  options: {
    itag?: number;
    quality?: string;
    format: "video" | "audio";
  },
) {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error("Invalid video ID");
    }

    let downloadOptions: ytdl.downloadOptions = {};

    if (options.itag) {
      downloadOptions.quality = options.itag;
    } else if (options.format === "audio") {
      downloadOptions = {
        quality: "highestaudio",
        filter: "audioonly",
      };
    } else {
      downloadOptions = {
        quality: options.quality || "highest",
        filter: "audioandvideo",
      };
    }

    const stream = ytdl(url, downloadOptions);
    return stream;
  } catch (error) {
    throw error;
  }
}

/**
 * Helper function to get video metadata for download
 */
export async function getDownloadMetadata(url: string) {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error("Invalid video ID");
    }

    const info = await ytdl.getInfo(videoId);
    const videoDetails = info.videoDetails;

    return {
      title: videoDetails.title,
      duration: videoDetails.lengthSeconds,
      author: videoDetails.author?.name,
      videoId,
      formats: info.formats.map(format => ({
        itag: format.itag,
        quality: format.qualityLabel || format.quality,
        container: format.container,
        hasVideo: format.hasVideo,
        hasAudio: format.hasAudio,
        contentLength: format.contentLength,
      })),
    };
  } catch (error) {
    throw error;
  }
}
