import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Suspense } from 'react'
import Loading from '@/components/Loading'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-6 w-6" />
                <span className="text-xl font-bold">PriceHunter</span>
              </div>
              <nav className="hidden md:flex gap-6">
                <Link href="/#" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link
                  href="/#how-it-works"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  How It Works
                </Link>
                <Link
                  href="/#popular"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Popular Deals
                </Link>

              </nav>
              <div className="w-32"></div>
            </div>
          </header>
          <Suspense fallback={<Loading/>}>
            {children}
          </Suspense>
          <footer className="w-full border-t py-6 md:py-0">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16 px-4 md:px-6">
              <p className="text-sm text-muted-foreground">© 2025 PriceHunter. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
