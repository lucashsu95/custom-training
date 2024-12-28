import QuestionSection from './QuestionSection'
import { useQuestion } from '@/provider/QuestionProvider'

export function QuestionsTable() {
  const { questions } = useQuestion()
  const groupByQuestions = Object.groupBy(questions, (question) => question.tag)
  return (
    <section className="mx-5 space-y-3 md:mx-auto md:w-[750px]">
      <h2 className="text-xl font-bold">題庫列表</h2>
      {Object.keys(groupByQuestions)
        .sort()
        .map((key) => {
          const questions = groupByQuestions[key].sort((a, b) => a.name - b.name)
          return (
            <QuestionSection
              key={`${groupByQuestions[key][0].id}-${key}`}
              questions={questions}
              questionKey={key}
            />
          )
        })}
    </section>
  )
}
