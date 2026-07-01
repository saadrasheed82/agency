import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Muhammad Saad Rashid — AI Automation Engineer & AI Creative Designer",
  description:
    "Building autonomous AI systems that smash operational bottlenecks. Turning 10-hour manual workflows into 3-minute automated engines.",
  keywords: [
    "AI Automation",
    "AI Engineer",
    "Paperclip",
    "Autonomous Agents",
    "Workflow Automation",
    "Muhammad Saad Rashid",
  ],
  authors: [{ name: "Muhammad Saad Rashid" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Muhammad Saad Rashid — AI Automation Engineer",
    description:
      "Building autonomous AI systems that smash operational bottlenecks.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <SiteFooter />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
