import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const font = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Side by Side",
  description: "Show two websites side by side",
  icons: [
    {
      sizes: "192x192",
      type: "image/png",
      url: "/android-chrome-192x192.png",
    },
    {
      sizes: "512x512",
      type: "image/png",
      url: "/android-chrome-512x512.png",
    },
  ],
};

export const viewport: Viewport = {
  height: "device-height",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${font.className} antialiased`}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_FIREBASE_MEASUREMENT_ID!} />
    </html>
  );
}
