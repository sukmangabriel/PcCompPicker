import { useState } from 'react'
import { Button } from './Button'
import type { SavedConfiguration } from '../api'
import {
  allComponents,
  configurationCategoryOrder,
} from '../utils/configuration-metadata'

function getComponentName(value: string | null | undefined) {
  if (!value) {
    return 'Nije odabrano'
  }

  return allComponents[value]?.name ?? 'Nepoznata komponenta'
}

function getConfigurationSummary(configuration: SavedConfiguration) {
  const selectedComponents = configurationCategoryOrder.filter(({ key }) => {
    const value = configuration[`${key}_id` as keyof SavedConfiguration] as
      string | null | undefined
    return Boolean(value)
  }).length

  const totalPrice = configurationCategoryOrder.reduce((sum, { key }) => {
    const value = configuration[`${key}_id` as keyof SavedConfiguration] as
      string | null | undefined
    if (!value) {
      return sum
    }

    const component = allComponents[value]
    return sum + (component?.price ?? 0)
  }, 0)

  const totalTdp = configurationCategoryOrder.reduce((sum, { key }) => {
    const value = configuration[`${key}_id` as keyof SavedConfiguration] as
      string | null | undefined
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

type SavedConfigurationCardProps = {
  configuration: SavedConfiguration
  isExpanded: boolean
  onToggle: () => void
  onDelete: () => void
  onEdit: () => void
  onRename: (newName: string) => void | Promise<void>
}

export function SavedConfigurationCard({
  configuration,
  isExpanded,
  onToggle,
  onDelete,
  onEdit,
  onRename,
}: SavedConfigurationCardProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftName, setDraftName] = useState(
    configuration.name || 'Moja konfiguracija',
  )

  const summary = getConfigurationSummary(configuration)

  const handleRenameSubmit = async () => {
    const nextName = draftName.trim()

    if (!nextName) {
      return
    }

    await onRename(nextName)
    setIsRenaming(false)
  }

  return (
    <article className="saved-configuration-card">
      <div className="saved-configuration-card__header">
        <div className="saved-configuration-card__title-wrap">
          <p className="eyebrow">Spremljeno</p>

          {isRenaming ? (
            <div className="saved-configuration-card__rename">
              <input
                type="text"
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                aria-label="Novi naziv konfiguracije"
                className="saved-configuration-card__rename-input"
              />

              <div className="saved-configuration-card__rename-actions">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => void handleRenameSubmit()}
                >
                  Spremi
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsRenaming(false)}
                >
                  Odustani
                </Button>
              </div>
            </div>
          ) : (
            <h2>{configuration.name || 'Moja konfiguracija'}</h2>
          )}
        </div>

        <div className="saved-configuration-card__header-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setDraftName(configuration.name || 'Moja konfiguracija')
              setIsRenaming(true)
            }}
          >
            Preimenuj konfiguraciju
          </Button>
          <Button type="button" variant="secondary" onClick={onEdit}>
            Uredi konfiguraciju
          </Button>
          <Button type="button" variant="ghost" onClick={onDelete}>
            Obriši
          </Button>
        </div>
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
          <Button type="button" variant="secondary" onClick={onToggle}>
            {isExpanded ? 'Sakrij detalje' : 'Prikaži detalje'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="saved-configuration-card__list">
          {configurationCategoryOrder.map(({ key, label }) => {
            const value = configuration[
              `${key}_id` as keyof SavedConfiguration
            ] as string | null | undefined
            const component = value ? allComponents[value] : undefined

            return (
              <div key={key} className="saved-configuration-item">
                <span>{label}</span>

                <div className="saved-configuration-item__details">
                  <strong>{getComponentName(value)}</strong>
                  {component ? (
                    <>
                      <span>{component.price.toFixed(2)} €</span>
                      <span>{component.tdp ?? 0} W</span>
                    </>
                  ) : (
                    <span>Nije odabrano</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}
