// component
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// icon
import { FaBook } from 'react-icons/fa'
import { IoLibrarySharp } from 'react-icons/io5'
import { MdNotStarted, MdDashboardCustomize } from 'react-icons/md'

// react
import { Link } from 'react-router-dom'
import {
  filterByTime,
  getLimitedQuestions,
  getVocabularyShuffled,
  productTech,
  shuffleAryByDue,
  sortByTech
} from '@/lib/functions'
import { DataContext } from '@/context/DataContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function HomeView() {
  const { questions, setProblems } = useContext(DataContext)
  const navigate = useNavigate()

  const startTraining = () => {
    const vocabulary = questions.filter((x) => x.type === '單字題' && x.isEnabled)
    const filteredQuestions = filterByTime(vocabulary)
    const shuffledQuestions = shuffleAryByDue(filteredQuestions)
    if (shuffledQuestions.length < 3) {
      toast('目前沒有要練習的題目', {
        description: '休息一下之後再來練習吧!'
      })
      return
    }
    const correctProblems = getLimitedQuestions(
      shuffledQuestions,
      shuffledQuestions.length >= 10 ? 10 : shuffledQuestions.length >= 5 ? 5 : 3
    )
    const displayedProblems = getVocabularyShuffled(correctProblems, true) // 顯示單字題
    const problems = productTech(displayedProblems)
    const sortedTechProblems = sortByTech(problems)
    setProblems(sortedTechProblems)
    navigate('/training/auto')
  }
  return (
    <section className="w-100 grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
      <Alert className="custom-alert cursor-pointer" onClick={startTraining}>
        <MdNotStarted className="h-5 w-5" />
        <AlertTitle className="text-base font-bold">直接練習</AlertTitle>
        <AlertDescription>一切由系統安排，只要負責背即可!</AlertDescription>
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
