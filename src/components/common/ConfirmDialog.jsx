import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import PropTypes from 'prop-types'

/**
 * 確認對話框
 *
 * 取代 ManageQuestions.jsx 的 4 個 AlertDialog、
 * HistoryView.jsx 的 window.confirm、
 * CreateQuestionForm.jsx 的 alert()。
 * 呼叫端以單一 { kind, payload } 形式的狀態驅動：
 * 由 payload 映射出 title / description，傳入本元件顯示。
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {function} props.onOpenChange
 * @param {'default'|'destructive'} [props.kind='default']
 * @param {string} props.title
 * @param {string} props.description
 * @param {function} props.onConfirm — 點擊確認時呼叫
 * @param {string} [props.confirmLabel='確認']
 * @param {string} [props.cancelLabel='取消']
 *
 * @example
 * const [confirm, setConfirm] = useState(null) // { kind, payload } | null
 * const config = confirm ? CONFIRM_CONFIGS[confirm.kind](confirm.payload) : null
 * <ConfirmDialog
 *   open={!!confirm}
 *   onOpenChange={(v) => !v && setConfirm(null)}
 *   kind={confirm?.kind === 'clearAll' ? 'destructive' : 'default'}
 *   title={config?.title ?? ''}
 *   description={config?.description ?? ''}
 *   onConfirm={handleConfirm}
 *   confirmLabel="刪除"
 * />
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  kind = 'default',
  title,
  description,
  onConfirm,
  confirmLabel = '確認',
  cancelLabel = '取消',
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={kind === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : undefined}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  kind: PropTypes.oneOf(['default', 'destructive']),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
}
