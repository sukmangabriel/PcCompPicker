import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { logoutUser, type AuthResponse } from './api'
import { AuthModal } from './components/AuthModal'
import { Navbar } from './components/Navbar'
import { ConfiguratorPage } from './pages/ConfiguratorPage'
import { LandingPage } from './pages/LandingPage'
import { UserConfigurations } from './pages/UserConfigurations'
import type { Configuration } from './types/hardware'

const STORAGE_KEY_USER = 'pccomp-picker-user'
const STORAGE_KEY_TOKEN = 'pccomp-picker-token'

function App() {
  const [configuration, setConfiguration] = useState<Configuration>({})
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_USER)
  })
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN)
  })

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem(STORAGE_KEY_USER, loggedInUser)
      return
    }

    localStorage.removeItem(STORAGE_KEY_USER)
  }, [loggedInUser])

  useEffect(() => {
    if (authToken) {
      localStorage.setItem(STORAGE_KEY_TOKEN, authToken)
      return
    }

    localStorage.removeItem(STORAGE_KEY_TOKEN)
  }, [authToken])

  const handleAuthSuccess = ({ user, token }: AuthResponse) => {
    setLoggedInUser(user.username)
    setAuthToken(token)
    setIsAuthModalOpen(false)
  }

  const handleLogout = async () => {
    try {
      if (authToken) {
        await logoutUser()
      }
    } catch {
      // Ignoriramo grešku pri odjavi jer korisnik mora ostati odjavljen lokalno.
    } finally {
      setLoggedInUser(null)
      setAuthToken(null)
      setIsAuthModalOpen(false)
    }
  }

  return (
    <div className="app-shell">
      <Navbar
        isLoggedIn={loggedInUser !== null}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/konfigurator"
          element={
            <ConfiguratorPage
              configuration={configuration}
              setConfiguration={setConfiguration}
              loggedInUser={loggedInUser}
              authToken={authToken}
            />
          }
        />
        <Route
          path="/moje-konfiguracije"
          element={<UserConfigurations loggedInUser={loggedInUser} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default App
