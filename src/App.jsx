import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TheNavbar from '@/components/Navbar'
import TrainingPage from '@/pages/TrainingPage'
import QuestionsTable from '@/pages/ManageQuestions'
import HomeView from '@/pages/HomeView'
import { useEffect, useState, useCallback, createContext } from 'react'
import { useIndexedDB } from '@/hooks/useIndexedDB'

export const DataContext = createContext()

function App() {
  const { getAllItem } = useIndexedDB('questions')
  const [questions, setQuestions] = useState([])

  const getAll = useCallback(() => {
    getAllItem((items) => {
      setQuestions(items)
    })
  }, [getAllItem])

  useEffect(() => {
    getAll()
  }, [getAll])

  return (
    <DataContext.Provider value={{ questions, setQuestions }}>
      <Router>
        <TheNavbar />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/upload" element={<QuestionsTable />} />
        </Routes>
      </Router>
    </DataContext.Provider>
  )
}

export default App
