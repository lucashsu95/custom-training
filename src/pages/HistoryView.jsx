import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from '@/hooks/useHistory'
import { Button } from '@/components/ui/button'
import { Trash2, History as HistoryIcon, Trash } from 'lucide-react'
import { toast } from 'sonner'
import TheBreadcrumb from '@/components/TheBreadcrumb'
import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'

export default function HistoryView() {
  const { getHistory, deleteHistory, clearAllHistory, ready } = useHistory()
  const [historyList, setHistoryList] = useState([])
  const [loading, setLoading] = useState(true)

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
    if (window.confirm('確定要清除所有練習紀錄嗎？')) {
      clearAllHistory()
      setHistoryList([])
      toast.success('已清除所有紀錄')
    }
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
    <section className="p-6 max-w-4xl mx-auto">
      <TheBreadcrumb>
        <BreadcrumbItem>
          <BreadcrumbPage>練習紀錄</BreadcrumbPage>
        </BreadcrumbItem>
      </TheBreadcrumb>

      <div className="flex items-center justify-between my-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HistoryIcon className="h-6 w-6" />
          練習紀錄
        </h1>
        {historyList.length > 0 && (
          <Button variant="destructive" size="sm" onClick={handleClearAll} className="flex gap-2">
            <Trash className="h-4 w-4" />
            清除全部
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted-foreground">載入中...</div>
      ) : historyList.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 border border-dashed rounded-lg">
          <div className="p-6 space-y-4">
            <HistoryIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">目前還沒有練習紀錄</p>
            <Link to="/training/setting">
              <Button variant="outline">開始第一次練習</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {historyList.map((item) => (
            <div key={item.id} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold leading-none tracking-tight">
                      {item.mode === 'auto' ? '直接練習' : '自定練習'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{formatDate(item.timestamp)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 pt-0">
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
                    <p className={`text-xl font-bold ${
                      item.score >= 80 ? 'text-green-500' : item.score >= 60 ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      {item.score}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">總題數</p>
                    <p className="text-xl font-bold">{item.totalQuestions}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">答對</p>
                    <p className="text-xl font-bold text-green-600">{item.correctCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">答錯</p>
                    <p className="text-xl font-bold text-red-600">{item.wrongCount}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
