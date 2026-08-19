import { useEffect } from 'react'
import { Button } from './Button'

type ToastType = 'success' | 'error' | 'info'

type ToastProps = {
  message: string
  type: ToastType
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onClose()
    }, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [onClose])

  return (
    <div className={`toast toast--${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      <Button
        type="button"
        variant="ghost"
        className="toast__close"
        onClick={onClose}
        aria-label="Zatvori obavijest"
      >
        ×
      </Button>
    </div>
  )
}
