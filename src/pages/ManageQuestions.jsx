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
          <span className="mx-1 rounded bg-gray-200 px-1 py-0.5 text-gray-600 dark:bg-gray-600 dark:text-gray-200">
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
                    ? question.name.map((part, j) => <div key={j}>{part}</div>)
                    : question.name}
                </TableCell>
                <TableCell>
                  {question.type === '選擇題'
                    ? Object.keys(question.options).map((optionKey) => (
                        <div
                          key={`${index}-${optionKey}`}
                          className={`rounded px-2 py-0.5 w-max ${question.answer === optionKey && 'bg-sky-200'}`}
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
