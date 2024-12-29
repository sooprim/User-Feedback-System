import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'User Feedback System',
  description: 'Allows for users to rate and comment on movies and TV shows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <header className="bg-gray-100 dark:bg-gray-800 py-4">
          <nav className="container mx-auto px-4">
            <ul className="flex justify-center space-x-6">
              <li>
                <Link href="/" className="text-foreground hover:opacity-80">Home</Link>
              </li>
              <li>
                <Link href="/users" className="text-foreground hover:opacity-80">Users</Link>
              </li>
              <li>
                <Link href="/movies" className="text-foreground hover:opacity-80">Movies</Link>
              </li>
              <li>
                <Link href="/comments" className="text-foreground hover:opacity-80">Comments</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
        <footer className="bg-gray-100 dark:bg-gray-800 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Jovan Tone 5618
        </footer>
      </body>
    </html>
  )
}

