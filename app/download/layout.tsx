import Footer from "@/components/download/footer";
import Header from "@/components/download/header";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Suspense
        fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}
      >
        {children}
      </Suspense>
      <Footer />
    </>
  );
}
