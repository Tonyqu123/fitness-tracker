"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

export default function HeroBanner() {
  const [showBanner, setShowBanner] = useState(true)
  const [currentImage, setCurrentImage] = useState("mitsui")
  const isMobile = useIsMobile()

  // Hide banner after user has seen it once in this session
  useEffect(() => {
    const hasSeenBanner = sessionStorage.getItem("hasSeenBanner")
    if (hasSeenBanner) {
      setShowBanner(false)
    } else {
      sessionStorage.setItem("hasSeenBanner", "true")
    }
  }, [])

  if (!showBanner) return null

  return (
    <div className="relative w-full overflow-hidden rounded-xl mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-[#C62127]/90 to-[#C62127]/40 z-10"></div>

      <div className="relative aspect-[16/9] md:aspect-[21/9]">
        {currentImage === "mitsui" ? (
          <Image
            src="/images/mitsui-shooting.png"
            alt="Basketball player shooting"
            fill
            className="object-contain object-right"
            priority
          />
        ) : (
          <Image
            src="/images/guanlan.png"
            alt="Guanlan"
            fill
            className="object-contain object-right"
            priority
          />
        )}
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center z-20 p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">突破自我极限</h2>
          <p className="text-white/90 text-sm md:text-base mb-4 drop-shadow-md">
            每一次训练都是向更强大的自己迈进的一步
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBanner(false)}
              className="bg-white text-[#C62127] px-4 py-2 rounded-md font-medium hover:bg-white/90 transition-colors"
            >
              开始训练
            </button>
            <button
              onClick={() => setCurrentImage(currentImage === "mitsui" ? "guanlan" : "mitsui")}
              className="bg-white/20 text-white px-3 py-2 rounded-md font-medium hover:bg-white/30 transition-colors"
            >
              切换图片
            </button>
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => setShowBanner(false)}
        className="absolute top-3 right-3 z-30 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  )
}

