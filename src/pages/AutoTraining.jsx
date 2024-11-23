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
import { Progress } from '@/components/ui/progress'
import { useMemo } from 'react'

function AutoTraining() {
  const { problems } = useContext(DataContext)
  const [state, setState] = useState({
    currentProblem: 0
  })

  const [result, setResult] = useState({
    correctCount: 0,
    wrongCount: 0
  })

  const score = useMemo(() => {
    const problemsLength = problems.filter((x) => x.type2 !== '教學' && x.afterErr === false).length
    return Math.floor(result.correctCount * Math.floor(100 / problemsLength))
  }, [problems, result.correctCount])

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
      <section>
        {/* 顯示資訊 */}
        <StateBoard mod={state.currentProblem === problems.length ? 'completed' : 'progress'} />
        {/* 進度條 */}
        <Progress value={Math.floor((state.currentProblem / problems.length) * 100)} />
        {/* 顯示成績 */}
        {state.currentProblem === problems.length && (
          <>
            <div className="my-2 rounded-md bg-purple-200 p-3 dark:bg-purple-400">
              <div
                className={`${
                  score >= 80
                    ? 'font-bold text-green-500 dark:text-green-300'
                    : score >= 60
                      ? ''
                      : 'font-bold text-red-500 dark:text-red-300'
                } text-lg`}
              >
                {score}分
              </div>
              <div className="text-xs">答對：{result.correctCount} </div>
              <div className="text-xs">答錯：{result.wrongCount}</div>
            </div>
          </>
        )}
      </section>

      {/* 顯示題目 */}
      <section className="mx-auto w-[220px] sm:w-[60%]">
        {problems.length > 0 &&
          problems.map((problem, i) => {
            return (
              state.currentProblem === i && (
                <div
                  key={`${problem.id}-${i}`}
                  className="motion-preset-slide-left mx-auto my-2 flex w-full flex-col items-center motion-duration-300 sm:items-start"
                >
                  {createComponent(problem.type, {
                    i,
                    problem,
                    mod: 'one-problem-mod',
                    setState,
                    setResult
                  })}
                  {(problem.type2 === '教學' ||
                    (problem.selected !== '' && problem.selected !== problem.answer)) && (
                    <Button
                      size="lg"
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
            )
          })}
      </section>
    </section>
  )
}
export default AutoTraining
