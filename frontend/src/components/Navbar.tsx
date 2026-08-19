import { NavLink } from 'react-router-dom'

type NavbarProps = {
  isLoggedIn: boolean
  onOpenAuth: () => void
  onLogout: () => void
}

export function Navbar({ isLoggedIn, onOpenAuth, onLogout }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand" aria-label="PcCompPicker">
          <span className="brand-mark">PC</span>
          <span>PcCompPicker</span>
        </div>

        <nav className="navbar__nav" aria-label="Glavna navigacija">
          <NavLink to="/" className="nav-link">
            Početna
          </NavLink>
          <NavLink to="/konfigurator" className="nav-link">
            Konfigurator
          </NavLink>
          <NavLink to="/moje-konfiguracije" className="nav-link">
            Moje konfiguracije
          </NavLink>
        </nav>

        <button
          type="button"
          className="button button--ghost button--nav"
          aria-label={isLoggedIn ? 'Odjava' : 'Prijava'}
          onClick={isLoggedIn ? onLogout : onOpenAuth}
        >
          {isLoggedIn ? 'Odjava' : 'Prijava/Registracija'}
        </button>
      </div>
    </header>
  )
}
