import PropTypes from 'prop-types'
import { proficiencyLevel } from '@/lib/functions'
import { cn } from '@/lib/utils'

const TONE_CLASSES = {
  good: 'bg-ans-correct text-score-good',
  warn: 'bg-ans-missed text-score-warn',
  bad: 'bg-ans-wrong text-score-bad',
  neutral: 'bg-muted text-muted-foreground',
}

/**
 * 熟練度階梯徽章（緊湊 pill）
 * Due Ladder 的最小視覺單位：刻痕軌道上的一格。
 *
 * @example <DueBadge due={5} />
 */
export default function DueBadge({ due, className }) {
  const { label, tone } = proficiencyLevel(due)
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium tabular-nums',
        TONE_CLASSES[tone],
        className
      )}
    >
      {label}
    </span>
  )
}

DueBadge.propTypes = {
  due: PropTypes.number,
  className: PropTypes.string,
}
