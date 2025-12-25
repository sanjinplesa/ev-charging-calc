import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plugrate - EV Charging Calculator',
  description: 'Calculate your EV charging costs with Plugrate',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

