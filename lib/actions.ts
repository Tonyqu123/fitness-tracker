"use client"

import { WorkoutCreateInput } from "@/db/dao/workoutDao";

export async function addWorkout(data: {
  exercise: string
  weight: number
  reps: number
}) {
  try {
    // 通过API将训练记录保存到数据库
    const response = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exercise: data.exercise,
        weight: data.weight,
        reps: data.reps,
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add workout');
    }

    // 刷新页面以更新UI
    window.location.reload();

    return { success: true };
  } catch (error) {
    console.error("Failed to add workout:", error);
    return { success: false, error: "Failed to add workout" };
  }
}

