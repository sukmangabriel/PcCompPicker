import { Button } from './Button'
import type {
  CompatibilityResult,
  ComponentCategory,
  Configuration,
} from '../types/hardware'

type ConfigurationSummaryProps = {
  totalPrice: number
  estimatedTdp: number
  selectedComponentCount: number
  compatibility: CompatibilityResult
  configuration: Configuration
  categories: ComponentCategory[]
  categoryLabels: Record<ComponentCategory, string>
  isOpen: boolean
  onToggle: () => void
  onRemoveComponent: (category: ComponentCategory) => void
  onSaveConfiguration: () => void
  loggedInUser: string | null
  onOpenAuth: () => void
}

export function ConfigurationSummary({
  totalPrice,
  estimatedTdp,
  selectedComponentCount,
  compatibility,
  configuration,
  categories,
  categoryLabels,
  isOpen,
  onToggle,
  onRemoveComponent,
  onSaveConfiguration,
  loggedInUser,
  onOpenAuth,
}: ConfigurationSummaryProps) {
  const statusLabel = compatibility.compatible
    ? 'Kompatibilno'
    : 'Potrebna dorada'

  return (
    <aside className="summary-panel" aria-live="polite">
      <div className="summary-card" id="configuration-summary-panel">
        <div className="summary-header">
          <div>
            <p className="eyebrow">Pregled</p>
            <h2>Konfiguracija</h2>
          </div>

          <Button
            variant="secondary"
            className="summary-toggle-button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls="configuration-summary-panel"
            aria-label={
              isOpen
                ? 'Umanji pregled konfiguracije'
                : 'Uvećaj pregled konfiguracije'
            }
          >
            {isOpen ? 'Umanji' : 'Uvećaj'}
          </Button>
        </div>

        <div className="summary-stats">
          <div className="summary-stat">
            <span>Ukupna cijena</span>
            <strong>{totalPrice.toFixed(2)} €</strong>
          </div>
          <div className="summary-stat">
            <span>Procijenjeni TDP</span>
            <strong>{estimatedTdp} W</strong>
          </div>
          <div className="summary-stat compact-stat">
            <span>Odabrane komponente</span>
            <strong>{selectedComponentCount}</strong>
          </div>
          <div
            className={
              compatibility.compatible
                ? 'status-pill ok'
                : 'status-pill warning'
            }
          >
            {statusLabel}
          </div>
        </div>

        {isOpen && (
          <>
            <div className="selection-list">
              <h3>Izgrađena konfiguracija</h3>
              {categories.map((category) => {
                const component = configuration[category]

                return (
                  <div key={category} className="selection-item">
                    <span>{categoryLabels[category]}</span>
                    <div className="selection-item__content">
                      <strong>
                        {component ? component.name : 'Nije odabrano'}
                      </strong>
                      {component && (
                        <Button
                          variant="primary"
                          className="selection-item__remove"
                          aria-label={`Ukloni ${component.name}`}
                          onClick={() => onRemoveComponent(category)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="summary-actions">
              <Button
                variant="primary"
                onClick={() => {
                  if (!loggedInUser) {
                    onOpenAuth()
                    return
                  }

                  onSaveConfiguration()
                }}
                disabled={selectedComponentCount === 0}
              >
                {loggedInUser ? 'Spremi konfiguraciju' : 'Prijavite se za spremanje'}
              </Button>
            </div>

            <div className="issue-list">
              <h3>Prijavljene poruke</h3>
              {compatibility.issues.length > 0 ? (
                <ul>
                  {compatibility.issues.map((issue, index) => (
                    <li
                      key={`${issue.severity}-${index}`}
                      className={issue.severity}
                    >
                      {issue.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-issues">
                  Nema prijavljenih problema kompatibilnosti.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
