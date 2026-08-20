import type { ComponentCategory } from '../../types/hardware'
import { CategoryFilterFields } from './CategoryFilterFields'
import { RangeFilterField } from './RangeFilterField'

type RangeState = {
  min: number
  max: number
}

type ConfiguratorFilterPanelProps = {
  activeCategory: ComponentCategory
  activeFilters: Record<string, any>
  priceRange: RangeState
  tdpRange: RangeState
  updateRangeFilter: (
    rangeKey: 'priceRange' | 'tdpRange',
    bound: keyof RangeState,
    value: number,
    minLimit: number,
    maxLimit: number,
  ) => void
  updateCategoryFilter: (key: string, value: string | number) => void
  resetFilters: () => void
}

export function ConfiguratorFilterPanel({
  activeCategory,
  activeFilters,
  priceRange,
  tdpRange,
  updateRangeFilter,
  updateCategoryFilter,
  resetFilters,
}: ConfiguratorFilterPanelProps) {
  return (
    <div className="filter-panel" aria-label="Filtri za komponente">
      <div className="filter-panel__header">
        <h2>Filtriraj komponente</h2>
        <button
          type="button"
          className="filter-panel__reset"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>

      <div className="filter-panel__grid">
        <RangeFilterField
          label="Cijena (€)"
          min={priceRange.min}
          max={priceRange.max}
          minLimit={0}
          maxLimit={5000}
          showSliders
          onMinChange={(value) =>
            updateRangeFilter('priceRange', 'min', value, 0, 5000)
          }
          onMaxChange={(value) =>
            updateRangeFilter('priceRange', 'max', value, 0, 5000)
          }
        />

        <RangeFilterField
          label="TDP (W)"
          min={tdpRange.min}
          max={tdpRange.max}
          minLimit={0}
          maxLimit={1000}
          showSliders
          onMinChange={(value) =>
            updateRangeFilter('tdpRange', 'min', value, 0, 1000)
          }
          onMaxChange={(value) =>
            updateRangeFilter('tdpRange', 'max', value, 0, 1000)
          }
        />
      </div>

      <CategoryFilterFields
        activeCategory={activeCategory}
        activeFilters={activeFilters}
        updateCategoryFilter={updateCategoryFilter}
      />
    </div>
  )
}
