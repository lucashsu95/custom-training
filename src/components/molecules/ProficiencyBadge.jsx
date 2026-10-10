import PropTypes from 'prop-types'
import { proficiencyLevel } from '@/lib/functions'
import { cn } from '@/lib/utils'

const TONE_CLASSES = {
  good: 'bg-ans-correct text-score-good',
  warn: 'bg-ans-missed text-score-warn',
  bad: 'bg-ans-wrong text-score-bad',
  neutral: 'bg-muted text-muted-foreground',
}

const DOT_CLASSES = {
  good: 'bg-score-good',
  warn: 'bg-score-warn',
  bad: 'bg-score-bad',
  neutral: 'bg-muted-foreground',
}

/**
 * 整題狀態徽章 — DueBadge 的強調版
 * 用於題目整體熟練度狀態，附狀態圓點。
 *
 * @example <ProficiencyBadge due={question.due} />
 */
export default function ProficiencyBadge({ due, className }) {
  const { label, tone } = proficiencyLevel(due)
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-semibold tabular-nums',
        TONE_CLASSES[tone],
        className
      )}
    >
      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', DOT_CLASSES[tone])} />
      {label}
    </span>
  )
}

ProficiencyBadge.propTypes = {
  due: PropTypes.number,
  className: PropTypes.string,
}
