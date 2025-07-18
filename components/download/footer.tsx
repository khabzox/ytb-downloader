import React from "react";

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
    >
      <div className="container mx-auto px-4 py-6 text-center">
        <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          © 2023 YTDownloader. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
