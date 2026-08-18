import type { CompatibilityIssue, Configuration } from '../types/hardware'

export function checkCaseCompatibility(
  configuration: Configuration,
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = []
  const { motherboard, psu, gpu, cooling } = configuration
  const pcCase = configuration.case

  if (motherboard?.category === 'motherboard' && pcCase?.category === 'case') {
    if (
      !pcCase.supportedMotherboardFormFactors.includes(motherboard.formFactor)
    ) {
      issues.push({
        severity: 'error',
        message: `Kućište ne podržava ${motherboard.formFactor} format odabrane matične ploče.`,
      })
    }
  }

  if (psu?.category === 'psu' && pcCase?.category === 'case') {
    if (!pcCase.supportedPsuFormFactors.includes(psu.formFactor)) {
      issues.push({
        severity: 'error',
        message: `Kućište ne podržava ${psu.formFactor} format odabranog napajanja.`,
      })
    }
  }

  if (gpu?.category === 'gpu' && pcCase?.category === 'case') {
    if (gpu.lengthMm > pcCase.maxGpuLengthMm) {
      issues.push({
        severity: 'error',
        message: `Grafička kartica duljine ${gpu.lengthMm} mm premašuje maksimalno podržanu duljinu od ${pcCase.maxGpuLengthMm} mm.`,
      })
    }
  }

  if (cooling?.category === 'cooling' && pcCase?.category === 'case') {
    if (cooling.heightMm > pcCase.maxCpuCoolerHeightMm) {
      issues.push({
        severity: 'error',
        message: `Zračni hladnjak visine ${cooling.heightMm} mm premašuje maksimalno podržanu visinu od ${pcCase.maxCpuCoolerHeightMm} mm.`,
      })
    }
  }

  return issues
}
