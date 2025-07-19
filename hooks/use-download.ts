"use client";

import { useState } from "react";
import { downloadVideoAction } from "@/actions/download-video";

export interface DownloadProgress {
  percentage: number;
  downloadedBytes: number;
  totalBytes: number;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
}

interface UseDownloadReturn {
  downloading: boolean;
  progress: DownloadProgress | null;
  error: string | null;
  downloadFile: (params: {
    url: string;
    itag?: number;
    quality?: string;
    format: "video" | "audio";
    filename?: string;
  }) => Promise<void>;
  cancelDownload: () => void;
  clearError: () => void;
}

export function useDownload(): UseDownloadReturn {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const downloadFile = async (params: {
    url: string;
    itag?: number;
    quality?: string;
    format: "video" | "audio";
    filename?: string;
  }) => {
    try {
      setDownloading(true);
      setError(null);
      setProgress(null);

      // Create abort controller for cancellation
      const controller = new AbortController();
      setAbortController(controller);

      // First validate and prepare the download
      const prepareResult = await downloadVideoAction({
        url: params.url,
        itag: params.itag,
        quality: params.quality,
        format: params.format,
        filename: params.filename,
      });

      if (!prepareResult.success) {
        setError(prepareResult.error || "Failed to prepare download");
        return;
      }

      // Initialize progress
      setProgress({
        percentage: 0,
        downloadedBytes: 0,
        totalBytes: prepareResult.size || 0,
        speed: 0,
        timeRemaining: 0,
      });

      // Make request to download API
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Download failed: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received");
      }

      // Get content length for progress tracking
      const contentLength = response.headers.get("content-length");
      const totalBytes = contentLength ? parseInt(contentLength) : prepareResult.size || 0;

      // Create readable stream and track progress
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let downloadedBytes = 0;
      let startTime = Date.now();
      let lastProgressUpdate = startTime;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
        downloadedBytes += value.length;

        // Update progress every 100ms to avoid too frequent updates
        const now = Date.now();
        if (now - lastProgressUpdate >= 100) {
          const elapsedTime = (now - startTime) / 1000; // seconds
          const speed = downloadedBytes / elapsedTime; // bytes per second
          const percentage = totalBytes > 0 ? (downloadedBytes / totalBytes) * 100 : 0;
          const remainingBytes = totalBytes - downloadedBytes;
          const timeRemaining = speed > 0 ? remainingBytes / speed : 0;

          setProgress({
            percentage: Math.min(percentage, 100),
            downloadedBytes,
            totalBytes,
            speed,
            timeRemaining,
          });

          lastProgressUpdate = now;
        }
      }

      // Combine all chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combinedArray = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combinedArray.set(chunk, offset);
        offset += chunk.length;
      }

      // Create download blob and trigger download
      const blob = new Blob([combinedArray], {
        type: params.format === "audio" ? "audio/mp4" : "video/mp4",
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = prepareResult.filename || `download.${params.format === "audio" ? "mp3" : "mp4"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      // Final progress update
      setProgress({
        percentage: 100,
        downloadedBytes: totalBytes,
        totalBytes,
        speed: 0,
        timeRemaining: 0,
      });

    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Download was cancelled");
      } else {
        setError(err.message || "Download failed");
      }
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
      setAbortController(null);
      // Clear progress after a delay
      setTimeout(() => {
        setProgress(null);
      }, 3000);
    }
  };

  const cancelDownload = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setDownloading(false);
    setProgress(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    downloading,
    progress,
    error,
    downloadFile,
    cancelDownload,
    clearError,
  };
}