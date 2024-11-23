// ui component
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import FileUploader from '@/components/manage/FileUploader'
import { Button } from '@/components/ui/button'
import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { QuestionsTable } from '@/components/manage/QuestionsTable'
import PreventRefresh from '@/components/PreventRefresh'
import { FaDownload, FaTrashAlt } from 'react-icons/fa'

// react
import { useState, useContext } from 'react'
import { DataContext } from '@/context/DataContext'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import QuestiopnJsonFile from '@/assets/example.json'
import { toast } from 'sonner'

export default function ManageQuestions() {
  const { questions, setQuestions } = useContext(DataContext)
  const { clearItem, addItem } = useIndexedDB('questions')
  const [open, setOpen] = useState(false)

  const handeClearItem = () => {
    clearItem()

    toast('已清空題庫', {
      description: '已成功清空所有題目',
      action: {
        label: '復原',
        onClick: () => undoClear(questions)
      }
    })
    setOpen(false)
    setQuestions([])
  }

  const undoClear = (recordQuestions) => {
    setQuestions(recordQuestions)
    addItem(recordQuestions)

    toast('已取消清空', {
      description: '已取消清空所有題目'
    })
    setOpen(false)
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

  const handleExportJsonFile = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(questions.map((x) => x.toPayload()))], {
      type: 'application/json'
    })
    element.href = URL.createObjectURL(file)
    element.download = 'questions.json'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div>
      <PreventRefresh />
      <section className="p-6">
        <TheBreadcrumb>
          <BreadcrumbItem>
            <BreadcrumbPage>題庫管理</BreadcrumbPage>
          </BreadcrumbItem>
        </TheBreadcrumb>

        <h2 className="my-2 text-xl font-bold">題庫操作</h2>
        <button className="text-sky-500 hover:underline" onClick={handleDownloadFile}>
          沒有題庫嗎?從這下載一個範例
          <span className="mx-1 rounded bg-gray-200 px-1 py-0.5 text-gray-600 dark:bg-gray-600 dark:text-gray-200">
            .json
          </span>
          檔吧
        </button>

        <div className="my-2 flex gap-2">
          <FileUploader />

          <Button size="icon" variant="outline" onClick={handleExportJsonFile}>
            <FaDownload />
          </Button>

          <AlertDialog asChild open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <FaTrashAlt />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確定要清空所有題目嗎？</AlertDialogTitle>
                <AlertDialogDescription>刪除後將無法復原，請謹慎操作。</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={handeClearItem}>確認</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      {questions.length > 0 ? <QuestionsTable /> : '目前沒有任何題目'}
    </div>
  )
}
