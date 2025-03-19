"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "lucide-react"
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { getQuarterlyWorkoutData } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NoDataPlaceholder from "@/components/no-data-placeholder"

export default function QuarterlyStats() {
  const [quarterData, setQuarterData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getQuarterlyWorkoutData()
        setQuarterData(data)
      } catch (error) {
        console.error("Failed to fetch quarterly data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="h-80 rounded-lg bg-gray-800/50 animate-pulse" />
  }

  const hasData = quarterData.some(
    (item) => item.卧推 > 0 || item.深蹲 > 0 || item.硬拉 > 0 || item.引体向上 > 0 || item.frequency > 0,
  )

  if (!hasData) {
    return <NoDataPlaceholder message="暂无季度训练数据，继续努力！" />
  }

  return (
    <Card className="bg-gray-900/70 backdrop-blur border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#C62127]">
          <LineChart className="size-5" />
          <span>季度训练分析</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="volume" className="w-full">
          <TabsList className="mb-4 bg-gray-800 text-gray-400">
            <TabsTrigger value="volume" className="data-[state=active]:bg-[#C62127] data-[state=active]:text-white">
              训练重量
            </TabsTrigger>
            <TabsTrigger value="frequency" className="data-[state=active]:bg-[#C62127] data-[state=active]:text-white">
              训练频率
            </TabsTrigger>
            <TabsTrigger
              value="progression"
              className="data-[state=active]:bg-[#C62127] data-[state=active]:text-white"
            >
              训练进步
            </TabsTrigger>
          </TabsList>

          <TabsContent value="volume" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={quarterData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickMargin={10}
                  stroke="#9CA3AF"
                />
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
                  labelStyle={{ color: "white" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
                {["卧推", "深蹲", "硬拉", "引体向上"].map((exercise, index) => (
                  <Line
                    key={exercise}
                    type="monotone"
                    dataKey={exercise}
                    name={exercise}
                    stroke={getLineColor(index)}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </RechartsLineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="frequency" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={quarterData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickMargin={10}
                  stroke="#9CA3AF"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickMargin={10}
                  tickFormatter={(value) => `${value}次`}
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
                  labelStyle={{ color: "white" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="frequency"
                  name="训练次数"
                  stroke="#C62127"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="progression" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={quarterData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickMargin={10}
                  stroke="#9CA3AF"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tickMargin={10}
                  tickFormatter={(value) => `${value}%`}
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
                  labelStyle={{ color: "white" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="progress"
                  name="进步百分比"
                  stroke="#00C49A"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function getLineColor(index: number) {
  const colors = ["#C62127", "#2E5C9D", "#00C49A", "#845EC2"]
  return colors[index % colors.length]
}

