"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadProgress } from "@/hooks/use-download";

interface DownloadProgressProps {
  progress: DownloadProgress;
  onCancel?: () => void;
  fileName?: string;
}

export default function DownloadProgressComponent({
  progress,
  onCancel,
  fileName,
}: DownloadProgressProps) {
  const formatSpeed = (speed: number) => {
    if (speed >= 1024 * 1024) {
      return `${(speed / (1024 * 1024)).toFixed(1)} MB/s`;
    }
    if (speed >= 1024) {
      return `${(speed / 1024).toFixed(1)} KB/s`;
    }
    return `${speed.toFixed(0)} B/s`;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} B`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Downloading...</h3>
              {fileName && (
                <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                  {fileName}
                </p>
              )}
            </div>
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress.percentage} className="w-full h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress.percentage.toFixed(1)}%</span>
              <span>
                {formatBytes(progress.downloadedBytes)} / {formatBytes(progress.totalBytes)}
              </span>
            </div>
          </div>

          {/* Speed and ETA */}
          {progress.speed > 0 && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Speed: {formatSpeed(progress.speed)}</span>
              <span>ETA: {formatTime(progress.timeRemaining)}</span>
            </div>
          )}

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">
              {progress.percentage >= 100 ? "Download complete!" : "Downloading..."}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}