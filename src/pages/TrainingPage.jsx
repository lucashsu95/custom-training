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
import {
  FillInTheBlankQuestion,
  getQuestionByNumber,
  getQuestionByTag,
  MultipleChoiceQuestion,
  shuffleAry
} from '@/classes/Question'
import MultipleChoiceItem from '@/components/traiing/MultipleChoiceItem'
import FillInTheBlankItem from '@/components/traiing/FillInTheBlankItem'

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
    setStatus((prevStatus) => ({
      ...prevStatus,
      [e.target.name]: e.target.value
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

  const [problems, setProblems] = useState([])

  const startTraining = (e) => {
    e.preventDefault()
    const selectedQuestions = getQuestionByTag(questions, status.currentTag)
    const shuffledQuestions = shuffleAry(selectedQuestions)
    const correctProblems = getQuestionByNumber(shuffledQuestions, status.questionNumber)
    const displayedProblems = correctProblems.map((problem) =>
      problem.type === '選擇題'
        ? MultipleChoiceQuestion.create(problem)
        : FillInTheBlankQuestion.create(problem)
    )
    setProblems(displayedProblems)
    setStatus((prev) => ({ ...prev, pageIndex: 1 }))
  }

  const [selectedOption, setSelectedOption] = useState(new Map())
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
    setStatus((prev) => ({ ...prev, pageIndex: 2 }))
    window.scrollTo(0, 0)
    window.document.body.style.height = '1px'
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
          {result.score > -1 && (
            <>
              <div className="my-2 rounded-md bg-purple-200 p-3">
                <div
                  className={`${
                    result.score >= 85
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
          <form
            className="my-5 space-y-6 md:space-y-12 md:p-6 md:shadow-lg"
            onSubmit={handleSubmit}
          >
            {problems.map((problem, i) => (
              <section key={i} className="">
                {problem.type === '選擇題' ? (
                  <MultipleChoiceItem
                    key={i}
                    i={i}
                    problem={problem}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    pageIndex={status.pageIndex}
                  />
                ) : (
                  <FillInTheBlankItem
                    key={i}
                    i={i}
                    problem={problem}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    pageIndex={status.pageIndex}
                  />
                )}
              </section>
            ))}
            {result.score < 0 && <Button>送出答案</Button>}
          </form>
        </article>
      )}
    </section>
  )
}
