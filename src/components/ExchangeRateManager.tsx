import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CURRENCIES } from '../utils/currency'

export default function ExchangeRateManager() {
  const { state, dispatch } = useApp()
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const startEdit = (currency: string) => {
    setEditing(currency)
    setEditValue(String(state.exchangeRates[currency] || 1))
  }

  const saveEdit = () => {
    if (!editing) return
    const rate = parseFloat(editValue)
    if (isNaN(rate) || rate <= 0) return
    dispatch({ type: 'UPDATE_EXCHANGE_RATE', payload: { currency: editing, rate } })
    setEditing(null)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">汇率管理</h3>
      <p className="text-xs text-gray-400 mb-4">
        所有汇率均以 CNY（人民币）为基准。修改汇率后，统计结果将使用新汇率换算。
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CURRENCIES.map((currency) => {
          const rate = state.exchangeRates[currency] || 1
          const isEditing = editing === currency
          return (
            <div
              key={currency}
              className="flex items-center gap-2 p-2 rounded-lg border border-gray-100"
            >
              <span className="text-sm font-medium w-12 shrink-0">{currency}</span>
              {isEditing ? (
                <>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') setEditing(null)
                    }}
                  />
                  <button onClick={saveEdit} className="text-xs text-blue-500 hover:text-blue-700">
                    保存
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-600">1 = ¥{rate.toFixed(4)}</span>
                  <button
                    onClick={() => startEdit(currency)}
                    className="text-xs text-gray-400 hover:text-blue-500"
                  >
                    编辑
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
