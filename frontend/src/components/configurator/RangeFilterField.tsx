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
  const className = compact ? 'filter-group filter-group--compact' : 'filter-group'

  return (
    <div className={className}>
      <div className="filter-group__header">
        <span>{label}</span>
        <strong>
          {min} - {max}
        </strong>
      </div>
      <div className="filter-group__inputs">
        <label>
          Min
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            value={min}
            onChange={(event) => onMinChange(Number(event.target.value || 0))}
          />
        </label>
        <label>
          Max
          <input
            type="number"
            min={minLimit}
            max={maxLimit}
            value={max}
            onChange={(event) => onMaxChange(Number(event.target.value || 0))}
          />
        </label>
      </div>
      {showSliders && (
        <div className="filter-group__sliders">
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            value={min}
            onChange={(event) => onMinChange(Number(event.target.value))}
          />
          <input
            type="range"
            min={minLimit}
            max={maxLimit}
            value={max}
            onChange={(event) => onMaxChange(Number(event.target.value))}
          />
        </div>
      )}
    </div>
  )
}
