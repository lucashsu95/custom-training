import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { ChevronDown } from 'lucide-react'
import { useQuestion } from '@/provider/QuestionProvider'
import { createQuestion, formatDueAt, proficiencyLevel } from '@/lib/functions'
import QuestionCard from '@/components/molecules/QuestionCard'

function OptionsDetail({ question }) {
  if (question.type === '單選題') {
    return (
      <div className="space-y-1">
        {Object.keys(question.options ?? {}).map((optionKey) => (
          <div
            key={optionKey}
            className={`rounded px-2 py-0.5 ${question.answer === optionKey ? 'bg-ans-correct' : ''}`}
          >
            {optionKey}. {question.options[optionKey]}
          </div>
        ))}
      </div>
    )
  }
  if (question.type === '多選題') {
    return (
      <div className="space-y-1">
        {(question.options ?? []).map((option) => (
          <div key={option}>{option}</div>
        ))}
        {(question.answers ?? []).map((answer) => (
          <div key={answer} className="rounded bg-ans-correct px-2 py-0.5">
            {answer}
          </div>
        ))}
      </div>
    )
  }
  if (question.type === '填空題' || question.type === '配對題') {
    return (
      <div className="space-y-1">
        {(question.options ?? []).map((option) => (
          <div key={option}>{option}</div>
        ))}
      </div>
    )
  }
  if (question.type === '單字題') {
    return <div>{question.answer}</div>
  }
  return <div>未知題型</div>
}

OptionsDetail.propTypes = {
  question: PropTypes.object.isRequired
}

export default function QuestionSection({ questions, questionKey }) {
  const [open, setOpen] = useState(false)
  const { setQuestions, updateQuestion } = useQuestion()

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild onClick={() => setOpen(!open)}>
        <h4 className="mb-3 flex cursor-pointer items-center justify-between rounded-md bg-muted px-3 py-2 text-lg font-bold shadow">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded"
              aria-label={`全選「${questionKey}」標籤的題目`}
              onClick={(e) => {
                e.stopPropagation()
                const isChecked = e.target.checked
                setQuestions((prev) =>
                  prev.map((question) =>
                    question.tag === questionKey
                      ? createQuestion({ ...question, isChecked })
                      : question
                  )
                )
              }}
            />
            <span>{questionKey}</span>
          </span>
          <ChevronDown className={`${open ? '-rotate-180' : 'rotate-0'} transition-transform`} />
        </h4>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="space-y-2">
          {questions.map((question) => {
            const level = proficiencyLevel(question.due)
            const stem = Array.isArray(question.name)
              ? question.name.join('、')
              : (question.name ?? '')
            return (
              <div key={question.id} className="space-y-2">
                <QuestionCard
                  question={{ ...question, name: stem }}
                  actions={
                    <Switch
                      checked={question.isEnabled}
                      onCheckedChange={() =>
                        updateQuestion(question.id, { isEnabled: !question.isEnabled })
                      }
                      aria-label={`${stem}，目前${level.label}，切換啟用狀態`}
                    />
                  }
                />
                <div className="space-y-1 px-1 text-sm">
                  <OptionsDetail question={question} />
                  <p className="text-muted-foreground">下次練習：{formatDueAt(question)}</p>
                  {question.remark && <p className="text-muted-foreground">{question.remark}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

QuestionSection.propTypes = {
  questions: PropTypes.array.isRequired,
  questionKey: PropTypes.string.isRequired
}
