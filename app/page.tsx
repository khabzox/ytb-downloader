import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import Features from "@/components/landing-page/features";
import HowItWorks from "@/components/landing-page/how-it-work";
import Cta from "@/components/landing-page/cta";
import Footer from "@/components/landing-page/footer";

export default function YouTubeDownloaderLanding() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* CTA Section */}
      <Cta />

      {/* Footer */}
      <Footer />
    </div>
  );
}
