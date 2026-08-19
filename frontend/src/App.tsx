import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthModal } from './components/AuthModal'
import { Navbar } from './components/Navbar'
import { ConfiguratorPage } from './pages/ConfiguratorPage'
import { LandingPage } from './pages/LandingPage'
import { UserConfigurations } from './pages/UserConfigurations'
import type { Configuration } from './types/hardware'

function App() {
  const [configuration, setConfiguration] = useState<Configuration>({})
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null)

  const handleAuthSuccess = (username: string) => {
    setLoggedInUser(username)
    setIsAuthModalOpen(false)
  }

  return (
    <div className="app-shell">
      <Navbar
        isLoggedIn={loggedInUser !== null}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => setLoggedInUser(null)}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/konfigurator"
          element={
            <ConfiguratorPage
              configuration={configuration}
              setConfiguration={setConfiguration}
            />
          }
        />
        <Route path="/moje-konfiguracije" element={<UserConfigurations />} />
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
