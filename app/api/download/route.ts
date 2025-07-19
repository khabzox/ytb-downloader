// app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDownloadStream, getDownloadMetadata } from "@/actions/download-video";
import { validateYouTubeUrl } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, itag, quality, format, filename } = body;

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

    // Get metadata for filename
    const metadata = await getDownloadMetadata(url);

    // Generate filename if not provided
    let downloadFilename = filename;
    if (!downloadFilename) {
      const sanitizedTitle =
        metadata.title
          ?.replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "_")
          .substring(0, 100) || "video";

      const extension = format === "audio" ? "mp4" : "mp4";
      downloadFilename = `${sanitizedTitle}_${metadata.videoId}.${extension}`;
    }

    // Get download stream
    const stream = await getDownloadStream(url, {
      itag: parseInt(itag) || undefined,
      quality,
      format: format || "video",
    });

    // Set response headers for file download
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${downloadFilename}"`);
    headers.set("Content-Type", format === "audio" ? "audio/mp4" : "video/mp4");

    // Convert Node.js stream to Web Stream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", chunk => {
          controller.enqueue(new Uint8Array(chunk));
        });

        stream.on("end", () => {
          controller.close();
        });

        stream.on("error", error => {
          controller.error(error);
        });
      },
    });

    return new NextResponse(webStream, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Download API error:", error);

    let errorMessage = "Download failed";
    let statusCode = 500;

    if (error.statusCode === 410) {
      errorMessage = "Video is no longer available";
      statusCode = 410;
    } else if (error.statusCode === 403) {
      errorMessage = "Video is private or restricted";
      statusCode = 403;
    } else if (error.message?.includes("Video unavailable")) {
      errorMessage = "Video is unavailable";
      statusCode = 404;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

// Optional: Handle GET requests for direct download links
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const itag = searchParams.get("itag");
  const quality = searchParams.get("quality");
  const format = searchParams.get("format") || "video";

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    return await POST(request);
  } catch (error) {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
