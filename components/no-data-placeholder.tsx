import { BarChart4 } from "lucide-react"

interface NoDataPlaceholderProps {
  message: string
}

export default function NoDataPlaceholder({ message }: NoDataPlaceholderProps) {
  return (
    <div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-lg p-6 text-center">
      <div className="flex flex-col items-center justify-center py-12">
        <BarChart4 className="h-12 w-12 text-gray-600 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">暂无数据</h3>
        <p className="text-gray-400">{message}</p>
        <p className="text-sm text-[#C62127] mt-4 italic">放弃的话比赛就结束了</p>
      </div>
    </div>
  )
}

