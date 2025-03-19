import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navigation from "@/components/navigation"
import BackgroundElements from "@/components/background-elements"
import LoadingScreen from "@/components/loading-screen"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MomentumX | 见证每一次突破",
  description: "简洁易用的健身记录应用，追踪你的健身进度，激励你持续前进。",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LoadingScreen />
          <div className="flex flex-col min-h-screen bg-[#121212] text-white relative overflow-hidden">
            <BackgroundElements />
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-1">{children}</main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'