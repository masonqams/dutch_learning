import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Dutch Vocabulary Flashcards",
  description: "CEFR-aligned Dutch vocabulary practice for English speakers.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
