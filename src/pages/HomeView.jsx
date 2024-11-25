// component & icon
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FaBook } from 'react-icons/fa'
import { IoLibrarySharp } from 'react-icons/io5'
import { MdNotStarted, MdDashboardCustomize } from 'react-icons/md'

// react
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

// provider
import { useQuestion } from '@/provider/QuestionProvider'
import { useSetting } from '@/provider/SettingProvider'

// hook
import { useInitializeQuestions } from '@/hooks/useInitializeQuestions'

export default function HomeView() {
  const { autoStartTraining } = useQuestion()
  const { initTrainingCount } = useSetting()

  const navigate = useNavigate()
  const initializeQuestions = useInitializeQuestions()

  // 初始化
  useEffect(() => {
    initializeQuestions()
    initTrainingCount()
  }, [initTrainingCount, initializeQuestions])

  const startTraining = () => {
    if (autoStartTraining()) {
      navigate('/training/auto')
    }
  }

  return (
    <section className="w-100 grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
      <Alert
        className="custom-alert cursor-pointer bg-blue-200 dark:bg-[#6574bda4]"
        onClick={startTraining}
      >
        <MdNotStarted className="h-5 w-5" />
        <AlertTitle className="text-base font-bold">直接練習</AlertTitle>
        <AlertDescription>一切由系統安排，只要會背即可!</AlertDescription>
      </Alert>

      <Link to="/training/setting">
        <Alert className="custom-alert">
          <MdDashboardCustomize className="h-5 w-5" />
          <AlertTitle className="text-base font-bold">自定練習</AlertTitle>
          <AlertDescription>自定題目➡️自定題數➡️開始練習</AlertDescription>
        </Alert>
      </Link>

      <Link to="/upload">
        <Alert className="custom-alert">
          <IoLibrarySharp className="h-5 w-5" />
          <AlertTitle className="text-base font-bold">自定題庫</AlertTitle>
          <AlertDescription>在題庫頁面上傳題庫</AlertDescription>
        </Alert>
      </Link>

      <a target="_blank" href="https://github.com/lucashsu95/custom-training/blob/main/README.md">
        <Alert className="custom-alert">
          <FaBook className="h-5 w-5" />
          <AlertTitle className="text-base font-bold">教學-說明書</AlertTitle>
          <AlertDescription>查看使用說明書</AlertDescription>
        </Alert>
      </a>
    </section>
  )
}
