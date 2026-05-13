import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ProjectHeader from '../components/ProjectHeader'
import StatsOverview from '../components/StatsOverview'
import CategoryBreakdown from '../components/CategoryBreakdown'
import MemberRanking from '../components/MemberRanking'
import SettlementTable from '../components/SettlementTable'
import EmptyState from '../components/EmptyState'
import { convertToBase } from '../utils/currency'
import { calculateBalances, computeSettlements } from '../utils/settlement'

export default function StatisticsPage() {
  const { id } = useParams<{ id: string }>()
  const { state } = useApp()

  const project = state.projects.find((p) => p.id === id)

  const stats = useMemo(() => {
    if (!project) return null
    const expenses = state.expenses[project.id] || []
    const rates = state.exchangeRates

    // Total in base currency
    let grandTotal = 0
    const categoryTotals: Record<string, number> = {}
    const memberPaid: Record<string, number> = {}
    const memberOwed: Record<string, number> = {}

    const memberIds = new Set(project.members.map((m) => m.id))

    for (const m of project.members) {
      memberPaid[m.id] = 0
      memberOwed[m.id] = 0
    }

    for (const expense of expenses) {
      const amountInBase = convertToBase(
        expense.amount,
        expense.currency,
        project.baseCurrency,
        rates,
      )
      grandTotal += amountInBase

      // Category totals
      categoryTotals[expense.categoryId] = (categoryTotals[expense.categoryId] || 0) + amountInBase

      const payerIsMember = memberIds.has(expense.paidBy)
      const activeParticipants = expense.participants.filter((pid) => memberIds.has(pid))
      const effectiveParticipants =
        activeParticipants.length > 0 ? activeParticipants : payerIsMember ? [expense.paidBy] : []

      if (effectiveParticipants.length === 0) continue

      // Member paid
      if (payerIsMember) {
        memberPaid[expense.paidBy] = (memberPaid[expense.paidBy] || 0) + amountInBase
      } else {
        const creditShare = amountInBase / effectiveParticipants.length
        for (const pid of effectiveParticipants) {
          memberPaid[pid] = (memberPaid[pid] || 0) + creditShare
        }
      }

      // Member owed
      if (expense.splitType === 'equal') {
        const share = amountInBase / effectiveParticipants.length
        for (const pid of effectiveParticipants) {
          memberOwed[pid] = (memberOwed[pid] || 0) + share
        }
      } else if (expense.customAmounts) {
        for (const pid of effectiveParticipants) {
          const custom = convertToBase(
            expense.customAmounts[pid] || 0,
            expense.currency,
            project.baseCurrency,
            rates,
          )
          memberOwed[pid] = (memberOwed[pid] || 0) + custom
        }
      }
    }

    const memberCount = project.members.length || 1
    const avgPerPerson = grandTotal / memberCount

    const categoryData = Object.entries(categoryTotals)
      .map(([categoryId, total]) => ({ categoryId, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total)

    const memberData = project.members.map((m) => ({
      memberId: m.id,
      paid: Math.round((memberPaid[m.id] || 0) * 100) / 100,
      owed: Math.round((memberOwed[m.id] || 0) * 100) / 100,
    }))

    const balances = calculateBalances(expenses, project.members, project.baseCurrency, rates)
    const settlements = computeSettlements(balances)

    return {
      grandTotal: Math.round(grandTotal * 100) / 100,
      avgPerPerson: Math.round(avgPerPerson * 100) / 100,
      expenseCount: expenses.length,
      categoryData,
      memberData,
      balances,
      settlements,
    }
  }, [project, state.expenses, state.exchangeRates])

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

  return (
    <div>
      <ProjectHeader projectId={project.id} projectName={project.name} />

      {!stats || stats.expenseCount === 0 ? (
        <EmptyState
          icon="📊"
          title="暂无统计数据"
          description="添加消费记录后即可查看统计"
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
        <div className="space-y-6">
          <StatsOverview
            total={stats.grandTotal}
            avgPerPerson={stats.avgPerPerson}
            expenseCount={stats.expenseCount}
            currency={project.baseCurrency}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryBreakdown
              data={stats.categoryData}
              categories={project.categories}
              currency={project.baseCurrency}
              grandTotal={stats.grandTotal}
            />
            <MemberRanking
              data={stats.memberData}
              members={project.members}
              currency={project.baseCurrency}
            />
          </div>

          <SettlementTable
            settlements={stats.settlements}
            balances={stats.balances}
            members={project.members}
            currency={project.baseCurrency}
          />
        </div>
      )}
    </div>
  )
}
