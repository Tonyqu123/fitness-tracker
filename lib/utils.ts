"use client"

import { WorkoutWithExercise } from "@/db/dao/workoutDao"
import { getWorkouts } from "./data";

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

// 获取当天的训练统计数据
export async function getDailyWorkoutStats() {
  try {
    // Create a valid date object and format it safely
    const currentDate = new Date();
    // Use a safer date format string rather than directly calling toISOString
    const dateParam = encodeURIComponent(currentDate.toISOString());
    
    console.log('Fetching daily stats with date:', dateParam);
    
    const response = await fetch(`/api/workouts/stats?date=${dateParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed response from stats API:', response.status, errorData);
      throw new Error(`Failed to fetch daily stats: ${response.status}`);
    }

    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    return {
      totalWeight: 0,
      totalSets: 0,
      maxWeight: 0,
      exerciseCount: 0,
    };
  }
}

// 获取周训练数据
export async function getWeeklyWorkoutData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const result = []
  const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

  // 计算一周前的日期
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 6)

  try {
    // 格式化日期，避免直接使用toISOString
    const startDateParam = encodeURIComponent(weekAgo.toISOString());
    const endDateParam = encodeURIComponent(new Date().toISOString());
    
    console.log('Fetching weekly data with date range:', { startDateParam, endDateParam });
    
    // 获取过去一周的训练记录
    const response = await fetch(`/api/workouts?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed response from workouts API:', response.status, errorData);
      throw new Error(`Failed to fetch weekly workout data: ${response.status}`);
    }

    const data = await response.json();
    const allWorkouts = data.workouts;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Safely convert date objects
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      const dayWorkouts = allWorkouts.filter((workout) => {
        try {
          const workoutDate = new Date(workout.date);
          workoutDate.setHours(0, 0, 0, 0);
          return workoutDate.getTime() === targetDate.getTime();
        } catch (error) {
          console.error('Error parsing workout date:', workout.date, error);
          return false;
        }
      });

      const dayOfWeek = date.getDay();
      const value = dayWorkouts.reduce((sum, workout) => sum + workout.weight, 0);

      result.push({
        day: dayNames[dayOfWeek],
        date: date.toISOString().split("T")[0], // YYYY-MM-DD format
        value: Math.max(value, 0), // Ensure non-negative value
      });
    }

    return result;
  } catch (error) {
    console.error('Error fetching weekly workout data:', error);
    
    // 返回一周的空数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const dayOfWeek = date.getDay()
      
      result.push({
        day: dayNames[dayOfWeek],
        date: date.toISOString().split("T")[0],
        value: 0,
      });
    }
    
    return result;
  }
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
      try {
        const workoutDate = new Date(workout.date)
        return !isNaN(workoutDate.getTime()) && workoutDate >= weekStart && workoutDate <= weekEnd
      } catch (error) {
        console.error("Error filtering workout:", workout, error)
        return false
      }
    })

    const totalWeight = weekWorkouts.reduce((sum, workout) => {
      try {
        return sum + (Number(workout.weight) * Number(workout.reps))
      } catch (error) {
        console.error("Error calculating weight:", workout, error)
        return sum
      }
    }, 0)

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

