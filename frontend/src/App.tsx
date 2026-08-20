import { useEffect, useState } from 'react'
import './App.css'
import toast, { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import { logoutUser, type AuthResponse } from './api'
import { AuthModal } from './components/AuthModal'
import { Button } from './components/Button'
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
    toast.success(`Uspješno ste prijavljeni kao ${user.username}.`, {
      duration: 2000,
    })
  }

  const handleLogout = async () => {
    toast.custom(
      (t) => (
        <div className="toast-confirmation">
          <p>Želite li se stvarno odjaviti?</p>
          <div className="toast-confirmation__actions">
            <Button
              type="button"
              variant="primary"
              className="toast-confirmation__button toast-confirmation__button--primary"
              onClick={async () => {
                toast.dismiss(t.id)
                try {
                  if (authToken) {
                    await logoutUser()
                  }
                } catch (error: unknown) {
                  void error
                } finally {
                  setLoggedInUser(null)
                  setAuthToken(null)
                  setIsAuthModalOpen(false)
                  toast.success('Uspješno ste odjavljeni.', {
                    duration: 2000,
                  })
                }
              }}
            >
              Da, odjavi me
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="toast-confirmation__button toast-confirmation__button--secondary"
              onClick={() => toast.dismiss(t.id)}
            >
              Odustani
            </Button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      },
    )
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
              onOpenAuth={() => setIsAuthModalOpen(true)}
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
        onError={(message) => toast.error(message, { duration: 2000 })}
      />

      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 18,
          left: 20,
          right: 20,
          bottom: 'auto',
        }}
        toastOptions={{
          duration: 2000,
          style: {
            maxWidth: '420px',
            width: 'fit-content',
            minWidth: '300px',
            borderRadius: '18px',
            padding: '14px 18px',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: '0 22px 45px rgba(15, 23, 42, 0.16)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            margin: '0 auto',
          },
          success: {
            style: {
              background: '#dcfce7',
              color: '#166534',
            },
            iconTheme: {
              primary: '#166534',
              secondary: '#dcfce7',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
            },
            iconTheme: {
              primary: '#991b1b',
              secondary: '#fef2f2',
            },
          },
        }}
      />
    </div>
  )
}

export default App
