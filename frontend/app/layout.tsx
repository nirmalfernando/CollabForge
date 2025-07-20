import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CollabForge App',
  description: 'Created with CollabForge',
  generator: 'CollabForge.dev',
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
