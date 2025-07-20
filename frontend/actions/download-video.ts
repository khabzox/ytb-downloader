"use server";

import { NextRequest, NextResponse } from "next/server";
import ytdl from "ytdl-core";
import ytdlDistube from "@distube/ytdl-core";
import { extractYouTubeVideoId, validateYouTubeUrl } from "@/lib/validators";
import { getYouTubeVideoData, getDownloadUrl, YouTubeApiOptions, createVideoStreamWithFallback } from "@/lib/youtube-api";
import { Readable } from "stream";
import { spawn } from "child_process";
import { PassThrough } from "stream";

// Enhanced interfaces
export interface DownloadRequest {
  url: string;
  itag?: number;
  quality?: string;
  format: "video" | "audio";
  filename?: string;
  // Enhanced options
  preferredCodec?: string;
  maxFileSize?: number; // in MB
  customOptions?: YouTubeApiOptions;
}

export interface DownloadResponse {
  success: boolean;
  filename?: string;
  size?: number;
  estimatedSize?: string;
  duration?: string;
  quality?: string;
  format?: string;
  error?: string;
  errorType?: "UNAVAILABLE" | "RESTRICTED" | "NETWORK" | "FORMAT_NOT_FOUND" | "UNKNOWN";
  metadata?: {
    videoId: string;
    title: string;
    author: string;
    processingTime: number;
  };
}

export interface StreamOptions {
  itag?: number;
  quality?: string;
  format: "video" | "audio";
  range?: string;
  preferredCodec?: string;
}

/**
 * Enhanced server action to initiate video download with better error handling
 */
export async function downloadVideoAction(request: DownloadRequest): Promise<DownloadResponse> {
  const startTime = Date.now();

  try {
    // Validate URL
    const validation = validateYouTubeUrl(request.url);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || "Invalid YouTube URL",
        errorType: "UNKNOWN",
      };
    }

    const videoId = extractYouTubeVideoId(request.url);
    if (!videoId) {
      return {
        success: false,
        error: "Could not extract video ID",
        errorType: "UNKNOWN",
      };
    }

    // Use enhanced API to get video data
    const apiResponse = await getYouTubeVideoData(request.url, request.customOptions);

    if (!apiResponse.success || !apiResponse.data) {
      return {
        success: false,
        error: apiResponse.error || "Failed to fetch video information",
        // errorType: apiResponse.errorType || "UNKNOWN",
      };
    }

    const { videoInfo, downloadOptions } = apiResponse.data;

    // Find the best format match
    let selectedFormat;
    if (request.itag) {
      selectedFormat = downloadOptions.find(f => f.itag === request.itag);
    } else {
      // Filter by format type
      const formatsByType = downloadOptions.filter(f =>
        request.format === "audio" ? f.hasAudio && !f.hasVideo : f.hasVideo,
      );

      if (request.quality) {
        selectedFormat = formatsByType.find(f =>
          f.quality.toLowerCase().includes(request.quality!.toLowerCase()),
        );
      }

      // Fallback to recommended or first format
      if (!selectedFormat) {
        selectedFormat = formatsByType.find(f => f.recommended) || formatsByType[0];
      }
    }

    if (!selectedFormat) {
      return {
        success: false,
        error: `No suitable ${request.format} format found`,
        errorType: "FORMAT_NOT_FOUND",
      };
    }

    // Generate enhanced filename
    const sanitizedTitle = sanitizeFilename(videoInfo.title);
    const extension = getFileExtension(selectedFormat.type, request.format);
    const qualityTag = selectedFormat.quality ? `_${selectedFormat.quality}` : "";
    const filename = request.filename || `${sanitizedTitle}${qualityTag}_${videoId}.${extension}`;

    // Estimate file size if not available
    let estimatedSizeBytes = 0;
    if (selectedFormat.size && selectedFormat.size !== "Unknown") {
      estimatedSizeBytes = parseSizeString(selectedFormat.size);
    } else {
      // Rough estimation based on duration and quality
      const durationSeconds = parseDuration(videoInfo.duration);
      estimatedSizeBytes = estimateFileSize(
        durationSeconds,
        selectedFormat.quality,
        request.format,
      );
    }

    // Check file size limit if specified
    if (request.maxFileSize && estimatedSizeBytes > request.maxFileSize * 1024 * 1024) {
      return {
        success: false,
        error: `File size (${formatFileSize(estimatedSizeBytes)}) exceeds limit of ${request.maxFileSize}MB`,
        errorType: "UNKNOWN",
      };
    }

    return {
      success: true,
      filename,
      size: estimatedSizeBytes,
      estimatedSize: selectedFormat.size,
      duration: videoInfo.duration,
      quality: selectedFormat.quality,
      format: selectedFormat.type,
      metadata: {
        videoId,
        title: videoInfo.title,
        author: videoInfo.channel.name,
        processingTime: Date.now() - startTime,
      },
    };
  } catch (error: any) {
    console.error("Download action error:", error);

    let errorType: DownloadResponse["errorType"] = "UNKNOWN";
    let errorMessage = "Failed to initiate download";

    if (error.statusCode === 410 || error.message?.includes("unavailable")) {
      errorMessage = "Video is no longer available";
      errorType = "UNAVAILABLE";
    } else if (error.statusCode === 403 || error.message?.includes("restricted")) {
      errorMessage = "Video is private or restricted";
      errorType = "RESTRICTED";
    } else if (error.message?.includes("network") || error.message?.includes("timeout")) {
      errorMessage = "Network error occurred";
      errorType = "NETWORK";
    }

    return {
      success: false,
      error: errorMessage,
      errorType,
      metadata: {
        videoId: extractYouTubeVideoId(request.url) || "unknown",
        title: "Unknown",
        author: "Unknown",
        processingTime: Date.now() - startTime,
      },
    };
  }
}

