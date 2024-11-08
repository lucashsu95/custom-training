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

import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'

import React, { useContext, useMemo } from 'react'
import { DataContext } from '@/App'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import QuestiopnJsonFile from '@/assets/questions.json'
import TheBreadcrumb from '@/components/TheBreadcrumb'

export default function ManageQuestions() {
  const { questions, setQuestions } = useContext(DataContext)
  const { clearItem } = useIndexedDB('questions')

  const handeClearItem = () => {
    clearItem()
    setQuestions([])
    alert('已清空題庫')
  }

  const handleDownloadFile = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(QuestiopnJsonFile)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = 'questions.json'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div>
      <section className="p-6">
        <TheBreadcrumb>
          <BreadcrumbItem>
            <BreadcrumbPage>題庫列表</BreadcrumbPage>
          </BreadcrumbItem>
        </TheBreadcrumb>

        <h1 className="my-2 text-xl font-bold">題庫列表</h1>
        <button className="text-sky-500 hover:underline" onClick={handleDownloadFile}>
          沒有題庫嗎?從這下載一個範例
          <span className="mx-1 rounded bg-gray-200 px-1 py-0.5 text-gray-600 dark:text-gray-200 dark:bg-gray-600">
            .json
          </span>
          檔吧
        </button>
        <FileUploader />
        <Button variant="destructive" onClick={handeClearItem}>
          清空題庫
        </Button>
      </section>

      {questions.length > 0 ? <QuestionsTable /> : '目前沒有任何題目'}
    </div>
  )
}

function QuestionsTable() {
  const { questions } = useContext(DataContext)
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
                  <div className="w-max rounded-md bg-sky-200 px-1 py-0.5 dark:bg-sky-700">
                    {question.tag}
                  </div>
                </TableCell>
                <TableCell>類型：{question.type}</TableCell>
                <TableCell>{question.remark !== '' && '備註：' + question.remark}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-2/3 font-medium">
                  {question.type === '配對題'
                    ? question.name.map((part, j) => <li key={j}>{part}</li>)
                    : question.name}
                </TableCell>
                {question.type === '選擇題' ? (
                  <>
                    <TableCell className="text-xs">
                      {Object.keys(question.options).map((optionKey) => (
                        <div key={`${index}-${optionKey}`}>
                          {optionKey}. {question.options[optionKey]}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="w-5">{question.answer}</TableCell>
                  </>
                ) : question.type === '填空題' || question.type === '配對題' ? (
                  <TableCell className="text-xs" colSpan={2}>
                    {question.options.map((option) => (
                      <div key={option}>{option}</div>
                    ))}
                  </TableCell>
                ) : (
                  '無'
                )}
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
