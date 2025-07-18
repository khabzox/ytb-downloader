import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileVideo } from "lucide-react";
import React from "react";

export default function DownloadInfo() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Download Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="text-primary h-4 w-4" />
          <span className="text-muted-foreground">Estimated download time: 30-60 seconds</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FileVideo className="text-primary h-4 w-4" />
          <span className="text-muted-foreground">Multiple formats available</span>
        </div>
        <div className="bg-accent rounded-lg p-3">
          <p className="text-muted-foreground text-xs">
            <strong>Note:</strong> Please respect copyright laws and only download content you have
            permission to use.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
