import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/lib/i18n";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mafqudati.app";

export const metadata: Metadata = {
  title: "مفقوداتي | Mafqudati - اعثر على أشيائك المفقودة",
  description:
    "مجتمع يساعد بعضه البعض لاستعادة الأشياء المفقودة. A community helping each other recover lost items. Find and report lost & found belongings.",
  keywords: [
    "مفقوداتي",
    "أشياء مفقودة",
    "أشياء موجودة",
    "lost and found",
    "mafqudati",
    "مفقودات",
    "استرجاع الأشياء",
    "find lost items",
    "report found items",
    "lost belongings",
    "found belongings",
    "Egypt lost and found",
    "القاهرة مفقودات",
    "مصر مفقودات",
  ],
  authors: [{ name: "Mafqudati" }],
  creator: "Mafqudati",
  publisher: "Mafqudati",
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
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    title: "مفقوداتي | Mafqudati - اعثر على أشيائك المفقودة",
    description:
      "مجتمع يساعد بعضه البعض لاستعادة الأشياء المفقودة",
    url: siteUrl,
    siteName: "مفقوداتي | Mafqudati",
    locale: "ar_EG",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "مفقوداتي - اعثر على أشيائك المفقودة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مفقوداتي | Mafqudati - اعثر على أشيائك المفقودة",
    description:
      "مجتمع يساعد بعضه البعض لاستعادة الأشياء المفقودة",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="canonical" href={siteUrl} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <I18nProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </I18nProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
