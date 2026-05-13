import { NavLink } from 'react-router-dom'

interface ProjectHeaderProps {
  projectId: string
  projectName: string
}

export default function ProjectHeader({ projectId, projectName }: ProjectHeaderProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
      isActive
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{projectName}</h2>
      <nav className="flex gap-6 border-b border-gray-200">
        <NavLink to={`/project/${projectId}`} end className={linkClass}>
          消费记录
        </NavLink>
        <NavLink to={`/project/${projectId}/statistics`} className={linkClass}>
          统计 & 结算
        </NavLink>
        <NavLink to={`/project/${projectId}/settings`} className={linkClass}>
          设置
        </NavLink>
      </nav>
    </div>
  )
}
