import { useEffect, useMemo, useState } from 'react'
import { deleteConfiguration, fetchConfigurations, type SavedConfiguration } from '../api'
import { Button } from '../components/Button'
import { cases } from '../data/cases'
import { coolings } from '../data/coolings'
import { cpus } from '../data/cpus'
import { gpus } from '../data/gpus'
import { motherboards } from '../data/motherboards'
import { psus } from '../data/psus'
import { rams } from '../data/rams'
import { storages } from '../data/storages'
import type { Component, ComponentCategory } from '../types/hardware'

type UserConfigurationsProps = {
  loggedInUser: string | null
}

const allComponents: Record<string, Component> = {}

for (const list of [cpus, gpus, rams, storages, motherboards, psus, cases, coolings]) {
  for (const item of list) {
    allComponents[item.id] = item
  }
}

const categoryOrder: Array<{ key: ComponentCategory; label: string }> = [
  { key: 'cpu', label: 'CPU' },
  { key: 'gpu', label: 'GPU' },
  { key: 'ram', label: 'RAM' },
  { key: 'storage', label: 'Pohrana' },
  { key: 'motherboard', label: 'Matična ploča' },
  { key: 'psu', label: 'Napajanje' },
  { key: 'case', label: 'Kućište' },
  { key: 'cooling', label: 'Hlađenje' },
]

function getComponentName(value: string | null | undefined) {
  if (!value) {
    return 'Nije odabrano'
  }

  return allComponents[value]?.name ?? 'Nepoznata komponenta'
}

export function UserConfigurations({ loggedInUser }: UserConfigurationsProps) {
  const [configurations, setConfigurations] = useState<SavedConfiguration[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const loadConfigurations = useMemo(
    () => async () => {
      if (!loggedInUser) {
        setConfigurations([])
        return
      }

      try {
        setLoading(true)
        const savedConfigurations = await fetchConfigurations()
        setConfigurations(savedConfigurations)
        setErrorMessage('')
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message ?? 'Nismo uspjeli dohvatiti konfiguracije.')
      } finally {
        setLoading(false)
      }
    },
    [loggedInUser],
  )

  useEffect(() => {
    void loadConfigurations()
  }, [loadConfigurations])

  const handleDelete = async (configurationId: number) => {
    try {
      await deleteConfiguration(configurationId)
      setConfigurations((current) => current.filter((item) => item.id !== configurationId))
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? 'Nismo uspjeli obrisati konfiguraciju.')
    }
  }

  if (!loggedInUser) {
    return (
      <main className="page-shell page-shell--compact">
        <section className="page-card">
          <h1>Moje konfiguracije</h1>
          <p className="page-text">Prijavite se kako biste vidjeli i upravljali svojim spremljenim konfiguracijama.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell page-shell--compact">
      <section className="page-card">
        <div className="page-card__header">
          <div>
            <p className="eyebrow">Korisnički račun</p>
            <h1>Moje konfiguracije</h1>
          </div>
          <span className="profile-pill">Prijavljen kao: {loggedInUser}</span>
        </div>

        {errorMessage && <p className="form-message form-message--error">{errorMessage}</p>}

        {loading ? (
          <p className="page-text">Učitavanje konfiguracija...</p>
        ) : configurations.length === 0 ? (
          <p className="page-text">Nemate spremljenih konfiguracija.</p>
        ) : (
          <div className="saved-configurations">
            {configurations.map((configuration) => (
              <article key={configuration.id} className="saved-configuration-card">
                <div className="saved-configuration-card__header">
                  <div>
                    <p className="eyebrow">Spremljeno</p>
                    <h2>{configuration.name || 'Moja konfiguracija'}</h2>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void handleDelete(configuration.id)}
                  >
                    Obriši
                  </Button>
                </div>

                <div className="saved-configuration-card__list">
                  {categoryOrder.map(({ key, label }) => (
                    <div key={key} className="saved-configuration-item">
                      <span>{label}</span>
                      <strong>{getComponentName(configuration[`${key}_id` as keyof SavedConfiguration] as string | null | undefined)}</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
