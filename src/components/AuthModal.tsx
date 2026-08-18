import { useMemo, useState } from 'react'
import { Button } from './Button'
import { Input } from './Input'

type AuthMode = 'login' | 'register'

type AuthModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')

  const title = useMemo(
    () => (mode === 'login' ? 'Prijava' : 'Registracija'),
    [mode],
  )

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onClose()
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
            onClick={() => setMode('login')}
            role="tab"
            aria-selected={mode === 'login'}
          >
            Prijava
          </Button>
          <Button
            type="button"
            variant="tab"
            className={mode === 'register' ? 'button--active auth-modal__tab' : 'auth-modal__tab'}
            onClick={() => setMode('register')}
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
            <Button type="submit" variant="primary">
              {mode === 'login' ? 'Prijavi se' : 'Registriraj se'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
