"use client"

export interface WorkoutRecord {
  id: string
  exercise: string
  weight: number
  reps: number
  date: string
}

const STORAGE_KEY = "fitness-tracker-workouts"

export async function getWorkouts(): Promise<WorkoutRecord[]> {
  // In client components, we can use localStorage
  if (typeof window !== "undefined") {
    const storedWorkouts = localStorage.getItem(STORAGE_KEY)
    if (storedWorkouts) {
      return JSON.parse(storedWorkouts)
    }
  }

  // Return sample data if no stored workouts or running on server
  return getSampleWorkouts()
}

export async function saveWorkout(workout: WorkoutRecord): Promise<void> {
  if (typeof window !== "undefined") {
    const workouts = await getWorkouts()
    workouts.push(workout)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts))
  }
}

function getSampleWorkouts(): WorkoutRecord[] {
  const workouts: WorkoutRecord[] = []
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Generate some sample data for the past 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Skip some days to make the data more realistic
    if (Math.random() > 0.7) continue

    const exercises = ["bench-press", "squat", "deadlift", "pull-up"]
    const exerciseCount = Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < exerciseCount; j++) {
      const exercise = exercises[Math.floor(Math.random() * exercises.length)]
      const weight = Math.floor(Math.random() * 50) + 20
      const reps = Math.floor(Math.random() * 10) + 1

      workouts.push({
        id: `sample-${i}-${j}`,
        exercise,
        weight,
        reps,
        date: date.toISOString(),
      })
    }
  }

  return workouts
}

