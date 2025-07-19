"use client";

import { Download, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React from "react";

// Import your DownloadProgress type
interface DownloadProgress {
  percentage: number;
  downloadedBytes: number;
  totalBytes: number;
  speed: number;
  timeRemaining: number;
}

interface DownloadOption {
  type: string;
  quality: string;
  size: string;
  icon: React.ElementType;
  recommended?: boolean;
  itag?: number;
  format?: "video" | "audio";
}

interface DownloadOptionsProps {
  options: DownloadOption[];
  onDownload?: (option: DownloadOption) => void;
  downloading?: boolean;
  progress?: DownloadProgress | null;
  error?: string | null;
  onCancelDownload?: () => void;
  onClearError?: () => void;
}

export default function DownloadOptions({
  options,
  onDownload,
  downloading = false,
  progress = null,
  error = null,
  onCancelDownload,
  onClearError,
}: DownloadOptionsProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Download Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              {onClearError && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearError}
                  className="h-auto p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Download Progress */}
        {downloading && progress && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Downloading...</span>
              {onCancelDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancelDownload}
                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Progress value={progress.percentage} className="w-full" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress.percentage.toFixed(1)}%</span>
              <span>
                {formatBytes(progress.downloadedBytes)} / {formatBytes(progress.totalBytes)}
              </span>
            </div>
            
            {progress.speed > 0 && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Speed: {formatSpeed(progress.speed)}</span>
                <span>ETA: {formatTime(progress.timeRemaining)}</span>
              </div>
            )}
          </div>
        )}

        {/* Download Options List - Using your original structure */}
        {options.length > 0 ? (
          <div>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <option.icon className="h-6 w-6 text-primary" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">
                          {option.type} - {option.quality}
                        </h3>
                        {option.recommended && (
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        File size: {option.size}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onDownload?.(option)}
                    disabled={downloading}
                    className="min-w-[100px]"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>

                {index < options.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No download options available</p>
            <p className="text-sm">The video might be private or restricted</p>
          </div>
        )}

        {/* Download Tips */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Download Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Choose MP4 for video with audio</li>
            <li>• Choose MP3 for audio-only downloads</li>
            <li>• Higher quality = larger file size</li>
            <li>• Downloads may take time depending on file size</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
