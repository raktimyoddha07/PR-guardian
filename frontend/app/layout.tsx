import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PR Guardian",
  description: "RAG-powered agentic GitHub PR management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
