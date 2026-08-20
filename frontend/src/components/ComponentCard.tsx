import { Button } from './Button'
import type { Component } from '../types/hardware'

type ComponentCardProps = {
  component: Component
  selected: boolean
  onSelect: () => void
  summary: string
}

function getComponentHighlights(component: Component): string[] {
  switch (component.category) {
    case 'cpu':
      return [
        `${component.cores}/${component.threads} T/C`,
        `${component.baseClockGHz.toFixed(2)} GHz`,
      ]
    case 'gpu':
      return [
        `${component.memoryGB} GB ${component.memoryType}`,
        `${component.lengthMm} mm`,
      ]
    case 'ram':
      return [`${component.modules} modules`, `${component.speedMHz} MHz`]
    case 'storage':
      return [`${component.capacityGB} GB`, component.formFactor]
    case 'motherboard':
      return [
        component.pcieVersion,
        `${component.memorySlots} memory slots`,
        `${component.m2Slots}x M.2`,
        `${component.sataPorts}x SATA`,
        component.supportedStorageInterfaces.join(', '),
      ]
    case 'psu':
      return [
        component.cpuPowerConnectors.join(' / '),
        component.formFactor,
        component.modular ? 'Modular' : 'Non-modular',
      ]
    case 'case':
      return [
        `${component.maxCpuCoolerHeightMm} mm CPU cooler`,
        component.supportedPsuFormFactors.join(', '),
      ]
    case 'cooling':
      return [`${component.heightMm} mm`]
    default:
      return []
  }
}

export function ComponentCard({
  component,
  selected,
  onSelect,
  summary,
}: ComponentCardProps) {
  const highlights = getComponentHighlights(component)

  return (
    <Button
      key={component.id}
      variant="card"
      className={selected ? 'component-card selected' : 'component-card'}
      aria-pressed={selected}
      aria-label={`Odaberi ${component.name}`}
      onClick={onSelect}
    >
      <img src={component.image} alt={component.name} />

      <div className="component-body">
        <div className="card-topline">
          <strong>{component.name}</strong>
          <span>{component.price.toFixed(2)} €</span>
        </div>

        <p>{component.manufacturer}</p>
        <small>{summary}</small>

        <div
          className="component-tags"
          aria-label={`${component.name} atributi`}
        >
          {highlights.slice(0, 4).map((highlight) => (
            <span
              key={`${component.id}-${highlight}`}
              className="component-tag"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </Button>
  )
}
