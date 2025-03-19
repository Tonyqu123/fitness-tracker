import QuarterlyStats from "@/components/quarterly-stats"
import MotivationalQuote from "@/components/motivational-quote"

export default function QuarterlyPage() {
  return (
    <div className="container px-4 py-6 pb-20 md:pb-6">
      <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
        <MotivationalQuote />
      </div>

      <QuarterlyStats />
    </div>
  )
}

