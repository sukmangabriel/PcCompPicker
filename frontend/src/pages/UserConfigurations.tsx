import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
  deleteConfiguration,
  fetchConfigurations,
  renameConfiguration,
  type SavedConfiguration,
} from '../api'
import { Button } from '../components/Button'
import { SavedConfigurationCard } from '../components/SavedConfigurationCard'
import { cases } from '../data/cases'
import { coolings } from '../data/coolings'
import { cpus } from '../data/cpus'
import { gpus } from '../data/gpus'
import { motherboards } from '../data/motherboards'
import { psus } from '../data/psus'
import { rams } from '../data/rams'
import { storages } from '../data/storages'
import type { Component, ComponentCategory, Configuration } from '../types/hardware'

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

export function UserConfigurations({ loggedInUser }: UserConfigurationsProps) {
  const [configurations, setConfigurations] = useState<SavedConfiguration[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedConfigs, setExpandedConfigs] = useState<Record<number, boolean>>({})
  const navigate = useNavigate()

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

  const handleEdit = (configuration: SavedConfiguration) => {
    const nextConfiguration: Configuration = {}

    for (const { key } of categoryOrder) {
      const componentId = configuration[`${key}_id` as keyof SavedConfiguration] as string | null | undefined
      if (!componentId) {
        continue
      }

      const selectedComponent = allComponents[componentId]
      if (selectedComponent) {
        nextConfiguration[key] = selectedComponent
      }
    }

    navigate('/konfigurator', {
      state: {
        configuration: nextConfiguration,
        editingConfigurationId: configuration.id,
        configName: configuration.name || 'Moja konfiguracija',
      },
    })
  }

  const handleRename = async (configurationId: number, newName: string) => {
    const trimmedName = newName.trim()

    if (!trimmedName) {
      toast.error('Ime konfiguracije ne može biti prazno.')
      return
    }

    try {
      const updatedConfiguration = await renameConfiguration(configurationId, trimmedName)
      setConfigurations((current) =>
        current.map((item) =>
          item.id === configurationId ? { ...item, name: updatedConfiguration.name } : item,
        ),
      )
      toast.success('Naziv konfiguracije je uspješno promijenjen.')
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Nismo uspjeli promijeniti naziv konfiguracije.'
      toast.error(message)
    }
  }

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

              return (
                <SavedConfigurationCard
                  key={configuration.id}
                  configuration={configuration}
                  isExpanded={isExpanded}
                  onToggle={() => toggleConfiguration(configuration.id)}
                  onDelete={() => void handleDelete(configuration.id)}
                  onEdit={() => handleEdit(configuration)}
                  onRename={(newName) => void handleRename(configuration.id, newName)}
                />
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
