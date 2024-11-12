import { MatchingQuestion } from '@/classes/Question'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Input } from '@/components/ui/input'

export default function MatchingItem({ i, problem, setSelectedOption, selectedOption, mod }) {
  const options = useMemo(() => {
    const newOptions = new Map()
    problem.shuffledOptions.forEach((option, j) => {
      newOptions.set(String.fromCharCode(j + 65), option)
    })
    return newOptions
  }, [problem.shuffledOptions])

  const subSelectedOption = new Map()

  return (
    <>
      <h2 className="text-lg">{i + 1} 配對題. 請把對應的代號填入正確的輸入框內</h2>
      <div
        style={{ backgroundColor: `hsl(var(--background))` }}
        className="sticky top-0 my-2 flex flex-wrap justify-center gap-3 rounded-sm border p-3 text-sm shadow"
      >
        {[...options.keys()].map((optionKey) => (
          <div key={optionKey} className="flex">
            {optionKey}. {options.get(optionKey)}
          </div>
        ))}
      </div>
      <article className="mt-5 space-y-4 overflow-x-auto leading-10">
        {problem.shuffledName.map((part, j) => {
          const idx = problem.name.indexOf(part)
          const answer = problem.options[idx]
          const option = selectedOption.get(i)?.get(`${i}-${j}`)
          const isCorrect = answer === option

          const handleChange = (e) => {
            subSelectedOption.set(`${i}-${j}`, options.get(e.target.value.trim().toUpperCase()))
            setSelectedOption((prev) => {
              prev.set(i, subSelectedOption)
              return prev
            })
          }

          return (
            <span
              key={j}
              className="mt-2 grid w-full grid-cols-[max-content_auto] items-center gap-x-3 border-b pb-3 text-sm last:border-b-0 sm:w-full sm:text-base"
            >
              {mod === 'completed' ? (
                <div>
                  {!isCorrect && (
                    <span
                      className={`h-8 rounded px-2 py-1 ${!isCorrect && 'bg-red-200 dark:bg-red-500'}`}
                    >
                      {option}
                    </span>
                  )}
                  <span
                    className={`h-8 rounded px-2 py-1 ${!isCorrect && 'ml-2'} ${isCorrect ? 'bg-green-200 dark:bg-emerald-700' : 'bg-yellow-200 dark:bg-yellow-600'}`}
                  >
                    {answer}
                  </span>
                </div>
              ) : (
                <Input
                  type="text"
                  key={j}
                  onChange={handleChange}
                  className="inline h-8 w-10"
                  required
                />
              )}
              <div>{part}</div>
            </span>
          )
        })}
      </article>
    </>
  )
}
MatchingItem.propTypes = {
  i: PropTypes.number.isRequired,
  problem: PropTypes.instanceOf(MatchingQuestion).isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.instanceOf(Map).isRequired,
  mod: PropTypes.string.isRequired
}
