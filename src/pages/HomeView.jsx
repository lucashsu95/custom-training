// component & icon
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PageHeader from '@/components/layout/PageHeader'
import DueBadge from '@/components/molecules/DueBadge'
import { FaBook, FaHistory } from 'react-icons/fa'
import { IoLibrarySharp } from 'react-icons/io5'
import { MdNotStarted, MdDashboardCustomize } from 'react-icons/md'

// react
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

// provider
import { useQuestion } from '@/provider/QuestionProvider'
import { useSetting } from '@/provider/SettingProvider'

const LADDER_SAMPLES = [-3, -1, 0, 3, 5, null]

export default function HomeView() {
  const { autoStartTraining, questions } = useQuestion()
  const { trainingCount, checkTrainingCount } = useSetting()

  const navigate = useNavigate()

  const startTraining = () => {
    if (autoStartTraining()) {
      navigate('/training/auto')
    }
  }

  const doneCount = parseInt(trainingCount ?? 0, 10)
  const reachedLimit = checkTrainingCount()
  const statusText = reachedLimit ? '今日已達上限' : '可繼續練習'

  return (
    <div className="grid gap-4">
      <PageHeader title="首頁" description={`今日已練習 ${doneCount} 次，上限 3 次`} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>題庫題數</CardTitle>
            <CardDescription className="text-2xl font-semibold tabular-nums text-foreground">
              {questions.length}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>今日練習次數</CardTitle>
            <CardDescription className="text-2xl font-semibold tabular-nums text-foreground">
              {doneCount}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>練習狀態</CardTitle>
            <CardDescription className="text-muted-foreground">{statusText}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>熟練度階梯</CardTitle>
          <CardDescription>由不熟練到熟練的刻度對照</CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            {LADDER_SAMPLES.map((due, index) => (
              <DueBadge key={due === null ? 'none' : `due-${due}-${index}`} due={due} />
            ))}
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="功能導覽">
        <Card
          className="cursor-pointer transition-colors hover:bg-muted"
          onClick={startTraining}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') startTraining()
          }}
        >
          <CardHeader>
            <MdNotStarted className="h-5 w-5" aria-hidden="true" />
            <CardTitle>直接練習</CardTitle>
            <CardDescription>一切由系統安排，只要會背即可，每日上限 3 次</CardDescription>
          </CardHeader>
        </Card>

        <Link to="/training/setting">
          <Card className="transition-colors hover:bg-muted">
            <CardHeader>
              <MdDashboardCustomize className="h-5 w-5" aria-hidden="true" />
              <CardTitle>自定練習</CardTitle>
              <CardDescription>自定題目➡️自定題數➡️開始練習</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/upload">
          <Card className="transition-colors hover:bg-muted">
            <CardHeader>
              <IoLibrarySharp className="h-5 w-5" aria-hidden="true" />
              <CardTitle>自定題庫</CardTitle>
              <CardDescription>在題庫頁面上傳題庫</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/history">
          <Card className="transition-colors hover:bg-muted">
            <CardHeader>
              <FaHistory className="h-5 w-5" aria-hidden="true" />
              <CardTitle>練習紀錄</CardTitle>
              <CardDescription>查看過去的練習結果</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <a
          target="_blank"
          href="https://github.com/lucashsu95/custom-training/blob/main/docs/how-to-use.md"
          rel="noreferrer"
        >
          <Card className="transition-colors hover:bg-muted">
            <CardHeader>
              <FaBook className="h-5 w-5" aria-hidden="true" />
              <CardTitle>教學-說明書</CardTitle>
              <CardDescription>查看使用說明書</CardDescription>
            </CardHeader>
          </Card>
        </a>
      </section>
    </div>
  )
}
