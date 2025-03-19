"use client"

import { saveWorkout } from "@/lib/data"

export async function addWorkout(data: {
  exercise: string
  weight: number
  reps: number
}) {
  try {
    // Save workout to localStorage
    await saveWorkout({
      id: Date.now().toString(),
      exercise: data.exercise,
      weight: data.weight,
      reps: data.reps,
      date: new Date().toISOString(),
    })

    // Force a refresh to update the UI
    window.location.reload()

    return { success: true }
  } catch (error) {
    console.error("Failed to add workout:", error)
    return { success: false, error: "Failed to add workout" }
  }
}

