import { useEffect, useState } from 'react'
import { Button } from './Button'
import { cases } from '../data/cases'
import { coolings } from '../data/coolings'
import { cpus } from '../data/cpus'
import { gpus } from '../data/gpus'
import { motherboards } from '../data/motherboards'
import { psus } from '../data/psus'
import { rams } from '../data/rams'
import { storages } from '../data/storages'
import type { Component, ComponentCategory } from '../types/hardware'
import type { SavedConfiguration } from '../api'

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

function getConfigurationSummary(configuration: SavedConfiguration) {
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
  const [draftName, setDraftName] = useState(configuration.name || 'Moja konfiguracija')

  useEffect(() => {
    setDraftName(configuration.name || 'Moja konfiguracija')
  }, [configuration.name])

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
                <Button type="button" variant="primary" onClick={() => void handleRenameSubmit()}>
                  Spremi
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsRenaming(false)}>
                  Odustani
                </Button>
              </div>
            </div>
          ) : (
            <h2>{configuration.name || 'Moja konfiguracija'}</h2>
          )}
        </div>

        <div className="saved-configuration-card__header-actions">
          <Button type="button" variant="secondary" onClick={() => setIsRenaming(true)}>
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
          {categoryOrder.map(({ key, label }) => {
            const value = configuration[`${key}_id` as keyof SavedConfiguration] as string | null | undefined
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
