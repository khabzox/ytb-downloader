import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Zap, Shield, Smartphone } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Hero() {
  return (
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
          <Suspense
            fallback={
              <div className="mx-auto mb-8 max-w-2xl">
                <div className="animate-pulse rounded-lg bg-gray-200 p-6 shadow-lg">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="h-12 flex-1 rounded-md bg-gray-300" />
                    <div className="h-12 w-32 rounded-md bg-gray-300" />
                  </div>
                  <div className="mt-3 h-4 w-1/2 rounded bg-gray-300" />
                </div>
              </div>
            }
          >
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
          </Suspense>
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
  );
}
