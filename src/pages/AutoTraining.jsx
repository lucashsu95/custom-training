// ui component
import PageHeader from '@/components/layout/PageHeader'
import TrainingHUD from '@/components/training/TrainingHUD'
import ScoreSummary from '@/components/molecules/ScoreSummary'
import { Button } from '@/components/ui/button'

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
  const [, setTime] = useState(0)

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
    <section className="overflow-hidden">
      <PageHeader title="練習中" />
      <section>
        {/* 顯示資訊 */}
        <TrainingHUD
          mod={trainingFinish ? 'completed' : 'progress'}
          initialTime={0}
          onTimeUpdate={setTime}
          current={state.currentProblem}
          total={problems.length}
          score={trainingFinish ? score : undefined}
        />

        {/* 進度條 */}
        <Progress value={Math.floor((state.currentProblem / problems.length) * 100)} className="my-2" />

        {/* 顯示成績 */}
        {trainingFinish && (
          <ScoreSummary
            score={score}
            correct={result.correctCount}
            wrong={result.wrongCount}
            total={problems.length}
          />
        )}
      </section>

      {/* 顯示題目 */}
      <section className="mx-auto w-full max-w-2xl">
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
          )}
      </section>

      {trainingFinish && (
        <Link to="/">
          <Button className="mt-3 w-full">回首頁</Button>
        </Link>
      )}
    </section>
  )
}
export default AutoTraining
