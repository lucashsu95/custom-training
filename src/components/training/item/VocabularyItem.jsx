import PropTypes from 'prop-types'
import { VocabularyQuestion } from '@/classes/Question'
import { DataContext } from '@/context/DataContext'
import { useContext } from 'react'
import { useState } from 'react'
import { useQuestion } from '@/hooks/useQuestion'

export default function VocabularyItem({ i, problem, mod, setState, setResult }) {
  const { setProblems } = useContext(DataContext)
  const [hasSelected, setHasSelected] = useState(false)
  const { updateState } = useQuestion()

  return (
    <>
      {problem.type2 === '教學' && (
        <div className="mt-3 text-gray-500/70 dark:text-green-300/60">New 新單字 !</div>
      )}
      <h2 className="my-4 text-lg sm:my-3 md:my-2">
        {i + 1}. {problem.name}
      </h2>
      {problem?.type2 === '教學' ? (
        <article className="flex flex-col place-items-stretch gap-4 sm:ml-5">
          {problem.answer}
        </article>
      ) : (
        <article className="ml-3 flex w-full flex-col place-items-stretch gap-4">
          {problem.shuffledOptions.map((option, j) => {
            const id = `${i}-${j}`
            const isCorrect = problem.answer === option && problem.selected === option
            const isWrong = problem.selected === option && !isCorrect
            const inWrongCorrect = problem.answer === option && !isCorrect
            const optionClass = isCorrect
              ? 'bg-green-200 dark:bg-emerald-700'
              : isWrong
                ? 'bg-red-200 dark:bg-red-500'
                : inWrongCorrect
                  ? 'bg-yellow-200 dark:bg-yellow-600'
                  : ''
            const handleChange = () => {
              setProblems((prev) => {
                prev[i].selected = option
                return prev
              })

              if (mod === 'one-problem-mod') {
                const isCorrect = problem.answer === problem.selected
                if (hasSelected === false) {
                  setResult((prev) => ({
                    ...prev,
                    correctCount: prev.correctCount + (isCorrect ? 1 : 0),
                    wrongCount: prev.wrongCount + (isCorrect ? 0 : 1)
                  }))
                  if (!isCorrect) {
                    const problem2 = VocabularyQuestion.create({ ...problem })
                    setProblems((prev) => [...prev, problem2])
                  }
                  updateState(problem.id, problem.due + (isCorrect ? 1 : -2))
                }
                setHasSelected(true)
                if (isCorrect) {
                  setState((prev) => ({ ...prev, currentProblem: prev.currentProblem + 1 }))
                }
              }
            }

            const Isprogress =
              mod === 'progress' && 'has-[:checked]:bg-sky-200 dark:has-[:checked]:bg-sky-500'

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
                  className="from-radio h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  required
                />
                <label
                  htmlFor={id}
                  className={`ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300 ${Isprogress}`}
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
