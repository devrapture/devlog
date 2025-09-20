import { MainLayout } from "@/components/layout/main-layout";
import Provider from "@/components/provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,

  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Provider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
