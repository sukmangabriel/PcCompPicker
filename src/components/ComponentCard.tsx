import { Button } from './Button'
import type { Component } from '../types/hardware'

type ComponentCardProps = {
  component: Component
  selected: boolean
  onSelect: () => void
  summary: string
}

export function ComponentCard({ component, selected, onSelect, summary }: ComponentCardProps) {
  return (
    <Button
      key={component.id}
      variant="card"
      className={selected ? 'component-card selected' : 'component-card'}
      aria-pressed={selected}
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
      </div>
    </Button>
  )
}
