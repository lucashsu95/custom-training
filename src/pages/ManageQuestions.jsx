// ui component
import FileUploader from '@/components/manage/FileUploader'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/layout/PageHeader'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import { QuestionsTable } from '@/components/manage/QuestionsTable'
import { Download, Trash2, CircleX, FileQuestion } from 'lucide-react'
import CreateQuestionForm from '@/components/manage/CreateQuestionForm'

// react
import { useState } from 'react'
import QuestiopnJsonFile from '@/assets/example.json'

// lib
import { toast } from 'sonner'
import { useIndexedDB } from '@/hooks/useIndexedDB'

// provider
import { useQuestion } from '@/provider/QuestionProvider'

const CONFIRM_CONFIGS = {
  clearChecked: {
    kind: 'destructive',
    title: '確定要刪除勾選的題目嗎？',
    description: '請謹慎操作。'
  },
  clearAll: {
    kind: 'destructive',
    title: '確定要刪除全部的題目嗎？',
    description: '請謹慎操作。'
  },
  enableChecked: {
    kind: 'default',
    title: '確定要讓勾選的題目生效嗎？',
    description: '請謹慎操作。'
  },
  disableChecked: {
    kind: 'default',
    title: '確定要讓勾選的題目失效嗎？',
    description: '請謹慎操作。'
  }
}

export default function ManageQuestions() {
  const { questions, setQuestions, updateQuestion } = useQuestion()
  const { clearAll, clearItem, addItem } = useIndexedDB('questions')
  const [confirm, setConfirm] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)

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
    setConfirm(null)
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
    setConfirm(null)
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
      description: '已成功讓勾選的題目下載'
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
      description: '已成功讓勾選的題目下載'
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
    setConfirm(null)
  }
  const handeDisableItem = () => {
    const recordQuestions = questions.filter((question) => question.isChecked)
    for (const question of recordQuestions) {
      updateQuestion(question.id, { isEnabled: false })
    }

    toast('✅操作成功', {
      description: '已成功讓勾選的題目失效'
    })
    setConfirm(null)
  }

  const handleConfirm = () => {
    if (confirm === 'clearChecked') handeClearItem()
    else if (confirm === 'clearAll') handeClearAll()
    else if (confirm === 'enableChecked') handeEnableItem()
    else if (confirm === 'disableChecked') handeDisableItem()
  }

  const hasChecked = questions.some((question) => question.isChecked)
  const config = confirm ? CONFIRM_CONFIGS[confirm] : null

  return (
    <div>
      <PageHeader
        title="題庫管理"
        description={questions.length > 0 ? `共 ${questions.length} 題` : undefined}
      />

      <section aria-label="題庫操作">
        <h2 className="my-2 text-xl font-bold">題庫操作</h2>
        <button className="text-primary hover:underline" onClick={handleDownloadFile}>
          沒有題庫嗎?從這下載一個範例
          <span className="mx-1 rounded bg-muted px-1 py-0.5 text-muted-foreground">
            .json
          </span>
          檔吧
        </button>

        <div className="my-2 flex gap-2">
          <Button onClick={() => setCreateOpen(true)}>新增題目</Button>
          <CreateQuestionForm
            open={createOpen}
            onOpenChange={setCreateOpen}
            onCreate={(question) => {
              addItem(question)
              setQuestions((prev) => [...prev, question])
              toast('✅ 新增成功', { description: '已成功新增題目' })
            }}
          />
          <FileUploader />
          {hasChecked && (
            <Button
              variant="outline"
              size="icon"
              aria-label="刪除勾選的題目"
              onClick={() => setConfirm('clearChecked')}
            >
              <CircleX />
            </Button>
          )}

          <Button
            size="icon"
            variant="outline"
            aria-label="匯出題庫"
            onClick={handleExportJsonFile}
          >
            <Download />
          </Button>

          <Button
            variant="outline"
            size="icon"
            aria-label="刪除全部題目"
            onClick={() => setConfirm('clearAll')}
          >
            <Trash2 />
          </Button>
          {hasChecked && (
            <>
              <Button variant="outline" onClick={() => setConfirm('enableChecked')}>
                生效
              </Button>
              <Button variant="outline" onClick={() => setConfirm('disableChecked')}>
                失效
              </Button>
            </>
          )}
        </div>
      </section>

      {questions.length > 0 ? (
        <QuestionsTable />
      ) : (
        <div data-testid="manage-empty">
          <EmptyState
            icon={<FileQuestion className="h-10 w-10" />}
            title="目前沒有任何題目"
            description="上傳 JSON 檔案或手動新增題目來開始建立題庫"
            action={
              <span className="inline-flex gap-2">
                <Button onClick={() => setCreateOpen(true)}>新增題目</Button>
                <FileUploader />
              </span>
            }
          />
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(v) => {
          if (!v) setConfirm(null)
        }}
        kind={config?.kind ?? 'default'}
        title={config?.title ?? ''}
        description={config?.description ?? ''}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
