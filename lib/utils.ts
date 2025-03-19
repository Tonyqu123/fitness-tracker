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

// 格式化时间为 HH:MM 格式
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
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
      
      const dayWorkouts = allWorkouts.filter((workout: any) => {
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
      const totalWeight = dayWorkouts.reduce((sum: number, workout: any) => sum + workout.weight, 0);
      const totalSets = dayWorkouts.length;

      result.push({
        dayName: dayNames[dayOfWeek],
        date: date.toISOString().split("T")[0], // YYYY-MM-DD format
        totalWeight: Math.max(totalWeight, 0), // Ensure non-negative value
        totalSets: totalSets
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
        dayName: dayNames[dayOfWeek],
        date: date.toISOString().split("T")[0],
        totalWeight: 0,
        totalSets: 0
      });
    }
    
    return result;
  }
}

export async function getMonthlyWorkoutData() {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Calculate first and last day of the month
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  
  try {
    // Format dates for API call
    const startDateParam = encodeURIComponent(firstDay.toISOString());
    const endDateParam = encodeURIComponent(lastDay.toISOString());
    
    console.log('Fetching monthly data with date range:', { startDateParam, endDateParam });
    
    // Fetch workouts for the current month
    const response = await fetch(`/api/workouts?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed response from workouts API:', response.status, errorData);
      throw new Error(`Failed to fetch monthly workout data: ${response.status}`);
    }

    const data = await response.json();
    const allWorkouts = data.workouts;
    
    const result = []
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

      const weekWorkouts = allWorkouts.filter((workout: any) => {
        try {
          const workoutDate = new Date(workout.date)
          return !isNaN(workoutDate.getTime()) && workoutDate >= weekStart && workoutDate <= weekEnd
        } catch (error) {
          console.error("Error filtering workout:", workout, error)
          return false
        }
      })

      const totalWeight = weekWorkouts.reduce((sum: number, workout: any) => {
        try {
          return sum + (Number(workout.weight))
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

    return result;
  } catch (error) {
    console.error('Error fetching monthly workout data:', error);
    
    // Return empty data for all weeks in the month
    const result = []
    const totalDays = lastDay.getDate()
    const totalWeeks = Math.ceil(totalDays / 7)
    
    for (let i = 0; i < totalWeeks; i++) {
      result.push({
        name: `第${i + 1}周`,
        value: 0,
      })
    }
    
    return result;
  }
}

export async function getQuarterlyWorkoutData() {
  const today = new Date()
  
  // Calculate date 90 days ago
  const ninetyDaysAgo = new Date(today)
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  
  try {
    // Format dates for API call
    const startDateParam = encodeURIComponent(ninetyDaysAgo.toISOString());
    const endDateParam = encodeURIComponent(today.toISOString());
    
    console.log('Fetching quarterly data with date range:', { startDateParam, endDateParam });
    
    // Fetch workouts for the last 90 days
    const response = await fetch(`/api/workouts?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed response from workouts API:', response.status, errorData);
      throw new Error(`Failed to fetch quarterly workout data: ${response.status}`);
    }

    const data = await response.json();
    const allWorkouts = data.workouts;
    
    const result = []

    // Get data for past 90 days in 10-day increments
    for (let i = 90; i >= 0; i -= 10) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const dateStr = date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })

      // Get all exercises from this period
      const periodStart = new Date(date)
      periodStart.setDate(periodStart.getDate() - 5)
      const periodEnd = new Date(date)
      periodEnd.setDate(periodEnd.getDate() + 5)
      
      // Filter workouts for this period
      const periodWorkouts = allWorkouts.filter((workout: any) => {
        try {
          const workoutDate = new Date(workout.date)
          return workoutDate >= periodStart && workoutDate <= periodEnd
        } catch (error) {
          console.error("Error filtering workout for period:", workout, error)
          return false
        }
      })
      
      // Get unique exercises in this period
      const exercises = Array.from(new Set(periodWorkouts.map((w: any) => w.exerciseId)))
      const exerciseData: Record<string, number> = {}
      
      // Calculate max weight for each exercise in this period
      exercises.forEach((exerciseId: unknown) => {
        const exerciseWorkouts = periodWorkouts.filter((w: any) => w.exerciseId === exerciseId)
        
        if (exerciseWorkouts.length > 0) {
          const maxWeight = Math.max(...exerciseWorkouts.map((w: any) => w.weight))
          exerciseData[getExerciseName(exerciseId as string)] = maxWeight
        }
      })
      
      // Add default exercises if they don't exist in the data
      const defaultExercises = ["bench-press", "squat", "deadlift", "pull-up"]
      defaultExercises.forEach((exercise) => {
        if (!(getExerciseName(exercise) in exerciseData)) {
          exerciseData[getExerciseName(exercise)] = 0
        }
      })

      result.push({
        date: dateStr,
        ...exerciseData,
        frequency: periodWorkouts.length,
        // Use real data for progress instead of random values
        progress: calculateProgress(periodWorkouts),
      })
    }

    return result
  } catch (error) {
    console.error('Error fetching quarterly workout data:', error);
    return generateEmptyQuarterlyData();
  }
}

// Helper function to calculate progress
function calculateProgress(workouts: any[]): number {
  if (workouts.length < 2) return 0;
  
  // Sort workouts by date
  const sortedWorkouts = [...workouts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
  
  // Calculate average weight of first half vs second half
  const midpoint = Math.floor(sortedWorkouts.length / 2);
  const firstHalf = sortedWorkouts.slice(0, midpoint);
  const secondHalf = sortedWorkouts.slice(midpoint);
  
  const firstHalfAvg = firstHalf.reduce((sum, w) => sum + w.weight, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, w) => sum + w.weight, 0) / secondHalf.length;
  
  // Calculate percentage change
  if (firstHalfAvg === 0) return 0;
  const percentChange = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  
  // Cap at ±30%
  return Math.max(-30, Math.min(30, Math.round(percentChange)));
}

// Helper function to generate empty quarterly data
function generateEmptyQuarterlyData() {
  const today = new Date();
  const result = [];
  
  for (let i = 90; i >= 0; i -= 10) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
    
    result.push({
      date: dateStr,
      "卧推": 0,
      "深蹲": 0,
      "硬拉": 0,
      "引体向上": 0,
      frequency: 0,
      progress: 0,
    });
  }
  
  return result;
}

export async function getConsecutiveWorkoutDays() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  try {
    // Format dates for API call
    const startDateParam = encodeURIComponent(thirtyDaysAgo.toISOString());
    const endDateParam = encodeURIComponent(today.toISOString());
    
    console.log('Fetching consecutive days data with date range:', { startDateParam, endDateParam });
    
    // Fetch workouts for the last 30 days
    const response = await fetch(`/api/workouts?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed response from workouts API:', response.status, errorData);
      throw new Error(`Failed to fetch consecutive days data: ${response.status}`);
    }

    const data = await response.json();
    const allWorkouts = data.workouts;
    
    let consecutiveDays = 0

    for (let i = 0; i < 30; i++) {
      // Check up to 30 days back
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const dayWorkouts = allWorkouts.filter((workout: any) => {
        try {
          const workoutDate = new Date(workout.date)
          workoutDate.setHours(0, 0, 0, 0)
          return workoutDate.getTime() === date.getTime()
        } catch (error) {
          console.error('Error parsing workout date:', workout.date, error)
          return false
        }
      })

      if (dayWorkouts.length > 0) {
        consecutiveDays++
      } else {
        break
      }
    }

    return consecutiveDays
  } catch (error) {
    console.error('Error fetching consecutive workout days:', error);
    return 0;
  }
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

