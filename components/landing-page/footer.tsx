import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-border py-12 bg-muted"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <Image src={"/logo/logo-saas.png"} alt="YTDownloader Logo" width={32} height={32} />
              <span className="text-xl font-bold text-foreground">
                YTBDownloader
              </span>
            </div>
            <p className="mb-4 text-muted-foreground">
              The fastest and most reliable YouTube video downloader. Download your favorite videos
              in high quality for free.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Features", "How it Works", "FAQ"].map((link, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="transition-opacity hover:opacity-80 text-muted-foreground"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Terms of Service", "DMCA", "Contact"].map((link, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="transition-opacity hover:opacity-80 text-muted-foreground"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground"
        >
          <p>&copy; {new Date().getFullYear()} YTDownloader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
