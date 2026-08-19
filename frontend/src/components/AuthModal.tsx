import { useMemo, useState } from 'react'
import { loginUser, registerUser, type AuthResponse } from '../api'
import { Button } from './Button'
import { Input } from './Input'

type AuthMode = 'login' | 'register'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (payload: AuthResponse) => void
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [errorMessage, setErrorMessage] = useState('')
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
      setErrorMessage('Korisničko ime i lozinka su obavezni.')
      return
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMessage('Lozinke se ne podudaraju.')
        return
      }

      if (password.length < 6) {
        setErrorMessage('Lozinka mora imati najmanje 6 znakova.')
        return
      }
    }

    setIsSubmitting(true)
    setErrorMessage('')

    console.log('Auth submit start:', { mode, username, passwordLength: password.length })

    try {
      const response =
        mode === 'login'
          ? await loginUser(username, password)
          : await registerUser(username, password)

      console.log('Auth response received:', response)

      form.reset()
      setErrorMessage('')
      console.log('Uspješna prijava:', response)
      onAuthSuccess(response)
      onClose()
    } catch (error: any) {
      console.error('Auth submit error:', error)
      setErrorMessage(
        error?.response?.data?.message ?? 'Došlo je do pogreške. Pokušajte ponovno.',
      )
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
              setErrorMessage('')
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
              setErrorMessage('')
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

          {errorMessage && <p className="form-message form-message--error">{errorMessage}</p>}

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
