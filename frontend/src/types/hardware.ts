export type ComponentCategory =
  'cpu' | 'gpu' | 'ram' | 'storage' | 'motherboard' | 'psu' | 'case' | 'cooling'

type BaseComponent = {
  id: string
  name: string
  image: string
  category: ComponentCategory
  manufacturer: string
  price: number
  tdp?: number
  description: string
}

export type CpuComponent = BaseComponent & {
  category: 'cpu'
  tdp: number
  socket: string
  cores: number
  threads: number
  baseClockGHz: number
  boostClockGHz?: number
}

export type GpuComponent = BaseComponent & {
  category: 'gpu'
  tdp: number
  chipset: string
  memoryGB: number
  memoryType: string
  lengthMm: number
  interface: 'PCIe 3.0' | 'PCIe 4.0' | 'PCIe 5.0'
}

export type RamComponent = BaseComponent & {
  category: 'ram'
  memoryType: 'DDR4' | 'DDR5'
  capacityGB: number
  modules: number
  speedMHz: number
}

export type StorageComponent = BaseComponent & {
  category: 'storage'
  storageType: 'SSD' | 'HDD'
  capacityGB: number
  formFactor: '2.5-inch' | '3.5-inch' | 'M.2'
  interface: 'SATA' | 'NVMe'
  readSpeedMBps?: number
  writeSpeedMBps?: number
}

export type MotherboardComponent = BaseComponent & {
  category: 'motherboard'
  socket: string
  chipset: string
  memoryType: 'DDR4' | 'DDR5'
  memorySlots: number
  maxMemoryGB: number
  maxMemorySpeedMHz: number
  formFactor: 'ATX' | 'Micro-ATX' | 'Mini-ITX'
  pcieVersion: 'PCIe 3.0' | 'PCIe 4.0' | 'PCIe 5.0'
  cpuPowerConnector: '4-pin' | '8-pin' | '8+4-pin'
  m2Slots: number
  sataPorts: number
  supportedStorageInterfaces: ('SATA' | 'NVMe')[]
}

export type PsuComponent = BaseComponent & {
  category: 'psu'
  formFactor: 'ATX' | 'SFX' | 'SFX-L' | 'TFX' | 'Flex ATX'
  wattage: number
  efficiencyRating: string
  modular: boolean
  mainPowerConnector: 'ATX 24-pin'
  cpuPowerConnectors: ('4-pin' | '8-pin' | '8+4-pin')[]
}

export type CaseComponent = BaseComponent & {
  category: 'case'
  supportedMotherboardFormFactors: ('ATX' | 'Micro-ATX' | 'Mini-ITX')[]
  supportedPsuFormFactors: ('ATX' | 'SFX' | 'SFX-L' | 'TFX' | 'Flex ATX')[]
  maxGpuLengthMm: number
  maxCpuCoolerHeightMm: number
}

export type CoolingComponent = BaseComponent & {
  category: 'cooling'
  socketSupport: string[]
  heightMm: number
  maxTdpW: number
}

export type Component =
  | CpuComponent
  | GpuComponent
  | RamComponent
  | StorageComponent
  | MotherboardComponent
  | PsuComponent
  | CaseComponent
  | CoolingComponent

export type Configuration = Partial<Record<ComponentCategory, Component>>

export type CompatibilityIssue = {
  severity: 'error' | 'warning'
  message: string
}

export type CompatibilityResult = {
  compatible: boolean
  issues: CompatibilityIssue[]
}
