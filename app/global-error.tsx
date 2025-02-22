'use client'

import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#1E1F25] min-h-screen`}>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h2 className="text-2xl font-semibold text-red-500">Something went wrong!</h2>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-[#2D9CDB] hover:bg-[#2D9CDB]/90 text-white rounded-xl transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}