import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import { getSiteData } from "@/data";

const pixelFont = VT323({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const SITE_DATA = getSiteData();
  
  return {
    title: {
      default: SITE_DATA.title,
      template: `%s | ${SITE_DATA.title}`,
    },
    description: SITE_DATA.description,
    authors: [{ name: SITE_DATA.author }],
    keywords: ["Computer Science", "Student", "Portfolio", "Software Engineer", "Web Development"],
    openGraph: {
      title: SITE_DATA.title,
      description: SITE_DATA.description,
      url: "https://example.com",
      siteName: SITE_DATA.title,
      locale: "en_US",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pixelFont.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
