import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ycomma.com"),
  title: "YCOMMA | \uB2F9\uC2E0\uC758 \uBE44\uC988\uB2C8\uC2A4\uB97C \uC704\uD55C All-Round \uD30C\uD2B8\uB108",
  description: "\uBE44\uC988\uB2C8\uC2A4 \uBD80\uC2A4\uD305 \uC5D0\uC774\uC804\uC2DC, \uC640\uC774\uCF64\uB9C8",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "YCOMMA | \uB2F9\uC2E0\uC758 \uBE44\uC988\uB2C8\uC2A4\uB97C \uC704\uD55C All-Round \uD30C\uD2B8\uB108",
    description: "\uBE44\uC988\uB2C8\uC2A4 \uBD80\uC2A4\uD305 \uC5D0\uC774\uC804\uC2DC, \uC640\uC774\uCF64\uB9C8",
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
    title: "YCOMMA | \uB2F9\uC2E0\uC758 \uBE44\uC988\uB2C8\uC2A4\uB97C \uC704\uD55C All-Round \uD30C\uD2B8\uB108",
    description: "\uBE44\uC988\uB2C8\uC2A4 \uBD80\uC2A4\uD305 \uC5D0\uC774\uC804\uC2DC, \uC640\uC774\uCF64\uB9C8",
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
