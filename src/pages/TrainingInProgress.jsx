// ui component
import { Button } from '@/components/ui/button'
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

// question component
import MultipleChoiceItem from '@/components/training/MultipleChoiceItem'
import FillInTheBlankItem from '@/components/training/FillInTheBlankItem'
import MatchingItem from '@/components/training/MatchingItem'

import { DataContext } from '@/App'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import StateBoard from '@/components/training/StateBoard'
import { FillInTheBlankQuestion, MatchingQuestion } from '@/classes/Question'

function TrainingInProgress() {
  const { problems } = useContext(DataContext)
  const [selectedOption, setSelectedOption] = useState(new Map())
  const [mod, setMod] = useState('progress')

  const [result, setResult] = useState({
    score: -1,
    correctCount: 0,
    wrongCount: 0
  })

  const getCorrectCount = () =>
    problems.reduce((acc, problem, i) => {
      const selected = selectedOption.get(i)
      if (problem.type === '選擇題') {
        return acc + (selected === problem.answerStr ? 1 : 0)
      }
      if (problem.type === '填空題') {
        return acc + FillInTheBlankQuestion.getCorrectCount(problem, selected, i)
      }
      if (problem.type === '配對題') {
        return acc + MatchingQuestion.getCorrectCount(problem, selected, i)
      }
      return acc
    }, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const problemsLength = problems.reduce(
      (acc, problem) => acc + (problem.type === '選擇題' ? 1 : problem.options.length),
      0
    )
    const correctCount = getCorrectCount()
    const score = Math.round((correctCount / problemsLength) * 100)
    setResult({
      score,
      correctCount,
      wrongCount: problemsLength - correctCount
    })
    setMod('completed')
    window.scrollTo(0, 0)
    window.document.body.style.height = '1px'
  }

  return (
    <section className="p-6">
      <TheBreadcrumb>
        <BreadcrumbItem>
          <Link to="/training/setting">練習設定頁面</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>練習中</BreadcrumbPage>
        </BreadcrumbItem>
      </TheBreadcrumb>
      <div>
        <StateBoard mod={mod} />
        <form className="my-5 space-y-6 md:space-y-12 md:p-6 md:shadow-lg" onSubmit={handleSubmit}>
          {problems.map((problem, i) => {
            const state = {
              i: i,
              problem: problem,
              selectedOption: selectedOption,
              setSelectedOption: setSelectedOption,
              mod: mod
            }
            return (
              <section key={i}>
                {problem.type === '選擇題' ? (
                  <MultipleChoiceItem key={i} {...state} />
                ) : problem.type === '填空題' ? (
                  <FillInTheBlankItem key={i} {...state} />
                ) : (
                  <MatchingItem key={i} {...state} />
                )}
              </section>
            )
          })}
          {result.score < 0 && (
            <>
              <Button>送出答案</Button>
              <Button type="reset" className="ml-2" variant="secondary">
                重設
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}

export default TrainingInProgress
