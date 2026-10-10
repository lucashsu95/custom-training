// provider
import { useQuestion } from '@/provider/QuestionProvider'
import { createComponent } from '@/utils/componentFactory'
import { createQuestion } from '@/lib/functions'
import { useHistory } from '@/hooks/useHistory'
import { v4 as uuidv4 } from 'uuid'

// react
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// components
import PageHeader from '@/components/layout/PageHeader'
import TrainingHUD from '@/components/training/TrainingHUD'
import ScoreSummary from '@/components/molecules/ScoreSummary'
import ConfirmDialog from '@/components/common/ConfirmDialog'

function TrainingInProgress() {
  const { problems, setProblems, updateDue, trainingConfig } = useQuestion()
  const { addHistory } = useHistory()
  const [mod, setMod] = useState('progress')

  const [result, setResult] = useState({
    score: -1,
    correctCount: 0,
    wrongCount: 0
  })

  const [time, setTime] = useState(0)
  const [initialTime, setInitialTime] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)
  const formRef = useRef(null)

  // Restore state
  useEffect(() => {
    const saved = localStorage.getItem('trainingState')
    if (saved) {
      const state = JSON.parse(saved)
      if (state.problems && state.problems.length > 0) {
        setProblems(state.problems.map((p) => createQuestion(p)))
      }
      if (state.result) setResult(state.result)
      if (state.mod) setMod(state.mod)
      if (state.time) {
        setTime(state.time)
        setInitialTime(state.time)
      }
    }
  }, [setProblems])

  // Save state
  useEffect(() => {
    if (problems && problems.length > 0 && mod !== 'completed') {
      const state = {
        problems: problems.map((p) => p.toPayload()),
        result,
        mod,
        time
      }
      localStorage.setItem('trainingState', JSON.stringify(state))
    }
  }, [problems, result, mod, time])

  // Clear on unmount
  useEffect(() => {
    return () => {
      // In a SPA, unmount happens when navigating away or reloading.
      // To persist across reload but clear on "leaving", we can't easily distinguish them in useEffect cleanup.
      // Usually "leaving the page" means navigating to another route.
      // If we want to support reload, we should NOT clear in cleanup if we can't tell it's a reload.
      // However, the requirement specifically asked for it.
      // I will implement a check if the current path is NOT the training path.
      if (window.location.pathname !== '/training/in-progress') {
        localStorage.removeItem('trainingState')
      }
    }
  }, [])

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

    // Save history
    const historyEntry = {
      id: uuidv4(),
      timestamp: Date.now(),
      mode: trainingConfig.mode,
      tags: trainingConfig.tags,
      score,
      correctCount,
      wrongCount: problemsLength - correctCount,
      totalQuestions: problemsLength
    }
    addHistory(historyEntry)

    setMod('completed')
    localStorage.removeItem('trainingState')
    window.scrollTo(0, 0)
  }

  return (
    <section>
      <PageHeader title="練習中" description="作答完成後送出，系統會計算分數並記錄歷史" />
      <div>
        {/* 顯示資訊 */}
        <TrainingHUD mod={mod} onTimeUpdate={setTime} initialTime={initialTime} />

        {/* 顯示成績 */}
        {result.score > -1 && (
          <ScoreSummary
            score={result.score}
            correct={result.correctCount}
            wrong={result.wrongCount}
            total={result.correctCount + result.wrongCount}
          />
        )}

        {/* 題目作答 */}

        <form ref={formRef} className="my-5 space-y-6 md:space-y-12 md:p-6 md:shadow-lg" onSubmit={handleSubmit}>
          {problems.map((problem) => (
            <section key={problem.id}>
              {createComponent(problem.type, {
                i: problems.indexOf(problem),
                problem,
                mod
              })}
            </section>
          ))}
          {result.score < 0 ? (
            <>
              <Button>送出答案</Button>
              <Button type="button" className="ml-2" variant="secondary" onClick={() => setConfirmReset(true)}>
                重設
              </Button>
            </>
          ) : (
            <Link to="/">
              <Button className="z-10 w-full">回首頁</Button>
            </Link>
          )}
        </form>
      </div>
      <ConfirmDialog
        open={confirmReset}
        onOpenChange={(v) => !v && setConfirmReset(false)}
        title="重設作答"
        description="確定要清除目前所有作答內容嗎？此動作無法復原。"
        confirmLabel="重設"
        onConfirm={() => {
          formRef.current?.reset()
          setConfirmReset(false)
        }}
      />
    </section>
  )
}
export default TrainingInProgress
