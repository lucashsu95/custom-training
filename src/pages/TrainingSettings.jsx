import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import TheBreadcrumb from '@/components/TheBreadcrumb'

import { DataContext } from '@/App'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getQuestionByNumber,
  getQuestionByTag,
  getTags,
  getProblemType,
  shuffleAry
} from '@/lib/functions'

function TrainingSettings() {
  // init state
  const { questions, setProblems } = useContext(DataContext)
  const navigate = useNavigate()

  const [status, setStatus] = useState({
    currentTags: new Set(),
    questionNumber: 0
  })

  const questionsLength = getQuestionByTag(questions, status.currentTags).length

  // handle Start
  const handleTagChange = (value) => {
    const updatedTags = new Set(status.currentTags)
    if (updatedTags.has(value)) {
      updatedTags.delete(value)
    } else {
      updatedTags.add(value)
    }
    return updatedTags
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'tag') {
      const tagValue = e.target.dataset.value
      const updatedTags = handleTagChange(tagValue)
      setStatus((prevStatus) => ({
        ...prevStatus,
        currentTags: updatedTags,
        questionNumber: getQuestionByTag(questions, updatedTags).length
      }))
    } else {
      setStatus((prevStatus) => ({
        ...prevStatus,
        [name]: value
      }))
    }
  }

  const handleSelectAll = () => {
    setStatus({
      currentTags: new Set(getTags(questions)),
      questionNumber: questions.length
    })
  }

  const handleClearAll = () => {
    setStatus({
      currentTags: new Set(),
      questionNumber: 0
    })
  }

  // handle End

  const tags = getTags(questions)
  tags.unshift('全部')

  const startTraining = (e) => {
    e.preventDefault()
    if (status.currentTags.length < 1) {
      alert('請選擇標籤')
      return
    }
    const selectedQuestions = getQuestionByTag(questions, status.currentTags)
    const shuffledQuestions = shuffleAry(selectedQuestions)
    const correctProblems = getQuestionByNumber(shuffledQuestions, status.questionNumber)
    const displayedProblems = correctProblems.map((problem) => getProblemType(problem))
    setProblems(displayedProblems)
    navigate('/training/in-progress')
  }

  return (
    <section className="p-6">
      <TheBreadcrumb>
        <BreadcrumbItem>
          <BreadcrumbPage>練習設定頁面</BreadcrumbPage>
        </BreadcrumbItem>
      </TheBreadcrumb>
      <article className="mx-auto mt-3 max-w-96 rounded-md border p-5">
        <h1 className="my-2 text-xl font-bold">練習設定頁面</h1>
        <form onSubmit={startTraining} className="space-y-5">
          {/* 選擇標籤 */}
          <section>
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
          </section>

          {/* 選擇題數 */}
          <section>
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
          </section>

          <section className="flex flex-col gap-2 md:flex-row">
            <Button>開始練習</Button>
            <Button type="button" onClick={handleSelectAll} variant="outline">
              全選
            </Button>
            <Button type="button" onClick={handleClearAll} variant="destructive">
              全部取消
            </Button>
          </section>
        </form>
      </article>
    </section>
  )
}

export default TrainingSettings
