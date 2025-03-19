"use client"

import { getWorkouts } from "@/lib/data"

// Simple className utility that doesn't depend on external packages
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })
}

export async function getDailyWorkoutStats() {
  const allWorkouts = await getWorkouts()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayWorkouts = allWorkouts.filter((workout) => {
    const workoutDate = new Date(workout.date)
    workoutDate.setHours(0, 0, 0, 0)
    return workoutDate.getTime() === today.getTime()
  })

  const totalWeight = todayWorkouts.reduce((sum, workout) => sum + workout.weight * workout.reps, 0)
  const maxWeight = todayWorkouts.length > 0 ? Math.max(...todayWorkouts.map((w) => w.weight)) : 0
  const exerciseTypes = new Set(todayWorkouts.map((w) => w.exercise))

  return {
    totalWeight,
    totalSets: todayWorkouts.length,
    maxWeight,
    exerciseCount: exerciseTypes.size,
  }
}

export async function getWeeklyWorkoutData() {
  const allWorkouts = await getWorkouts()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const result = []
  const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dayWorkouts = allWorkouts.filter((workout) => {
      const workoutDate = new Date(workout.date)
      workoutDate.setHours(0, 0, 0, 0)
      return workoutDate.getTime() === date.getTime()
    })

    const totalWeight = dayWorkouts.reduce((sum, workout) => sum + workout.weight * workout.reps, 0)

    result.push({
      date: date.toISOString().split("T")[0],
      dayName: dayNames[date.getDay()],
      totalWeight,
      totalSets: dayWorkouts.length,
    })
  }

  return result
}

export async function getMonthlyWorkoutData() {
  const allWorkouts = await getWorkouts()
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const result = []

  // Get the number of weeks in the current month
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const totalDays = lastDay.getDate()
  const totalWeeks = Math.ceil(totalDays / 7)

  for (let i = 0; i < totalWeeks; i++) {
    const weekStart = new Date(firstDay)
    weekStart.setDate(weekStart.getDate() + i * 7)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    if (weekEnd > lastDay) {
      weekEnd.setTime(lastDay.getTime())
    }

    const weekWorkouts = allWorkouts.filter((workout) => {
      const workoutDate = new Date(workout.date)
      return workoutDate >= weekStart && workoutDate <= weekEnd
    })

    const totalWeight = weekWorkouts.reduce((sum, workout) => sum + workout.weight * workout.reps, 0)

    result.push({
      name: `第${i + 1}周`,
      value: totalWeight,
    })
  }

  return result
}

export async function getQuarterlyWorkoutData() {
  const allWorkouts = await getWorkouts()
  const today = new Date()

  const result = []

  // Get data for past 90 days
  for (let i = 90; i >= 0; i -= 10) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dateStr = date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })

    const exercises = ["bench-press", "squat", "deadlift", "pull-up"]
    const exerciseData: Record<string, number> = {}

    // Calculate average weight for each exercise 5 days before and after this date
    exercises.forEach((exercise) => {
      const rangeWorkouts = allWorkouts.filter((workout) => {
        const workoutDate = new Date(workout.date)
        const dayDiff = Math.abs(Math.floor((workoutDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)))
        return dayDiff <= 5 && workout.exercise === exercise
      })

      if (rangeWorkouts.length > 0) {
        const maxWeight = Math.max(...rangeWorkouts.map((w) => w.weight))
        exerciseData[getExerciseName(exercise)] = maxWeight
      } else {
        exerciseData[getExerciseName(exercise)] = 0
      }
    })

    const dayWorkouts = allWorkouts.filter((workout) => {
      const workoutDate = new Date(workout.date)
      const dayDiff = Math.abs(Math.floor((workoutDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)))
      return dayDiff <= 5
    })

    result.push({
      date: dateStr,
      ...exerciseData,
      frequency: dayWorkouts.length,
      progress: Math.floor(Math.random() * 30) - 5, // Random progress for demo purposes
    })
  }

  return result
}

export async function getConsecutiveWorkoutDays() {
  const allWorkouts = await getWorkouts()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let consecutiveDays = 0

  for (let i = 0; i < 30; i++) {
    // Check up to 30 days back
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dayWorkouts = allWorkouts.filter((workout) => {
      const workoutDate = new Date(workout.date)
      workoutDate.setHours(0, 0, 0, 0)
      return workoutDate.getTime() === date.getTime()
    })

    if (dayWorkouts.length > 0) {
      consecutiveDays++
    } else {
      break
    }
  }

  return consecutiveDays
}

function getExerciseName(exerciseId: string): string {
  const names: Record<string, string> = {
    "bench-press": "卧推",
    squat: "深蹲",
    deadlift: "硬拉",
    "pull-up": "引体向上",
  }
  return names[exerciseId] || exerciseId
}

