"use client"

import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"

export default function BackgroundElements() {
  const isMobile = useIsMobile()
  const [showAnimation, setShowAnimation] = useState(false)

  // Trigger animation when component mounts
  useEffect(() => {
    setShowAnimation(true)

    // Reset animation after it completes
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Dark overlay with 60% opacity */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Guanlan image with subtle effect */}
      <div className="absolute bottom-0 right-0 w-full md:w-1/3 h-full md:h-2/3 opacity-20 z-0 overflow-hidden">
        <div className="relative w-full h-full transform translate-y-8 md:translate-y-0 md:translate-x-8">
          <Image
            src="/images/guanlan.png"
            alt="Guanlan"
            fill
            className="object-contain object-bottom-right"
            style={{ objectPosition: 'bottom right' }}
          />
        </div>
      </div>

      {/* Basketball court lines */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-80 md:h-80 border-2 border-white rounded-full"></div>

        {/* Center line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-white"></div>

        {/* Three-point lines */}
        <div className="absolute top-1/4 left-0 w-1/3 h-1/2 border-2 border-white rounded-tr-full rounded-br-full border-l-0"></div>
        <div className="absolute top-1/4 right-0 w-1/3 h-1/2 border-2 border-white rounded-tl-full rounded-bl-full border-r-0"></div>

        {/* Free throw lines */}
        <div className="absolute top-1/3 left-0 w-1/4 h-1/3 border-2 border-white border-l-0"></div>
        <div className="absolute top-1/3 right-0 w-1/4 h-1/3 border-2 border-white border-r-0"></div>

        {/* Backboards */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-16 bg-white"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-16 bg-white"></div>
      </div>

      {/* Wood texture overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/wood-texture.svg')] opacity-10"></div>

      {/* Japanese quote (only on desktop) */}
      {!isMobile && (
        <div className="absolute bottom-4 right-4 text-white/20 text-sm italic z-0">あきらめたらそこで試合終了だよ</div>
      )}

      {/* Basketball trajectory animation */}
      <div
        className={`absolute z-0 transition-all duration-1000 ease-in-out ${showAnimation ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute top-3/4 left-1/4 w-8 h-8 rounded-full border-2 border-[#C62127] animate-bounce"></div>
        <div className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full border-2 border-[#C62127] animate-ping"></div>
      </div>
    </>
  )
}

