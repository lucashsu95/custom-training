import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useContext } from 'react'
import { DataContext } from '@/context/DataContext'
import { ChevronsUpDown } from 'lucide-react'

export function QuestionsTable() {
  const { questions } = useContext(DataContext)
  // const totalCount = useMemo(() => questions.length, [questions]) TODO
  const displayQuestions = Object.groupBy(questions, (question) => question.tag)

  return (
    <section>
      <h2 className="my-2 px-6 text-xl font-bold">題庫列表</h2>
      <section className="mx-5 max-w-[800px] space-y-3 md:mx-auto">
        {Object.keys(displayQuestions)
          .sort()
          .map((key, index) => {
            const questions = displayQuestions[key].sort((a, b) => a.name - b.name)
            return (
              <Collapsible key={index}>
                <CollapsibleTrigger asChild>
                  <h4 className="boder-b mb-3 flex items-center justify-between rounded-md bg-sky-900 px-3 py-2 text-lg font-bold shadow md:px-10">
                    {key}
                    <ChevronsUpDown className="h-4 w-4" />
                  </h4>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-x-auto">
                  <div className="min-w-max space-y-2">
                    <div className="custom-row">
                      <div>類型</div>
                      <div>熟練度</div>
                      <div>題目</div>
                      <div>選項/答案</div>
                      <div>備註</div>
                    </div>
                    {questions.map((question, j) => (
                      <div key={j} className="custom-row">
                        <section>{question.type}</section>
                        <section>
                          {question.due > 2 && <span className="text-green-500">熟練</span>}
                          {question.due < 3 && question.due >= 0 && question.due !== null && (
                            <span>普通</span>
                          )}
                          {question.due < 0 && <span className="text-red-400">不熟練</span>}
                          {question.due === null && (
                            <span className="text-gray-500/70 dark:text-gray-300/70">未作答</span>
                          )}
                        </section>
                        <section className="md:max-w-auto max-w-[700px]">
                          {
                            question.type === '配對題'
                              ? question.name.map((part, j) => <li key={j}>{part}</li>)
                              : question.name
                            // <div dangerouslySetInnerHTML={{ __html: question.name }}></div>
                          }
                        </section>
                        <section>
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
                        </section>
                        <section>{question.remark}</section>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
      </section>

      {/* <section className="flex gap-3 text-center mx-5">
        <div>題目數量：</div>
        {totalCount}
      </section> */}
      {/* <TableCell colSpan={4}></TableCell>
      <TableCell className="text-right"></TableCell> */}
    </section>
  )
}
