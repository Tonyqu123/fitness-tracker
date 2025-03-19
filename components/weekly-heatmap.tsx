"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { getWeeklyWorkoutData } from "@/lib/utils"
import NoDataPlaceholder from "@/components/no-data-placeholder"

export default function WeeklyHeatmap() {
  const [weekData, setWeekData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeeklyWorkoutData()
        setWeekData(data)
      } catch (error) {
        console.error("Failed to fetch weekly data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="h-64 rounded-lg bg-gray-800/50 animate-pulse" />
  }

  const hasData = weekData.some((day) => day.totalWeight > 0)
  const maxValue = Math.max(...weekData.map((day) => day.totalWeight))

  if (!hasData) {
    return <NoDataPlaceholder message="暂无周训练数据，继续努力！" />
  }

  return (
    <Card className="bg-gray-900/70 backdrop-blur border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-[#C62127]">
          <Calendar className="size-5" />
          <span>周训练热力图</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {weekData.map((day) => (
            <div key={day.date} className="grid grid-cols-7 items-center gap-2 group">
              <div className="text-sm text-gray-400">{day.dayName}</div>
              <div className="col-span-5 relative">
                <div className="h-10 w-full bg-gray-800 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-[#C62127] transition-all duration-500 ease-out group-hover:opacity-80"
                    style={{
                      width: maxValue ? `${(day.totalWeight / maxValue) * 100}%` : "0%",
                      opacity: day.totalWeight ? 0.2 + (day.totalWeight / maxValue) * 0.8 : 0.2,
                    }}
                  />
                </div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium bg-gray-800 px-2 py-1 rounded">{day.totalSets} 组训练</span>
                </div>
              </div>
              <div className="text-right font-medium text-white">{day.totalWeight}kg</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

