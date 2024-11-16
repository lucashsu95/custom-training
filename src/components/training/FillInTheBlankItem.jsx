import { FillInTheBlankQuestion } from '@/classes/Question'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Input } from '@/components/ui/input'

export default function FillInTheBlankItem({ i, problem, setSelectedOption, selectedOption, mod }) {
  const options = useMemo(() => {
    const newOptions = new Map()
    problem.shuffledOptions.forEach((option, j) => {
      newOptions.set(String.fromCharCode(j + 65), option)
    })
    return newOptions
  }, [problem.shuffledOptions])

  const subSelectedOption = new Map()
  const problemName = problem.name.split('@@')

  return (
    <>
      <h2 className="text-lg">{i + 1} 填空題. 請把對應代號填入正確的輸入框內</h2>
      <div
        style={{ backgroundColor: `hsl(var(--background))` }}
        className="sticky top-0 my-2 flex flex-wrap justify-center gap-3 rounded-md border p-3 text-sm shadow"
      >
        {[...options.keys()].map((optionKey) => (
          <div key={optionKey} className="flex">
            {optionKey}. {options.get(optionKey)}
          </div>
        ))}
      </div>
      <article className="leading-10">
        {problemName.map((part, j) => {
          if (j === problemName.length - 1) {
            return <span key={j}>{part}</span>
          }

          const option = selectedOption.get(i)?.get(`${i}-${j}`)
          const answer = problem.options[j]
          const isCorrect = answer === option

          const handleChange = (e) => {
            subSelectedOption.set(`${i}-${j}`, options.get(e.target.value.trim().toUpperCase()))
            setSelectedOption((prev) => {
              prev.set(i, subSelectedOption)
              return prev
            })
          }

          return (
            <span key={j} className="text-sm md:text-base">
              <span>{part}</span>
              {mod === 'completed' ? (
                <>
                  {!isCorrect && (
                    <span
                      className={`inline h-8 w-28 rounded px-2 py-1 ${!isCorrect && 'bg-red-200 dark:bg-red-500'}`}
                    >
                      {option}
                    </span>
                  )}
                  <span
                    className={`inline h-8 w-28 rounded px-2 py-1 ${isCorrect ? 'bg-green-200 dark:bg-emerald-700' : 'bg-yellow-200 dark:bg-yellow-600'}`}
                  >
                    {answer}
                  </span>
                </>
              ) : (
                <Input
                  type="text"
                  key={j}
                  onChange={handleChange}
                  className="inline h-8 w-28"
                  required
                />
              )}
            </span>
          )
        })}
      </article>
    </>
  )
}
FillInTheBlankItem.propTypes = {
  i: PropTypes.number.isRequired,
  problem: PropTypes.instanceOf(FillInTheBlankQuestion).isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.instanceOf(Map).isRequired,
  mod: PropTypes.string.isRequired
}
