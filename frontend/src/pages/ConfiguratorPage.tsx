import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveConfiguration } from '../api'
import { Button } from '../components/Button'
import { ComponentCard } from '../components/ComponentCard'
import { ConfigurationSummary } from '../components/ConfigurationSummary'
import { cases } from '../data/cases'
import { coolings } from '../data/coolings'
import { cpus } from '../data/cpus'
import { gpus } from '../data/gpus'
import { motherboards } from '../data/motherboards'
import { psus } from '../data/psus'
import { rams } from '../data/rams'
import { storages } from '../data/storages'
import type { Component, ComponentCategory, Configuration } from '../types/hardware'
import { calculateEstimatedTdp, calculateTotalPrice } from '../utils/calculations'
import { checkCompatibility } from '../utils/compatibility'

type ConfiguratorPageProps = {
  configuration: Configuration
  setConfiguration: React.Dispatch<React.SetStateAction<Configuration>>
  loggedInUser: string | null
  authToken: string | null
}

const categoryLabels: Record<ComponentCategory, string> = {
  cpu: 'Procesori',
  gpu: 'Grafičke kartice',
  ram: 'RAM memorija',
  storage: 'Pohrana',
  motherboard: 'Matične ploče',
  psu: 'Napajanja',
  case: 'Kućišta',
  cooling: 'Hladnjaci',
}

const catalog: Record<ComponentCategory, Component[]> = {
  cpu: cpus as Component[],
  gpu: gpus as Component[],
  ram: rams as Component[],
  storage: storages as Component[],
  motherboard: motherboards as Component[],
  psu: psus as Component[],
  case: cases as Component[],
  cooling: coolings as Component[],
}

const categories = Object.keys(categoryLabels) as ComponentCategory[]

function getComponentSummary(component: Component): string {
  switch (component.category) {
    case 'cpu':
      return `${component.socket} • ${component.tdp} W`
    case 'gpu':
      return `${component.interface} • ${component.tdp} W`
    case 'ram':
      return `${component.memoryType} • ${component.capacityGB} GB`
    case 'storage':
      return `${component.interface} • ${component.formFactor}`
    case 'motherboard':
      return `${component.socket} • ${component.memoryType}`
    case 'psu':
      return `${component.wattage} W • ${component.efficiencyRating}`
    case 'case':
      return `${component.supportedMotherboardFormFactors.join(', ')} • ${component.maxGpuLengthMm} mm`
    case 'cooling':
      return `${component.socketSupport.join(', ')} • ${component.maxTdpW} W`
    default:
      return 'Nepoznata komponenta'
  }
}

export function ConfiguratorPage({
  configuration,
  setConfiguration,
  loggedInUser,
  authToken,
}: ConfiguratorPageProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = (searchParams.get('category') as ComponentCategory) || 'cpu'

  const [activeCategory, setActiveCategory] = useState<ComponentCategory>(initialCategory)
  const [isSummaryOpen, setIsSummaryOpen] = useState(true)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  const totalPrice = useMemo(
    () => calculateTotalPrice(configuration),
    [configuration],
  )

  const estimatedTdp = useMemo(
    () => calculateEstimatedTdp(configuration),
    [configuration],
  )

  const selectedComponentCount =
    Object.values(configuration).filter(Boolean).length

  const compatibility = useMemo(
    () => checkCompatibility(configuration),
    [configuration],
  )

  const handleSelect = (category: ComponentCategory, component: Component) => {
    setConfiguration((previous) => ({
      ...previous,
      [category]: component,
    }))
  }

  const removeComponent = (category: ComponentCategory) => {
    setConfiguration((previous) => {
      const next = { ...previous }
      delete next[category]
      return next
    })
  }

  const handleCategoryChange = (category: ComponentCategory) => {
    setActiveCategory(category)
    setSearchParams({ category })
  }

  const handleSaveConfiguration = async () => {
    if (!loggedInUser || !authToken) {
      setSaveError('Prijavite se kako biste spremili konfiguraciju.')
      return
    }

    if (selectedComponentCount === 0) {
      setSaveError('Odaberite barem jednu komponentu prije spremanja.')
      return
    }

    const payload: Record<string, string> = {
      name: 'Moja konfiguracija',
    }

    for (const category of categories) {
      const component = configuration[category]

      if (component) {
        payload[`${category}_id`] = component.id
      }
    }

    try {
      setSaveError('')
      setSaveMessage('Spremanje konfiguracije...')
      await saveConfiguration(payload)
      setSaveMessage('Konfiguracija je uspješno spremljena.')
    } catch (error: any) {
      setSaveMessage('')
      setSaveError(error?.response?.data?.message ?? 'Nismo uspjeli spremiti konfiguraciju.')
    }
  }

  return (
    <main className="config-layout">
      <section className="catalog-section" aria-label="Katalog komponenti">
        <header className="catalog-header">
          <div>
            <p className="eyebrow">Odabir komponenata</p>
            <h1>Konfiguracija računala</h1>
          </div>

          <Button variant="ghost" onClick={() => navigate('/')}>
            Nazad na uvod
          </Button>
        </header>

        <div className="category-tabs" role="tablist" aria-label="Kategorije komponenti">
          {categories.map((category) => (
            <Button
              key={category}
              id={`tab-${category}`}
              role="tab"
              variant="tab"
              active={activeCategory === category}
              aria-selected={activeCategory === category}
              aria-controls={`panel-${category}`}
              tabIndex={activeCategory === category ? 0 : -1}
              onClick={() => handleCategoryChange(category)}
            >
              {categoryLabels[category]}
            </Button>
          ))}
        </div>

        <div id={`panel-${activeCategory}`} className="catalog-grid" role="tabpanel">
          {catalog[activeCategory].map((component) => {
            const selected = configuration[activeCategory]?.id === component.id

            return (
              <ComponentCard
                key={component.id}
                component={component}
                selected={selected}
                onSelect={() => handleSelect(activeCategory, component)}
                summary={getComponentSummary(component)}
              />
            )
          })}
        </div>
      </section>

      <ConfigurationSummary
        totalPrice={totalPrice}
        estimatedTdp={estimatedTdp}
        selectedComponentCount={selectedComponentCount}
        compatibility={compatibility}
        configuration={configuration}
        categories={categories}
        categoryLabels={categoryLabels}
        isOpen={isSummaryOpen}
        onToggle={() => setIsSummaryOpen((previous) => !previous)}
        onRemoveComponent={removeComponent}
        onSaveConfiguration={handleSaveConfiguration}
        loggedInUser={loggedInUser}
        saveMessage={saveMessage}
        saveError={saveError}
      />
    </main>
  )
}
