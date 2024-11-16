// tools
import { useEffect, useState } from 'react'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'

// pages
import HomeView from '@/pages/HomeView'
import TheNavbar from '@/components/Navbar'
import ManageQuestions from '@/pages/ManageQuestions'
import TrainingSettings from './pages/TrainingSettings'
import TrainingInProgress from './pages/TrainingInProgress'

// 導入 DataContext
import { DataContext } from './DataContext'

// components
import { Toaster } from '@/components/ui/sonner'

// assets
import JsonFile from '@/assets/example.json'

function App() {
  const { addItem, getAllItem } = useIndexedDB('questions')
  const [questions, setQuestions] = useState([])
  const [problems, setProblems] = useState([])

  useEffect(() => {
    getAllItem((allItems) => {
      if (allItems.length === 0) {
        addItem(JsonFile)
      }
      setQuestions(allItems)
    })
  }, [addItem, getAllItem])

  return (
    <DataContext.Provider value={{ questions, setQuestions, problems, setProblems }}>
      <ThemeProvider>
        <Router>
          <TheNavbar />
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/upload" element={<ManageQuestions />} />
            <Route path="/training/setting" element={<TrainingSettings />} />
            <Route path="/training/in-progress" element={<TrainingInProgress />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </DataContext.Provider>
  )
}

export default App
