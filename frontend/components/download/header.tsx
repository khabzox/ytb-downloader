import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-background border-border border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="group flex scale-100 items-center space-x-2 rounded-lg p-2 transition-transform duration-300 hover:scale-105 hover:bg-gray-200/40"
        >
          <ArrowLeft className="text-primary h-5 w-5" />
          <span className="text-foreground text-sm font-medium">Back to Home</span>
        </Link>
        <Link
          href="/"
          className="group scale-100 rounded-lg p-2 transition-transform duration-300 hover:scale-105 hover:bg-gray-200/40"
        >
          <div className="flex items-center space-x-2">
            <Image src={"/logo/logo-saas.png"} alt="YTDownloader Logo" width={32} height={32} />
            <span className="text-foreground text-xl font-bold">YTBDownloader</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
