import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";

// Modern, clean sans-serif - perfect for UI
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Professional monospace for code/URLs
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// Friendly, rounded font for headings
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YouTube Downloader - Fast & Free Video Downloads",
  description:
    "Download YouTube videos and shorts in high quality. Fast, free, and easy to use YouTube downloader with multiple format options.",
  keywords: [
    "youtube downloader",
    "video downloader",
    "youtube to mp4",
    "download youtube videos",
    "free video downloader",
  ],
  authors: [{ name: "Abdelkabir" }],
  creator: "Abdelkabir",
  publisher: "YouTube Downloader",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://youtube-downloader.vercel.app/"),
  openGraph: {
    title: "YouTube Downloader - Fast & Free Video Downloads",
    description: "Download YouTube videos and shorts in high quality. Fast, free, and easy to use.",
    url: "https://youtube-downloader.vercel.app/",
    siteName: "YouTube Downloader",
    images: [
      {
        url: "/logo/logo-saas.png",
        width: 1200,
        height: 630,
        alt: "YouTube Downloader",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "YouTube Downloader - Fast & Free Video Downloads",
  //   description: "Download YouTube videos and shorts in high quality. Fast, free, and easy to use.",
  //   images: ["/twitter-image.jpg"],
  //   creator: "@khabzox",
  // },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-site-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${poppins.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
