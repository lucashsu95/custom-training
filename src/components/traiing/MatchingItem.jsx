import { MatchingQuestion } from '@/classes/Question'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Input } from '@/components/ui/input'

export default function MatchingItem({ i, problem, setSelectedOption, selectedOption, mod }) {
  // Object
  const options = useMemo(() => {
    const newOptions = {}
    problem.shuffledOptions.forEach((option, j) => {
      newOptions[String.fromCharCode(j + 65)] = option
    })
    return newOptions
  }, [problem.shuffledOptions])

  const subSelectedOption = new Map()

  return (
    <>
      <h2 className="text-lg">{i + 1} 配對題. 請把對應的代號填入正確的輸入框內</h2>
      <div className="my-2 flex flex-wrap justify-center gap-3 rounded-sm border p-3 text-sm shadow">
        {Object.keys(options).map((optionKey) => (
          <div key={optionKey} className="flex">
            {optionKey}. {options[optionKey]}
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-4 overflow-x-auto leading-10">
        {problem.shuffledName.map((part, j) => {
          const idx = problem.name.indexOf(part)
          const answer = problem.options[idx]
          const option = selectedOption.get(i)?.get(`${i}-${j}`)
          const isCorrect = answer === option

          const handleChange = (e) => {
            subSelectedOption.set(`${i}-${j}`, options[e.target.value.trim().toUpperCase()])
            setSelectedOption((prev) => {
              prev.set(i, subSelectedOption)
              return prev
            })
          }

          return (
            <span
              key={j}
              className="grid w-max grid-cols-[max-content_auto] items-center gap-x-3 border-b last:border-b-0 mt-2 pb-3 text-sm sm:w-full sm:text-base"
            >
              {mod === 'completed' ? (
                <div>
                  {!isCorrect && (
                    <span className={`h-8 rounded px-2 py-1 ${!isCorrect && 'bg-red-200'}`}>
                      {option}
                    </span>
                  )}
                  <span
                    className={`h-8 rounded px-2 py-1 ${!isCorrect && 'ml-2'} ${isCorrect ? 'bg-green-200' : 'bg-yellow-200'}`}
                  >
                    {answer}
                  </span>
                </div>
              ) : (
                <Input
                  type="text"
                  key={j}
                  onChange={handleChange}
                  className="inline h-8 w-14"
                  required
                />
              )}
              <div>{part}</div>
            </span>
          )
        })}
      </div>
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
