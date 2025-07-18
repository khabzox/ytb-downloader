import Link from "next/link";
import { ArrowLeft, FileVideo } from "lucide-react";

export default function Header() {
  return (
    <header
      className="border-b bg-background border-border"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <ArrowLeft className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Back to Home
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          <FileVideo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            YTDownloader
          </span>
        </div>
      </div>
    </header>
  );
}
