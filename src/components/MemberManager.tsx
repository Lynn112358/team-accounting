import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { genId } from '../utils/id'
import type { Member } from '../types'

interface MemberManagerProps {
  projectId: string
  members: Member[]
}

export default function MemberManager({ projectId, members }: MemberManagerProps) {
  const { dispatch } = useApp()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const addMember = () => {
    if (!newName.trim()) return
    dispatch({
      type: 'ADD_MEMBER',
      payload: { projectId, member: { id: genId(), name: newName.trim() } },
    })
    setNewName('')
  }

  const removeMember = (memberId: string) => {
    dispatch({ type: 'REMOVE_MEMBER', payload: { projectId, memberId } })
  }

  const startEdit = (member: Member) => {
    setEditingId(member.id)
    setEditName(member.name)
  }

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return
    dispatch({
      type: 'RENAME_MEMBER',
      payload: { projectId, memberId: editingId, name: editName.trim() },
    })
    setEditingId(null)
    setEditName('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">团队成员</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addMember()
        }}
        className="flex gap-2 mb-3"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入成员姓名"
        />
        <button
          type="submit"
          disabled={!newName.trim()}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          添加
        </button>
      </form>
      {members.length === 0 ? (
        <p className="text-sm text-gray-400">暂无成员</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {members.map((m) =>
            editingId === m.id ? (
              <span
                key={m.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-300 rounded-full"
              >
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-20 px-1 py-0 text-sm border-0 bg-transparent focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                    if (e.key === 'Escape') cancelEdit()
                  }}
                />
                <button onClick={saveEdit} className="text-blue-500 hover:text-blue-700 text-xs">
                  保存
                </button>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 text-xs">
                  ✕
                </button>
              </span>
            ) : (
              <span
                key={m.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => startEdit(m)}
                title="点击改名"
              >
                {m.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeMember(m.id)
                  }}
                  className="text-gray-400 hover:text-red-500 text-xs"
                >
                  ✕
                </button>
              </span>
            ),
          )}
        </div>
      )}
    </div>
  )
}
