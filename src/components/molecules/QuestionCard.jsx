import PropTypes from 'prop-types'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import DueBadge from './DueBadge'

/**
 * 題目卡片 — 題庫列表的一列
 * 題目本文 + DueBadge + 操作 slot（編輯/刪除由呼叫端傳入）。
 *
 * @example
 * <QuestionCard
 *   question={q}
 *   actions={<><Button>編輯</Button><Button>刪除</Button></>}
 * />
 */
export default function QuestionCard({ question, actions, className }) {
  const stem = question.name ?? question.stem ?? ''
  return (
    <Card className={cn('shadow-subtle', className)}>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-stem font-medium truncate" title={stem}>
            {stem}
          </p>
          {(question.tag || question.type) && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {[question.type, question.tag].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <DueBadge due={question.due} />
          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

QuestionCard.propTypes = {
  question: PropTypes.shape({
    name: PropTypes.string,
    stem: PropTypes.string,
    tag: PropTypes.string,
    type: PropTypes.string,
    due: PropTypes.number,
  }).isRequired,
  actions: PropTypes.node,
  className: PropTypes.string,
}
