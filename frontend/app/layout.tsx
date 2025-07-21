import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CollabForge App',
  description: 'Created by CollabForge Team',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
