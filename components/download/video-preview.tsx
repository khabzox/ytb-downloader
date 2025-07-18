import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, ThumbsUp, Calendar } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function VideoPreview({ videoData }: { videoData: any }) {
  return (
    <Card className="bg-card">
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
