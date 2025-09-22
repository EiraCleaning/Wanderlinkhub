import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import "../styles/theme.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WanderLink Hub - Family-Friendly Events & Hubs",
  description: "Discover family-friendly events and hubs around the world. Find activities, workshops, and safe spaces for families with children.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WanderLink Hub",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2E5D50",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts - Direct Import */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Force Font Application */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              font-family: 'Inter', system-ui, sans-serif !important;
            }
            
            h1, h2, h3, h4, h5, h6, .brand-heading, .brand-title {
              font-family: 'Poppins', 'Inter', system-ui, sans-serif !important;
            }
            
            .brand-subtitle, .brand-body {
              font-family: 'Inter', system-ui, sans-serif !important;
            }
          `
        }} />
        
        {/* Temporarily disabled service worker for development debugging */}
        {/*
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        */}
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased bg-[var(--wl-beige)] text-[var(--wl-ink)] min-h-screen`}
        style={{
          fontFamily: "'Inter', system-ui, sans-serif"
        }}
      >
        {children}
      </body>
    </html>
  );
}
