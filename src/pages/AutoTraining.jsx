// ui component
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import StateBoard from '@/components/training/StateBoard'
import { Button } from '@/components/ui/button'
import { RiCheckboxCircleFill } from 'react-icons/ri'

// react
import { useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

// provider
import { useQuestion } from '@/provider/QuestionProvider'
import { useSetting } from '@/provider/SettingProvider'
import { createComponent } from '@/utils/componentFactory'

function AutoTraining() {
  const { problems } = useQuestion()
  const { addTrainingCount } = useSetting()
  const [state, setState] = useState({
    currentProblem: 0
  })
  const [result, setResult] = useState({
    correctCount: 0,
    wrongCount: 0
  })

  const trainingFinish = useMemo(
    () => state.currentProblem === problems.length,
    [state.currentProblem, problems.length]
  )

  const score = useMemo(() => {
    const problemsLength = problems.filter((x) => x.type2 !== '教學' && x.afterErr === false).length
    return Math.min(result.correctCount * Math.ceil(100 / problemsLength), 100)
  }, [problems, result.correctCount])

  const id = problems
    .filter((x) => x.type2 !== '教學' && x.afterErr === false)
    .map((x) => x.id)
    .join('-')

  useEffect(() => {
    const hasAddTrainingCount = localStorage.getItem('hasAddTrainingCount')
    if (!hasAddTrainingCount || hasAddTrainingCount !== id) {
      if (trainingFinish && problems.length > 0) {
        addTrainingCount()
        localStorage.setItem('hasAddTrainingCount', id)
      }
    }
  }, [addTrainingCount, id, problems, trainingFinish])

  return (
    <section className="overflow-hidden p-6">
      <TheBreadcrumb>
        <BreadcrumbItem>
          <BreadcrumbPage>練習中</BreadcrumbPage>
        </BreadcrumbItem>
      </TheBreadcrumb>
      <section>
        {/* 顯示資訊 */}
        <StateBoard mod={trainingFinish ? 'completed' : 'progress'} />

        {/* 進度條 */}
        <div className="my-2 flex items-center gap-2 px-2 sm:gap-4 md:gap-6">
          <Progress value={Math.floor((state.currentProblem / problems.length) * 100)} />
          <RiCheckboxCircleFill className="h-5 w-5" />
        </div>

        {/* 顯示成績 */}
        {trainingFinish && (
          <>
            <div className="my-2 space-y-1 rounded-md bg-gray-200/25 px-5 py-3 text-gray-500 shadow dark:bg-gray-700/35 dark:text-gray-100/65">
              <div
                className={`${
                  score >= 80
                    ? 'font-bold text-green-500 dark:text-green-400'
                    : score >= 60
                      ? ''
                      : 'font-bold text-red-500 dark:text-red-400'
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
      <section className="mx-auto w-full max-w-[380px] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%]">
        {problems.length > 0 &&
          problems.map(
            (problem, i) =>
              (state.currentProblem === i ||
                (trainingFinish && !problem.afterErr && problem.type2 != '教學')) && (
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
                    (problem.selected !== '' &&
                      ((problem.type === '單字題' && problem.selected !== problem?.answer) ||
                        (problem.type === '多選題' && problem.hasSubmit && !problem.isCorrect()) ||
                        (problem.type === '單選題' && problem.selected !== problem?.answerStr)) &&
                      state.currentProblem !== problems.length)) && (
                    <Button
                      size="lg"
                      className="z-10 mt-5 w-full"
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
          )}
      </section>

      {trainingFinish && (
        <Link to="/">
          <Button className="z-10 mt-3 w-full">回首頁</Button>
        </Link>
      )}
    </section>
  )
}
export default AutoTraining
