import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import {
  FillInTheBlankQuestion,
  getQuestionByNumber,
  getQuestionByTag,
  getTags,
  MultipleChoiceQuestion,
  shuffleAry
} from '@/classes/Question'

import { DataContext } from '@/App'
import { useMemo, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TrainingSettings() {
  const { questions, setProblems } = useContext(DataContext)
  const navigate = useNavigate()

  const [status, setStatus] = useState({
    currentTags: new Set(['全部']),
    questionNumber: 0
  })

  const questionsLength = useMemo(
    () => getQuestionByTag(questions, status.currentTags).length,
    [questions, status.currentTags]
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'tag') {
      const value = e.target.dataset.value
      if (status.currentTags.has(value)) {
        status.currentTags.delete(value)
      } else {
        status.currentTags.add(value)
      }
      setStatus((prevStatus) => ({
        ...prevStatus,
        currentTags: new Set(status.currentTags),
        questionNumber: getQuestionByTag(questions, status.currentTags).length
      }))
      return
    }
    setStatus((prevStatus) => ({
      ...prevStatus,
      [name]: value
    }))
  }

  const tags = useMemo(() => {
    const ary = getTags(questions)
    ary.unshift('全部')
    return ary
  }, [questions])

  const startTraining = (e) => {
    e.preventDefault()
    if (status.currentTags.length < 1) {
      alert('請選擇標籤')
      return
    }
    const selectedQuestions = getQuestionByTag(questions, status.currentTags)
    const shuffledQuestions = shuffleAry(selectedQuestions)
    const correctProblems = getQuestionByNumber(shuffledQuestions, status.questionNumber)
    const displayedProblems = correctProblems.map((problem) =>
      problem.type === '選擇題'
        ? MultipleChoiceQuestion.create(problem)
        : FillInTheBlankQuestion.create(problem)
    )
    setProblems(displayedProblems)
    navigate('/training/in-progress')
  }

  return (
    <section className="p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>練習設定頁面</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <article className="mx-auto mt-3 max-w-96 rounded-md border p-5">
        <h1 className="my-2 text-xl font-bold">練習設定頁面</h1>
        <form onSubmit={startTraining} className="space-y-5">
          <div>
            <Label className="text-base" htmlFor="current-tag">
              標籤：
            </Label>
            <ToggleGroup type="multiple" variant="outline" className="flex-wrap">
              {tags.map((tag) => (
                <ToggleGroupItem
                  value={tag}
                  key={tag}
                  data-value={tag}
                  name="tag"
                  data-state={status.currentTags.has(tag) ? 'on' : 'off'}
                  onClick={handleChange}
                >
                  {status.currentTags.has(tag) && <span>✔</span>}
                  {tag}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <Label className="text-base" htmlFor="question-number">
              題數：
            </Label>
            <Input
              name="questionNumber"
              type="number"
              id="question-number"
              value={status.questionNumber}
              onChange={handleChange}
              className="w-full max-w-[280px]"
              min="0"
              max={questionsLength}
              required
            />
            <p className="ml-1 text-sm text-gray-500">共有 {questionsLength} 題</p>
          </div>

          <Button>開始練習</Button>
        </form>
      </article>
    </section>
  )
}

export default TrainingSettings
