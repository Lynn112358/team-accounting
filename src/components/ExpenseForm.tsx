import { useState, useEffect } from 'react'
import type { Expense, Member, Category } from '../types'
import { CURRENCIES } from '../utils/currency'

interface ExpenseFormProps {
  projectId: string
  members: Member[]
  categories: Category[]
  baseCurrency: string
  initial?: Expense | null
  onSave: (expense: Omit<Expense, 'id' | 'createdAt'> & { id?: string; createdAt?: number }) => void
  onCancel: () => void
}

export default function ExpenseForm({
  projectId,
  members,
  categories,
  baseCurrency,
  initial,
  onSave,
  onCancel,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '')
  const [currency, setCurrency] = useState(initial?.currency || baseCurrency)
  const [categoryId, setCategoryId] = useState(initial?.categoryId || (categories[0]?.id ?? ''))
  const [description, setDescription] = useState(initial?.description || '')
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10))
  const [paidBy, setPaidBy] = useState(initial?.paidBy || (members[0]?.id ?? ''))
  const [participants, setParticipants] = useState<string[]>(
    initial?.participants || members.map((m) => m.id),
  )
  const [splitType, setSplitType] = useState<'equal' | 'custom'>(initial?.splitType || 'equal')
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>(
    initial?.customAmounts
      ? Object.fromEntries(Object.entries(initial.customAmounts).map(([k, v]) => [k, String(v)]))
      : {},
  )

  useEffect(() => {
    if (!initial && members.length > 0 && !paidBy) {
      setPaidBy(members[0].id)
      setParticipants(members.map((m) => m.id))
    }
  }, [members, initial, paidBy])

  const toggleParticipant = (memberId: string) => {
    setParticipants((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return
    if (!categoryId) return
    if (!paidBy) return

    const expenseData: Omit<Expense, 'id' | 'createdAt'> & { id?: string; createdAt?: number } = {
      projectId,
      amount: numAmount,
      currency,
      categoryId,
      description: description.trim(),
      date,
      paidBy,
      participants,
      splitType,
    }

    if (splitType === 'custom') {
      const amounts: Record<string, number> = {}
      for (const pid of participants) {
        amounts[pid] = parseFloat(customAmounts[pid] || '0') || 0
      }
      expenseData.customAmounts = amounts
    }

    if (initial) {
      expenseData.id = initial.id
      expenseData.createdAt = initial.createdAt
    }

    onSave(expenseData)
  }

  const selectedCategory = categories.find((c) => c.id === categoryId)

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">金额</label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            autoFocus
            required
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">消费分类</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
                categoryId === cat.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
        {selectedCategory && (
          <p className="text-xs text-gray-400 mt-1">
            已选：{selectedCategory.icon} {selectedCategory.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例如：打车去酒店"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">付款人</label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>
            选择付款人
          </option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">参与人</label>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleParticipant(m.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                participants.includes(m.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-400'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">分摊方式</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSplitType('equal')}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              splitType === 'equal'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            均摊
          </button>
          <button
            type="button"
            onClick={() => setSplitType('custom')}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              splitType === 'custom'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            自定义金额
          </button>
        </div>
      </div>

      {splitType === 'custom' && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-xs text-gray-500 mb-2">为每位参与人设置金额（{currency}）</p>
          {participants.map((pid) => {
            const member = members.find((m) => m.id === pid)
            if (!member) return null
            return (
              <div key={pid} className="flex items-center gap-2">
                <span className="text-sm w-20 shrink-0">{member.name}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={customAmounts[pid] || ''}
                  onChange={(e) => setCustomAmounts((prev) => ({ ...prev, [pid]: e.target.value }))}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            )
          })}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={!amount || !categoryId || !paidBy || participants.length === 0}
        >
          {initial ? '保存修改' : '添加消费'}
        </button>
      </div>
    </form>
  )
}
