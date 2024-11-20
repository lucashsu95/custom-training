import { useContext } from 'react'
import { DataContext } from '@/context/DataContext'
import { Button } from '@/components/ui/button'
import { getProblemLength } from '@/lib/functions'
import PropTypes from 'prop-types'

export default function CustomTraining({
  result,
  createComponent,
  updateState,
  setResult,
  setMod
}) {
  const { problems } = useContext(DataContext)

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
      problem.due = problem.due === null ? 0 : problem.due
      problem.due += Math.max(count === len ? 1 : -1, -3)
      updateState(problem.id, problem.due)
      correctCount += count
      problemsLength += len
    }

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
  )
}

CustomTraining.propTypes = {
  updateState: PropTypes.func,
  setResult: PropTypes.func,
  setMod: PropTypes.func,
  createComponent: PropTypes.func,
  result: PropTypes.object
}
