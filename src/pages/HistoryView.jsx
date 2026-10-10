import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from '@/hooks/useHistory'
import { Button } from '@/components/ui/button'
import { Trash2, History as HistoryIcon, Trash } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/layout/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { scoreTone } from '@/lib/functions'
import { cn } from '@/lib/utils'

const SCORE_TEXT = {
  good: 'text-score-good',
  warn: 'text-score-warn',
  bad: 'text-score-bad',
}

export default function HistoryView() {
  const { getHistory, deleteHistory, clearAllHistory, ready } = useHistory()
  const [historyList, setHistoryList] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmClear, setConfirmClear] = useState(false)

  const fetchHistory = React.useCallback(() => {
    if (!ready) return
    getHistory((data) => {
      // Sort by timestamp descending
      const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp)
      setHistoryList(sorted)
      setLoading(false)
    })
  }, [getHistory, ready])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleDelete = (id) => {
    deleteHistory([id])
    setHistoryList((prev) => prev.filter((item) => item.id !== id))
    toast.success('已刪除紀錄')
  }

  const handleClearAll = () => {
    clearAllHistory()
    setHistoryList([])
    setConfirmClear(false)
    toast.success('已清除所有紀錄')
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <section aria-label="練習紀錄">
      <PageHeader
        title="練習紀錄"
        description={historyList.length > 0 ? `共 ${historyList.length} 筆練習紀錄` : undefined}
        actions={
          historyList.length > 0 ? (
            <Button variant="destructive" size="sm" onClick={() => setConfirmClear(true)} className="flex gap-2">
              <Trash className="h-4 w-4" />
              清除全部
            </Button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="space-y-4" aria-label="載入中">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : historyList.length === 0 ? (
        <div data-testid="history-empty">
        <EmptyState
          icon={<HistoryIcon className="h-10 w-10" />}
          title="目前還沒有練習紀錄"
          description="完成一次練習後，這裡會顯示你的得分與答題統計"
          action={
            <Button variant="outline" asChild>
              <Link to="/training/setting">開始第一次練習</Link>
            </Button>
          }
        />
        </div>
      ) : (
        <div className="space-y-4">
          {historyList.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {item.mode === 'auto' ? '直接練習' : '自定練習'}
                    </CardTitle>
                    <CardDescription>{formatDate(item.timestamp)}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="刪除紀錄"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags && item.tags.length > 0 ? (
                    item.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">無標籤</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">分數</p>
                    <p className={cn('text-xl font-bold tabular-nums', SCORE_TEXT[scoreTone(item.score)])}>
                      {item.score}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">總題數</p>
                    <p className="text-xl font-bold tabular-nums">{item.totalQuestions}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">答對</p>
                    <p className="text-xl font-bold tabular-nums text-score-good">{item.correctCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">答錯</p>
                    <p className="text-xl font-bold tabular-nums text-score-bad">{item.wrongCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={(v) => !v && setConfirmClear(false)}
        kind="destructive"
        title="清除所有練習紀錄"
        description="確定要清除所有練習紀錄嗎？此操作無法復原。"
        onConfirm={handleClearAll}
        confirmLabel="清除全部"
      />
    </section>
  )
}
