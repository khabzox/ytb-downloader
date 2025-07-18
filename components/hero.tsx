
import { Zap, Shield, Smartphone } from "lucide-react";
import { Suspense } from "react";
import UrlInput from "./landing-page/url-input";
import UrlInputLoading from "./landing-page/url-input";

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
          <Suspense fallback={<UrlInputLoading />}>
            <UrlInput />
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
