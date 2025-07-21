import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import React from "react";

type DownloadOption = {
  icon: React.ElementType;
  type: string;
  quality: string;
  recommended?: boolean;
  size: string;
};

export default function DownloadOptions({ options }: { options: DownloadOption[] }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Download className="text-primary h-5 w-5" />
          Download Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {options.map((option, index) => (
          <div key={index}>
            <div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border p-4 sm:gap-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="bg-accent rounded-lg p-2">
                  <option.icon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 max-sm:flex-col-reverse">
                    <span className="text-foreground font-semibold">
                      {option.type} - {option.quality}
                    </span>
                    {option.recommended && (
                      <Badge className="bg-primary text-white">Recommended</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">File size: {option.size}</p>
                </div>
              </div>
              <Button className="bg-primary text-primary-foreground cursor-pointer border-none w-full sm:w-auto mt-2 sm:mt-0">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            {index < options.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}