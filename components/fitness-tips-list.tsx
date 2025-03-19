"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { getAllFitnessTips } from "@/lib/fitness-tips"

export default function FitnessTipsList() {
  const [tips, setTips] = useState<Array<{ title: string; content: string }>>([])

  useEffect(() => {
    setTips(getAllFitnessTips())
  }, [])

  return (
    <div className="space-y-4">
      {tips.map((tip, index) => (
        <Card key={index} className="bg-gray-900/70 backdrop-blur border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="size-4 text-[#C62127]" />
              <span>{tip.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">{tip.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

