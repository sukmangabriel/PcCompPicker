type RangeFilterFieldProps = {
  label: string
  min: number
  max: number
  minLimit: number
  maxLimit: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  compact?: boolean
  showSliders?: boolean
}

export function RangeFilterField({
  label,
  min,
  max,
  minLimit,
  maxLimit,
  onMinChange,
  onMaxChange,
  compact = false,
  showSliders = false,
}: RangeFilterFieldProps) {
  const className = compact
    ? 'filter-group filter-group--compact'
    : 'filter-group'
  const baseId = `filter-range-${label.toLowerCase().replace(/\s+/g, '-')}`
  const minId = `${baseId}-min`
  const maxId = `${baseId}-max`
  const minSliderId = `${baseId}-min-slider`
  const maxSliderId = `${baseId}-max-slider`

  return (
    <div className={className}>
      <div className="filter-group__header">
        <span id={baseId}>{label}</span>
        <strong>
          {min} - {max}
        </strong>
      </div>
      <div className="filter-group__inputs">
        <label htmlFor={minId}>
          Min
          <input
            id={minId}
            type="number"
            min={minLimit}
            max={maxLimit}
            value={min}
            aria-describedby={baseId}
            onChange={(event) => onMinChange(Number(event.target.value || 0))}
          />
        </label>
        <label htmlFor={maxId}>
          Max
          <input
            id={maxId}
            type="number"
            min={minLimit}
            max={maxLimit}
            value={max}
            aria-describedby={baseId}
            onChange={(event) => onMaxChange(Number(event.target.value || 0))}
          />
        </label>
      </div>
      {showSliders && (
        <div className="filter-group__sliders">
          <label className="sr-only" htmlFor={minSliderId}>
            {label} - minimalna vrijednost
          </label>
          <input
            id={minSliderId}
            type="range"
            min={minLimit}
            max={maxLimit}
            value={min}
            aria-describedby={baseId}
            onChange={(event) => onMinChange(Number(event.target.value))}
          />
          <label className="sr-only" htmlFor={maxSliderId}>
            {label} - maksimalna vrijednost
          </label>
          <input
            id={maxSliderId}
            type="range"
            min={minLimit}
            max={maxLimit}
            value={max}
            aria-describedby={baseId}
            onChange={(event) => onMaxChange(Number(event.target.value))}
          />
        </div>
      )}
    </div>
  )
}
