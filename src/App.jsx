// react
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'

// pages
import HomeView from '@/pages/HomeView'
import ManageQuestions from '@/pages/ManageQuestions'
import TrainingSettings from '@/pages/TrainingSettings'
import TrainingInProgress from '@/pages/TrainingInProgress'
import AutoTraining from '@/pages/AutoTraining'
import HistoryView from '@/pages/HistoryView'

// layout
import AppShell from '@/components/layout/AppShell'
import { Toaster } from '@/components/ui/sonner'

// providers
import { SettingProvider } from '@/provider/SettingProvider'
import { QuestionProvider } from '@/provider/QuestionProvider'
import { ThemeProvider } from '@/provider/ThemeProvider'

// 404 頁面（inline，內容簡單不需獨立檔案）
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-display font-semibold tabular-nums">404</p>
      <p className="mt-2 text-muted-foreground">找不到這個頁面</p>
      <Link to="/" className="mt-4 text-sm text-primary underline underline-offset-4">
        回到首頁
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <SettingProvider>
      <QuestionProvider>
        <ThemeProvider>
          <Router>
            <AppShell>
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/training/auto" element={<AutoTraining />} />
                <Route path="/upload" element={<ManageQuestions />} />
                <Route path="/training/setting" element={<TrainingSettings />} />
                <Route path="/training/in-progress" element={<TrainingInProgress />} />
                <Route path="/history" element={<HistoryView />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
            <Toaster />
          </Router>
        </ThemeProvider>
      </QuestionProvider>
    </SettingProvider>
  )
}
