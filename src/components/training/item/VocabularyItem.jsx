import PropTypes from 'prop-types'
import { VocabularyQuestion } from '@/classes/Question'
import { DataContext } from '@/context/DataContext'
import { useContext } from 'react'
import { useState } from 'react'
import { useQuestion } from '@/hooks/useQuestion'

export default function VocabularyItem({ i, problem, mod, setState, setResult }) {
  const { setProblems } = useContext(DataContext)
  const [hasSelected, setHasSelected] = useState(false)
  const { updateDue } = useQuestion()

  return (
    <>
      {problem.type2 === '教學' && (
        <div className="motion-preset-bounce mt-3 text-green-500/70 -motion-translate-y-in-150 motion-delay-300 dark:text-green-300/60">
          New 新單字 !
        </div>
      )}
      {problem.due < -1 && (
        <div className="motion-preset-bounce mt-3 text-red-500/70 -motion-translate-y-in-150 motion-delay-300 dark:text-red-400/60">
          不熟練的單字 !
        </div>
      )}
      {problem.afterErr && (
        <div className="motion-preset-bounce mt-3 text-yellow-500/80 -motion-translate-y-in-150 motion-delay-300 dark:text-yellow-400/60">
          再複習一下
        </div>
      )}
      <h2 className="my-6 text-lg sm:my-3 md:my-2">
        {i + 1}. {problem.name}
      </h2>
      {problem?.type2 === '教學' ? (
        <article className="flex flex-col place-items-stretch gap-4 sm:ml-5">
          {problem.answer}
        </article>
      ) : (
        <article className="flex w-full flex-col place-items-stretch gap-4">
          {problem.shuffledOptions.map((option, j) => {
            const id = `${i}-${j}`
            const isCorrect = problem.answer === option && problem.selected === option
            const isWrong = problem.selected === option && !isCorrect
            const inWrongCorrect = problem.answer === option && !isCorrect
            const optionClass = isCorrect
              ? 'bg-green-200 dark:bg-emerald-700 motion-preset-confetti'
              : isWrong
                ? 'bg-red-200 dark:bg-red-500 motion-preset-shake'
                : inWrongCorrect
                  ? 'bg-yellow-200 dark:bg-yellow-600'
                  : ''
            const Isprogress =
              mod === 'progress' && 'has-[:checked]:bg-sky-200 dark:has-[:checked]:bg-sky-500'

            const handleChange = () => {
              setProblems((prev) => {
                prev[i].selected = option
                return prev
              })

              if (mod === 'one-problem-mod') {
                if (hasSelected === false) {
                  const isCorrect = problem.selected === problem.answer
                  if (!isCorrect) {
                    const problem2 = VocabularyQuestion.create({ ...problem, afterErr: true })
                    setProblems((prev) => [...prev, problem2])
                  }
                  if (!problem.afterErr) {
                    setResult((prev) => ({
                      ...prev,
                      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
                      wrongCount: prev.wrongCount + (isCorrect ? 0 : 1)
                    }))
                    updateDue(problem.id, isCorrect)
                  }
                  setHasSelected(true)
                  if (isCorrect) {
                    setTimeout(() => {
                      setState((prev) => ({ ...prev, currentProblem: prev.currentProblem + 1 }))
                    }, 700)
                  }
                }
              }
            }

            return (
              <div
                key={id}
                className={`flex items-center rounded border border-gray-200 ps-4 dark:border-gray-700 ${(mod === 'completed' || hasSelected) && optionClass}`}
                onClick={handleChange}
              >
                <input
                  type="radio"
                  name={`problem-${i}`}
                  id={id}
                  value={id}
                  className="hidden"
                  required
                />
                <label
                  htmlFor={id}
                  className={`w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300 ${Isprogress}`}
                >{`${String.fromCharCode(j + 65)}. ${option}`}</label>
              </div>
            )
          })}
        </article>
      )}
    </>
  )
}

VocabularyItem.propTypes = {
  i: PropTypes.number.isRequired,
  problem: PropTypes.instanceOf(VocabularyQuestion).isRequired,
  mod: PropTypes.string.isRequired,
  setState: PropTypes.func,
  setResult: PropTypes.func
}
