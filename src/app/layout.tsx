import localFont from "next/font/local";
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/lenis-provider";
import GrainOverlay from "@/components/grain-overlay";
import PreloaderWrapper from "@/components/preloader-wrapper";
import { SITE_URL } from "@/data/site";

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
    template: "%s | Forae Factory",
    default: "Forae Factory",
  },
  description:
    "An independent digital design studio helping brands tell better stories through code and motion.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Forae Factory",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${googleSans.variable} ${playfair.variable} antialiased selection:bg-white selection:text-black`}
      >
        <PreloaderWrapper>
          <LenisProvider>
            <GrainOverlay />
            {children}
          </LenisProvider>
        </PreloaderWrapper>
      </body>
    </html>
  );
}
