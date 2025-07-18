import { Zap, Shield, Smartphone } from "lucide-react";
import { Suspense } from "react";
import UrlInput from "./url-input";
import UrlInputLoading from "@/components/loading/url-input";

export default function Hero() {
  return (
    <section className="from-background via-background to-accent bg-gradient-to-br py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Download YouTube Videos <span className="text-primary block">Fast & Free</span>
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Convert and download your favorite YouTube videos in high quality. Simple, fast, and
            completely free to use.
          </p>

          {/* URL Input Section */}
          <Suspense fallback={<UrlInputLoading />}>
            <UrlInput />
          </Suspense>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="text-primary h-4 w-4" />
              <span className="text-muted-foreground">100% Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-primary h-4 w-4" />
              <span className="text-muted-foreground">Super Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="text-primary h-4 w-4" />
              <span className="text-muted-foreground">Mobile Friendly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
