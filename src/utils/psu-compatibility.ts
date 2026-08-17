import type {
  CompatibilityIssue,
  Configuration,
} from '../types/hardware'
import { calculateEstimatedTdp } from './calculations'

export function checkPowerSupplyCompatibility(
  configuration: Configuration,
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = []
  const { psu } = configuration

  if (psu?.category !== 'psu') {
    return issues
  }

  const estimatedTdp = calculateEstimatedTdp(configuration)
  const recommendedWattage = estimatedTdp * 1.25

  if (psu.wattage < estimatedTdp) {
    issues.push({
      severity: 'error',
      message: `Napajanje od ${psu.wattage} W slabije je od procijenjene potrošnje konfiguracije od ${estimatedTdp} W.`,
    })
  } else if (psu.wattage < recommendedWattage) {
    issues.push({
      severity: 'warning',
      message: `Napajanje od ${psu.wattage} W pokriva procijenjenih ${estimatedTdp} W, ali nema preporučenu rezervu od 25 % (${Math.ceil(recommendedWattage)} W).`,
    })
  }

  return issues
}
