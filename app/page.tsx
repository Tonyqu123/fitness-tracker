import { Suspense } from "react"
import DailySummary from "@/components/daily-summary"
import MotivationalQuote from "@/components/motivational-quote"
import WorkoutFormModal from "@/components/workout-form-modal"
import JapaneseQuote from "@/components/japanese-quote"
import HeroBanner from "@/components/hero-banner"

export default function Home() {
  return (
    <div className="container px-4 py-6 pb-20 md:pb-6">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Today's Workout Summary */}
      <Suspense fallback={<div className="h-52 rounded-lg bg-gray-800/50 animate-pulse" />}>
        <DailySummary />
      </Suspense>

      {/* Motivational Quote */}
      <div className="mt-8">
        <MotivationalQuote />
      </div>

      {/* Japanese Quote Easter Egg */}
      <div className="mt-8 hidden md:block">
        <JapaneseQuote />
      </div>

      {/* Floating Action Button for adding workout */}
      <WorkoutFormModal />
    </div>
  )
}

