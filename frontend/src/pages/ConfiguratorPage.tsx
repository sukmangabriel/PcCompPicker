import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { saveConfiguration, updateConfiguration } from '../api'
import { Button } from '../components/Button'
import { ComponentCard } from '../components/ComponentCard'
import { ConfigurationSummary } from '../components/ConfigurationSummary'
import { ConfiguratorFilterPanel } from '../components/configurator/ConfiguratorFilterPanel'
import { cases } from '../data/cases'
import { coolings } from '../data/coolings'
import { cpus } from '../data/cpus'
import { gpus } from '../data/gpus'
import { motherboards } from '../data/motherboards'
import { psus } from '../data/psus'
import { rams } from '../data/rams'
import { storages } from '../data/storages'
import type {
  Component,
  ComponentCategory,
  Configuration,
} from '../types/hardware'
import {
  calculateEstimatedTdp,
  calculateTotalPrice,
} from '../utils/calculations'
import { checkCompatibility } from '../utils/compatibility'
import {
  defaultCategoryFilters,
  filterComponentsByCategory,
  normalizeRange,
  type CategoryFilterState,
  type RangeState,
} from '../components/configurator/filtering'
import { getApiErrorMessage } from '../utils/error-message'

type ConfiguratorPageProps = {
  configuration: Configuration
  setConfiguration: React.Dispatch<React.SetStateAction<Configuration>>
  loggedInUser: string | null
  authToken: string | null
  onOpenAuth: () => void
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
  onOpenAuth,
}: ConfiguratorPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const isValidCategory = (value: string | null): value is ComponentCategory => {
    return Boolean(value && categories.includes(value as ComponentCategory))
  }

  const [activeCategory, setActiveCategory] = useState<ComponentCategory>(() => {
    const categoryFromUrl = searchParams.get('category')
    return isValidCategory(categoryFromUrl) ? categoryFromUrl : 'cpu'
  })
  const [isSummaryOpen, setIsSummaryOpen] = useState(true)
  const [editingConfigurationId, setEditingConfigurationId] = useState<
    number | null
  >(null)
  const [configurationName, setConfigurationName] =
    useState('Moja konfiguracija')
  const [categoryFilters, setCategoryFilters] = useState<
    Record<ComponentCategory, CategoryFilterState>
  >(defaultCategoryFilters)

  const activeFilters =
    categoryFilters[activeCategory] ?? defaultCategoryFilters[activeCategory]
  const priceRange = activeFilters.priceRange as RangeState
  const tdpRange = activeFilters.tdpRange as RangeState

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')

    if (isValidCategory(categoryFromUrl) && categoryFromUrl !== activeCategory) {
      setActiveCategory(categoryFromUrl)
    }
  }, [activeCategory, searchParams])

  useEffect(() => {
    const state = location.state as
      | {
          configuration?: Configuration
          editingConfigurationId?: number
          configName?: string
        }
      | undefined

    if (!state?.configuration) {
      return
    }

    setConfiguration(state.configuration)
    setEditingConfigurationId(state.editingConfigurationId ?? null)
    setConfigurationName(state.configName ?? 'Moja konfiguracija')
  }, [location.state, setConfiguration])

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

  const filteredComponents = useMemo(() => {
    return filterComponentsByCategory(
      catalog[activeCategory],
      activeCategory,
      activeFilters,
      priceRange,
      tdpRange,
    )
  }, [activeCategory, activeFilters, priceRange, tdpRange])

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
    const selectedComponent = configuration[category]

    if (!selectedComponent) {
      return
    }

    toast.custom(
      (t) => (
        <div className="toast-confirmation">
          <p>
            Želite li stvarno ukloniti {selectedComponent.name} iz
            konfiguracije?
          </p>
          <div className="toast-confirmation__actions">
            <Button
              type="button"
              variant="primary"
              className="toast-confirmation__button toast-confirmation__button--primary"
              onClick={() => {
                toast.dismiss(t.id)
                setConfiguration((previous) => {
                  const next = { ...previous }
                  delete next[category]
                  return next
                })
                toast.success('Komponenta je uklonjena iz konfiguracije.')
              }}
            >
              Da, ukloni
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

  const handleCategoryChange = (category: ComponentCategory) => {
    setActiveCategory(category)
    setSearchParams({ category }, { replace: true })
  }

  const updateRangeFilter = (
    rangeKey: 'priceRange' | 'tdpRange',
    bound: keyof RangeState,
    value: number,
    minLimit: number,
    maxLimit: number,
  ) => {
    const nextRange = normalizeRange(
      {
        ...(activeFilters[rangeKey] as RangeState),
        [bound]: value,
      },
      minLimit,
      maxLimit,
    )

    setCategoryFilters((previous) => ({
      ...previous,
      [activeCategory]: {
        ...previous[activeCategory],
        [rangeKey]: nextRange,
      },
    }))
  }

  const updateCategoryFilter = (key: string, value: string | number) => {
    setCategoryFilters((previous) => ({
      ...previous,
      [activeCategory]: {
        ...previous[activeCategory],
        [key]: value,
      },
    }))
  }

  const resetFilters = () => {
    setCategoryFilters((previous) => ({
      ...previous,
      [activeCategory]: { ...defaultCategoryFilters[activeCategory] },
    }))
  }

  const handleSaveConfiguration = async () => {
    if (!loggedInUser || !authToken) {
      toast.error('Prijavite se kako biste spremili konfiguraciju.')
      return
    }

    if (selectedComponentCount === 0) {
      toast.error('Odaberite barem jednu komponentu prije spremanja.')
      return
    }

    const payload: Record<string, string | null> = {
      name: configurationName.trim() || 'Moja konfiguracija',
    }

    for (const category of categories) {
      const component = configuration[category]
      payload[`${category}_id`] = component ? component.id : null
    }

    const loadingToastId = toast.loading(
      editingConfigurationId
        ? 'Ažuriranje konfiguracije...'
        : 'Spremanje konfiguracije...',
    )

    try {
      if (editingConfigurationId) {
        await updateConfiguration(editingConfigurationId, payload)
        toast.success('Konfiguracija je uspješno ažurirana.', {
          id: loadingToastId,
        })
        navigate('/moje-konfiguracije')
        return
      }

      await saveConfiguration(payload)
      toast.success('Konfiguracija je uspješno spremljena.', {
        id: loadingToastId,
      })
    } catch (error: unknown) {
      const message = getApiErrorMessage(
        error,
        'Nismo uspjeli spremiti konfiguraciju.',
      )
      toast.error(message, { id: loadingToastId })
    }
  }

  return (
    <main id="main-content" className="config-layout">
      <aside className="filter-panel-wrapper">
        <ConfiguratorFilterPanel
          activeCategory={activeCategory}
          activeFilters={activeFilters}
          priceRange={priceRange}
          tdpRange={tdpRange}
          updateRangeFilter={updateRangeFilter}
          updateCategoryFilter={updateCategoryFilter}
          resetFilters={resetFilters}
        />
      </aside>

      <section className="catalog-section" aria-label="Katalog komponenti">
        <header className="catalog-header">
          <div>
            <p className="eyebrow">Odabir komponenata</p>
            <h1>Konfiguracija računala</h1>
          </div>

          <Button variant="ghost" onClick={() => navigate('/')}>
            Natrag
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
              onClick={() => handleCategoryChange(category)}
            >
              {categoryLabels[category]}
            </Button>
          ))}
        </div>

        <div className="catalog-content">
          <div className="catalog-grid-wrapper">
            <div
              key={activeCategory}
              id={`panel-${activeCategory}`}
              className="catalog-grid"
              role="tabpanel"
            >
              {filteredComponents.length === 0 ? (
                <p className="empty-state">
                  Nema komponenti koje odgovaraju odabranim filtrima.
                </p>
              ) : (
                filteredComponents.map((component) => {
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
                })
              )}
            </div>
          </div>
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
        onOpenAuth={onOpenAuth}
      />
    </main>
  )
}
