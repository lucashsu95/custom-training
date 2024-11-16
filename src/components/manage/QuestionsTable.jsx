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
import { DataContext } from '@/App'

export default function QuestionsTable() {
  const { questions } = useContext(DataContext)
  const totalCount = useMemo(() => questions.length, [questions])

  return (
    <section>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>類型/題目</TableHead>
            <TableHead>標籤/選項</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell>
                  <div>類型：{question.type}</div>
                  {question.remark !== '' && <div>備註：{question.remark}</div>}
                </TableCell>
                <TableCell>
                  <div className="flex justify-around">
                    <div className="w-max rounded-md bg-sky-200 px-1 py-0.5 dark:bg-sky-700">
                      {question.tag}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {question.type === '配對題'
                    ? question.name.map((part, j) => <li key={j}>{part}</li>)
                    : question.name}
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
                      : '無'}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>題目數量</TableCell>
            <TableCell className="text-right">{totalCount}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  )
}
