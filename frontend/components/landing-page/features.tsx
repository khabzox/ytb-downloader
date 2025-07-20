import { Card, CardContent } from "@/components/ui/card";
import { Download, Zap, Shield, Smartphone, Clock, Video } from "lucide-react";

export default function Features() {
  return (
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
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Why Choose Our Downloader?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
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
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
