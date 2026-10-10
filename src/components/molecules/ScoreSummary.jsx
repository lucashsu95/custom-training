import PropTypes from 'prop-types'
import { scoreTone } from '@/lib/functions'
import { cn } from '@/lib/utils'

const SCORE_TEXT = {
  good: 'text-score-good',
  warn: 'text-score-warn',
  bad: 'text-score-bad',
}

/**
 * 練習結果摘要
 * 主分數以 scoreTone(score) 上色，答對/答錯/總題數用 P0 語意色。
 *
 * @example <ScoreSummary score={85} correct={7} wrong={1} total={8} />
 */
export default function ScoreSummary({ score, correct, wrong, total, className }) {
  const tone = scoreTone(score)
  return (
    <section aria-label="練習結果" className={cn('rounded-xl border bg-card p-6 text-center shadow-subtle', className)}>
      <p className="text-sm text-muted-foreground">本次得分</p>
      <p className={cn('text-display font-semibold tabular-nums', SCORE_TEXT[tone])}>
        {score}
        <span className="text-title font-medium text-muted-foreground"> 分</span>
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-md bg-ans-correct px-2 py-2.5">
          <dt className="text-xs text-muted-foreground">答對</dt>
          <dd className="text-title font-semibold tabular-nums text-score-good">{correct}</dd>
        </div>
        <div className="rounded-md bg-ans-wrong px-2 py-2.5">
          <dt className="text-xs text-muted-foreground">答錯</dt>
          <dd className="text-title font-semibold tabular-nums text-score-bad">{wrong}</dd>
        </div>
        <div className="rounded-md bg-muted px-2 py-2.5">
          <dt className="text-xs text-muted-foreground">總題數</dt>
          <dd className="text-title font-semibold tabular-nums">{total}</dd>
        </div>
      </dl>
    </section>
  )
}

ScoreSummary.propTypes = {
  score: PropTypes.number.isRequired,
  correct: PropTypes.number.isRequired,
  wrong: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  className: PropTypes.string,
}
