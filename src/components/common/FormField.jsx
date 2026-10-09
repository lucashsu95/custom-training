import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import PropTypes from 'prop-types'

/**
 * 表單欄位包裝元件
 *
 * 取代 TrainingSettings.jsx 與 CreateQuestionForm.jsx 中的
 * 臨時 Label+Input 配對，統一標籤、描述、錯誤顯示。
 * CreateQuestionForm.jsx 的 8 個 alert() 驗證訊息
 * 改由 error prop 以 role="alert" 顯示。
 *
 * @example
 * <FormField label="題目數量" htmlFor="count" description="每次練習的題目數">
 *   <Input id="count" type="number" min={1} />
 * </FormField>
 *
 * <FormField label="題目" htmlFor="stem" error="題目不能為空">
 *   <Input id="stem" aria-invalid={!!error} aria-describedby="stem-error" />
 * </FormField>
 */
export default function FormField({
  label,
  htmlFor,
  description,
  error,
  children,
  className,
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined
  const descId = htmlFor ? `${htmlFor}-desc` : undefined

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {description && !error && (
        <p id={descId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
FormField.propTypes = {
  label: PropTypes.string.isRequired,
  htmlFor: PropTypes.string,
  description: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}
