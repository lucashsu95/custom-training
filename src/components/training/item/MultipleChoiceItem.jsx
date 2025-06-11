import PropTypes from 'prop-types'
import { MultipleChoiceQuestion } from '@/classes/Question'
import { useQuestion } from '@/provider/QuestionProvider'

import { AiOutlineFire } from 'react-icons/ai'
import { IoIosWarning } from 'react-icons/io'
import { Button } from '@/components/ui/button'

export default function MultipleChoiceItem({ i, problem, mod, setResult, setState }) {
  const { setProblems, updateDue } = useQuestion()
  const hasSubmit = problem.hasSubmit
  const handleSubmit = () => {
    if (mod !== 'one-problem-mod') return
    if (hasSubmit) return
    const isCorrect = problem.isCorrect()
    if (!isCorrect) {
      const problem2 = MultipleChoiceQuestion.create({
        ...problem,
        shuffledOptions: null,
        selected: null,
        hasSubmit: null,
        afterErr: true
      })
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
    problem.hasSubmit = true
    if (isCorrect) {
      setTimeout(() => {
        setState((prev) => ({ ...prev, currentProblem: prev.currentProblem + 1 }))
      }, 700)
    }
  }

  return (
    <>
      {problem.type2 === '教學' && (
        <div className="motion-preset-bounce mt-1 flex items-center gap-2 text-green-500/70 -motion-translate-y-in-150 motion-delay-300 dark:text-green-300/60">
          <AiOutlineFire className="h-5 w-5" />
          New 新題目 !
        </div>
      )}
      {problem.due <= -1 && (
        <div className="motion-preset-bounce mt-1 flex items-center gap-2 text-red-500/70 -motion-translate-y-in-150 motion-delay-300 dark:text-red-400/60">
          <IoIosWarning className="h-5 w-5" />
          不熟練的題目 !
        </div>
      )}
      {problem.afterErr && (
        <div className="motion-preset-bounce mt-1 text-yellow-500/80 -motion-translate-y-in-150 motion-delay-300 dark:text-yellow-400/60">
          再複習一下
        </div>
      )}
      <h2 className="my-2 text-lg">
        {mod === 'one-problem-mod' ? '' : i + 1 + '.'} {problem.name} <br />({problem.type})
      </h2>
      {problem?.type2 === '教學' ? (
        <article className="sm:ml-5">
          <ul className="list-inside list-disc">
            {problem.answers.map((answer, j) => (
              <li key={`${i}-${j}-answer`}>
                <span className="text-gray-900 dark:text-gray-300">{answer}</span>
              </li>
            ))}
          </ul>
        </article>
      ) : (
        <article className="flex w-full flex-col place-items-stretch gap-4">
          {problem.shuffledOptions.map((option, j) => {
            const hasSelected = problem.selected.includes(option)

            const id = `${i}-${j}-${hasSelected}`
            const isCorrect = problem.answers.includes(option) && problem.selected.includes(option)
            const isWrong = problem.options.includes(option) && hasSelected
            const inWrongCorrect = problem.answers.includes(option) && !isCorrect
            const optionClass = isCorrect
              ? 'bg-green-200 dark:bg-emerald-700 motion-preset-confetti'
              : isWrong
                ? 'bg-red-200 dark:bg-red-500 motion-preset-shake'
                : inWrongCorrect
                  ? 'bg-yellow-200 dark:bg-yellow-600'
                  : ''

            const Isprogress = hasSubmit || mod === 'completed'
              ? ''
              : 'has-[:checked]:bg-sky-200 dark:has-[:checked]:bg-sky-500'

            const handleClick = () => {
              if((mod === 'one-problem-mod' && hasSubmit) || mod === 'completed') return
              setProblems((prev) => {
                const newProblems = [...prev]

                if (newProblems[i].selected.includes(option)) {
                  newProblems[i] = MultipleChoiceQuestion.create({
                    ...newProblems[i],
                    selected: newProblems[i].selected.filter((item) => item !== option)
                  })
                } else {
                  newProblems[i] = MultipleChoiceQuestion.create({
                    ...newProblems[i],
                    selected: [...newProblems[i].selected, option]
                  })
                }
                return newProblems
              })
            }

            return (
              <div
                key={id}
                className={`flex items-center rounded border border-gray-200 px-4 dark:border-gray-700 ${Isprogress} ${(mod === 'completed' || hasSubmit) && optionClass}`}
                onClick={handleClick}
              >
                <input
                  type="checkbox"
                  name={`problem-${i}`}
                  id={id}
                  value={id}
                  className='from-checkbox mr-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  checked={problem.selected.includes(option)}
                  disabled={hasSubmit || mod === 'completed'}
                  onChange={() => {}}
                />
                <label
                  htmlFor={id}
                  className={`w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300 sm:ms-2`}
                >
                  {mod === 'one-problem-mod' ? '' : String.fromCharCode(j + 65) + '.'} {option}
                </label>
              </div>
            )
          })}
          {mod === 'one-problem-mod' && !hasSubmit && (
            <Button onClick={handleSubmit} disabled={hasSubmit} className="mt-3 w-full">
              送出答案
            </Button>
          )}
        </article>
      )}
    </>
  )
}

MultipleChoiceItem.propTypes = {
  i: PropTypes.number.isRequired,
  problem: PropTypes.instanceOf(MultipleChoiceQuestion).isRequired,
  mod: PropTypes.string.isRequired,
  setResult: PropTypes.func,
  setState: PropTypes.func
}
