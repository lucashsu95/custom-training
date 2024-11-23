// ui component
import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { Switch } from '@/components/ui/switch'

import { DataContext } from '@/context/DataContext'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getQuestionByTag,
  getTags,
  getLimitedQuestions,
  getVocabularyShuffled,
  shuffleAryByDue,
  productTech
} from '@/lib/functions'
import PreventRefresh from '@/components/PreventRefresh'

function TrainingSettings() {
  // init state
  const { questions, setProblems } = useContext(DataContext)
  const navigate = useNavigate()

  const [state, setState] = useState({
    currentTags: new Set(),
    questionNumber: 0,
    hasTech: true,
    hasName: true
  })

  const questionsLength = getQuestionByTag(questions, state.currentTags).length

  // handle Start
  const handleTagChange = (value) => {
    const updatedTags = new Set(state.currentTags)
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
      setState((prevstate) => ({
        ...prevstate,
        currentTags: updatedTags,
        questionNumber: getQuestionByTag(questions, updatedTags).length
      }))
    } else {
      setState((prevstate) => ({
        ...prevstate,
        [name]: value
      }))
    }
  }

  const handleSelectAll = () => {
    setState((prev) => {
      ;(prev.currentTags = new Set(getTags(questions))), (prev.questionNumber = questions.length)
      return prev
    })
  }

  const handleClearAll = () => {
    setState((prev) => {
      ;(prev.currentTags = new Set()), (prev.questionNumber = 0)
      return prev
    })
  }

  // handle End

  const tags = getTags(questions)

  const startTraining = (e) => {
    e.preventDefault()
    if (state.currentTags.length < 1) {
      alert('請選擇標籤')
      return
    }
    const enabledQuestions = questions.filter((x) => x.isEnabled)
    const selectedQuestions = getQuestionByTag(enabledQuestions, state.currentTags)
    const shuffledQuestions = shuffleAryByDue(selectedQuestions)
    const correctProblems = getLimitedQuestions(shuffledQuestions, state.questionNumber)
    const displayedProblems = getVocabularyShuffled(correctProblems, state.hasName) // 顯示單字題
    const problems = state.hasTech ? productTech(displayedProblems) : displayedProblems
    setProblems(problems)
    navigate('/training/in-progress')
  }

  return (
    <section className="p-6">
      <PreventRefresh />
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
              1. 標籤：
            </Label>
            <ToggleGroup type="multiple" variant="outline" className="flex-wrap">
              {tags.sort().map((tag) => (
                <ToggleGroupItem
                  value={tag}
                  key={tag}
                  data-value={tag}
                  name="tag"
                  data-state={state.currentTags.has(tag) ? 'on' : 'off'}
                  onClick={handleChange}
                >
                  {state.currentTags.has(tag) && <span>✔</span>}
                  {tag}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>

          {/* 選擇題數 */}
          <section>
            <Label className="text-base" htmlFor="question-number">
              2. 題數：
            </Label>
            <Input
              name="questionNumber"
              type="number"
              id="question-number"
              value={state.questionNumber}
              onChange={handleChange}
              className="w-full max-w-[280px]"
              min="0"
              max={questionsLength}
              required
            />
            <p className="ml-1 text-sm text-gray-500">共有 {questionsLength} 題</p>
          </section>

          <section className="flex flex-col gap-2 [&>*]:flex [&>*]:items-center [&>*]:gap-2">
            <div>
              3. 產生教學
              <Switch
                checked={state.hasTech}
                onClick={() => setState((prev) => ({ ...prev, hasTech: !prev.hasTech }))}
              />
            </div>
            <div>
              4. 包含題目
              <Switch
                checked={state.hasName}
                onClick={() => setState((prev) => ({ ...prev, hasName: !prev.hasName }))}
              />
            </div>
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
