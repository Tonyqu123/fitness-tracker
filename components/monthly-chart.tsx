"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getMonthlyWorkoutData } from "@/lib/utils"
import { useEffect, useState } from "react"
import NoDataPlaceholder from "@/components/no-data-placeholder"

export default function MonthlyChart() {
  const [monthData, setMonthData] = useState<Array<{ name: string; value: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonthlyWorkoutData()
        setMonthData(data)
      } catch (error) {
        console.error("Failed to fetch monthly data:", error)
        // Still set empty data to avoid infinite loading state
        setMonthData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="h-64 rounded-lg bg-gray-800/50 animate-pulse" />
  }

  const hasData = monthData.some((item) => item.value > 0)

  if (!hasData) {
    return <NoDataPlaceholder message="暂无月度训练数据，继续努力！" />
  }

  return (
    <Card className="bg-gray-900/70 backdrop-blur border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-[#C62127]">
          <BarChart className="size-5" />
          <span>月度训练量</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={monthData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={10} stroke="#9CA3AF" />
              <YAxis
                axisLine={false}
                tickLine={false}
                fontSize={12}
                tickMargin={10}
                tickFormatter={(value) => `${value}kg`}
                stroke="#9CA3AF"
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(17, 24, 39, 0.9)",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  padding: "8px",
                  color: "white",
                }}
                formatter={(value) => [`${value}kg`, "训练重量"]}
                labelStyle={{ color: "white" }}
                cursor={{ fill: "rgba(198, 33, 39, 0.1)" }}
              />
              <Bar dataKey="value" fill="#C62127" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

