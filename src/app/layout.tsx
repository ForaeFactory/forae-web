import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import GrainOverlay from "@/components/grain-overlay";
import PreloaderWrapper, { INTRO_SKIP_SCRIPT } from "@/components/preloader-wrapper";
import Providers from "@/components/providers";
import JsonLd from "@/components/json-ld";
import { organizationSchema } from "@/data/structured-data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/data/site";

const googleSans = localFont({
  src: "./fonts/GoogleSansFlex-latin.woff2",
  variable: "--font-google-sans",
  weight: "1 1000",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME}: creative direction, brand and WebGL studio in Austin`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    images: [{ url: "/images/og/home.jpg", width: 1200, height: 630, alt: `${SITE_NAME}, creative studio in Austin, Texas` }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the intro script may set data-intro before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SKIP_SCRIPT }} />
      </head>
      <body
        className={`${googleSans.variable} ${playfair.variable} antialiased selection:bg-white selection:text-black`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={organizationSchema()} />
        <Providers>
          <PreloaderWrapper>
            <GrainOverlay />
            {children}
          </PreloaderWrapper>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
