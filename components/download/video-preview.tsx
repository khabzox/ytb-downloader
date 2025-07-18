import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, ThumbsUp, Calendar } from "lucide-react";
import Image from "next/image";
import React from "react";

type VideoData = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  uploadDate: string;
  description: string;
  isShort?: boolean;
  channel: {
    name: string;
    avatar: string;
    subscribers: string;
    verified: boolean;
    bio: string;
    socialLinks: {
      youtube: string;
      twitter: string;
      website: string;
    };
  };
};

export default function VideoPreview({ videoData }: { videoData: VideoData }) {
  const videoUrl = videoData.isShort
    ? `https://www.youtube.com/shorts/${videoData.id}`
    : `https://www.youtube.com/watch?v=${videoData.id}`;

  return (
    <Card className="bg-card">
      <CardContent className="pt-0">
        <div className="relative">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
            title={videoData.title}
          >
            <Image
              src={videoData.thumbnail}
              alt={videoData.title}
              height={360}
              width={640}
              className="w-full rounded-t-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-t-lg bg-black/10 transition-colors group-hover:bg-black/20">
              <Play className="h-16 w-16 text-white opacity-80" />
            </div>
          </a>
          <Badge className="absolute right-2 bottom-2 bg-black/80 text-white">
            {videoData.duration}
          </Badge>
        </div>
        <div className="p-6">
          <h1 className="text-foreground mb-4 text-2xl font-bold">{videoData.title}</h1>
          <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
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
          <p className="text-muted-foreground">{videoData.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
