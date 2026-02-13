import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QueryQuest – SQL Trainer",
  description: "A browser-based SQL learning game built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vt323.variable} antialiased bg-black text-green-500`}
      >
        {children}
        <Script src="/sql-wasm.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
