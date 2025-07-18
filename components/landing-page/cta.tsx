import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export default function Cta() {
  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h2
            className="mb-4 text-3xl font-bold md:text-4xl text-foreground"
          >
            Ready to Start Downloading?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join millions of users who trust our YouTube downloader for their video needs
          </p>
          <Link href="/download">
            <Button
              size="lg"
              className="h-12 px-8 font-semibold bg-primary text-primary-foreground border-none"
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
