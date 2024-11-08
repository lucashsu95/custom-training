import MultipleChoiceItem from '@/components/traiing/MultipleChoiceItem'
import FillInTheBlankItem from '@/components/traiing/FillInTheBlankItem'
import { Button } from '@/components/ui/button'

import { DataContext } from '@/App'
import { useContext, useState, useMemo } from 'react'
import { getTags } from '@/classes/Question'
import { Link } from 'react-router-dom'
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import MatchingItem from '@/components/traiing/MatchingItem'

function TrainingInProgress() {
  const { problems } = useContext(DataContext)
  const [selectedOption, setSelectedOption] = useState(new Map())
  const [mod, setMod] = useState('progress')

  const tags = useMemo(() => getTags(problems), [problems])

  const [result, setResult] = useState({
    score: -1,
    correctCount: 0,
    wrongCount: 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const correctCount = problems.reduce((acc, problem, i) => {
      const selected = selectedOption.get(i)
      if (problem.type === '選擇題') {
        return acc + (selected === problem.answerStr ? 1 : 0)
      }
      if (problem.type === '填空題') {
        return (
          acc +
          problem.options.reduce(
            (acc, option, j) => (selected.get(`${i}-${j}`) === option ? acc + 1 : acc),
            0
          )
        )
      }
      if(problem.type === '配對題') {
        return (
          acc +
          problem.shuffledName.reduce(
            (acc, name, j) => (selected.get(`${i}-${j}`) === problem.options[problem.name.indexOf(name)] ? acc + 1 : acc),
            0
          )
        )
      }
      return acc
    }, 0)
    const problemsLength = problems.reduce(
      (acc, problem) => acc + (problem.type === '選擇題' ? 1 : problem.options.length),
      0
    )
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
      <article>
        <h1 className="my-2 text-xl font-bold">練習中</h1>
        <p>共有 {problems.length} 題</p>
        <p>
          標籤：
          {tags.map((tag, index) => (
            <span className="w-max rounded border px-2 py-1" key={index}>
              {tag}
            </span>
          ))}
        </p>
        {result.score > -1 && (
          <>
            <div className="my-2 rounded-md bg-purple-200 p-3">
              <div
                className={`${
                  result.score >= 80
                    ? 'font-bold text-green-500'
                    : result.score >= 60
                      ? ''
                      : 'font-bold text-red-500'
                } text-lg`}
              >
                {result.score}分
              </div>
              <div className="text-xs">答對：{result.correctCount} </div>
              <div className="text-xs">答錯：{result.wrongCount}</div>
            </div>
          </>
        )}
        <form className="my-5 space-y-6 md:space-y-12 md:p-6 md:shadow-lg" onSubmit={handleSubmit}>
          {problems.map((problem, i) => (
            <section key={i} className="">
              {problem.type === '選擇題' ? (
                <MultipleChoiceItem
                  key={i}
                  i={i}
                  problem={problem}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  mod={mod}
                />
              ) : problem.type === '填空題' ? (
                <FillInTheBlankItem
                  key={i}
                  i={i}
                  problem={problem}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  mod={mod}
                />
              ) : (
                <MatchingItem
                  key={i}
                  i={i}
                  problem={problem}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  mod={mod}
                />
              )}
            </section>
          ))}
          {result.score < 0 && <Button>送出答案</Button>}
        </form>
      </article>
    </section>
  )
}

export default TrainingInProgress
