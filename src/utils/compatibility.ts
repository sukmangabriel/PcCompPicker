import type {
  CompatibilityIssue,
  Configuration,
} from '../types/hardware'

const pcieVersionRank = {
  'PCIe 3.0': 3,
  'PCIe 4.0': 4,
  'PCIe 5.0': 5,
} as const

export function checkMotherboardCompatibility(
  configuration: Configuration,
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = []
  const { cpu, gpu, ram, storage, motherboard, psu } = configuration

  if (cpu?.category === 'cpu' && motherboard?.category === 'motherboard') {
    if (cpu.socket !== motherboard.socket) {
      issues.push({
        severity: 'error',
        message: `Procesor koristi socket ${cpu.socket}, a matična ploča socket ${motherboard.socket}.`,
      })
    }
  }

  if (ram?.category === 'ram' && motherboard?.category === 'motherboard') {
    if (ram.memoryType !== motherboard.memoryType) {
      issues.push({
        severity: 'error',
        message: `RAM koristi ${ram.memoryType}, a matična ploča podržava ${motherboard.memoryType}.`,
      })
    }

    if (ram.capacityGB > motherboard.maxMemoryGB) {
      issues.push({
        severity: 'error',
        message: `Kapacitet RAM-a od ${ram.capacityGB} GB premašuje maksimalno podržanih ${motherboard.maxMemoryGB} GB.`,
      })
    }

    if (ram.modules > motherboard.memorySlots) {
      issues.push({
        severity: 'error',
        message: `RAM zahtijeva ${ram.modules} memorijska utora, a matična ploča ima ${motherboard.memorySlots}.`,
      })
    }

    if (ram.speedMHz > motherboard.maxMemorySpeedMHz) {
      issues.push({
        severity: 'error',
        message: `Brzina RAM-a od ${ram.speedMHz} MHz premašuje maksimalno podržanih ${motherboard.maxMemorySpeedMHz} MHz.`,
      })
    }
  }

  if (gpu?.category === 'gpu' && motherboard?.category === 'motherboard') {
    if (
      pcieVersionRank[gpu.interface] >
      pcieVersionRank[motherboard.pcieVersion]
    ) {
      issues.push({
        severity: 'error',
        message: `Grafička kartica zahtijeva ${gpu.interface}, a matična ploča podržava ${motherboard.pcieVersion}.`,
      })
    }
  }

  if (storage?.category === 'storage' && motherboard?.category === 'motherboard') {
    if (!motherboard.supportedStorageInterfaces.includes(storage.interface)) {
      issues.push({
        severity: 'error',
        message: `Matična ploča ne podržava ${storage.interface} sučelje odabranog uređaja za pohranu.`,
      })
    }

    if (storage.formFactor === 'M.2' && motherboard.m2Slots < 1) {
      issues.push({
        severity: 'error',
        message: 'Odabrani M.2 uređaj nema dostupan utor na matičnoj ploči.',
      })
    }

    if (
      storage.formFactor !== 'M.2' &&
      storage.interface === 'SATA' &&
      motherboard.sataPorts < 1
    ) {
      issues.push({
        severity: 'error',
        message: 'Odabrani SATA uređaj nema dostupan SATA priključak na matičnoj ploči.',
      })
    }
  }

  if (motherboard?.category === 'motherboard' && psu?.category === 'psu') {
    if (!psu.cpuPowerConnectors.includes(motherboard.cpuPowerConnector)) {
      issues.push({
        severity: 'error',
        message: `Matična ploča zahtijeva CPU priključak ${motherboard.cpuPowerConnector}, koji nije dostupan na odabranom napajanju.`,
      })
    }
  }

  return issues
}

export function checkCaseCompatibility(
  configuration: Configuration,
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = []
  const { motherboard, psu, gpu, cooling } = configuration
  const pcCase = configuration.case

  if (motherboard?.category === 'motherboard' && pcCase?.category === 'case') {
    if (!pcCase.supportedMotherboardFormFactors.includes(motherboard.formFactor)) {
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
