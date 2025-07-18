import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Zap, Shield, Smartphone, Clock, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function YouTubeDownloaderLanding() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Header */}
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

      {/* Hero Section */}
      <section
        className="py-20 md:py-32"
        style={{
          background: `linear-gradient(135deg, var(--background) 0%, var(--background) 70%, var(--accent) 100%)`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h1
              className="mb-6 text-4xl font-bold tracking-tight md:text-6xl"
              style={{ color: "var(--foreground)" }}
            >
              Download YouTube Videos
              <span className="block" style={{ color: "var(--primary)" }}>
                Fast & Free
              </span>
            </h1>
            <p
              className="mx-auto mb-8 max-w-2xl text-xl"
              style={{ color: "var(--muted-foreground)" }}
            >
              Convert and download your favorite YouTube videos in high quality. Simple, fast, and
              completely free to use.
            </p>

            {/* URL Input Section */}
            <div className="mx-auto mb-8 max-w-2xl">
              <Card
                className="p-6 shadow-lg"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--primary)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Input
                      type="url"
                      placeholder="Paste YouTube URL here..."
                      className="h-12 flex-1 border-2 text-base"
                      style={{
                        backgroundColor: "var(--input)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                    />
                    <Link href="/download">
                      <Button
                        size="lg"
                        className="h-12 w-full px-8 font-semibold sm:w-auto"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-foreground)",
                          border: "none",
                        }}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download
                      </Button>
                    </Link>
                  </div>
                  <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Supports all YouTube video formats and qualities
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" style={{ color: "var(--primary)" }} />
                <span style={{ color: "var(--muted-foreground)" }}>100% Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" style={{ color: "var(--primary)" }} />
                <span style={{ color: "var(--muted-foreground)" }}>Super Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" style={{ color: "var(--primary)" }} />
                <span style={{ color: "var(--muted-foreground)" }}>Mobile Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-20"
        style={{
          background: `linear-gradient(135deg, rgba(255, 0, 0, 0.08) 0%, rgba(255, 0, 0, 0.12) 50%, rgba(255, 0, 0, 0.08) 100%)`,
          backdropFilter: "blur(0.5px)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-3xl font-bold md:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Why Choose Our Downloader?
            </h2>
            <p className="mx-auto max-w-2xl text-xl" style={{ color: "var(--muted-foreground)" }}>
              Experience the fastest and most reliable way to download YouTube videos
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Download videos in seconds with our optimized servers and advanced technology.",
              },
              {
                icon: Video,
                title: "High Quality",
                desc: "Choose from multiple quality options including HD, Full HD, and 4K resolution.",
              },
              {
                icon: Shield,
                title: "100% Safe",
                desc: "No malware, no ads, no registration required. Your privacy is our priority.",
              },
              {
                icon: Smartphone,
                title: "All Devices",
                desc: "Works perfectly on desktop, mobile, and tablet. Download anywhere, anytime.",
              },
              {
                icon: Clock,
                title: "No Time Limits",
                desc: "Download as many videos as you want without any restrictions or waiting times.",
              },
              {
                icon: Download,
                title: "Multiple Formats",
                desc: "Download in MP4, MP3, AVI, and more formats to suit your needs.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(255, 0, 0, 0.1)",
                }}
              >
                <CardContent className="p-0">
                  <div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 0, 0, 0.2) 100%)",
                      border: "1px solid rgba(255, 0, 0, 0.2)",
                    }}
                  >
                    <feature.icon className="h-6 w-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold" style={{ color: "var(--foreground)" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "var(--muted-foreground)" }}>{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20" style={{ backgroundColor: "var(--background)" }}>
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-3xl font-bold md:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              How It Works
            </h2>
            <p className="text-xl" style={{ color: "var(--muted-foreground)" }}>
              Download YouTube videos in just 3 simple steps
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Copy URL",
                  desc: "Copy the YouTube video URL from your browser's address bar",
                },
                {
                  step: "2",
                  title: "Paste & Click",
                  desc: "Paste the URL in our input field and click the download button",
                },
                {
                  step: "3",
                  title: "Download",
                  desc: "Choose your preferred quality and format, then download instantly",
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold" style={{ color: "var(--foreground)" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--muted-foreground)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: "var(--accent)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2
              className="mb-4 text-3xl font-bold md:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Ready to Start Downloading?
            </h2>
            <p className="mb-8 text-xl" style={{ color: "var(--muted-foreground)" }}>
              Join millions of users who trust our YouTube downloader for their video needs
            </p>
            <Link href="/download">
              <Button
                size="lg"
                className="h-12 px-8 font-semibold"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  border: "none",
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Start Downloading Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t py-12"
        style={{
          backgroundColor: "var(--muted)",
          borderColor: "var(--border)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center space-x-2">
                <Image src={"/logo/logo-saas.png"} alt="YTDownloader Logo" width={32} height={32} />
                <span className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  YTBDownloader
                </span>
              </div>
              <p className="mb-4" style={{ color: "var(--muted-foreground)" }}>
                The fastest and most reliable YouTube video downloader. Download your favorite
                videos in high quality for free.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold" style={{ color: "var(--foreground)" }}>
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                {["Home", "Features", "How it Works", "FAQ"].map((link, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="transition-opacity hover:opacity-80"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold" style={{ color: "var(--foreground)" }}>
                Legal
              </h3>
              <ul className="space-y-2 text-sm">
                {["Privacy Policy", "Terms of Service", "DMCA", "Contact"].map((link, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="transition-opacity hover:opacity-80"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-8 border-t pt-8 text-center text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            <p>&copy; {new Date().getFullYear()} YTDownloader. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
