// ui component
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import PageHeader from '@/components/layout/PageHeader'
import FormField from '@/components/common/FormField'

// lib
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getQuestionByTag, getTags } from '@/lib/functions'

// provider
import { useQuestion } from '@/provider/QuestionProvider'

function TrainingSettings() {
  // init state
  const { questions, customStartTraining } = useQuestion()
  const navigate = useNavigate()

  const [state, setState] = useState({
    currentTags: new Set(),
    questionNumber: 0,
    hasTech: false,
    hasName: true
  })

  const questionsLength = getQuestionByTag(questions, state.currentTags).length
  const tags = getTags(questions)

  // handle Start
  // 受控 ToggleGroup：value 為陣列，僅計算已啟用題目
  const handleTagsValueChange = (values) => {
    const updatedTags = new Set(values)
    setState((prevstate) => ({
      ...prevstate,
      currentTags: updatedTags,
      questionNumber: getQuestionByTag(questions, updatedTags).filter((x) => x.isEnabled).length
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setState((prevstate) => ({
      ...prevstate,
      [name]: value
    }))
  }

  const handleSelectAll = () => {
    const allTags = new Set(getTags(questions))
    setState((prev) => ({
      ...prev,
      currentTags: allTags,
      questionNumber: getQuestionByTag(questions, allTags).filter((x) => x.isEnabled).length
    }))
  }

  const handleClearAll = () => {
    setState((prev) => ({
      ...prev,
      currentTags: new Set(),
      questionNumber: 0
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (customStartTraining(state)) {
      navigate('/training/in-progress')
    }
  }

  // handle End

  return (
    <section>
      <PageHeader title="練習設定頁面" />
      <article className="rounded-md border p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="標籤">
            <ToggleGroup
              type="multiple"
              variant="outline"
              className="flex-wrap"
              value={[...state.currentTags]}
              onValueChange={handleTagsValueChange}
            >
              {[...tags].sort().map((tag) => (
                <ToggleGroupItem value={tag} key={tag}>
                  {tag}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormField>

          <FormField label="題數" htmlFor="question-number" description={`共有 ${questionsLength} 題`}>
            <Input
              name="questionNumber"
              type="number"
              id="question-number"
              value={state.questionNumber}
              onChange={handleChange}
              className="w-full"
              min="0"
              max={questionsLength}
              required
            />
          </FormField>

          <FormField label="產生教學" htmlFor="has-tech">
            <Switch
              id="has-tech"
              checked={state.hasTech}
              onCheckedChange={(checked) => setState((prev) => ({ ...prev, hasTech: checked }))}
            />
          </FormField>

          <FormField label="包含題目" htmlFor="has-name">
            <Switch
              id="has-name"
              checked={state.hasName}
              onCheckedChange={(checked) => setState((prev) => ({ ...prev, hasName: checked }))}
            />
          </FormField>

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
