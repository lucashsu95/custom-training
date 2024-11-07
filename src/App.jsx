import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TheNavbar from '@/components/Navbar'
import QuestionsTable from '@/pages/ManageQuestions'
import HomeView from '@/pages/HomeView'
import { useEffect, useState, useCallback, createContext } from 'react'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import TrainingSettings from './pages/TrainingSettings'
import TrainingInProgress from './pages/TrainingInProgress'

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext()

function App() {
  const { getAllItem } = useIndexedDB('questions')
  const [questions, setQuestions] = useState([])
  const [problems, setProblems] = useState([])

  const getAll = useCallback(() => {
    getAllItem((items) => {
      setQuestions(items)
    })
  }, [getAllItem])

  useEffect(() => {
    getAll()
  }, [getAll])

  return (
    <DataContext.Provider value={{ questions, setQuestions, problems, setProblems }}>
      <Router>
        <TheNavbar />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/upload" element={<QuestionsTable />} />
          <Route path="/training/setting" element={<TrainingSettings />} />
          <Route path="/training/in-progress" element={<TrainingInProgress />} />
        </Routes>
      </Router>
    </DataContext.Provider>
  )
}

export default App
