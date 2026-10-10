import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { formatTime, scoreTone } from '@/lib/functions'
import { cn } from '@/lib/utils'

const SCORE_TEXT = {
  good: 'text-score-good',
  warn: 'text-score-warn',
  bad: 'text-score-bad'
}

/**
 * 練習狀態列（取代 StateBoard 的計時契約，B5 才接入頁面）
 * 契約保留 StateBoard 的 onTimeUpdate / initialTime；另加 current / total / score。
 */
export default function TrainingHUD({ mod, onTimeUpdate, initialTime = 0, current, total, score }) {
  const [isActive, setIsActive] = useState(true)
  const [time, setTime] = useState(initialTime)

  // Timer（與 StateBoard 同語義：mount 啟動、mod completed 停止）
  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1
          if (onTimeUpdate) onTimeUpdate(newTime)
          return newTime
        })
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, onTimeUpdate])

  const startTimer = () => {
    setIsActive(true)
  }

  const stopTimer = () => {
    setIsActive(false)
  }

  useEffect(() => {
    startTimer()
  }, [])

  useEffect(() => {
    if (mod === 'completed') {
      stopTimer()
    }
  }, [mod])

  const hasProgress = typeof current === 'number' && typeof total === 'number'
  const hasScore = typeof score === 'number' && score >= 0

  return (
    <section
      aria-label="練習狀態"
      className="sticky top-[var(--header-h)] z-header my-2 flex items-center gap-6 rounded-lg border bg-background/95 px-4 py-2 shadow-subtle backdrop-blur"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-muted-foreground">時間</span>
        <span className="text-base font-semibold tabular-nums">{formatTime(time)}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-muted-foreground">進度</span>
        <span className="text-base font-semibold tabular-nums">
          {hasProgress ? `${current}/${total}` : '—'}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-muted-foreground">得分</span>
        <span
          className={cn(
            'text-base font-semibold tabular-nums',
            hasScore ? SCORE_TEXT[scoreTone(score)] : 'text-muted-foreground'
          )}
        >
          {hasScore ? `${score} 分` : '—'}
        </span>
      </div>
    </section>
  )
}

TrainingHUD.propTypes = {
  mod: PropTypes.string,
  onTimeUpdate: PropTypes.func,
  initialTime: PropTypes.number,
  current: PropTypes.number,
  total: PropTypes.number,
  score: PropTypes.number
}
