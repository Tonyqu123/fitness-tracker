"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { getRandomFitnessTip } from "@/lib/fitness-tips"

export default function FitnessTips() {
  const [tip, setTip] = useState({ title: "", content: "" })

  useEffect(() => {
    setTip(getRandomFitnessTip())
  }, [])

  return (
    <Card className="bg-gray-900 border-gray-800 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-[#FF6B35]">
          <Lightbulb className="size-5" />
          <span>健身小贴士</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-medium text-white">{tip.title}</h3>
          <p className="text-sm text-gray-400">{tip.content}</p>
        </div>
      </CardContent>
    </Card>
  )
}

