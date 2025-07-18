import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Play,
  Eye,
  ThumbsUp,
  Calendar,
  Clock,
  FileVideo,
  Music,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DownloadPage() {
  // Mock video data - in real app this would come from URL params or API
  const videoData = {
    id: "dQw4w9WgXcQ",
    title: "Amazing Tutorial: How to Build Modern Web Applications",
    thumbnail: "/placeholder.svg?height=360&width=640",
    duration: "12:34",
    views: "1,234,567",
    likes: "45,678",
    uploadDate: "2024-01-15",
    description:
      "Learn how to build modern web applications with the latest technologies. This comprehensive tutorial covers everything from setup to deployment.",
    channel: {
      name: "TechMaster Pro",
      avatar: "/placeholder.svg?height=80&width=80",
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
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" style={{ color: "var(--primary)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Back to Home
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            <FileVideo className="h-8 w-8" style={{ color: "var(--primary)" }} />
            <span className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              YTDownloader
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Video Preview */}
            <Card style={{ backgroundColor: "var(--card)" }}>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={videoData.thumbnail || "/placeholder.svg"}
                    alt={videoData.title}
                    width={640}
                    height={360}
                    className="h-auto w-full rounded-t-lg"
                  />
                  <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center rounded-t-lg bg-black">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <Badge
                    className="absolute right-2 bottom-2"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", color: "white" }}
                  >
                    {videoData.duration}
                  </Badge>
                </div>
                <div className="p-6">
                  <h1 className="mb-4 text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                    {videoData.title}
                  </h1>
                  <div
                    className="mb-4 flex flex-wrap gap-4 text-sm"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{videoData.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{videoData.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(videoData.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p style={{ color: "var(--muted-foreground)" }}>{videoData.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Download Options */}
            <Card style={{ backgroundColor: "var(--card)" }}>
              <CardHeader>
                <CardTitle
                  className="flex items-center gap-2"
                  style={{ color: "var(--foreground)" }}
                >
                  <Download className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  Download Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {downloadOptions.map((option, index) => (
                  <div key={index}>
                    <div
                      className="flex items-center justify-between rounded-lg border p-4"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-lg p-2"
                          style={{ backgroundColor: "var(--accent)" }}
                        >
                          <option.icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                              {option.type} - {option.quality}
                            </span>
                            {option.recommended && (
                              <Badge style={{ backgroundColor: "var(--primary)", color: "white" }}>
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                            File size: {option.size}
                          </p>
                        </div>
                      </div>
                      <Button
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-foreground)",
                          border: "none",
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    {index < downloadOptions.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Channel Info */}
          <div className="space-y-6">
            {/* Channel Information */}
            <Card style={{ backgroundColor: "var(--card)" }}>
              <CardHeader>
                <CardTitle style={{ color: "var(--foreground)" }}>Channel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Image
                    src={videoData.channel.avatar || "/placeholder.svg"}
                    alt={videoData.channel.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                        {videoData.channel.name}
                      </h3>
                      {videoData.channel.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                      {videoData.channel.subscribers} subscribers
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 font-medium" style={{ color: "var(--foreground)" }}>
                    About
                  </h4>
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {videoData.channel.bio}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3 font-medium" style={{ color: "var(--foreground)" }}>
                    Social Links
                  </h4>
                  <div className="space-y-2">
                    <Link
                      href={videoData.channel.socialLinks.youtube}
                      className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                      style={{ color: "var(--primary)" }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      YouTube Channel
                    </Link>
                    <Link
                      href={videoData.channel.socialLinks.twitter}
                      className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                      style={{ color: "var(--primary)" }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Twitter
                    </Link>
                    <Link
                      href={videoData.channel.socialLinks.website}
                      className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                      style={{ color: "var(--primary)" }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Website
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Info */}
            <Card style={{ backgroundColor: "var(--card)" }}>
              <CardHeader>
                <CardTitle style={{ color: "var(--foreground)" }}>Download Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" style={{ color: "var(--primary)" }} />
                  <span style={{ color: "var(--muted-foreground)" }}>
                    Estimated download time: 30-60 seconds
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileVideo className="h-4 w-4" style={{ color: "var(--primary)" }} />
                  <span style={{ color: "var(--muted-foreground)" }}>
                    Multiple formats available
                  </span>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: "var(--accent)" }}>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <strong>Note:</strong> Please respect copyright laws and only download content
                    you have permission to use.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
