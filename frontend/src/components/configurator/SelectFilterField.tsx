type SelectOption = {
  value: string
  label: string
}

type SelectFilterFieldProps = {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export function SelectFilterField({ label, value, options, onChange }: SelectFilterFieldProps) {
  return (
    <div className="filter-group filter-group--compact">
      <label className="filter-label">
        {label}
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
