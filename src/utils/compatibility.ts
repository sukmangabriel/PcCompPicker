import type {
  CompatibilityResult,
  Configuration,
} from '../types/hardware'
import { checkCaseCompatibility } from './case-compatibility'
import { checkMotherboardCompatibility } from './mbo-compatibility'
import { checkCoolingCompatibility } from './cooling-compatibility'
import { checkPowerSupplyCompatibility } from './psu-compatibility'


export function checkCompatibility(
  configuration: Configuration,
): CompatibilityResult {
  const issues = [
    ...checkMotherboardCompatibility(configuration),
    ...checkCaseCompatibility(configuration),
    ...checkCoolingCompatibility(configuration),
    ...checkPowerSupplyCompatibility(configuration),
  ]

  return {
    compatible: !issues.some((issue) => issue.severity === 'error'),
    issues,
  }
}
