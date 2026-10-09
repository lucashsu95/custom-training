import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'

/**
 * 空狀態佔位元件
 *
 * 取代 ManageQuestions.jsx 的裸字串 '目前沒有任何題目'
 * 與 HistoryView.jsx 的客製空狀態區塊。
 * icon / action 為 slot，呼叫端傳入 lucide-react 圖示
 *（如 FileQuestion、History）與 Button。
 *
 * @example
 * <EmptyState
 *   icon={<FileQuestion className="h-10 w-10" />}
 *   title="尚無題目"
 *   description="上傳 JSON 檔案或手動新增題目來開始練習"
 *   action={<Button onClick={openUpload}>上傳題庫</Button>}
 * />
 */
export default function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground">{icon}</div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
}
