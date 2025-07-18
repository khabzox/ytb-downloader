import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export default function Cta() {
  return (
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
  );
}
