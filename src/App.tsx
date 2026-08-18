import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ConfiguratorPage } from './pages/ConfiguratorPage'
import { LandingPage } from './pages/LandingPage'
import { UserConfigurations } from './pages/UserConfigurations'
import type { Configuration } from './types/hardware'

function App() {
  const [configuration, setConfiguration] = useState<Configuration>({})

  return (
    <div className="app-shell">
      <Navbar />
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
    </div>
  )
}

export default App
