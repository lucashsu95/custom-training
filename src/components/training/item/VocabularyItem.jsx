import PropTypes from 'prop-types'
import { VocabularyQuestion } from '@/classes/Question'
import { DataContext } from '@/context/DataContext'
import { useContext } from 'react'
import { useState } from 'react'
import { useQuestion } from '@/hooks/useQuestion'
import { IoIosWarning } from 'react-icons/io'
import { AiOutlineFire } from 'react-icons/ai'

export default function VocabularyItem({ i, problem, mod, setState, setResult }) {
  const { setProblems } = useContext(DataContext)
  const [hasSelected, setHasSelected] = useState(problem.selected !== '')
  const { updateDue } = useQuestion()

  return (
    <>
      {problem.type2 === '教學' && (
        <div className="motion-preset-bounce mt-1 flex items-center gap-2 text-green-500/70 -motion-translate-y-in-150 motion-delay-300 dark:text-green-300/60">
          <AiOutlineFire className="h-5 w-5" />
          New 新單字 !
        </div>
      )}
      {problem.due < -1 && (
        <div className="motion-preset-bounce mt-1 flex items-center gap-2 text-red-500/70 -motion-translate-y-in-150 motion-delay-300 dark:text-red-400/60">
          <IoIosWarning className="h-5 w-5" />
          不熟練的單字 !
        </div>
      )}
      {problem.afterErr && (
        <div className="motion-preset-bounce mt-1 text-yellow-500/80 -motion-translate-y-in-150 motion-delay-300 dark:text-yellow-400/60">
          再複習一下
        </div>
      )}
      <h2 className={`my-3 ${mod === 'one-problem-mod' ? 'text-2xl' : 'text-xl'}`}>
        {i + 1}. {problem.name}
      </h2>
      {problem?.type2 === '教學' ? (
        <article className="flex flex-col place-items-stretch gap-4 text-lg sm:ml-5">
          {problem.answer}
        </article>
      ) : (
        <article className="mt-2 flex w-full flex-col place-items-stretch gap-4 md:mt-0">
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
                className={`flex items-center rounded border border-gray-200 ps-4 dark:border-gray-700 ${Isprogress} ${(mod === 'completed' || hasSelected) && optionClass}`}
                onClick={handleChange}
              >
                <input
                  type="radio"
                  name={`problem-${i}`}
                  id={id}
                  value={id}
                  className={`${mod === 'one-problem-mod' ? 'hidden' : ''} from-radio peer mr-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600`}
                  required
                />
                <label
                  htmlFor={id}
                  className={`w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300`}
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
