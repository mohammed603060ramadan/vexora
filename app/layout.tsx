
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VEXORA | Technology Solutions",
    template: "%s | VEXORA",
  },
  description:
    "VEXORA delivers software development, cybersecurity, networks and infrastructure, data analytics, and digital marketing solutions.",
  applicationName: "VEXORA",
  metadataBase: new URL("https://vexora.com"),
  openGraph: {
    title: "VEXORA | Technology Solutions",
    description:
      "Technology that moves you forward. Discover VEXORA's technology services.",
    siteName: "VEXORA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
