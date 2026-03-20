import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YCOMMA CMS MVP",
  description: "YCOMMA corporate site content management prototype",
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
