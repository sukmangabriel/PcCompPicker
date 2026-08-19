import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
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
  const [expandedConfigs, setExpandedConfigs] = useState<Record<number, boolean>>({})

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
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? 'Nismo uspjeli dohvatiti konfiguracije.')
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
    const configuration = configurations.find((item) => item.id === configurationId)
    const configurationName = configuration?.name || 'ova spremljena konfiguracija'

    toast.custom(
      (t) => (
        <div className="toast-confirmation">
          <p>Želite li stvarno obrisati {configurationName}?</p>
          <div className="toast-confirmation__actions">
            <Button
              type="button"
              variant="primary"
              className="toast-confirmation__button toast-confirmation__button--primary"
              onClick={async () => {
                toast.dismiss(t.id)
                try {
                  await deleteConfiguration(configurationId)
                  setConfigurations((current) => current.filter((item) => item.id !== configurationId))
                  setExpandedConfigs((current) => {
                    const next = { ...current }
                    delete next[configurationId]
                    return next
                  })
                  toast.success('Konfiguracija je uspješno obrisana.')
                } catch (error: any) {
                  const message = error?.response?.data?.message ?? 'Nismo uspjeli obrisati konfiguraciju.'
                  toast.error(message)
                }
              }}
            >
              Da, obriši
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

  const toggleConfiguration = (configurationId: number) => {
    setExpandedConfigs((current) => ({
      ...current,
      [configurationId]: !current[configurationId],
    }))
  }

  const getConfigurationSummary = (configuration: SavedConfiguration) => {
    const selectedComponents = categoryOrder.filter(({ key }) => {
      const value = configuration[`${key}_id` as keyof SavedConfiguration] as string | null | undefined
      return Boolean(value)
    }).length

    const totalPrice = categoryOrder.reduce((sum, { key }) => {
      const value = configuration[`${key}_id` as keyof SavedConfiguration] as string | null | undefined
      if (!value) {
        return sum
      }

      const component = allComponents[value]
      return sum + (component?.price ?? 0)
    }, 0)

    const totalTdp = categoryOrder.reduce((sum, { key }) => {
      const value = configuration[`${key}_id` as keyof SavedConfiguration] as string | null | undefined
      if (!value) {
        return sum
      }

      const component = allComponents[value]
      return sum + (component?.tdp ?? 0)
    }, 0)

    return {
      selectedComponents,
      totalPrice,
      totalTdp,
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
            <h1>Moje konfiguracije</h1>
          </div>
        </div>

        {loading ? (
          <p className="page-text">Učitavanje konfiguracija...</p>
        ) : configurations.length === 0 ? (
          <p className="page-text">Nemate spremljenih konfiguracija.</p>
        ) : (
          <div className="saved-configurations">
            {configurations.map((configuration) => {
              const isExpanded = Boolean(expandedConfigs[configuration.id])
              const summary = getConfigurationSummary(configuration)

              return (
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

                  <div className="saved-configuration-card__summary">
                    <div className="saved-configuration-card__stats">
                      <div className="saved-configuration-stat">
                        <span>Ukupna cijena</span>
                        <strong>{summary.totalPrice.toFixed(2)} €</strong>
                      </div>
                      <div className="saved-configuration-stat">
                        <span>TDP</span>
                        <strong>{summary.totalTdp} W</strong>
                      </div>
                      <div className="saved-configuration-stat">
                        <span>Komponente</span>
                        <strong>{summary.selectedComponents}</strong>
                      </div>
                    </div>

                    <div className="saved-configuration-card__actions">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => toggleConfiguration(configuration.id)}
                      >
                        {isExpanded ? 'Sakrij detalje' : 'Prikaži detalje'}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="saved-configuration-card__list">
                      {categoryOrder.map(({ key, label }) => (
                        <div key={key} className="saved-configuration-item">
                          <span>{label}</span>
                          <strong>{getComponentName(configuration[`${key}_id` as keyof SavedConfiguration] as string | null | undefined)}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
