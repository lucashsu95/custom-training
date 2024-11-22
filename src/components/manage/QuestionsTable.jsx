import { useContext } from 'react'
import { DataContext } from '@/context/DataContext'
import { ChevronsUpDown } from 'lucide-react'
import QuestionSection from './QuestionSection'

export function QuestionsTable() {
  const { questions } = useContext(DataContext)
  // const totalCount = useMemo(() => questions.length, [questions]) TODO
  const groupByQuestions = Object.groupBy(questions, (question) => question.tag)

  return (
    <section className="mx-5 space-y-3 md:mx-auto md:w-[700px]">
      <h2 className="questionKey bg-gray-200 dark:bg-gray-700">
        題庫列表
        <ChevronsUpDown className="h-4 w-4" />
      </h2>
      {Object.keys(groupByQuestions)
        .sort()
        .map((key, i) => {
          const questions = groupByQuestions[key].sort((a, b) => a.name - b.name)
          return <QuestionSection key={i} questions={questions} questionKey={key} />
        })}
      {/* <section className="flex gap-3 text-center mx-5">
        <div>題目數量：</div>
        {totalCount}
      </section> */}
      {/* <TableCell colSpan={4}></TableCell>
      <TableCell className="text-right"></TableCell> */}
    </section>
  )
}

// QuestionsTable.propTypes = {
//   isEnableds: PropTypes.arrayOf(PropTypes.bool).isRequired,
// }
