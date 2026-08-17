import type {
  CompatibilityIssue,
  Configuration,
} from '../types/hardware'

export function checkCoolingCompatibility(
  configuration: Configuration,
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = []
  const { cpu, cooling } = configuration

  if (cpu?.category !== 'cpu' || cooling?.category !== 'cooling') {
    return issues
  }

  if (!cooling.socketSupport.includes(cpu.socket)) {
    issues.push({
      severity: 'error',
      message: `Zračni hladnjak ne podržava socket ${cpu.socket} odabranog procesora.`,
    })
  }

  if (cooling.maxTdpW < cpu.tdp) {
    issues.push({
      severity: 'error',
      message: `Zračni hladnjak podržava najviše ${cooling.maxTdpW} W, a procesor ima TDP od ${cpu.tdp} W.`,
    })
  }

  return issues
}
