import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { genId } from '../utils/id'
import type { Category } from '../types'

const EMOJI_OPTIONS = ['🍔', '🚗', '🏨', '🎫', '🛒', '💊', '🎁', '📱', '🎬', '🍺', '🎵', '🏀']

interface CategoryManagerProps {
  projectId: string
  categories: Category[]
}

export default function CategoryManager({ projectId, categories }: CategoryManagerProps) {
  const { dispatch } = useApp()
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('🎁')

  const addCategory = () => {
    if (!newName.trim()) return
    dispatch({
      type: 'ADD_CATEGORY',
      payload: {
        projectId,
        category: { id: genId(), name: newName.trim(), icon: newIcon },
      },
    })
    setNewName('')
  }

  const removeCategory = (categoryId: string) => {
    dispatch({ type: 'REMOVE_CATEGORY', payload: { projectId, categoryId } })
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">消费分类</h3>
      <div className="flex gap-2 mb-3">
        <div className="flex gap-1 flex-wrap">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setNewIcon(emoji)}
              className={`w-9 h-9 text-lg rounded-lg flex items-center justify-center border-2 transition-colors ${
                newIcon === emoji
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addCategory()
        }}
        className="flex gap-2"
      >
        <span className="flex items-center text-xl px-2">{newIcon}</span>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入分类名称"
        />
        <button
          type="submit"
          disabled={!newName.trim()}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          添加
        </button>
      </form>
      {categories.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">暂无分类</p>
      ) : (
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
            >
              {c.icon} {c.name}
              <button
                onClick={() => removeCategory(c.id)}
                className="text-gray-400 hover:text-red-500 text-xs"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
