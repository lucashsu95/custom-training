// ui component
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import StateBoard from '@/components/training/StateBoard'
import PreventRefresh from '@/components/PreventRefresh'
import { Button } from '@/components/ui/button'

// question component
import MultipleChoiceItem from '@/components/training/item/MultipleChoiceItem'
import FillInTheBlankItem from '@/components/training/item/FillInTheBlankItem'
import MatchingItem from '@/components/training/item/MatchingItem'
import VocabularyItem from '@/components/training/item/VocabularyItem'

// react
import { useContext, useState } from 'react'
import { DataContext } from '@/context/DataContext'
import { Progress } from '../ui/progress'
import { useMemo } from 'react'
import { useEffect } from 'react'

function AutoTraining() {
  const { problems } = useContext(DataContext)
  const [state, setState] = useState({
    currentProblem: 0
  })

  const [result, setResult] = useState({
    score: -1,
    correctCount: 0,
    wrongCount: 0
  })

  const problemsLength = problems.filter((x) => x.type2 !== '教學').length
  const progressBar = useMemo(() => {
    return Math.floor(((result.correctCount + result.wrongCount) / problemsLength) * 100)
  }, [problemsLength, result.correctCount, result.wrongCount])

  useEffect(() => {
    if (state.currentProblem === problems.length) {
      setResult((prev) => ({
        ...prev,
        score: Math.round((result.correctCount / (problemsLength - result.wrongCount)) * 100)
      }))

      window.scrollTo(0, 0)
      window.document.body.style.height = '1px'
    }
  }, [
    problems.length,
    problemsLength,
    result.correctCount,
    result.wrongCount,
    state.currentProblem
  ])

  const createComponent = (type, state) => {
    // state = { i, problem ,mod,setState,setResult }
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

  return (
    <section className="p-6">
      <PreventRefresh />

      <TheBreadcrumb>
        <BreadcrumbItem>
          <BreadcrumbPage>練習中</BreadcrumbPage>
        </BreadcrumbItem>
      </TheBreadcrumb>
      <div>
        {/* 顯示資訊 */}
        <StateBoard mod={state.currentProblem === problems.length ? 'completed' : 'progress'} />
        {/* 進度條 */}
        <Progress value={progressBar} />
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
      </div>

      {/* 顯示題目 */}
      <div>
        {problems.length > 0 &&
          problems.map((problem, i) => {
            if (state.currentProblem !== i) {
              return
            }
            return (
              <div
                key={problem.id}
                className="mx-auto my-2 flex w-full flex-col items-center sm:w-[80%] md:w-[70%]"
              >
                <div className="w-full px-5">
                  {createComponent(problem.type, {
                    i,
                    problem,
                    mod: 'one-problem-mod',
                    setState,
                    setResult
                  })}
                </div>
                {problem.type2 === '教學' && (
                  <Button
                    className="mt-5 w-full"
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        currentProblem: state.currentProblem + 1
                      }))
                    }}
                  >
                    確認
                  </Button>
                )}
              </div>
            )
          })}
      </div>
    </section>
  )
}
export default AutoTraining
