import { useMemo, useState } from 'react'
import { loginUser, registerUser, type AuthResponse } from '../api'
import { Button } from './Button'
import { Input } from './Input'

type AuthMode = 'login' | 'register'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (payload: AuthResponse) => void
  onError?: (message: string) => void
}

export function AuthModal({ isOpen, onClose, onAuthSuccess, onError }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = useMemo(
    () => (mode === 'login' ? 'Prijava' : 'Registracija'),
    [mode],
  )

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const username = String(formData.get('username') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (!username || !password) {
      const message = mode === 'register'
        ? 'Registracija nije uspjela: korisničko ime i lozinka su obavezni.'
        : 'Prijava nije uspjela: korisničko ime i lozinka su obavezni.'
      onError?.(message)
      return
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        const message = 'Registracija nije uspjela: lozinke se ne podudaraju.'
        onError?.(message)
        return
      }

      if (password.length < 6) {
        const message = 'Registracija nije uspjela: lozinka mora imati najmanje 6 znakova.'
        onError?.(message)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const response =
        mode === 'login'
          ? await loginUser(username, password)
          : await registerUser(username, password)

      form.reset()
      onAuthSuccess(response)
      onClose()
    } catch (error: any) {
      const rawMessage = error?.response?.data?.message ?? 'Došlo je do pogreške. Pokušajte ponovno.'
      const message = mode === 'register'
        ? `Registracija nije uspjela: ${rawMessage.replace(/^Registracija nije uspjela:\s*/i, '')}`
        : `Prijava nije uspjela: ${rawMessage.replace(/^Prijava nije uspjela:\s*/i, '')}`
      onError?.(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-modal__backdrop" onClick={onClose} aria-hidden="true">
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-modal__header">
          <div>
            <p className="eyebrow">Račun</p>
            <h2 id="auth-modal-title">{title}</h2>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="auth-modal__close"
            onClick={onClose}
            aria-label="Zatvori modal"
          >
            ×
          </Button>
        </div>

        <div className="auth-modal__tabs" role="tablist" aria-label="Odabir načina prijave">
          <Button
            type="button"
            variant="tab"
            className={mode === 'login' ? 'button--active auth-modal__tab' : 'auth-modal__tab'}
            onClick={() => {
              setMode('login')
            }}
            role="tab"
            aria-selected={mode === 'login'}
          >
            Prijava
          </Button>
          <Button
            type="button"
            variant="tab"
            className={mode === 'register' ? 'button--active auth-modal__tab' : 'auth-modal__tab'}
            onClick={() => {
              setMode('register')
            }}
            role="tab"
            aria-selected={mode === 'register'}
          >
            Registracija
          </Button>
        </div>

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          <Input
            label="Korisničko ime"
            type="text"
            name="username"
            placeholder="korisnicko_ime"
            autoComplete="username"
          />

          <Input
            label="Lozinka"
            type="password"
            name="password"
            placeholder="Unesite lozinku"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'register' && (
            <Input
              label="Ponovi lozinku"
              type="password"
              name="confirmPassword"
              placeholder="Ponovite lozinku"
              autoComplete="new-password"
            />
          )}

          <div className="auth-modal__actions">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? mode === 'login'
                  ? 'Prijava...'
                  : 'Registracija...'
                : mode === 'login'
                  ? 'Prijavi se'
                  : 'Registriraj se'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
