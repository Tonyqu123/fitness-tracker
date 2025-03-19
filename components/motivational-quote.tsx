"use client"

import { useEffect, useState } from "react"
import { getRandomMotivationalQuote } from "@/lib/motivational-quotes"

export default function MotivationalQuote() {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    setQuote(getRandomMotivationalQuote())
  }, [])

  return (
    <div className="flex items-center justify-center">
      <blockquote className="text-lg font-medium text-center italic text-white/90 bg-gray-900/50 backdrop-blur p-4 rounded-lg border-l-4 border-[#C62127]">
        "{quote}"
      </blockquote>
    </div>
  )
}

