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
import { FaDownload, FaTrashAlt } from 'react-icons/fa'
import { IoIosRemoveCircle } from 'react-icons/io'

// react
import { useEffect, useState } from 'react'
import QuestiopnJsonFile from '@/assets/example.json'

// lib
import { toast } from 'sonner'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import { useInitializeQuestions } from '@/hooks/useInitializeQuestions'

// provider
import { useQuestion } from '@/provider/QuestionProvider'
import { useSetting } from '@/provider/SettingProvider'

export default function ManageQuestions() {
  const { questions, setQuestions, updateQuestion } = useQuestion()
  const { clearAll, clearItem, addItem } = useIndexedDB('questions')
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [open4, setOpen4] = useState(false)

  // 初始化Question Start

  const { initTrainingCount } = useSetting()
  const initializeQuestions = useInitializeQuestions()

  useEffect(() => {
    if (questions.length === 0) {
      initializeQuestions()
      initTrainingCount()
    }
  }, [initTrainingCount, initializeQuestions, questions.length])

  // 初始化Question End

  const undoClear = (recordQuestions) => {
    setQuestions((prev) => [...prev, ...recordQuestions])
    addItem(recordQuestions)

    toast('已取消清空', {
      description: '已取消清空所有題目'
    })
  }

  const handeClearAll = () => {
    clearAll()

    toast('✅已清空題庫', {
      description: '已成功刪除所有題目',
      action: {
        label: '復原',
        onClick: () => undoClear(questions)
      }
    })
    setOpen1(false)
    setQuestions([])
  }

  const handeClearItem = () => {
    const recordQuestions = questions.filter((question) => question.isChecked)
    const recordQuestionsId = recordQuestions.map((question) => question.id)

    clearItem(recordQuestionsId)

    toast('✅刪除成功', {
      description: '已成功刪除勾選的題目',
      action: {
        label: '復原',
        onClick: () => undoClear(recordQuestions)
      }
    })
    setOpen2(false)
    setQuestions((prev) =>
      prev
        .filter((question) => !question.isChecked)
        .map((question) => ({ ...question, isChecked: false }))
    )
  }

  const handleDownloadFile = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(QuestiopnJsonFile)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = 'example.json'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast('✅下載成功', {
      description: '已成功讓勾選的題目失效'
    })
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
    toast('✅下載成功', {
      description: '已成功讓勾選的題目失效'
    })
  }

  const handeEnableItem = () => {
    const recordQuestions = questions.filter((question) => question.isChecked)
    for (const question of recordQuestions) {
      updateQuestion(question.id, { isEnabled: true })
    }

    toast('✅操作成功', {
      description: '已成功讓勾選的題目生效'
    })
    setOpen3(false)
  }
  const handeDisableItem = () => {
    const recordQuestions = questions.filter((question) => question.isChecked)
    for (const question of recordQuestions) {
      updateQuestion(question.id, { isEnabled: false })
    }

    toast('✅操作成功', {
      description: '已成功讓勾選的題目失效'
    })
    setOpen4(false)
  }

  const hasChecked = questions.some((question) => question.isChecked)

  return (
    <div>
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
          {hasChecked && (
            <AlertDialog asChild open={open1} onOpenChange={setOpen1}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <IoIosRemoveCircle />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>確定要刪除勾選的題目嗎？</AlertDialogTitle>
                  <AlertDialogDescription>請謹慎操作。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handeClearItem}>確認</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button size="icon" variant="outline" onClick={handleExportJsonFile}>
            <FaDownload />
          </Button>

          <AlertDialog asChild open={open2} onOpenChange={setOpen2}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <FaTrashAlt />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確定要刪除全部的題目嗎？</AlertDialogTitle>
                <AlertDialogDescription>請謹慎操作。</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={handeClearAll}>確認</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {hasChecked && (
            <>
              <AlertDialog asChild open={open3} onOpenChange={setOpen3}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">生效</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>確定要讓勾選的題目生效嗎？</AlertDialogTitle>
                    <AlertDialogDescription>請謹慎操作。</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={handeEnableItem}>確認</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog asChild open={open4} onOpenChange={setOpen4}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">失效</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>確定要讓勾選的題目失效嗎？</AlertDialogTitle>
                    <AlertDialogDescription>請謹慎操作。</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={handeDisableItem}>確認</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </section>

      {questions.length > 0 ? <QuestionsTable /> : '目前沒有任何題目'}
    </div>
  )
}
