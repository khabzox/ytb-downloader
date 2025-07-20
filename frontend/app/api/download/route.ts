import { NextRequest, NextResponse } from "next/server";
import {
  getDownloadStream,
  getDownloadMetadata,
  getDirectDownloadUrl,
} from "@/actions/download-video";
import { validateYouTubeUrl } from "@/lib/validators";
import { checkYtdlHealth } from "@/lib/youtube-api";

// Types for the API
interface DownloadRequestBody {
  url: string;
  itag?: number;
  quality?: string;
  format?: "video" | "audio";
  filename?: string;
  preferredCodec?: string;
  directDownload?: boolean; // If true, return direct URL instead of streaming
}

interface DownloadQueryParams {
  url: string;
  itag?: string;
  quality?: string;
  format?: string;
  range?: string;
  preview?: string; // For getting metadata only
}

/**
 * POST: Stream download or get direct download URL
 */
export async function POST(request: NextRequest) {
  try {
    const body: DownloadRequestBody = await request.json();
    const { url, itag, quality, format = "video", filename, preferredCodec, directDownload } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    const validation = validateYouTubeUrl(url);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || "Invalid YouTube URL" },
        { status: 400 },
      );
    }

    // Health check before processing
    const healthCheck = await checkYtdlHealth();
    if (!healthCheck.isWorking) {
      return NextResponse.json(
        {
          error: healthCheck.error || "YouTube service temporarily unavailable",
          suggestion: healthCheck.suggestion,
          retryAfter: 300, // 5 minutes
        },
        { status: 503 },
      );
    }

    // If direct download URL is requested
    if (directDownload && itag) {
      const directUrl = await getDirectDownloadUrl(url, parseInt(itag.toString()));
      if (!directUrl.success) {
        return NextResponse.json({ error: directUrl.error }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        downloadUrl: directUrl.downloadUrl,
        expiresAt: directUrl.expiresAt,
      });
    }

    // Get metadata for filename and validation
    const metadata = await getDownloadMetadata(url);

    // Generate filename if not provided
    let downloadFilename = filename;
    if (!downloadFilename) {
      const sanitizedTitle =
        metadata.title
          ?.replace(/[^\w\s.-]/g, "")
          .replace(/\s+/g, "_")
          .substring(0, 100) || "video";

      const extension = format === "audio" ? "mp4" : "mp4";
      const qualityTag = quality ? `_${quality}` : "";
      downloadFilename = `${sanitizedTitle}${qualityTag}_${metadata.videoId}.${extension}`;
    }

    // Get download stream
    const stream: NodeJS.ReadableStream = await getDownloadStream(url, {
      itag: itag ? parseInt(itag.toString()) : undefined,
      quality,
      format,
      preferredCodec,
    });

    // Set response headers for file download
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${downloadFilename}"`);

    // Set appropriate content type
    const contentType = getContentType(format, preferredCodec);
    headers.set("Content-Type", contentType);

    // Add additional headers for better download experience
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "no-cache");
    headers.set(
      "X-Download-Info",
      JSON.stringify({
        title: toAscii(metadata.title),
        duration: toAscii(metadata.duration),
        quality: toAscii(quality || "default"),
        format: toAscii(format),
      }),
    );

    // Handle range requests for resumable downloads
    const range = request.headers.get("range");
    if (range) {
      headers.set("Content-Range", `bytes ${range}/`);
      return new NextResponse(createWebStream(stream) as unknown as ReadableStream, {
        status: 206, // Partial Content
        headers,
      });
    }

    // Convert Node.js stream to Web Stream with error handling
    const webStream = createWebStream(stream) as unknown as ReadableStream;

    return new NextResponse(webStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Download API error:", error);
    return handleDownloadError(error);
  }
}

