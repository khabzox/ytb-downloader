import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-background border-border border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Image src={"/logo/logo-saas.png"} alt="YTDownloader Logo" width={32} height={32} />
          <span className="text-foreground text-xl font-bold">YTBDownloader</span>
        </div>
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="#features"
            className="text-foreground text-sm font-medium transition-opacity hover:opacity-80"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-foreground text-sm font-medium transition-opacity hover:opacity-80"
          >
            How it Works
          </Link>
          <Link
            href="#contact"
            className="text-foreground text-sm font-medium transition-opacity hover:opacity-80"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
