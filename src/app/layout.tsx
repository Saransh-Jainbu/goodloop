import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const heading = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading", display: "swap" });

const title = `${SITE_NAME}: find volunteering opportunities near you`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "volunteering",
    "volunteer opportunities near me",
    "blood donation camp",
    "food donation drive",
    "clothes donation",
    "community service",
    "social work",
    "NGO events",
    "volunteer registration",
  ],
  openGraph: { type: "website", siteName: SITE_NAME, title, description: SITE_DESCRIPTION, url: "/", locale: "en" },
  twitter: { card: "summary_large_image", title, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#047857" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${heading.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="container py-8">{children}</main>
      </body>
    </html>
  );
}
