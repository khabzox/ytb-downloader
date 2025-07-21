import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type ChannelInfo = {
  readonly videoData: {
    channel: {
      avatar: string;
      name: string;
      verified: boolean;
      subscribers: string;
      bio: string;
      socialLinks: {
        youtube: string;
        twitter: string;
        website: string;
      };
    };
  };
};

export default function ChannelInformation({ videoData }: ChannelInfo) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Channel Information</CardTitle>
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
              <h3 className="text-foreground font-semibold">{videoData.channel.name}</h3>
              {videoData.channel.verified && (
                <Badge variant="secondary" className="text-xs">
                  ✓ Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {videoData.channel.subscribers} subscribers
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-foreground mb-2 font-medium">About</h4>
          <p className="text-muted-foreground text-sm">{videoData.channel.bio}</p>
        </div>

        <Separator />

        <div>
          <h4 className="text-foreground mb-3 font-medium">Social Links</h4>
          <div className="space-y-2">
            <Link
              href={videoData.channel.socialLinks.youtube}
              className="text-primary flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
            >
              <ExternalLink className="h-4 w-4" />
              YouTube Channel
            </Link>
            <Link
              href={videoData.channel.socialLinks.twitter}
              className="text-primary flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
            >
              <ExternalLink className="h-4 w-4" />
              Twitter
            </Link>
            <Link
              href={videoData.channel.socialLinks.website}
              className="text-primary flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
            >
              <ExternalLink className="h-4 w-4" />
              Website
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
