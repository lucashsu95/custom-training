import { MatchingQuestion } from '@/classes/Question'
import PropTypes from 'prop-types'
import { Input } from '@/components/ui/input'
import { DataContext } from '@/App'
import { useContext } from 'react'

export default function MatchingItem({ i, problem, mod }) {
  const { setProblems } = useContext(DataContext)

  const options = new Map()
  problem.shuffledOptions.forEach((option, j) => {
    options.set(String.fromCharCode(j + 65), option)
  })

  const selected = problem.selected // type is Map()

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
          const option = selected.get(j)
          const isCorrect = answer === option

          const handleChange = (e) => {
            selected.set(j, options.get(e.target.value.trim().toUpperCase()))
            setProblems((prev) => {
              prev[i].selected = selected
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
                  className="ml-1 inline h-8 w-10"
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
  mod: PropTypes.string.isRequired
}
