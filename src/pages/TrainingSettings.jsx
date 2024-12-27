// ui component
import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { Switch } from '@/components/ui/switch'

// lib
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getQuestionByTag, getTags } from '@/lib/functions'

// hook
import { useInitializeQuestions } from '@/hooks/useInitializeQuestions'

// provider
import { useQuestion } from '@/provider/QuestionProvider'
import { useSetting } from '@/provider/SettingProvider'

function TrainingSettings() {
  // init state
  const { questions, customStartTraining } = useQuestion()
  const navigate = useNavigate()

  // 初始化Question Start

  const { initTrainingCount } = useSetting()
  const initializeQuestions = useInitializeQuestions()

  useEffect(() => {
    if (questions.length === 0) {
      initializeQuestions()
      initTrainingCount()
    }
  }, [initTrainingCount, initializeQuestions, questions.length])

  // 初始化Question End

  const [state, setState] = useState({
    currentTags: new Set(),
    questionNumber: 0,
    hasTech: false,
    hasName: true
  })

  const questionsLength = getQuestionByTag(questions, state.currentTags).length
  const tags = getTags(questions)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (customStartTraining(state)) {
      navigate('/training/in-progress')
    }
  }

  // handle End

  return (
    <section className="p-6">
      <TheBreadcrumb>
        <BreadcrumbItem>
          <BreadcrumbPage>練習設定頁面</BreadcrumbPage>
        </BreadcrumbItem>
      </TheBreadcrumb>
      <article className="mx-auto mt-3 max-w-96 rounded-md border p-5">
        <h1 className="my-2 text-xl font-bold">練習設定頁面</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <section className="flex flex-col gap-3 md:flex-row">
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
