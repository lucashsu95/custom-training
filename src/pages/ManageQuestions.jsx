/* eslint-disable react/prop-types */
import FileUploader from '@/components/FileUploader'
import { Button } from '@/components/ui/button'
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
import Question from '@/classes/Question'
import { useIndexedDB } from '@/hooks/useIndexedDB'

export default function ManageQuestions() {
  const { questions, setQuestions } = useContext(DataContext)
  const { clearItem } = useIndexedDB('questions')

  const displayedQuestions = useMemo(
    () => questions.map((question) => Question.create(question)),
    [questions]
  )

  const handeClearItem = () => {
    clearItem()
    setQuestions([])
    alert('已清空題庫')
  }

  return (
    <div>
      <section className="p-6">
        <h1 className="mb-2 text-xl font-bold">題庫列表</h1>
        <FileUploader />
        <Button variant="destructive" onClick={handeClearItem}>
          清空題庫
        </Button>
      </section>

      {questions.length > 0 ? (
        <QuestionsTable questions={displayedQuestions} />
      ) : (
        '目前沒有任何題目'
      )}
    </div>
  )
}

function QuestionsTable({ questions }) {
  const totalCount = useMemo(() => questions.length, [questions])

  return (
    <section>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">題目</TableHead>
            <TableHead>選項</TableHead>
            <TableHead>答案</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell>
                  <div className="w-max rounded-md bg-sky-200 px-1 py-0.5">{question.tag}</div>
                </TableCell>
                <TableCell colSpan={2}>
                  {question.remark !== '' && '備註：' + question.remark}
                </TableCell>
              </TableRow>
              <TableRow className="bg-gray-100">
                <TableCell className="w-2/3 font-medium">{question.name}</TableCell>
                <TableCell className="text-xs">
                  {Object.keys(question.options).map((optionKey) => (
                    <div key={`${index}-${optionKey}`}>
                      {optionKey}. {question.options[optionKey]}
                    </div>
                  ))}
                </TableCell>
                <TableCell className="w-5">{question.answer}</TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>題目數量</TableCell>
            <TableCell className="text-right">{totalCount}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  )
}
