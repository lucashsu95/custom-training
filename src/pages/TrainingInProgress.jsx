// ui component
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import StateBoard from '@/components/training/StateBoard'

// react
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// provider
import { useQuestion } from '@/provider/QuestionProvider'
import { createComponent } from '@/utils/componentFactory'

function TrainingInProgress() {
  const { problems, updateDue } = useQuestion()
  const [mod, setMod] = useState('progress')

  const [result, setResult] = useState({
    score: -1,
    correctCount: 0,
    wrongCount: 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!problems || problems.length === 0) {
      toast('目前沒有可作答的題目', {
        description: '請返回設定頁面重新選擇或稍後再試'
      })
      return
    }
    let problemsLength = 0
    let correctCount = 0

    // 計算題目數量 & 更新 due
    for (const problem of problems) {
      if (problem.type2 === '教學') continue
      const count = problem.getCorrectCount()
      const len = problem.getProblemLength()
      updateDue(problem.id, problem.isCorrect())
      correctCount += count
      problemsLength += len
    }

    // 計算分數

    if (problemsLength === 0) {
      toast('目前沒有可計分的題目', {
        description: '請返回設定頁面重新選擇或稍後再試'
      })
      return
    }

    const score = parseInt((100 / problemsLength) * correctCount)
    setResult({
      score,
      correctCount,
      wrongCount: problemsLength - correctCount
    })
    setMod('completed')
    window.scrollTo(0, 0)
    window.document.body.style.height = '1px'
  }

  return (
    <section className="p-6">
      <TheBreadcrumb>
        <BreadcrumbItem>
          <Link to="/training/setting">練習設定頁面</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>練習中</BreadcrumbPage>
        </BreadcrumbItem>
      </TheBreadcrumb>
      <div>
        {/* 顯示資訊 */}
        <StateBoard mod={mod} />

        {/* 顯示成績 */}
        {result.score > -1 && (
          <>
            <div className="my-2 space-y-1 rounded-md bg-gray-200/25 px-5 py-3 text-gray-500 shadow dark:bg-gray-700/35 dark:text-gray-100/65">
              <div
                className={`${
                  result.score >= 80
                    ? 'font-bold text-green-500 dark:text-green-400'
                    : result.score >= 60
                      ? ''
                      : 'font-bold text-red-400 dark:text-red-400'
                } text-lg`}
              >
                {result.score}分
              </div>
              <div className="text-xs">答對：{result.correctCount} </div>
              <div className="text-xs">答錯：{result.wrongCount}</div>
            </div>
          </>
        )}

        {/* 題目作答 */}

        <form className="my-5 space-y-6 md:space-y-12 md:p-6 md:shadow-lg" onSubmit={handleSubmit}>
          {problems.map((problem, i) => (
            <section key={i}>
              {createComponent(problem.type, {
                i,
                problem,
                mod
              })}
            </section>
          ))}
          {result.score < 0 ? (
            <>
              <Button>送出答案</Button>
              <Button type="reset" className="ml-2" variant="secondary">
                重設
              </Button>
            </>
          ) : (
            <Link to="/">
              <Button className="z-10 mt-3 w-full">回首頁</Button>
            </Link>
          )}
        </form>
      </div>
    </section>
  )
}
export default TrainingInProgress
