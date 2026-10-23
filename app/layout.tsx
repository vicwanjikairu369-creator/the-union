import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Union",
  description: "An emotionally immersive marriage simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}