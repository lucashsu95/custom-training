import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'

/**
 * 頁面標題區塊
 *
 * @example
 * <PageHeader
 *   title="題庫"
 *   description="依標籤分組，共 142 題 · 12 個標籤"
 *   actions={<Button>下載範例</Button>}
 * />
 */
export default function PageHeader({ title, description, actions, className }) {
  return (
    <div className={cn('flex flex-col gap-1 pb-6 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h1 className="text-title font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  )
}
PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
}