/**
 * Enhanced download stream with better error handling and options
 */
export async function getDownloadStream(url: string, options: StreamOptions) {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) throw new Error("Invalid video ID");

  let downloadOptions: ytdl.downloadOptions = {
    requestOptions: {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    },
  };

  if (options.range) {
    downloadOptions.range = { start: 0, end: parseInt(options.range) };
  }
  if (options.itag) {
    downloadOptions.quality = options.itag;
  } else if (options.format === "audio") {
    downloadOptions = {
      ...downloadOptions,
      quality: "highestaudio",
      filter: "audioonly",
    };
  } else {
    downloadOptions = {
      ...downloadOptions,
      quality: options.quality || "highest",
      filter: "audioandvideo",
    };
  }
  if (options.preferredCodec) {
    downloadOptions.filter = (format: any) => {
      const hasCodec = format.codecs?.includes(options.preferredCodec);
      const matchesType = options.format === "audio" ? !format.hasVideo : format.hasVideo;
      return hasCodec && matchesType;
    };
  }

  // Try ytdl-core
  try {
    const stream = ytdl(url, downloadOptions);
    let errored = false;
    let gotData = false;
    stream.on("error", err => { errored = true; });
    stream.once("data", () => { gotData = true; });
    await new Promise((resolve, reject) => {
      stream.once("data", () => errored ? reject() : resolve(undefined));
      stream.once("error", reject);
      setTimeout(() => {
        if (!gotData) reject(new Error("No data from ytdl-core (timeout)"));
      }, 5000);
    });
    return stream;
  } catch (err) {
    console.error("ytdl-core failed:", err);
  }

  // Try @distube/ytdl-core
  try {
    const { format, ...distubeOptions } = downloadOptions;
    const stream = ytdlDistube(url, { ...distubeOptions, quality: downloadOptions.quality as any, filter: downloadOptions.filter as any });
    let errored = false;
    let gotData = false;
    stream.on("error", err => { errored = true; });
    stream.once("data", () => { gotData = true; });
    await new Promise((resolve, reject) => {
      stream.once("data", () => errored ? reject() : resolve(undefined));
      stream.once("error", reject);
      setTimeout(() => {
        if (!gotData) reject(new Error("No data from distube (timeout)"));
      }, 5000);
    });
    return stream;
  } catch (err) {
    console.error("distube failed:", err);
  }

  // Fallback: yt-dlp subprocess
  return await new Promise((resolve, reject) => {
    const ytDlpArgs = [
      "-f", "best",
      "-o", "-",
      url
    ];
    const ytDlpProc = spawn(YTDLP_PATH, ytDlpArgs, { stdio: ["ignore", "pipe", "pipe"] });
    let gotData = false;
    let errorMsg = "";
    const pass = new PassThrough();
    ytDlpProc.stdout.on("data", chunk => {
      gotData = true;
      pass.write(chunk);
    });
    ytDlpProc.stdout.on("end", () => {
      pass.end();
      if (!gotData) reject(new Error("No data from yt-dlp" + (errorMsg ? ": " + errorMsg : "")));
    });
    ytDlpProc.stderr.on("data", data => {
      errorMsg += data.toString();
      console.error("yt-dlp error:", data.toString());
    });
    ytDlpProc.on("error", err => {
      reject(new Error("yt-dlp process error: " + err.message));
    });
    ytDlpProc.on("close", code => {
      if (!gotData) reject(new Error("yt-dlp exited with code " + code + (errorMsg ? ": " + errorMsg : "")));
    });
    // If we get data, resolve with the pass-through stream
    ytDlpProc.stdout.once("data", () => {
      gotData = true;
      resolve(pass);
    });
  });
}

/**
 * Enhanced metadata function with comprehensive information
 */