/**
 * GET: Handle query parameter downloads and metadata requests
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: DownloadQueryParams = {
      url: searchParams.get("url") || "",
      itag: searchParams.get("itag") || undefined,
      quality: searchParams.get("quality") || undefined,
      format: (searchParams.get("format") as "video" | "audio") || "video",
      range: searchParams.get("range") || undefined,
      preview: searchParams.get("preview") || undefined,
    };

    if (!params.url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // If preview mode, return metadata only
    if (params.preview === "true") {
      try {
        const metadata = await getDownloadMetadata(params.url);
        return NextResponse.json({
          success: true,
          metadata,
        });
      } catch (error: any) {
        return NextResponse.json(
          { error: `Failed to get preview: ${error.message}` },
          { status: 404 },
        );
      }
    }

    // Convert GET params to POST body format and delegate
    const mockRequest = new Request(request.url, {
      method: "POST",
      body: JSON.stringify({
        url: params.url,
        itag: params.itag ? parseInt(params.itag) : undefined,
        quality: params.quality,
        format: params.format,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await POST(mockRequest as NextRequest);
  } catch (error: any) {
    console.error("Download GET API error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}

// Helper Functions

function createWebStream(nodeStream: NodeJS.ReadableStream): ReadableStream<Uint8Array> {
  let closed = false;
  let totalBytes = 0;
  const startTime = Date.now();

  function cleanup() {
    nodeStream.off("data", onData);
    nodeStream.off("end", onEnd);
    nodeStream.off("error", onError);
    if (typeof (nodeStream as any).destroy === "function" && !(nodeStream as any).destroyed) {
      (nodeStream as any).destroy();
    }
  }

  function onData(chunk: Buffer, controller: ReadableStreamDefaultController<Uint8Array>) {
    if (closed) return;
    try {
      controller.enqueue(new Uint8Array(chunk));
      totalBytes += chunk.length;
    } catch (error) {
      console.error("Stream data error:", error);
      onClose(controller);
    }
  }

  function onEnd(controller: ReadableStreamDefaultController<Uint8Array>) {
    if (closed) return;
    closed = true;
    const duration = Date.now() - startTime;
    console.log(`Download completed: ${totalBytes} bytes in ${duration}ms`);
    controller.close();
    cleanup();
  }

  function onError(error: any, controller: ReadableStreamDefaultController<Uint8Array>) {
    if (closed) return;
    closed = true;
    console.error("Stream error:", error);
    controller.error(error);
    cleanup();
  }

  function onClose(controller: ReadableStreamDefaultController<Uint8Array>) {
    if (closed) return;
    closed = true;
    controller.close();
    cleanup();
  }

  return new ReadableStream<Uint8Array>({
    start(controller) {
      // Bind handlers with controller context
      const dataHandler = (chunk: Buffer) => onData(chunk, controller);
      const endHandler = () => onEnd(controller);
      const errorHandler = (err: any) => onError(err, controller);
      nodeStream.on("data", dataHandler);
      nodeStream.on("end", endHandler);
      nodeStream.on("error", errorHandler);

      // Handle browser abort (refresh/leave)
      return (reason?: any) => {
        onError(reason || new Error("Client aborted download"), controller);
      };
    },
    cancel(reason) {
      cleanup();
    },
  });
}

function getContentType(format: "video" | "audio", codec?: string): string {
  if (format === "audio") {
    if (codec?.includes("mp3")) return "audio/mpeg";
    if (codec?.includes("aac")) return "audio/mp4";
    if (codec?.includes("opus")) return "audio/webm";
    return "audio/mp4"; // Default
  } else {
    if (codec?.includes("av01")) return "video/mp4"; // AV1
    if (codec?.includes("vp9")) return "video/webm";
    if (codec?.includes("h264")) return "video/mp4";
    return "video/mp4"; // Default
  }
}

function handleDownloadError(error: any): NextResponse {
  let errorMessage = "Download failed";
  let statusCode = 500;
  let retryAfter: number | undefined;

  // Map common YouTube errors to appropriate responses
  if (error.statusCode === 410 || error.message?.includes("unavailable")) {
    errorMessage = "Video is no longer available";
    statusCode = 410;
  } else if (error.statusCode === 403 || error.message?.includes("restricted")) {
    errorMessage = "Video is private or restricted";
    statusCode = 403;
  } else if (error.statusCode === 404) {
    errorMessage = "Video not found";
    statusCode = 404;
  } else if (error.statusCode === 429 || error.message?.includes("rate limit")) {
    errorMessage = "Too many requests. Please try again later.";
    statusCode = 429;
    retryAfter = 60; // 1 minute
  } else if (error.message?.includes("timeout")) {
    errorMessage = "Request timeout. Please try again.";
    statusCode = 408;
  } else if (error.message?.includes("network")) {
    errorMessage = "Network error occurred";
    statusCode = 503;
    retryAfter = 30;
  } else if (error.message?.includes("functions")) {
    errorMessage = "YouTube service temporarily unavailable";
    statusCode = 503;
    retryAfter = 300; // 5 minutes
  }

  const headers = new Headers();
  if (retryAfter) {
    headers.set("Retry-After", retryAfter.toString());
  }

  return NextResponse.json(
    {
      error: errorMessage,
      code: statusCode,
      retryAfter,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode, headers },
  );
}

/**
 * OPTIONS: Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range",
      "Access-Control-Expose-Headers": "Content-Range, Accept-Ranges, X-Download-Info",
    },
  });
}

function toAscii(str: string): string {
  if (!str) return '';
  return str.replace(/[^\x00-\x7F]/g, "");
}
