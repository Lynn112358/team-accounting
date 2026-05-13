import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { AppState, AppAction } from '../types'

const STORAGE_KEY = 'team-accounting-data'

const DEFAULT_RATES: Record<string, number> = {
  CNY: 1,
  USD: 7.2,
  EUR: 7.8,
  JPY: 0.048,
  GBP: 9.1,
  KRW: 0.0054,
  HKD: 0.92,
  TWD: 0.23,
  THB: 0.2,
  SGD: 5.3,
  AUD: 4.7,
  CAD: 5.3,
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        projects: parsed.projects || [],
        expenses: parsed.expenses || {},
        exchangeRates: parsed.exchangeRates || DEFAULT_RATES,
      }
    }
  } catch {
    // corrupted data, reset
  }
  return { projects: [], expenses: {}, exchangeRates: DEFAULT_RATES }
}

const initialState: AppState = loadState()

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
        expenses: { ...state.expenses, [action.payload.id]: [] },
      }

    case 'DELETE_PROJECT': {
      const { [action.payload]: _, ...restExpenses } = state.expenses
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        expenses: restExpenses,
      }
    }

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.payload.id ? action.payload : p)),
      }

    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: {
          ...state.expenses,
          [action.payload.projectId]: [
            ...(state.expenses[action.payload.projectId] || []),
            action.payload,
          ],
        },
      }

    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: {
          ...state.expenses,
          [action.payload.projectId]: (state.expenses[action.payload.projectId] || []).filter(
            (e) => e.id !== action.payload.expenseId,
          ),
        },
      }

    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: {
          ...state.expenses,
          [action.payload.projectId]: (state.expenses[action.payload.projectId] || []).map((e) =>
            e.id === action.payload.id ? action.payload : e,
          ),
        },
      }

    case 'ADD_MEMBER':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, members: [...p.members, action.payload.member] }
            : p,
        ),
      }

    case 'REMOVE_MEMBER':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, members: p.members.filter((m) => m.id !== action.payload.memberId) }
            : p,
        ),
      }

    case 'RENAME_MEMBER':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? {
                ...p,
                members: p.members.map((m) =>
                  m.id === action.payload.memberId ? { ...m, name: action.payload.name } : m,
                ),
              }
            : p,
        ),
      }

    case 'ADD_CATEGORY':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, categories: [...p.categories, action.payload.category] }
            : p,
        ),
      }

    case 'REMOVE_CATEGORY':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, categories: p.categories.filter((c) => c.id !== action.payload.categoryId) }
            : p,
        ),
      }

    case 'UPDATE_EXCHANGE_RATE':
      return {
        ...state,
        exchangeRates: {
          ...state.exchangeRates,
          [action.payload.currency]: action.payload.rate,
        },
      }

    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const timer = setTimeout(save, 300)
    return () => clearTimeout(timer)
  }, [state, save])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
