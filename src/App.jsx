// tools
import { useEffect, useState } from 'react'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { DataContext } from '@/context/DataContext'
import { v4 as uuidv4 } from 'uuid'

// pages
import HomeView from '@/pages/HomeView'
import ManageQuestions from '@/pages/ManageQuestions'
import TrainingSettings from './pages/TrainingSettings'
import TrainingInProgress from './pages/TrainingInProgress'

// components
import TheNavbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'

// assets
import JsonFile2 from '@/assets/unit4&5.json'
import { createQuestion } from './lib/functions'
import { useCallback } from 'react'

function App() {
  const { addItem, getAllItem, clearItem } = useIndexedDB('questions')
  const [questions, setQuestions] = useState([])
  const [problems, setProblems] = useState([])

  const seeder = useCallback(() => {
    // console.log('seeder')

    const seederData = [...JsonFile2]
    seederData.forEach((question) => (question.id = uuidv4()))
    addItem(seederData)
    setQuestions(seederData.map((question) => createQuestion(question)))
  }, [addItem])

  useEffect(() => {
    getAllItem((allItems) => {
      const isVisited = localStorage.getItem('visited')
      if (isVisited !== '2024-11-19') {
        clearItem()
        allItems.length = 0
      }
      if (allItems.length === 0 && isVisited !== '2024-11-19') {
        localStorage.setItem('visited', '2024-11-19')
        seeder()
      } else {
        setQuestions(allItems.map((question) => createQuestion(question)))
      }
    })
  }, [clearItem, getAllItem, seeder])

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
