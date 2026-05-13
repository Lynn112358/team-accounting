import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import ExpenseFormPage from './pages/ExpenseFormPage'
import StatisticsPage from './pages/StatisticsPage'
import ProjectSettingsPage from './pages/ProjectSettingsPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/project/:id/expense/new" element={<ExpenseFormPage />} />
            <Route path="/project/:id/expense/:eid/edit" element={<ExpenseFormPage />} />
            <Route path="/project/:id/statistics" element={<StatisticsPage />} />
            <Route path="/project/:id/settings" element={<ProjectSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
