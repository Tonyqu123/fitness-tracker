"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { formatTime } from "@/lib/utils"

interface WorkoutDetail {
  id: string
  exerciseName: string
  weight: number
  reps: number
  date: Date
}

export default function DailyWorkoutDetails() {
  const [workouts, setWorkouts] = useState<WorkoutDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // 获取今天的开始和结束时间
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // 格式化日期，避免直接使用toISOString
        const startDateParam = encodeURIComponent(today.toISOString())
        const endDateParam = encodeURIComponent(tomorrow.toISOString())
        
        // 获取今日的训练记录
        const response = await fetch(`/api/workouts?startDate=${startDateParam}&endDate=${endDateParam}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch workouts: ${response.status}`)
        }

        const data = await response.json()
        setWorkouts(data.workouts)
      } catch (error) {
        console.error('Error fetching daily workouts:', error)
        setWorkouts([])
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  if (loading) {
    return (
      <Card className="bg-gray-900/70 backdrop-blur border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Dumbbell className="mr-2 h-5 w-5 text-[#C62127]" />
            今日训练详情
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-[#C62127]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (workouts.length === 0) {
    return (
      <Card className="bg-gray-900/70 backdrop-blur border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Dumbbell className="mr-2 h-5 w-5 text-[#C62127]" />
            今日训练详情
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="h-10 w-10 text-gray-500 mb-3" />
            <p className="text-gray-400">今天还没有训练记录</p>
            <p className="text-sm text-gray-500 mt-1">点击右下角"+"按钮开始记录</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/70 backdrop-blur border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Dumbbell className="mr-2 h-5 w-5 text-[#C62127]" />
          今日训练详情
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 pr-4">
          <div className="space-y-4">
            {workouts.map((workout, index) => {
              const workoutTime = new Date(workout.date)
              return (
                <div key={workout.id} className="bg-gray-800/50 rounded-lg p-3 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[#00C49A] mr-2" />
                      <span className="font-medium text-white">{workout.exerciseName}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTime(workoutTime)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">组数 {index + 1}</span>
                    <div>
                      <span className="text-[#C62127] font-medium">{workout.weight} kg</span>
                      <span className="text-gray-400 mx-1">×</span>
                      <span className="text-white">{workout.reps} 次</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 