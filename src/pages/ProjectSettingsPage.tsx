import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import MemberManager from '../components/MemberManager'
import CategoryManager from '../components/CategoryManager'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ProjectSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [showDelete, setShowDelete] = useState(false)

  const project = state.projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">项目不存在</p>
      </div>
    )
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_PROJECT', payload: project.id })
    navigate('/', { replace: true })
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-800">项目设置</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <MemberManager projectId={project.id} members={project.members} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CategoryManager projectId={project.id} categories={project.categories} />
      </div>

      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="text-sm font-semibold text-red-600 mb-2">危险操作</h3>
        <p className="text-sm text-gray-500 mb-3">删除项目及其所有消费记录，此操作不可撤销。</p>
        <button
          onClick={() => setShowDelete(true)}
          className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
        >
          删除项目
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="删除项目"
        message={`确定要删除「${project.name}」吗？所有消费记录将被永久删除。`}
        confirmLabel="确认删除"
        danger
      />
    </div>
  )
}
