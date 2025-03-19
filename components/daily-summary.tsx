"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Flame, TrendingUp, Trophy, Dumbbell } from "lucide-react"
import { getDailyWorkoutStats } from "@/lib/utils"
import DailyWorkoutDetails from "./daily-workout-details"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function DailySummary() {
  const [stats, setStats] = useState({
    totalWeight: 0,
    totalSets: 0,
    maxWeight: 0,
    exerciseCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDailyWorkoutStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch daily stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="h-52 grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg bg-gray-800/50 animate-pulse" />
        ))}
      </div>
    )
  }

  const hasWorkouts = stats.totalSets > 0

  if (!hasWorkouts) {
    return (
      <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <Dumbbell className="h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">今天还没有训练记录</h3>
          <p className="text-gray-400">点击右下角的"+"按钮，快去完成第一次训练吧！</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild>
          <div className="grid grid-cols-2 gap-3 cursor-pointer" onClick={() => setDetailsOpen(true)}>
            <Card className="bg-gray-900/70 backdrop-blur border-gray-800 card-glow hover:bg-gray-800/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Flame className="size-8 text-[#C62127] mb-1" />
                  <span className="text-xs text-gray-400">今日总训练重量</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white tabular-nums">{stats.totalWeight}</span>
                    <span className="text-sm ml-1 text-gray-400">kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 backdrop-blur border-gray-800 card-glow hover:bg-gray-800/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Activity className="size-8 text-[#2E5C9D] mb-1" />
                  <span className="text-xs text-gray-400">今日总组数</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white tabular-nums">{stats.totalSets}</span>
                    <span className="text-sm ml-1 text-gray-400">组</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 backdrop-blur border-gray-800 card-glow hover:bg-gray-800/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <Trophy className="size-8 text-amber-500 mb-1" />
                  <span className="text-xs text-gray-400">今日最大重量</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white tabular-nums">{stats.maxWeight}</span>
                    <span className="text-sm ml-1 text-gray-400">kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/70 backdrop-blur border-gray-800 card-glow hover:bg-gray-800/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="size-8 text-[#00C49A] mb-1" />
                  <span className="text-xs text-gray-400">今日完成训练</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white tabular-nums">{stats.exerciseCount}</span>
                    <span className="text-sm ml-1 text-gray-400">动作</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">今日训练详情</DialogTitle>
          </DialogHeader>
          <DailyWorkoutDetails />
        </DialogContent>
      </Dialog>
    </>
  )
}

