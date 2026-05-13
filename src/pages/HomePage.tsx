import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { genId } from '../utils/id'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import ExchangeRateManager from '../components/ExchangeRateManager'
import { CURRENCIES } from '../utils/currency'
import type { Project } from '../types'

const DEFAULT_CATEGORIES = [
  { icon: '🍔', name: '餐饮' },
  { icon: '🚗', name: '交通' },
  { icon: '🏨', name: '住宿' },
  { icon: '🎫', name: '门票' },
  { icon: '🛒', name: '购物' },
  { icon: '💊', name: '医疗' },
  { icon: '🎁', name: '其他' },
]

export default function HomePage() {
  const { state, dispatch } = useApp()
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showRates, setShowRates] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [baseCurrency, setBaseCurrency] = useState('CNY')

  const handleCreate = () => {
    if (!name.trim()) return
    const project: Project = {
      id: genId(),
      name: name.trim(),
      description: description.trim(),
      baseCurrency,
      members: [],
      categories: DEFAULT_CATEGORIES.map((c) => ({ ...c, id: genId() })),
      createdAt: Date.now(),
    }
    dispatch({ type: 'ADD_PROJECT', payload: project })
    setName('')
    setDescription('')
    setBaseCurrency('CNY')
    setShowCreate(false)
  }

  const handleDelete = () => {
    if (!deleteId) return
    dispatch({ type: 'DELETE_PROJECT', payload: deleteId })
    setDeleteId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">我的项目</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          + 新建项目
        </button>
      </div>

      {state.projects.length === 0 ? (
        <EmptyState
          icon="📋"
          title="还没有项目"
          description="创建一个项目来开始记账吧"
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
            >
              创建第一个项目
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {state.projects.map((project) => {
            const expenseCount = state.expenses[project.id]?.length || 0
            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <Link to={`/project/${project.id}`} className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-500 mt-1 truncate">{project.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>{expenseCount} 笔消费</span>
                      <span>
                        {project.members.length > 0
                          ? `${project.members.length} 位成员`
                          : '未添加成员'}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setDeleteId(project.id)
                    }}
                    className="text-gray-300 hover:text-red-500 text-sm shrink-0 ml-2"
                    title="删除项目"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="新建项目">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCreate()
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例如：团建旅游"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">项目描述（可选）</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="简短描述这个项目"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">基准货币</label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            创建
          </button>
        </form>
      </Modal>

      <div className="mt-8">
        <button
          onClick={() => setShowRates(!showRates)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          {showRates ? '▼' : '▶'} 汇率设置
        </button>
        {showRates && (
          <div className="mt-3">
            <ExchangeRateManager />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="删除项目"
        message="确定要删除这个项目吗？项目下的所有消费记录也会被删除，此操作不可撤销。"
        confirmLabel="删除"
        danger
      />
    </div>
  )
}
