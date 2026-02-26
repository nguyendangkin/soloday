import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Solo Days — Đếm Ngày Solo",
  description:
    "Bạn đã solo bao lâu rồi? Đếm ngày, mở khóa thành tựu vui nhộn, và chia sẻ với bạn bè!",
  keywords: ["solo days", "đếm ngày", "single life", "fun counter", "achievements"],
  openGraph: {
    title: "Solo Days — Đếm Ngày Solo",
    description:
      "Đếm ngày solo, mở khóa thành tựu vui nhộn, chia sẻ với bạn bè!",
    type: "website",
    locale: "vi_VN",
    url: "https://solo-days.app",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "Solo Days — Đếm Ngày Solo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solo Days — Đếm Ngày Solo",
    description: "Đếm ngày solo, mở khóa thành tựu, chia sẻ niềm vui!",
    images: ["/icons/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Solo Days" />
        {/* PWA: chặn native prompt + đăng ký Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__deferredInstallPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__deferredInstallPrompt = e;
              });
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js');
              }
            `,
          }}
        />
      </head>
      <body className={inter.variable} style={{ fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
