import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useIndexedDB } from './hooks/useIndexedDB'
import TheNavbar from './components/Navbar'
import TrainingPage from './pages/TrainingPage'
import QuestionsTable from './pages/QuestionsTable'
import HomeView from './pages/HomeView'

function App() {
  const { getAllItem } = useIndexedDB('customTrainingDB', 'questions')

  useEffect(() => {
    getAllItem((questions) => {
      console.log(questions)
    })
  }, [getAllItem])

  return (
    <Router basename="custom-training">
      <TheNavbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/questions" element={<QuestionsTable />} />
        <Route path="/training" element={<TrainingPage />} />
      </Routes>
    </Router>
  )
}

export default App
