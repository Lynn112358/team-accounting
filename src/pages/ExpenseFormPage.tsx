import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { genId } from '../utils/id'
import ExpenseForm from '../components/ExpenseForm'
import type { Expense } from '../types'

export default function ExpenseFormPage() {
  const { id, eid } = useParams<{ id: string; eid: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const project = state.projects.find((p) => p.id === id)
  const isEdit = Boolean(eid)

  const existingExpense = isEdit ? state.expenses[id!]?.find((e) => e.id === eid) || null : null

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">项目不存在</p>
      </div>
    )
  }

  if (project.members.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">请先添加团队成员</p>
        <button
          onClick={() => navigate(`/project/${id}/settings`)}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
        >
          前往设置
        </button>
      </div>
    )
  }

  const handleSave = (
    data: Omit<Expense, 'id' | 'createdAt'> & { id?: string; createdAt?: number },
  ) => {
    if (isEdit && data.id) {
      dispatch({
        type: 'UPDATE_EXPENSE',
        payload: { ...data, id: data.id, createdAt: data.createdAt! } as Expense,
      })
    } else {
      dispatch({
        type: 'ADD_EXPENSE',
        payload: { ...data, id: genId(), createdAt: Date.now() } as Expense,
      })
    }
    navigate(`/project/${id}`, { replace: true })
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">{isEdit ? '编辑消费' : '新增消费'}</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ExpenseForm
          projectId={project.id}
          members={project.members}
          categories={project.categories}
          baseCurrency={project.baseCurrency}
          initial={existingExpense}
          onSave={handleSave}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  )
}
