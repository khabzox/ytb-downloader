import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export default function Cta() {
  return (
    <section className="bg-accent py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Ready to Start Downloading?
          </h2>
          <p className="text-muted-foreground mb-8 text-xl">
            Join millions of users who trust our YouTube downloader for their video needs
          </p>
          <Link href="/download">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground h-12 border-none px-8 font-semibold"
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
