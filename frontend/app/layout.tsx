import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CollabForge',
  description: 'Created with CollabForge',
  generator: 'CollabForge',
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
