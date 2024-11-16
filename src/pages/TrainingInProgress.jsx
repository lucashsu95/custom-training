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
import { getTags } from '@/classes/Question'
import { Link } from 'react-router-dom'
import { Toggle } from '@/components/ui/toggle'

function TrainingInProgress() {
  const { problems } = useContext(DataContext)
  const [selectedOption, setSelectedOption] = useState(new Map())
  const [mod, setMod] = useState('progress')

  const tags = getTags(problems)
  // const [isActive, setIsActive] = useState(true)
  // const [time, setTime] = useState(0)

  // Timer
  // useEffect(() => {
  //   let interval = null
  //   if (isActive) {
  //     interval = setInterval(() => {
  //       setTime((prevTime) => prevTime + 1)
  //     }, 1000)
  //   } else if (!isActive && time !== 0) {
  //     clearInterval(interval)
  //   }
  //   return () => clearInterval(interval)
  // }, [isActive, time])

  // const startTimer = () => {
  //   setIsActive(true)
  // }

  // const stopTimer = () => {
  //   setIsActive(false)
  // }

  // const resetTimer = () => {
  //   setTime(0)
  //   setIsActive(false)
  // }

  // useEffect(() => {
  //   startTimer()
  // }, [])

  // const formatTime = (seconds) => {
  //   const minutes = Math.floor(seconds / 60)
  //   const remainingSeconds = seconds % 60
  //   return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  // }

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
      if (problem.type === '配對題') {
        return (
          acc +
          problem.shuffledName.reduce(
            (acc, name, j) =>
              selected.get(`${i}-${j}`) === problem.options[problem.name.indexOf(name)]
                ? acc + 1
                : acc,
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
    // stopTimer()
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
        <section className="my-2 space-y-3 rounded-lg border p-4 shadow">
          <h1 className="text-xl font-bold">練習中</h1>
          <ul className="ml-5 list-outside list-disc leading-7">
            <li>共有 {problems.length} 題</li>
            <li>
              標籤：
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag, index) => (
                  <Toggle variant="outline" key={index} disabled>
                    {tag}
                  </Toggle>
                ))}
              </div>
            </li>
            {/* <li>
              <b>時間：</b>
              {formatTime(time)}{' '}
            </li> */}
          </ul>
        </section>
        {result.score > -1 && (
          <>
            <div className="my-2 rounded-md bg-purple-200 p-3 dark:bg-purple-400">
              <div
                className={`${
                  result.score >= 80
                    ? 'font-bold text-green-500 dark:text-green-300'
                    : result.score >= 60
                      ? ''
                      : 'font-bold text-red-500 dark:text-red-300'
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
            <section key={i}>
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
