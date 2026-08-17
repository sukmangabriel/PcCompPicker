import { Button } from './Button'

type CategoryCardProps = {
  icon: string
  title: string
  description: string
  optionCount: number
  onClick: () => void
}

export function CategoryCard({
  icon,
  title,
  description,
  optionCount,
  onClick,
}: CategoryCardProps) {
  return (
    <Button variant="card" className="category-card" onClick={onClick}>
      <span className="category-card__icon">{icon}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <small>{optionCount} opcija</small>
    </Button>
  )
}
