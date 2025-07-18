import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import Features from "@/components/landing-page/features";
import HowItWorks from "@/components/landing-page/how-it-work";
import Cta from "@/components/landing-page/cta";
import Footer from "@/components/landing-page/footer";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
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
