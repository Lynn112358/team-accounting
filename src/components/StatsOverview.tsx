import { formatMoney } from '../utils/currency'

interface StatsOverviewProps {
  total: number
  avgPerPerson: number
  expenseCount: number
  currency: string
}

export default function StatsOverview({
  total,
  avgPerPerson,
  expenseCount,
  currency,
}: StatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-500 mb-1">总消费</p>
        <p className="text-2xl font-bold text-gray-800">{formatMoney(total, currency)}</p>
        <p className="text-xs text-gray-400 mt-1">{expenseCount} 笔消费</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-500 mb-1">人均消费</p>
        <p className="text-2xl font-bold text-gray-800">{formatMoney(avgPerPerson, currency)}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-500 mb-1">消费货币</p>
        <p className="text-2xl font-bold text-gray-800">{currency}</p>
      </div>
    </div>
  )
}
