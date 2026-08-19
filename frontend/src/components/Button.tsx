import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'card' | 'ghost' | 'secondary' | 'tab'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  active?: boolean
}

export function Button({
  variant = 'primary',
  active = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = ['button', `button--${variant}`]

  if (active) {
    classes.push('button--active')
  }

  if (className) {
    classes.push(className)
  }

  return <button {...props} type={type} className={classes.join(' ')} />
}
