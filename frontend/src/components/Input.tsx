import type { InputHTMLAttributes } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="input-field">
      <label htmlFor={inputId} className="input-field__label">
        {label}
      </label>
      <input
        id={inputId}
        className={['input', className].filter(Boolean).join(' ')}
        {...props}
      />
    </div>
  )
}
