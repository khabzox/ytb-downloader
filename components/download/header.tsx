import Link from "next/link";
import { ArrowLeft, FileVideo } from "lucide-react";

export default function Header() {
  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <ArrowLeft className="h-5 w-5" style={{ color: "var(--primary)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Back to Home
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          <FileVideo className="h-8 w-8" style={{ color: "var(--primary)" }} />
          <span className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            YTDownloader
          </span>
        </div>
      </div>
    </header>
  );
}
