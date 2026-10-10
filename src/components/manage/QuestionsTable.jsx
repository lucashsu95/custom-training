import QuestionSection from './QuestionSection'
import { useQuestion } from '@/provider/QuestionProvider'

export function QuestionsTable() {
  const { questions } = useQuestion()
  const groupByQuestions = Object.groupBy(questions, (question) => question.tag)
  return (
    <section aria-label="題庫列表" className="space-y-3">
      <h2 className="text-xl font-bold">題庫列表</h2>
      {Object.keys(groupByQuestions)
        .sort((a, b) => a.localeCompare(b, 'zh-TW'))
        .map((key) => {
          const grouped = [...groupByQuestions[key]].sort((a, b) =>
            String(a.name ?? '').localeCompare(String(b.name ?? ''), 'zh-TW')
          )
          return (
            <QuestionSection
              key={`${grouped[0].id}-${key}`}
              questions={grouped}
              questionKey={key}
            />
          )
        })}
    </section>
  )
}
