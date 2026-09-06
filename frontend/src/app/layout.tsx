import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FitnessZone — India's Premium Gym Management Platform",
    template: "%s | FitnessZone",
  },
  description:
    "FitnessZone is India's leading gym management platform offering world-class fitness programs, personal training, and a premium gym experience. Join now and transform your body.",
  keywords: ["gym", "fitness", "India", "gym management", "personal training", "membership", "workout"],
  authors: [{ name: "FitnessZone" }],
  creator: "FitnessZone",
  metadataBase: new URL("https://fitnesszone.in"),
  openGraph: {
    title: "FitnessZone — India's Premium Gym Management Platform",
    description: "Join FitnessZone and experience world-class fitness training. Track your progress, manage memberships, and achieve your goals.",
    type: "website",
    locale: "en_IN",
    siteName: "FitnessZone",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
