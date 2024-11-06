import { FillInTheBlankQuestion } from '@/classes/Question'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Input } from '@/components/ui/input'

export default function FillInTheBlankItem({
  i,
  problem,
  setSelectedOption,
  selectedOption,
  pageIndex
}) {
  console.log('problem:', problem)

  const options = useMemo(() => {
    // Object
    const newOptions = {}
    problem.shuffledOptions.forEach((option, j) => {
      newOptions[String.fromCharCode(j + 65)] = option
    })
    return newOptions
  }, [problem.shuffledOptions])

  const subSelectedOption = new Map()

  return (
    <>
      <h2 className="text-lg">{i + 1} 請把對應的代號填入正確的輸入框內</h2>
      <div className="my-2 flex flex-wrap justify-center gap-3 rounded-md border p-3 text-sm shadow">
        {Object.keys(options).map((optionKey) => (
          <div key={optionKey} className="flex">
            {optionKey}. {options[optionKey]}
          </div>
        ))}
      </div>
      <h3 className="leading-10">
        {problem.name.split('@@').map((part, j) => {
          if (j === problem.name.split('@@').length - 1) {
            return <span key={j}>{part}</span>
          }

          const option = selectedOption.get(i)?.get(`${i}-${j}`)
          const answer = problem.options[j]
          const isCorrect = answer === option

          const handleChange = (e) => {
            subSelectedOption.set(`${i}-${j}`, options[e.target.value.trim().toUpperCase()])
            setSelectedOption((prev) => {
              prev.set(i, subSelectedOption)
              return prev
            })
            console.log(selectedOption)
          }

          return (
            <span key={j} className="text-sm md:text-base">
              <span>{part}</span>
              {pageIndex === 2 ? (
                <>
                  {!isCorrect && (
                    <span
                      className={`inline h-8 w-28 rounded px-2 py-1 ${!isCorrect && 'bg-red-200'}`}
                    >
                      {option}
                    </span>
                  )}
                  <span
                    className={`inline h-8 w-28 rounded px-2 py-1 ${isCorrect ? 'bg-green-200' : 'bg-yellow-200'}`}
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
      </h3>
    </>
  )
}
FillInTheBlankItem.propTypes = {
  i: PropTypes.number.isRequired,
  problem: PropTypes.instanceOf(FillInTheBlankQuestion).isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.instanceOf(Map).isRequired,
  pageIndex: PropTypes.number.isRequired
}
