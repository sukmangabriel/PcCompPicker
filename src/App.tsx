import { useMemo, useState } from 'react'
import './App.css'
import { Button } from './components/Button'
import { CategoryCard } from './components/CategoryCard'
import { ComponentCard } from './components/ComponentCard'
import { ConfigurationSummary } from './components/ConfigurationSummary'
import { cases } from './data/cases'
import { coolings } from './data/coolings'
import { cpus } from './data/cpus'
import { gpus } from './data/gpus'
import { motherboards } from './data/motherboards'
import { psus } from './data/psus'
import { rams } from './data/rams'
import { storages } from './data/storages'
import type {
  Component,
  ComponentCategory,
  Configuration,
} from './types/hardware'
import {
  calculateEstimatedTdp,
  calculateTotalPrice,
} from './utils/calculations'
import { checkCompatibility } from './utils/compatibility'

type ViewMode = 'landing' | 'catalog'

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

const categoryMeta: Record<
  ComponentCategory,
  { icon: string; title: string; description: string }
> = {
  cpu: {
    icon: '🧠',
    title: 'Procesor',
    description: 'Mozak sustava i osnovna snaga računala.',
  },
  gpu: {
    icon: '🎮',
    title: 'Grafika',
    description: 'Učinkovitost za igranje i vizualni rad.',
  },
  ram: {
    icon: '⚡',
    title: 'Memorija',
    description: 'Brzina i kapacitet za sve zadatke.',
  },
  storage: {
    icon: '💾',
    title: 'Pohrana',
    description: 'Brzina i prostor za podatke i igre.',
  },
  motherboard: {
    icon: '🧩',
    title: 'Matična ploča',
    description: 'Osnova na kojoj sve komunicira.',
  },
  psu: {
    icon: '🔋',
    title: 'Napajanje',
    description: 'Stabilnost i dovoljna rezervna snaga.',
  },
  case: {
    icon: '🛡️',
    title: 'Kućište',
    description: 'Fizičko smještanje i ventilacija.',
  },
  cooling: {
    icon: '❄️',
    title: 'Hlađenje',
    description: 'Upravljanje temperaturom i TDP-om.',
  },
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

function App() {
  const [view, setView] = useState<ViewMode>('landing')
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('cpu')
  const [selectedLandingCategory, setSelectedLandingCategory] =
    useState<ComponentCategory | null>(null)
  const [configuration, setConfiguration] = useState<Configuration>({})
  const [isSummaryOpen, setIsSummaryOpen] = useState(true)

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

  const openCatalog = (category: ComponentCategory) => {
    setActiveCategory(category)
    setIsSummaryOpen(true)
    setView('catalog')
  }

  return (
    <div className="app-shell">
      {view === 'landing' ? (
        <main className="landing-page">
          <header className="landing-header">
            <div className="brand-block">
              <span className="brand-mark">PC</span>
              <span>PcCompPicker</span>
            </div>
          </header>

          <section className="hero-section hero-section--centered">
            <div className="hero-copy hero-copy--centered">
              <p className="eyebrow">Projektni konfigurator</p>
              <h1>Izgradi savršeno računalo bez problema s kompatibilnošću.</h1>
              <p className="hero-text">
                Odaberi procesor, grafičku karticu, memoriju, kućište i
                napajanje. Aplikacija će odmah provjeriti jesu li sve komponente
                međusobno usklađene.
              </p>

              <div className="hero-actions hero-actions--centered">
                <Button
                  variant="primary"
                  onClick={() => openCatalog('cpu')}
                  aria-label="Izgradi konfiguraciju"
                >
                  Izgradi konfiguraciju
                </Button>
              </div>
            </div>
          </section>

          <section
            className="category-showcase"
            aria-label="Kartice komponenti"
          >
            <div className="landing-category-list">
              {categories.map((category) => {
                const isSelected = selectedLandingCategory === category

                return (
                  <div key={category} className="landing-category-item">
                    <CategoryCard
                      icon={categoryMeta[category].icon}
                      title={categoryMeta[category].title}
                      description={categoryMeta[category].description}
                      optionCount={catalog[category].length}
                      onClick={() =>
                        setSelectedLandingCategory((previous) =>
                          previous === category ? null : category,
                        )
                      }
                    />

                    {isSelected && (
                      <div className="landing-component-panel">
                        <div className="landing-component-panel__header">
                          <h2>{categoryMeta[category].title}</h2>
                          <span>{catalog[category].length} dostupnih</span>
                        </div>

                        <div className="landing-component-rows">
                          {catalog[category].map((component) => (
                            <div
                              key={component.id}
                              className="landing-component-row"
                            >
                              <div>
                                <strong>{component.name}</strong>
                                <small>{component.manufacturer}</small>
                              </div>
                              <div className="landing-component-meta">
                                <span>{getComponentSummary(component)}</span>
                                <strong>{component.price.toFixed(2)} €</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </main>
      ) : (
        <main className="config-layout">
          <section className="catalog-section" aria-label="Katalog komponenti">
            <header className="catalog-header">
              <div>
                <p className="eyebrow">Odabir komponenata</p>
                <h1>Konfiguracija računala</h1>
              </div>

              <Button variant="ghost" onClick={() => setView('landing')}>
                Nazad na uvod
              </Button>
            </header>

            <div
              className="category-tabs"
              role="tablist"
              aria-label="Kategorije komponenti"
            >
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
                  onClick={() => setActiveCategory(category)}
                >
                  {categoryLabels[category]}
                </Button>
              ))}
            </div>

            <div
              id={`panel-${activeCategory}`}
              className="catalog-grid"
              role="tabpanel"
            >
              {catalog[activeCategory].map((component) => {
                const selected =
                  configuration[activeCategory]?.id === component.id

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
          />
        </main>
      )}
    </div>
  )
}

export default App
