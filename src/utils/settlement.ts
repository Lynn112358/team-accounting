import type { Expense, Member, Settlement } from '../types'
import { convertToBase } from './currency'

export function calculateBalances(
  expenses: Expense[],
  members: Member[],
  baseCurrency: string,
  rates: Record<string, number>,
): Record<string, number> {
  const balances: Record<string, number> = {}
  const memberIds = new Set(members.map((m) => m.id))

  for (const m of members) {
    balances[m.id] = 0
  }

  for (const expense of expenses) {
    const amountInBase = convertToBase(expense.amount, expense.currency, baseCurrency, rates)

    const payerIsMember = memberIds.has(expense.paidBy)
    const activeParticipants = expense.participants.filter((pid) => memberIds.has(pid))

    // If no active participants remain, treat the payer (if still a member) as sole participant,
    // otherwise skip this expense entirely
    const effectiveParticipants =
      activeParticipants.length > 0
        ? activeParticipants
        : payerIsMember
          ? [expense.paidBy]
          : []

    if (effectiveParticipants.length === 0) continue

    // Payer gets credit (only if still a member)
    if (payerIsMember) {
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + amountInBase
    } else {
      // Payer was removed — distribute their credit among active participants
      const creditShare = amountInBase / effectiveParticipants.length
      for (const pid of effectiveParticipants) {
        balances[pid] = (balances[pid] || 0) + creditShare
      }
    }

    // Each participant owes their share
    if (expense.splitType === 'equal') {
      const share = amountInBase / effectiveParticipants.length
      for (const pid of effectiveParticipants) {
        balances[pid] = (balances[pid] || 0) - share
      }
    } else if (expense.customAmounts) {
      for (const pid of effectiveParticipants) {
        const customAmount = convertToBase(
          expense.customAmounts[pid] || 0,
          expense.currency,
          baseCurrency,
          rates,
        )
        balances[pid] = (balances[pid] || 0) - customAmount
      }
    }
  }

  return balances
}

export function computeSettlements(balances: Record<string, number>): Settlement[] {
  const creditors: { id: string; balance: number }[] = []
  const debtors: { id: string; balance: number }[] = []

  for (const [id, balance] of Object.entries(balances)) {
    const rounded = Math.round(balance * 100) / 100
    if (rounded > 0.01) {
      creditors.push({ id, balance: rounded })
    } else if (rounded < -0.01) {
      debtors.push({ id, balance: -rounded })
    }
  }

  creditors.sort((a, b) => b.balance - a.balance)
  debtors.sort((a, b) => b.balance - a.balance)

  const settlements: Settlement[] = []

  let ci = 0
  let di = 0
  while (ci < creditors.length && di < debtors.length) {
    const amount = Math.min(creditors[ci].balance, debtors[di].balance)
    settlements.push({
      from: debtors[di].id,
      to: creditors[ci].id,
      amount: Math.round(amount * 100) / 100,
    })

    creditors[ci].balance -= amount
    debtors[di].balance -= amount

    if (creditors[ci].balance < 0.01) ci++
    if (debtors[di].balance < 0.01) di++
  }

  return settlements
}
