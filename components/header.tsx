import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Image src={"/logo/logo-saas.png"} alt="YTDownloader Logo" width={32} height={32} />
          <span className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            YTBDownloader
          </span>
        </div>
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--foreground)" }}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--foreground)" }}
          >
            How it Works
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--foreground)" }}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
