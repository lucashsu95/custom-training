import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { IoIosArrowDown } from 'react-icons/io'
import { useQuestion } from '@/provider/QuestionProvider'
import { createQuestion } from '@/lib/functions'

export default function QuestionSection({ questions, questionKey }) {
  const [open, setOpen] = useState(false)
  const { setQuestions, updateQuestion } = useQuestion()

  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild onClick={() => setOpen(!open)}>
        <h4 className="md:px-10; mb-3 flex cursor-pointer items-center justify-between rounded-md bg-sky-200 px-3 py-2 text-lg font-bold shadow dark:bg-sky-900">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded"
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
          <IoIosArrowDown className={`${open ? '-rotate-180' : 'rotate-0'} transition-transform`} />
        </h4>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-x-auto">
        <div className="min-w-max space-y-2">
          <section className="custom-row grid-cols-6">
            <div>類型</div>
            <div>熟練度</div>
            <div>題目</div>
            <div>選項/答案</div>
            <div>備註</div>
            <div>已啟用</div>
          </section>
          {questions.map((question, index) => (
            <section
              key={index}
              className={`custom-row ${['填空題', '配對題', '選擇題'].includes(question.type) ? 'grid-cols-[1fr_1fr_6fr_5fr_1fr_1fr] gap-3' : 'grid-cols-6'}`}
            >
              <div>{question.type}</div>
              <div>
                {question.due > 7 ? (
                  <span className="text-green-500">熟練</span>
                ) : question.due >= 0 ? (
                  <span>普通</span>
                ) : question.due !== null ? (
                  <span className="text-red-400">不熟練</span>
                ) : (
                  <span className="text-gray-500/70 dark:text-gray-300/70">未作答</span>
                )}
              </div>
              <div className="max-w-[500px]">
                {question.type === '配對題'
                  ? question.name.map((part, j) => <li key={j}>{part}</li>)
                  : question.name}
              </div>
              <div className="max-w-[500px]">
                {question.type === '選擇題'
                  ? Object.keys(question.options).map((optionKey) => (
                      <div
                        key={`${index}-${optionKey}`}
                        className={`rounded px-2 py-0.5 ${question.answer === optionKey && 'bg-sky-200 dark:bg-sky-600'}`}
                      >
                        {optionKey}. {question.options[optionKey]}
                      </div>
                    ))
                  : question.type === '填空題' || question.type === '配對題'
                    ? question.options.map((option) => <div key={option}>{option}</div>)
                    : question.type === '單字題'
                      ? question.answer
                      : '未知題型'}
              </div>
              <div>{question.remark}</div>
              <div>
                <Switch
                  checked={question.isEnabled}
                  onClick={() => updateQuestion(question.id, { isEnabled: !question.isEnabled })}
                />
              </div>
            </section>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

QuestionSection.propTypes = {
  questions: PropTypes.array.isRequired,
  questionKey: PropTypes.string.isRequired
}
