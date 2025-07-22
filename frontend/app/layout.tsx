import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CollabForge",
  description: "Created by Wolfy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
