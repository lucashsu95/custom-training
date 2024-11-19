// ui component
import { Button } from '@/components/ui/button'
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

// question component
import { DataContext } from '@/context/DataContext'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import StateBoard from '@/components/training/StateBoard'
import MultipleChoiceItem from '@/components/training/MultipleChoiceItem'
import FillInTheBlankItem from '@/components/training/FillInTheBlankItem'
import MatchingItem from '@/components/training/MatchingItem'
import VocabularyItem from '@/components/training/VocabularyItem'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import PreventRefresh from '@/components/PreventRefresh'

function TrainingInProgress() {
  const { problems, setQuestions } = useContext(DataContext)
  const [mod, setMod] = useState('progress')
  const { updateItem } = useIndexedDB('questions')

  const [result, setResult] = useState({
    score: -1,
    correctCount: 0,
    wrongCount: 0
  })

  const createComponent = (type, state) => {
    state.mod = mod
    // state = { i, problem ,mod }
    switch (type) {
      case '選擇題':
        return <MultipleChoiceItem {...state} />
      case '填空題':
        return <FillInTheBlankItem {...state} />
      case '配對題':
        return <MatchingItem {...state} />
      case '單字題':
        return <VocabularyItem {...state} />
      default:
        return null
    }
  }

  const getProblemLength = (problem) => {
    if (Array.isArray(problem?.options)) {
      return problem.options.length
    }
    return 1
  }

  const updateState = (id, due) => {
    const second = new Date().getTime()
    updateItem(id, { due,last_answered_time: second })
    setQuestions((prev) => {
      for (const p of prev) {
        if (p.id === id) {
          p.due = due
          p.last_answered_time = second
        }
      }
      return prev
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let problemsLength = 0
    let correctCount = 0

    // 計算題目數量 & 更新 due
    problems.forEach((problem) => {
      const count = problem.getCorrectCount()
      const len = getProblemLength(problem)
      problem.due = problem.due === null ? 0 : problem.due
      problem.due += Math.max(count === len ? 1 : -1, -3)
      updateState(problem.id, problem.due)
      correctCount += count
      problemsLength += len
    })

    // 計算分數
    const score = Math.round((correctCount / problemsLength) * 100)
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
      <PreventRefresh />

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
                problem
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
