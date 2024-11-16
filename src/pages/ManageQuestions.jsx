import FileUploader from '@/components/manage/FileUploader'
import { Button } from '@/components/ui/button'
import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import TheBreadcrumb from '@/components/TheBreadcrumb'
import QuestionsTable from '@/components/manage/QuestionsTable'

import { useContext } from 'react'
import { DataContext } from '@/App'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import QuestiopnJsonFile from '@/assets/example.json'

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
    element.download = 'example.json'
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
