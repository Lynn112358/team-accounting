import type { Category } from '../types'
import { formatMoney } from '../utils/currency'

interface CategoryBreakdownProps {
  data: { categoryId: string; total: number }[]
  categories: Category[]
  currency: string
  grandTotal: number
}

export default function CategoryBreakdown({
  data,
  categories,
  currency,
  grandTotal,
}: CategoryBreakdownProps) {
  if (data.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">各分类消费</h3>
      <div className="space-y-3">
        {data.map((item) => {
          const cat = categories.find((c) => c.id === item.categoryId)
          const percent = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0
          return (
            <div key={item.categoryId}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>
                  {cat?.icon || '💰'} {cat?.name || '未分类'}
                </span>
                <span className="font-medium">{formatMoney(item.total, currency)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{percent.toFixed(1)}%</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
