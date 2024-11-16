import { FillInTheBlankQuestion } from '@/classes/Question'
import PropTypes from 'prop-types'
import { Input } from '@/components/ui/input'
import { DataContext } from '@/App'
import { useContext } from 'react'

export default function FillInTheBlankItem({ i, problem, mod }) {
  const { setProblems } = useContext(DataContext)

  const options = new Map()
  problem.shuffledOptions.forEach((option, j) => {
    options.set(String.fromCharCode(j + 65), option)
  })

  const selected = problem.selected // type is Map()
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

          const option = selected.get(j)
          const answer = problem.options[j]
          const isCorrect = answer === option

          const handleChange = (e) => {
            selected.set(j, options.get(e.target.value.trim().toUpperCase()))
            setProblems((prev) => {
              prev[i].selected = selected
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
  mod: PropTypes.string.isRequired
}
