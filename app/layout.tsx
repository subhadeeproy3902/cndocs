import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CN Docs - Comprehensive Networking Documentation",
  description: "A beautiful documentation site for computer networking and socket programming with clear explanations and practical examples.",
  keywords: [
    "computer networking",
    "socket programming",
    "TCP/IP",
    "OSI model",
    "networking documentation",
    "network protocols",
    "socket examples"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`overflow-x-hidden ${geistSans.variable} ${geistMono.variable} antialiased`}
      ><ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
