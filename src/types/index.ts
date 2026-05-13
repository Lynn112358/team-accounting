export interface Member {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface Project {
  id: string
  name: string
  description: string
  baseCurrency: string
  members: Member[]
  categories: Category[]
  createdAt: number
}

export type SplitType = 'equal' | 'custom'

export interface Expense {
  id: string
  projectId: string
  amount: number
  currency: string
  categoryId: string
  description: string
  date: string
  paidBy: string
  participants: string[]
  splitType: SplitType
  customAmounts?: Record<string, number>
  createdAt: number
}

export interface ExchangeRate {
  currency: string
  rate: number
}

export interface Settlement {
  from: string
  to: string
  amount: number
}

export interface AppState {
  projects: Project[]
  expenses: Record<string, Expense[]>
  exchangeRates: Record<string, number>
}

export type AppAction =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: { projectId: string; expenseId: string } }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'ADD_MEMBER'; payload: { projectId: string; member: Member } }
  | { type: 'REMOVE_MEMBER'; payload: { projectId: string; memberId: string } }
  | { type: 'RENAME_MEMBER'; payload: { projectId: string; memberId: string; name: string } }
  | { type: 'ADD_CATEGORY'; payload: { projectId: string; category: Category } }
  | { type: 'REMOVE_CATEGORY'; payload: { projectId: string; categoryId: string } }
  | { type: 'UPDATE_EXCHANGE_RATE'; payload: { currency: string; rate: number } }
