"use client"

import { useState, useEffect, useCallback } from "react"

export function useTrainingEffect() {
  const [showEffect, setShowEffect] = useState(false)

  const triggerEffect = useCallback(() => {
    setShowEffect(true)

    // Reset effect after animation completes
    setTimeout(() => {
      setShowEffect(false)
    }, 1500)
  }, [])

  // Create the effect element when triggered
  useEffect(() => {
    if (!showEffect) return

    // Create basketball animation
    const ball = document.createElement("div")
    ball.className = "fixed z-50 w-8 h-8 rounded-full bg-[#C62127] shadow-lg"
    ball.style.left = `${Math.random() * 70 + 15}%`
    ball.style.top = "100%"
    ball.style.transition = "all 1.5s cubic-bezier(0.2, -0.6, 0.7, 1)"
    document.body.appendChild(ball)

    // Animate the ball
    setTimeout(() => {
      ball.style.top = "10%"
    }, 10)

    // Remove the ball after animation
    setTimeout(() => {
      document.body.removeChild(ball)
    }, 1500)

    return () => {
      if (document.body.contains(ball)) {
        document.body.removeChild(ball)
      }
    }
  }, [showEffect])

  return { triggerEffect }
}

