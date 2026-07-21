import type { Metadata } from "next";
import PwaInstaller from "@/components/PwaInstaller";
import "./globals.css";
export const metadata: Metadata = {
  title: "Dutch Vocabulary Flashcards",
  description: "CEFR-aligned Dutch vocabulary practice for English speakers.",
  manifest: "/manifest.webmanifest",
  themeColor: "#4f46e5",
  appleWebApp: {
    capable: true,
    title: "Dutch Cards",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/icon.svg",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PwaInstaller />
        {children}
      </body>
    </html>
  );
}
