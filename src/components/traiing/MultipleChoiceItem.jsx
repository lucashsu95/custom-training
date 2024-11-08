import PropTypes from 'prop-types'
import { Label } from '@/components/ui/label'
import { MultipleChoiceQuestion } from '@/classes/Question'

export default function MultipleChoiceItem({ i, problem, setSelectedOption, selectedOption, mod }) {
  return (
    <>
      <h2 className="text-lg">
        {i + 1}. {problem.name}
      </h2>
      <article className="mt-3 space-y-2">
        {problem.shuffledOptions.map((option, j) => {
          const id = `${i}-${j}`
          const isCorrect = problem.answerStr === option && selectedOption.get(i) === option
          const isWrong = selectedOption.get(i) === option && !isCorrect
          const inWrongCorrect = problem.answerStr === option && !isCorrect
          const optionClass = isCorrect
            ? 'bg-green-200'
            : isWrong
              ? 'bg-red-200'
              : inWrongCorrect
                ? 'bg-yellow-200'
                : ''
          const handleChange = () => {
            setSelectedOption((prev) => {
              prev.set(i, option)
              return prev
            })
          }
          const Isprogress =
            mod === 'progress' && 'peer-checked:bg-sky-200 dark:peer-checked:bg-sky-500'

          return (
            <div key={id}>
              <input
                type="radio"
                name={`problem-${i}`}
                id={id}
                value={id}
                className="peer mr-2 hidden"
                required
              />
              <Label
                className={`w-full cursor-pointer rounded px-3 py-1.5 transition-colors hover:bg-gray-300 dark:hover:bg-gray-700 ${Isprogress} ${mod === 'completed' && optionClass}`}
                htmlFor={id}
                onClick={handleChange}
              >{`${String.fromCharCode(j + 65)}. ${option}`}</Label>
            </div>
          )
        })}
      </article>
    </>
  )
}

MultipleChoiceItem.propTypes = {
  i: PropTypes.number.isRequired,
  problem: PropTypes.instanceOf(MultipleChoiceQuestion).isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.instanceOf(Map).isRequired,
  mod: PropTypes.string.isRequired
}
