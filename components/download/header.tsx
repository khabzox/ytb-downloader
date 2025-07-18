import Link from "next/link";
import { ArrowLeft, FileVideo } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-background border-border border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <ArrowLeft className="text-primary h-5 w-5" />
          <span className="text-foreground text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex items-center space-x-2">
          <FileVideo className="text-primary h-8 w-8" />
          <span className="text-foreground text-xl font-bold">YTDownloader</span>
        </div>
      </div>
    </header>
  );
}
