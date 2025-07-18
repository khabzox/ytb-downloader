import { FileVideo, Music } from "lucide-react";

import VideoPreview from "@/components/download/video-preview";
import DownloadOptions from "@/components/download/download-options";
import ChannelInformation from "@/components/download/channel-information";
import DownloadInfo from "@/components/download/download-info";
import { Suspense } from "react";
import VideoPreviewSkeleton from "@/components/loading/video-preview";
import ChannelInformationSkeleton from "@/components/loading/channel-information";
import DownloadOptionsSkeleton from "@/components/loading/download-options";

export default function DownloadPage() {
  // Mock video data - in real app this would come from URL params or API
  const videoData = {
    id: "dQw4w9WgXcQ",
    title: "Amazing Tutorial: How to Build Modern Web Applications",
    thumbnail: "https://img.youtube.com/vi/6sgs1EZLF5E/maxresdefault.jpg",
    duration: "12:34",
    views: "1,234,567",
    likes: "45,678",
    uploadDate: "2024-01-15",
    description:
      "Learn how to build modern web applications with the latest technologies. This comprehensive tutorial covers everything from setup to deployment.",
    channel: {
      name: "TechMaster Pro",
      avatar: "https://yt3.ggpht.com/q0jye-KM3l3nDIs5Be_oXsECi4LjRdSeydIPgw6ByfSYI9Fmbn0Dg5fV-eq9Q0UH5_h_NyF5DA=s48-c-k-c0x00ffffff-no-rj",
      subscribers: "2.5M",
      verified: true,
      bio: "Creating high-quality tech tutorials and programming content. Helping developers level up their skills with practical, real-world examples.",
      socialLinks: {
        youtube: "https://youtube.com/@techmasterpro",
        twitter: "https://twitter.com/techmasterpro",
        website: "https://techmasterpro.com",
      },
    },
  };

  const downloadOptions = [
    {
      type: "MP4",
      quality: "1080p",
      size: "245 MB",
      icon: FileVideo,
      recommended: true,
    },
    {
      type: "MP4",
      quality: "720p",
      size: "156 MB",
      icon: FileVideo,
      recommended: false,
    },
    {
      type: "MP4",
      quality: "480p",
      size: "89 MB",
      icon: FileVideo,
      recommended: false,
    },
    {
      type: "MP3",
      quality: "320kbps",
      size: "12 MB",
      icon: Music,
      recommended: false,
    },
    {
      type: "MP3",
      quality: "128kbps",
      size: "5 MB",
      icon: Music,
      recommended: false,
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Video Preview */}
            <Suspense fallback={<VideoPreviewSkeleton />}>
              <VideoPreview videoData={videoData} />
            </Suspense>

            {/* Download Options */}
            <Suspense fallback={<DownloadOptionsSkeleton />}>
              <DownloadOptions options={downloadOptions} />
            </Suspense>
          </div>

          {/* Sidebar - Channel Info */}
          <div className="space-y-6">
            {/* Channel Information */}
            <Suspense fallback={<ChannelInformationSkeleton />}>
              <ChannelInformation videoData={videoData} />
            </Suspense>

            {/* Download Info */}
            <Suspense fallback={<DownloadOptionsSkeleton />}>
              <DownloadInfo />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
