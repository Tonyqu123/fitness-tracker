"use client"

import { useEffect, useState } from "react"
import { getConsecutiveWorkoutDays } from "@/lib/utils"

export default function JapaneseQuote() {
  const [showQuote, setShowQuote] = useState(false)
  const [consecutiveDays, setConsecutiveDays] = useState(0)

  useEffect(() => {
    const checkConsecutiveDays = async () => {
      const days = await getConsecutiveWorkoutDays()
      setConsecutiveDays(days)
      setShowQuote(days >= 3)
    }

    checkConsecutiveDays()
  }, [])

  if (!showQuote) return null

  return (
    <div className="text-right text-sm italic text-white/40 pr-4">
      <p className="font-light">俺は今なんだ…バスケが好きかもしれない…</p>
      <p className="text-xs mt-1 text-white/30">我好像现在…有点喜欢篮球了</p>
    </div>
  )
}

