import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { DataContext } from '@/App'
import { useMemo, useContext, useState } from 'react'
import Question from '@/classes/Question'

export default function TrainingPage() {
  const { questions } = useContext(DataContext)
  const [status, setStatus] = useState({
    pageIndex: 0,
    currentTag: '全部',
    questionNumber: 0
  })
  const questionsLength = useMemo(
    () =>
      status.currentTag === '全部'
        ? questions.length
        : questions.filter((x) => x.tag === status.currentTag).length,
    [questions, status.currentTag]
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'questionNumber' && (value > questionsLength || value < 0)) {
      return
    }
    if (name === 'currentTag') {
      setStatus((prevStatus) => ({
        ...prevStatus,
        questionNumber: 0
      }))
    }
    setStatus((prevStatus) => ({
      ...prevStatus,
      [name]: value
    }))
  }

  const tags = useMemo(() => {
    const tags = new Set()
    tags.add('全部')
    questions.forEach((question) => {
      tags.add(question.tag)
    })
    return Array.from(tags)
  }, [questions])

  const shuffleAry = (ary) => {
    return ary.sort(() => Math.random() - 0.5)
  }
  const [problems, setProblems] = useState([])

  const startTraining = (e) => {
    e.preventDefault()

    const selectedQuestions = questions.filter((question) => {
      if (status.currentTag === '全部') {
        return true
      }
      return question.tag === status.currentTag
    })
    const shuffledQuestions = shuffleAry(selectedQuestions)
    const problems = shuffledQuestions.slice(0, status.questionNumber)

    const displayedProblems = problems
      .map((problem) => Question.create(problem))
      .map((question) => {
        question.options = shuffleAry(Object.values(question.options))
        return question
      })
    setProblems(displayedProblems)
    setStatus((prev) => ({ ...prev, pageIndex: 1 }))
  }

  const [selectedOption, setSelectedOption] = useState(new Map())

  const handleSubmit = (e) => {
    e.preventDefault()
    const score = problems.reduce((acc, problem, i) => {
      const selected = selectedOption.get(i)
      if (selected === problem.answerStr) {
        return acc + 1
      }
      return acc
    }, 0)
    alert(`得分：${score}/${problems.length}`)
    setStatus((prev) => ({ ...prev, pageIndex: 2 }))
  }

  return (
    <section className="p-6">
      {status.pageIndex === 0 ? (
        <article>
          <h1 className="mb-2 text-xl font-bold">開始練習-設定</h1>
          <p className="text-gray-500">共有 {questionsLength} 題</p>
          <form onSubmit={startTraining} className="space-y-3">
            <div>
              <Label htmlFor="current-tag">標籤</Label>
              <Select
                id="current-tag"
                onValueChange={(value) => handleChange({ target: { name: 'currentTag', value } })}
              >
                <SelectTrigger className="w-full max-w-[280px]">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag, index) => (
                    <SelectItem value={tag} key={index}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="question-number">題數</Label>
              <Input
                name="questionNumber"
                type="number"
                id="question-number"
                value={status.questionNumber}
                onChange={handleChange}
                className="w-full max-w-[280px]"
                min="0"
                max={questionsLength}
              />
            </div>

            <Button>開始練習</Button>
          </form>
        </article>
      ) : (
        <article>
          <h1 className="mb-2 text-xl font-bold">練習中</h1>
          <p>共有 {problems.length} 題</p>
          <p>標籤：{status.currentTag}</p>
          <form className="my-5 space-y-12 md:p-6 md:shadow-lg" onSubmit={handleSubmit}>
            {problems.map((problem, i) => (
              <div key={i}>
                <h2>
                  {i + 1}. {problem.name}
                </h2>
                {problem.options.map((option, j) => {
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
                  const selectOption = () => {
                    setSelectedOption((prev) => {
                      prev.set(i, option)
                      return prev
                    })
                  }
                  return (
                    <div key={id} className="mt-2 space-y-2">
                      <input
                        type="radio"
                        name={`problem-${i}`}
                        id={id}
                        value={id}
                        className="peer mr-2"
                      />
                      <Label
                        className={`cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-gray-300 ${status.pageIndex === 1 && 'peer-checked:bg-sky-200'} ${status.pageIndex === 2 && optionClass}`}
                        htmlFor={id}
                        onClick={selectOption}
                      >{`${String.fromCharCode(j + 65)}. ${option}`}</Label>
                    </div>
                  )
                })}
              </div>
            ))}
            <Button>送出答案</Button>
          </form>
        </article>
      )}
    </section>
  )
}
