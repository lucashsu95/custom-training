// react
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// App.js
import { useEffect } from 'react'
// import { app, analytics } from './firebase';

// pages & components
import HomeView from '@/pages/HomeView'
import ManageQuestions from '@/pages/ManageQuestions'
import TrainingSettings from './pages/TrainingSettings'
import TrainingInProgress from './pages/TrainingInProgress'
import TheNavbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import AutoTraining from '@/pages/AutoTraining'

// providers
import { SettingProvider } from './provider/SettingProvider'
import { QuestionProvider } from '@/provider/QuestionProvider'
import { ThemeProvider } from './provider/ThemeProvider'

export default function App() {
  useEffect(() => {
    // console.log(app);
    // console.log(analytics);
  }, [])

  return (
    <SettingProvider>
      <QuestionProvider>
        <ThemeProvider>
          <Router>
            <TheNavbar />
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/training/auto" element={<AutoTraining />} />
              <Route path="/upload" element={<ManageQuestions />} />
              <Route path="/training/setting" element={<TrainingSettings />} />
              <Route path="/training/in-progress" element={<TrainingInProgress />} />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      </QuestionProvider>
    </SettingProvider>
  )
}
