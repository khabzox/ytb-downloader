import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contact" className="border-border bg-muted border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <Image src={"/logo/logo-saas.png"} alt="YTDownloader Logo" width={32} height={32} />
              <span className="text-foreground text-xl font-bold">YTBDownloader</span>
            </div>
            <p className="text-muted-foreground mb-4">
              The fastest and most reliable YouTube video downloader. Download your favorite videos
              in high quality for free.
            </p>
          </div>

          <div>
            <h3 className="text-foreground mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Features", "How it Works", "FAQ"].map((link, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-opacity hover:opacity-80"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Terms of Service", "DMCA", "Contact"].map((link, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-opacity hover:opacity-80"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} YTDownloader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
