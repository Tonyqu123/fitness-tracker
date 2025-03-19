import FitnessTips from "@/components/fitness-tips-list"
import MotivationalQuote from "@/components/motivational-quote"

export default function TipsPage() {
  return (
    <div className="container px-4 py-6 pb-20 md:pb-6">
      <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
        <MotivationalQuote />
      </div>

      <FitnessTips />
    </div>
  )
}

