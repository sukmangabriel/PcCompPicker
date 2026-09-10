import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

type NavbarProps = {
  isLoggedIn: boolean
  onOpenAuth: () => void
  onLogout: () => void
}

export function Navbar({ isLoggedIn, onOpenAuth, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand" aria-label="PcCompPicker">
          <span className="brand-mark">PC</span>
          <span>PcCompPicker</span>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={isMenuOpen ? 'Zatvori izbornik' : 'Otvori izbornik'}
          aria-expanded={isMenuOpen}
          aria-controls="navbar-menu"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="navbar__toggle-icon" aria-hidden="true" />
        </button>

        <nav
          id="navbar-menu"
          className={
            isMenuOpen ? 'navbar__nav navbar__nav--open' : 'navbar__nav'
          }
          aria-label="Glavna navigacija"
        >
          <NavLink
            to="/"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Početna
          </NavLink>
          <NavLink
            to="/konfigurator"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Konfigurator
          </NavLink>
          <NavLink
            to="/moje-konfiguracije"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Moje konfiguracije
          </NavLink>

          <button
            type="button"
            className="button button--ghost button--nav navbar__auth navbar__auth--mobile"
            aria-label={isLoggedIn ? 'Odjava' : 'Prijava'}
            onClick={() => {
              setIsMenuOpen(false)
              if (isLoggedIn) {
                onLogout()
              } else {
                onOpenAuth()
              }
            }}
          >
            {isLoggedIn ? 'Odjava' : 'Prijava/Registracija'}
          </button>
        </nav>

        <button
          type="button"
          className="button button--ghost button--nav navbar__auth navbar__auth--desktop"
          aria-label={isLoggedIn ? 'Odjava' : 'Prijava'}
          onClick={isLoggedIn ? onLogout : onOpenAuth}
        >
          {isLoggedIn ? 'Odjava' : 'Prijava/Registracija'}
        </button>
      </div>
    </header>
  )
}
