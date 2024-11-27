// ui component
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import StateBoard from '@/components/training/StateBoard'

// react
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getProblemLength } from '@/lib/functions'

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
    let problemsLength = 0
    let correctCount = 0

    // 計算題目數量 & 更新 due
    for (const problem of problems) {
      if (problem.type2 === '教學') {
        continue
      }
      const count = problem.getCorrectCount()
      const len = getProblemLength(problem)
      updateDue(problem.id, count === len)
      correctCount += count
      problemsLength += len
    }

    // 計算分數
    const score = Math.min(Math.ceil(100 / problemsLength) * correctCount, 100)
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
            <div className="my-2 rounded-md bg-purple-200 p-3 dark:bg-purple-400">
              <div
                className={`${
                  result.score >= 80
                    ? 'font-bold text-green-500 dark:text-green-300'
                    : result.score >= 60
                      ? ''
                      : 'font-bold text-red-500 dark:text-red-300'
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
          {result.score < 0 && (
            <>
              <Button>送出答案</Button>
              <Button type="reset" className="ml-2" variant="secondary">
                重設
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
export default TrainingInProgress
