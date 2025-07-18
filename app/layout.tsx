import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import SoundEffect from "@/components/SoundEffect"
import ScrollToTop from "@/components/ScrollToTop"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "LuxCR - Luxury Marketplace",
  description: "Encuentra productos y servicios de lujo en Costa Rica",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-background text-foreground min-h-screen">
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            {children}
            <SoundEffect />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
