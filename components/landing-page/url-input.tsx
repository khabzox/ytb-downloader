import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import Link from "next/link";

export default function UrlInput() {
  return (
    <div className="mx-auto mb-8 max-w-2xl">
      <Card className="p-6 shadow-lg bg-card border border-primary">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          type="url"
          placeholder="Paste YouTube URL here..."
          className="h-12 flex-1 border-2 text-base bg-input border-border text-foreground"
        />
        <Link href="/download">
          <Button
            size="lg"
            className="h-12 w-full px-8 font-semibold sm:w-auto bg-primary text-primary-foreground border-0"
          >
            <Download className="mr-2 h-5 w-5" />
            Download
          </Button>
        </Link>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
        Supports all YouTube video formats and qualities
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
