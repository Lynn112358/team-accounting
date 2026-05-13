import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ProjectHeader from '../components/ProjectHeader'
import ExpenseCard from '../components/ExpenseCard'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { state, dispatch } = useApp()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const project = state.projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">项目不存在</p>
        <Link to="/" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
          返回首页
        </Link>
      </div>
    )
  }

  const expenses = (state.expenses[project.id] || []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const handleDelete = () => {
    if (!deleteId) return
    dispatch({ type: 'DELETE_EXPENSE', payload: { projectId: project.id, expenseId: deleteId } })
    setDeleteId(null)
  }

  return (
    <div>
      <ProjectHeader projectId={project.id} projectName={project.name} />

      {expenses.length === 0 ? (
        <EmptyState
          icon="📝"
          title="还没有消费记录"
          description="添加第一笔消费吧"
          action={
            <Link
              to={`/project/${project.id}/expense/new`}
              className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
            >
              新增消费
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Link
              to={`/project/${project.id}/expense/new`}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
            >
              + 新增消费
            </Link>
          </div>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                members={project.members}
                categories={project.categories}
                onDelete={() => setDeleteId(expense.id)}
              />
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="删除消费记录"
        message="确定要删除这条消费记录吗？此操作不可撤销。"
        confirmLabel="删除"
        danger
      />
    </div>
  )
}
