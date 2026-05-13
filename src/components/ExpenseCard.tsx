import { Link } from 'react-router-dom'
import type { Expense, Member, Category } from '../types'
import { formatMoney } from '../utils/currency'

interface ExpenseCardProps {
  expense: Expense
  members: Member[]
  categories: Category[]
  onDelete: () => void
}

export default function ExpenseCard({ expense, members, categories, onDelete }: ExpenseCardProps) {
  const category = categories.find((c) => c.id === expense.categoryId)
  const payer = members.find((m) => m.id === expense.paidBy)
  const participantNames = expense.participants
    .map((pid) => members.find((m) => m.id === pid)?.name)
    .filter(Boolean)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{category?.icon || '💰'}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">
                {formatMoney(expense.amount, expense.currency)}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                {category?.name || '未分类'}
              </span>
            </div>
            {expense.description && (
              <p className="text-sm text-gray-500 truncate mt-0.5">{expense.description}</p>
            )}
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span>{expense.date}</span>
              <span>·</span>
              <span>付款：{payer?.name || '未知'}</span>
              <span>·</span>
              <span>{participantNames.join('、')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <Link
            to={`/project/${expense.projectId}/expense/${expense.id}/edit`}
            className="text-xs text-gray-400 hover:text-blue-500 px-2 py-1"
          >
            编辑
          </Link>
          <button onClick={onDelete} className="text-xs text-gray-400 hover:text-red-500 px-2 py-1">
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
