import PropTypes from 'prop-types'
import { MultipleChoiceQuestion } from '@/classes/Question'
import { DataContext } from '@/context/DataContext'
import { useContext } from 'react'

export default function MultipleChoiceItem({ i, problem, mod }) {
  const { setProblems } = useContext(DataContext)
  const selected = problem.selected

  return (
    <>
      <h2 className="text-lg">
        {i + 1}. {problem.name}
      </h2>
      {problem?.type2 === '教學' ? (
        <article className="ml-5">{problem.answerStr}</article>
      ) : (
        <article className="ml-3 flex w-full flex-col place-items-stretch gap-4">
          {problem.shuffledOptions.map((option, j) => {
            const id = `${i}-${j}`
            const isCorrect = problem.answerStr === option && selected === option
            const isWrong = selected === option && !isCorrect
            const inWrongCorrect = problem.answerStr === option && !isCorrect
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
            }
            const Isprogress =
              mod === 'progress' && 'has-[:checked]:bg-sky-200 dark:has-[:checked]:bg-sky-500'

            return (
              <div
                key={id}
                className={`flex items-center rounded border border-gray-200 ps-4 dark:border-gray-700 ${mod === 'completed' && optionClass}`}
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
                  onClick={handleChange}
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

MultipleChoiceItem.propTypes = {
  i: PropTypes.number.isRequired,
  problem: PropTypes.instanceOf(MultipleChoiceQuestion).isRequired,
  mod: PropTypes.string.isRequired
}
