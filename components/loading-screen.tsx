"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <Image src="/images/mitsui-shooting.png" alt="Basketball player shooting" fill className="object-contain" />
          </div>

          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "80%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 h-1 bg-[#C62127] rounded-full"
          />

          <div className="absolute bottom-10 text-white text-xl font-bold">MomentumX</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

