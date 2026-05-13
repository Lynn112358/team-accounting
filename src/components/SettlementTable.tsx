import type { Settlement, Member } from '../types'
import { formatMoney } from '../utils/currency'

interface SettlementTableProps {
  settlements: Settlement[]
  balances: Record<string, number>
  members: Member[]
  currency: string
}

export default function SettlementTable({
  settlements,
  balances,
  members,
  currency,
}: SettlementTableProps) {
  const getName = (id: string) => members.find((m) => m.id === id)?.name || '未知'

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">个人净额</h3>
        <div className="space-y-2">
          {Object.entries(balances).map(([memberId, balance]) => {
            const rounded = Math.round(balance * 100) / 100
            return (
              <div key={memberId} className="flex items-center justify-between text-sm">
                <span>{getName(memberId)}</span>
                <span
                  className={`font-medium ${
                    rounded > 0 ? 'text-green-600' : rounded < 0 ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {rounded > 0 ? '+' : ''}
                  {formatMoney(rounded, currency)}
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3">正数表示应收，负数表示应付</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">结算方案</h3>
        {settlements.length === 0 ? (
          <p className="text-sm text-gray-400">无需结算，所有人已平账</p>
        ) : (
          <div className="space-y-3">
            {settlements.map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                <span className="text-red-500 font-medium">{getName(s.from)}</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600 font-medium">{getName(s.to)}</span>
                <span className="ml-auto font-semibold text-gray-700">
                  {formatMoney(s.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
