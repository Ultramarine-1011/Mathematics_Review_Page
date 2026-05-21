import { Button } from './Button'

export interface ToastMessage {
  id: number
  type: 'success' | 'error'
  text: string
}

interface ToastProps {
  toast: ToastMessage
  onDismiss: () => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const styles =
    toast.type === 'success'
      ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'
      : 'border-rose-400/30 bg-rose-500/15 text-rose-100'

  return (
    <div
      role="status"
      className={`fixed left-4 right-4 top-4 z-50 mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-md sm:left-auto sm:right-6 sm:w-96 ${styles}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{toast.text}</p>
        <Button
          type="button"
          variant="ghost"
          className="min-h-8 px-2 py-1"
          onClick={onDismiss}
          aria-label="关闭提示"
        >
          关闭
        </Button>
      </div>
    </div>
  )
}

