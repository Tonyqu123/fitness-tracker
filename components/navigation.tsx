"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MoreVertical, Home, Calendar, BarChart, LineChart, Lightbulb } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const pathname = usePathname()
  const [title, setTitle] = useState("MomentumX")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Update title based on current path
    switch (pathname) {
      case "/":
        setTitle("MomentumX")
        break
      case "/weekly":
        setTitle("周训练热力图")
        break
      case "/monthly":
        setTitle("月度训练量")
        break
      case "/quarterly":
        setTitle("季度训练分析")
        break
      case "/tips":
        setTitle("健身小贴士")
        break
      default:
        setTitle("MomentumX")
    }
  }, [pathname])

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#121212]/80 backdrop-blur supports-[backdrop-filter]:bg-[#121212]/60">
        <div className="container flex h-14 items-center px-4">
          <h1 className="text-xl font-bold text-[#C62127]">{title}</h1>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-800">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>主页</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/weekly" className="flex items-center cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>周训练热力图</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/monthly" className="flex items-center cursor-pointer">
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>月度训练量</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/quarterly" className="flex items-center cursor-pointer">
                    <LineChart className="mr-2 h-4 w-4" />
                    <span>季度训练分析</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tips" className="flex items-center cursor-pointer">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    <span>健身小贴士</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/90 backdrop-blur supports-[backdrop-filter]:bg-[#121212]/70 border-t border-gray-800 md:hidden">
        <div className="grid grid-cols-5 h-16">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center text-xs",
              pathname === "/" ? "text-[#C62127]" : "text-gray-400",
            )}
          >
            <Home className="h-5 w-5 mb-1" />
            <span>主页</span>
          </Link>
          <Link
            href="/weekly"
            className={cn(
              "flex flex-col items-center justify-center text-xs",
              pathname === "/weekly" ? "text-[#C62127]" : "text-gray-400",
            )}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span>周视图</span>
          </Link>
          <Link
            href="/monthly"
            className={cn(
              "flex flex-col items-center justify-center text-xs",
              pathname === "/monthly" ? "text-[#C62127]" : "text-gray-400",
            )}
          >
            <BarChart className="h-5 w-5 mb-1" />
            <span>月视图</span>
          </Link>
          <Link
            href="/quarterly"
            className={cn(
              "flex flex-col items-center justify-center text-xs",
              pathname === "/quarterly" ? "text-[#C62127]" : "text-gray-400",
            )}
          >
            <LineChart className="h-5 w-5 mb-1" />
            <span>季视图</span>
          </Link>
          <Link
            href="/tips"
            className={cn(
              "flex flex-col items-center justify-center text-xs",
              pathname === "/tips" ? "text-[#C62127]" : "text-gray-400",
            )}
          >
            <Lightbulb className="h-5 w-5 mb-1" />
            <span>小贴士</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

