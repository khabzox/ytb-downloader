import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type ChannelInfo = {
  readonly videoData: {
    channel?: {
      avatar?: string;
      name?: string;
      verified?: boolean;
      subscribers?: string;
      bio?: string;
      socialLinks?: {
        youtube?: string;
        twitter?: string;
        website?: string;
      };
    };
  };
};

export default function ChannelInformation({ videoData }: ChannelInfo) {
  const channel = videoData.channel || {};
  const avatar = channel.avatar || "/placeholder.svg";
  const name = channel.name || "Unknown Channel";
  const verified = !!channel.verified;
  const subscribers = channel.subscribers || "0";
  const bio = channel.bio || "No channel description available.";
  const socialLinks = channel.socialLinks || {};

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Channel Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Image
            src={avatar}
            alt={name}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-foreground font-semibold">{name}</h3>
              {verified && (
                <Badge variant="secondary" className="text-xs">
                  ✓ Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {subscribers} subscribers
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-foreground mb-2 font-medium">About</h4>
          <p className="text-muted-foreground text-sm">{bio}</p>
        </div>

        <Separator />

        <div>
          <h4 className="text-foreground mb-3 font-medium">Social Links</h4>
          <div className="space-y-2">
            {socialLinks.youtube && (
              <Link
                href={socialLinks.youtube}
                className="text-primary flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                YouTube Channel
              </Link>
            )}
            {socialLinks.twitter && (
              <Link
                href={socialLinks.twitter}
                className="text-primary flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Twitter
              </Link>
            )}
            {socialLinks.website && (
              <Link
                href={socialLinks.website}
                className="text-primary flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Website
              </Link>
            )}
            {!socialLinks.youtube && !socialLinks.twitter && !socialLinks.website && (
              <span className="text-muted-foreground text-xs">No social links available.</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
