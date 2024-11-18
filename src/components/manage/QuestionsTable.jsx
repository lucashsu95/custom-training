import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import React, { useContext, useMemo } from 'react'
import { DataContext } from '@/context/DataContext'

export default function QuestionsTable() {
  const { questions } = useContext(DataContext)
  const totalCount = useMemo(() => questions.length, [questions])
  const displayQuestions = Object.groupBy(questions, (question) => question.tag)

  return (
    <section>
      <h2 className="my-2 px-6 text-xl font-bold">題庫列表</h2>
      <Table className="w-full min-w-max overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead>類型</TableHead>
            <TableHead>熟練度</TableHead>
            <TableHead>題目</TableHead>
            <TableHead>選項/答案</TableHead>
            <TableHead>備註</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(displayQuestions)
            .sort()
            .map((key, index) => {
              const questions = displayQuestions[key].sort((a, b) => a.name - b.name)

              return (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell colSpan={5} className="bg-gray-200 dark:bg-gray-800">
                      {key}
                    </TableCell>
                  </TableRow>
                  {questions.map((question, j) => (
                    <TableRow key={j}>
                      <TableCell>{question.type}</TableCell>
                      <TableCell>
                        {question.due > 2 && <span className="text-green-500">熟練</span>}
                        {question.due < 3 && question.due >= 0 && question.due !== null && (
                          <span>普通</span>
                        )}
                        {question.due < 0 && <span className="text-red-400">不熟練</span>}
                        {question.due === null && (
                          <span className="text-gray-500/70 dark:text-gray-300/70">未作答</span>
                        )}
                      </TableCell>
                      <TableCell className="md:max-w-auto max-w-[700px]">
                        {
                          question.type === '配對題'
                            ? question.name.map((part, j) => <li key={j}>{part}</li>)
                            : question.name
                          // <div dangerouslySetInnerHTML={{ __html: question.name }}></div>
                        }
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>{question.remark}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              )
            })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>題目數量</TableCell>
            <TableCell className="text-right">{totalCount}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  )
}
