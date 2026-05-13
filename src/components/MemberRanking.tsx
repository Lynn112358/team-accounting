import type { Member } from '../types'
import { formatMoney } from '../utils/currency'

interface MemberRankingProps {
  data: { memberId: string; paid: number; owed: number }[]
  members: Member[]
  currency: string
}

export default function MemberRanking({ data, members, currency }: MemberRankingProps) {
  if (data.length === 0) return null

  const sorted = [...data].sort((a, b) => b.paid - a.paid)

  const maxPaid = sorted[0]?.paid || 1

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">成员消费排行</h3>
      <div className="space-y-3">
        {sorted.map((item, index) => {
          const member = members.find((m) => m.id === item.memberId)
          const barWidth = maxPaid > 0 ? (item.paid / maxPaid) * 100 : 0
          return (
            <div key={item.memberId}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-1">
                  <span className="text-xs text-gray-400 w-5">{index + 1}.</span>
                  {member?.name || '未知'}
                </span>
                <span className="font-medium">{formatMoney(item.paid, currency)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(barWidth, 100)}%`,
                    backgroundColor:
                      index === 0
                        ? '#3b82f6'
                        : index === 1
                          ? '#60a5fa'
                          : index === 2
                            ? '#93bbfd'
                            : '#bfdbfe',
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                个人应担：{formatMoney(item.owed, currency)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
