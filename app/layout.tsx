import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ycomma.com"),
  title: "YCOMMA | 당신의 비즈니스를 위한 All-Round 파트너",
  description: "비즈니스 부스팅 에이전시, 와이콤마",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "YCOMMA | 당신의 비즈니스를 위한 All-Round 파트너",
    description: "비즈니스 부스팅 에이전시, 와이콤마",
    url: "https://ycomma.com",
    siteName: "YCOMMA",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "YCOMMA Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YCOMMA | 당신의 비즈니스를 위한 All-Round 파트너",
    description: "비즈니스 부스팅 에이전시, 와이콤마",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