export async function getDownloadMetadata(url: string, options?: YouTubeApiOptions) {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error("Invalid video ID");
    }

    // Use enhanced API
    const apiResponse = await getYouTubeVideoData(url, {
      includeFormats: true,
      maxFormats: 20,
      ...options,
    });

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.error || "Failed to fetch video metadata");
    }

    const { videoInfo, downloadOptions } = apiResponse.data;

    return {
      // Basic info
      title: videoInfo.title,
      duration: videoInfo.duration,
      author: videoInfo.channel.name,
      videoId,
      thumbnail: videoInfo.thumbnail,
      views: videoInfo.views,
      likes: videoInfo.likes,
      uploadDate: videoInfo.uploadDate,

      // Enhanced info
      description: videoInfo.description,
      isShort: videoInfo.isShort,
      category: videoInfo.category,
      tags: videoInfo.tags,

      // Channel info
      channel: {
        name: videoInfo.channel.name,
        avatar: videoInfo.channel.avatar,
        subscribers: videoInfo.channel.subscribers,
        verified: videoInfo.channel.verified,
        bio: videoInfo.channel.bio,
      },

      // Download formats
      formats: downloadOptions.map(format => ({
        itag: format.itag,
        type: format.type,
        quality: format.quality,
        size: format.size,
        container: format.container,
        hasVideo: format.hasVideo,
        hasAudio: format.hasAudio,
        codec: format.codec,
        bitrate: format.bitrate,
        fps: format.fps,
        recommended: format.recommended,
        hdr: format.hdr,
      })),

      // API metadata
      processingTime: apiResponse.metadata?.processingTime,
      timestamp: apiResponse.metadata?.timestamp,
    };
  } catch (error: any) {
    console.error("Metadata error:", error);
    throw new Error(`Failed to get metadata: ${error.message}`);
  }
}

/**
 * Get direct download URL for a specific format
 */
export async function getDirectDownloadUrl(
  url: string,
  itag: number,
): Promise<{
  success: boolean;
  downloadUrl?: string;
  expiresAt?: Date;
  error?: string;
}> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return {
        success: false,
        error: "Invalid video ID",
      };
    }

    const result = await getDownloadUrl(videoId, itag);

    if (!result.success || !result.url) {
      return {
        success: false,
        error: result.error || "Failed to get download URL",
      };
    }

    // YouTube URLs typically expire after a few hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6);

    return {
      success: true,
      downloadUrl: result.url,
      expiresAt,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get download URL",
    };
  }
}

// Helper functions
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^\w\s.-]/g, "") // Remove special characters except dots and hyphens
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single
    .substring(0, 100) // Limit length
    .trim();
}

function getFileExtension(formatType: string, requestFormat: "video" | "audio"): string {
  if (requestFormat === "audio") {
    switch (formatType.toLowerCase()) {
      case "mp3":
        return "mp3";
      case "m4a":
        return "m4a";
      case "webm":
        return "webm";
      default:
        return "mp4"; // Default audio container
    }
  } else {
    switch (formatType.toLowerCase()) {
      case "webm":
        return "webm";
      case "mkv":
        return "mkv";
      default:
        return "mp4";
    }
  }
}

function parseSizeString(sizeStr: string): number {
  const match = sizeStr.match(/([\d.]+)\s*(B|KB|MB|GB)/i);
  if (!match) return 0;

  const [, size, unit] = match;
  const sizeNum = parseFloat(size);

  switch (unit.toUpperCase()) {
    case "GB":
      return sizeNum * 1024 * 1024 * 1024;
    case "MB":
      return sizeNum * 1024 * 1024;
    case "KB":
      return sizeNum * 1024;
    default:
      return sizeNum;
  }
}

function parseDuration(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

function estimateFileSize(
  durationSeconds: number,
  quality: string,
  format: "video" | "audio",
): number {
  // Rough estimation based on typical bitrates
  let bitrate = 1000; // kbps

  if (format === "audio") {
    if (quality.includes("320")) bitrate = 320;
    else if (quality.includes("128")) bitrate = 128;
    else bitrate = 160;
  } else {
    if (quality.includes("1080")) bitrate = 5000;
    else if (quality.includes("720")) bitrate = 2500;
    else if (quality.includes("480")) bitrate = 1000;
    else bitrate = 1500;
  }

  return (durationSeconds * bitrate * 1000) / 8; // Convert to bytes
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Batch download metadata for multiple URLs
 */
export async function getBatchDownloadMetadata(urls: string[]): Promise<{
  success: boolean;
  results: Array<{
    url: string;
    metadata?: any;
    error?: string;
  }>;
  summary: {
    successful: number;
    failed: number;
    totalSize: string;
  };
}> {
  const results = await Promise.allSettled(
    urls.map(async url => ({
      url,
      metadata: await getDownloadMetadata(url),
    })),
  );

  let successful = 0;
  let failed = 0;
  let totalBytes = 0;

  const processedResults = results.map((result, index) => {
    if (result.status === "fulfilled") {
      successful++;
      // Try to calculate total size from formats
      const formats = result.value.metadata.formats || [];
      const largestFormat = formats.find((f: any) => f.recommended) || formats[0];
      if (largestFormat?.size) {
        totalBytes += parseSizeString(largestFormat.size);
      }
      return result.value;
    } else {
      failed++;
      return {
        url: urls[index],
        error: result.reason.message || "Failed to fetch metadata",
      };
    }
  });

  return {
    success: successful > 0,
    results: processedResults,
    summary: {
      successful,
      failed,
      totalSize: formatFileSize(totalBytes),
    },
  };
}

// Path to yt-dlp.exe (update if Python version or user changes)
const YTDLP_PATH = process.env.YTDLP_PATH ||
  "C:/Users/Abdelkabir/AppData/Roaming/Python/Python313/Scripts/yt-dlp.exe";
