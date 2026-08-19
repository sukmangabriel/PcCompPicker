import type { Configuration } from '../types/hardware'

export function calculateTotalPrice(configuration: Configuration): number {
  return Object.values(configuration).reduce(
    (total, component) => total + (component?.price ?? 0),
    0,
  )
}

export function calculateEstimatedTdp(configuration: Configuration): number {
  return Object.values(configuration).reduce(
    (total, component) => total + (component?.tdp ?? 0),
    0,
  )
}
