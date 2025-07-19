"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FileVideo, Music } from "lucide-react";
import VideoPreview from "@/components/download/video-preview";
import DownloadOptions from "@/components/download/download-options";
import ChannelInformation from "@/components/download/channel-information";
import DownloadInfo from "@/components/download/download-info";
import VideoPreviewSkeleton from "@/components/loading/video-preview";
import ChannelInformationSkeleton from "@/components/loading/channel-information";
import DownloadOptionsSkeleton from "@/components/loading/download-options";
import { useVideoInfo } from "@/hooks/use-video-info";
import { useDownload } from "@/hooks/use-download";

export default function DownloadPage() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") || "";
  const url = urlParam ? decodeURIComponent(urlParam) : "";

  const {
    videoInfo,
    downloadOptions: rawDownloadOptions,
    loading: videoLoading,
    error: videoError,
    fetchVideoInfo,
  } = useVideoInfo();

  const {
    downloading,
    progress,
    error: downloadError,
    downloadFile,
    cancelDownload,
    clearError,
  } = useDownload();

  // Transform download options to match your component structure
  const downloadOptions = rawDownloadOptions.map(option => ({
    type: option.format === "audio" ? "MP3" : "MP4",
    quality: option.quality,
    size: option.size,
    icon: option.format === "audio" ? Music : FileVideo,
    recommended: option.recommended,
    itag: option.itag,
    format: option.format,
  }));

  // Fetch video info when URL is available
  useEffect(() => {
    if (url) {
      fetchVideoInfo(url);
    }
  }, [url]);

  // Handle download option selection
  const handleDownload = async (option: any) => {
    if (!url) return;

    clearError();

    await downloadFile({
      url,
      itag: option.itag,
      quality: option.quality,
      format: option.format,
    });
  };

  // Show error state
  if (videoError && !videoLoading) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-6 text-center">
              <h2 className="text-destructive mb-2 text-xl font-semibold">Error Loading Video</h2>
              <p className="text-muted-foreground mb-4">{videoError}</p>
              <button
                onClick={() => window.history.back()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (videoLoading || !videoInfo) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <VideoPreviewSkeleton />
              <DownloadOptionsSkeleton />
            </div>
            <div className="space-y-6">
              <ChannelInformationSkeleton />
              <DownloadOptionsSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Video Preview */}
            <VideoPreview videoData={videoInfo} />

            {/* Download Options */}
            <DownloadOptions
              options={downloadOptions}
              onDownload={handleDownload}
              downloading={downloading}
              progress={progress}
              error={downloadError}
              onCancelDownload={cancelDownload}
              onClearError={clearError}
            />
          </div>

          {/* Sidebar - Channel Info */}
          <div className="space-y-6">
            {/* Channel Information */}
            <ChannelInformation videoData={videoInfo} />

            {/* Download Info */}
            <DownloadInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
