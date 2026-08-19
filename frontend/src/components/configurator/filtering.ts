import { cases } from '../../data/cases'
import { coolings } from '../../data/coolings'
import { cpus } from '../../data/cpus'
import { gpus } from '../../data/gpus'
import { motherboards } from '../../data/motherboards'
import { psus } from '../../data/psus'
import { rams } from '../../data/rams'
import { storages } from '../../data/storages'
import type { Component, ComponentCategory } from '../../types/hardware'

export type RangeState = {
  min: number
  max: number
}

export type CategoryFilterState = Record<string, any>

export const defaultCategoryFilters: Record<ComponentCategory, CategoryFilterState> = {
  cpu: {
    priceRange: { min: 0, max: 5000 },
    tdpRange: { min: 0, max: 1000 },
    manufacturer: 'all',
    socket: 'all',
    minCores: 0,
    maxCores: 32,
    minThreads: 0,
    maxThreads: 64,
  },
  gpu: {
    priceRange: { min: 0, max: 5000 },
    tdpRange: { min: 0, max: 1000 },
    manufacturer: 'all',
    interface: 'all',
    memoryType: 'all',
    minMemoryGB: 0,
    maxMemoryGB: 32,
  },
  ram: {
    priceRange: { min: 0, max: 5000 },
    tdpRange: { min: 0, max: 1000 },
    memoryType: 'all',
    minCapacityGB: 0,
    maxCapacityGB: 128,
    minSpeedMHz: 0,
    maxSpeedMHz: 8000,
    minModules: 1,
    maxModules: 4,
  },
  storage: {
    priceRange: { min: 0, max: 5000 },
    tdpRange: { min: 0, max: 1000 },
    storageType: 'all',
    formFactor: 'all',
    interface: 'all',
    minCapacityGB: 0,
    maxCapacityGB: 4000,
  },
  motherboard: {
    priceRange: { min: 0, max: 5000 },
    tdpRange: { min: 0, max: 1000 },
    socket: 'all',
    chipset: 'all',
    memoryType: 'all',
    formFactor: 'all',
    pcieVersion: 'all',
    minMemorySlots: 0,
    maxMemorySlots: 8,
    minMaxMemoryGB: 0,
    maxMaxMemoryGB: 192,
    minMaxMemorySpeedMHz: 0,
    maxMaxMemorySpeedMHz: 8000,
    cpuPowerConnector: 'all',
    storageInterface: 'all',
    minM2Slots: 0,
    maxM2Slots: 8,
    minSataPorts: 0,
    maxSataPorts: 8,
  },
  psu: {
    priceRange: { min: 0, max: 5000 },
    tdpRange: { min: 0, max: 1000 },
    formFactor: 'all',
    efficiencyRating: 'all',
    modular: 'all',
    cpuPowerConnector: 'all',
    minWattage: 0,
    maxWattage: 1200,
  },
  case: {
    priceRange: { min: 0, max: 5000 },
    tdpRange: { min: 0, max: 1000 },
    motherboardFormFactor: 'all',
    psuFormFactor: 'all',
    minGpuLength: 0,
    maxGpuLength: 500,
    minCpuCoolerHeight: 0,
    maxCpuCoolerHeight: 220,
  },
  cooling: {
    priceRange: { min: 0, max: 5000 },
    tdpRange: { min: 0, max: 1000 },
    socket: 'all',
    minHeightMm: 0,
    maxHeightMm: 220,
    minMaxTdpW: 0,
    maxMaxTdpW: 350,
  },
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function normalizeRange(next: RangeState, minLimit: number, maxLimit: number): RangeState {
  const nextMin = clampValue(next.min, minLimit, maxLimit)
  const nextMax = clampValue(next.max, minLimit, maxLimit)

  return {
    min: Math.min(nextMin, nextMax),
    max: Math.max(nextMin, nextMax),
  }
}

export function filterComponentsByCategory(
  components: Component[],
  activeCategory: ComponentCategory,
  activeFilters: CategoryFilterState,
  priceRange: RangeState,
  tdpRange: RangeState,
): Component[] {
  return components.filter((component) => {
    const price = component.price ?? 0
    const tdp = component.tdp ?? 0

    if (price < priceRange.min || price > priceRange.max) {
      return false
    }

    if (tdp < tdpRange.min || tdp > tdpRange.max) {
      return false
    }

    switch (activeCategory) {
      case 'cpu': {
        const cpu = component as (typeof cpus)[number]
        if (activeFilters.manufacturer !== 'all' && cpu.manufacturer !== activeFilters.manufacturer) {
          return false
        }
        if (activeFilters.socket !== 'all' && cpu.socket !== activeFilters.socket) {
          return false
        }
        if (cpu.cores < activeFilters.minCores || cpu.cores > activeFilters.maxCores) {
          return false
        }
        if (cpu.threads < activeFilters.minThreads || cpu.threads > activeFilters.maxThreads) {
          return false
        }
        return true
      }
      case 'gpu': {
        const gpu = component as (typeof gpus)[number]
        if (activeFilters.manufacturer !== 'all' && gpu.manufacturer !== activeFilters.manufacturer) {
          return false
        }
        if (activeFilters.interface !== 'all' && gpu.interface !== activeFilters.interface) {
          return false
        }
        if (activeFilters.memoryType !== 'all' && gpu.memoryType !== activeFilters.memoryType) {
          return false
        }
        if (gpu.memoryGB < activeFilters.minMemoryGB || gpu.memoryGB > activeFilters.maxMemoryGB) {
          return false
        }
        return true
      }
      case 'ram': {
        const ram = component as (typeof rams)[number]
        if (activeFilters.memoryType !== 'all' && ram.memoryType !== activeFilters.memoryType) {
          return false
        }
        if (ram.capacityGB < activeFilters.minCapacityGB || ram.capacityGB > activeFilters.maxCapacityGB) {
          return false
        }
        if (ram.speedMHz < activeFilters.minSpeedMHz || ram.speedMHz > activeFilters.maxSpeedMHz) {
          return false
        }
        if (ram.modules < activeFilters.minModules || ram.modules > activeFilters.maxModules) {
          return false
        }
        return true
      }
      case 'storage': {
        const storage = component as (typeof storages)[number]
        if (activeFilters.storageType !== 'all' && storage.storageType !== activeFilters.storageType) {
          return false
        }
        if (activeFilters.formFactor !== 'all' && storage.formFactor !== activeFilters.formFactor) {
          return false
        }
        if (activeFilters.interface !== 'all' && storage.interface !== activeFilters.interface) {
          return false
        }
        if (storage.capacityGB < activeFilters.minCapacityGB || storage.capacityGB > activeFilters.maxCapacityGB) {
          return false
        }
        return true
      }
      case 'motherboard': {
        const motherboard = component as (typeof motherboards)[number]
        if (activeFilters.socket !== 'all' && motherboard.socket !== activeFilters.socket) {
          return false
        }
        if (activeFilters.chipset !== 'all' && motherboard.chipset !== activeFilters.chipset) {
          return false
        }
        if (activeFilters.memoryType !== 'all' && motherboard.memoryType !== activeFilters.memoryType) {
          return false
        }
        if (activeFilters.formFactor !== 'all' && motherboard.formFactor !== activeFilters.formFactor) {
          return false
        }
        if (activeFilters.pcieVersion !== 'all' && motherboard.pcieVersion !== activeFilters.pcieVersion) {
          return false
        }
        if (motherboard.memorySlots < activeFilters.minMemorySlots || motherboard.memorySlots > activeFilters.maxMemorySlots) {
          return false
        }
        if (motherboard.maxMemoryGB < activeFilters.minMaxMemoryGB || motherboard.maxMemoryGB > activeFilters.maxMaxMemoryGB) {
          return false
        }
        if (motherboard.maxMemorySpeedMHz < activeFilters.minMaxMemorySpeedMHz || motherboard.maxMemorySpeedMHz > activeFilters.maxMaxMemorySpeedMHz) {
          return false
        }
        if (activeFilters.cpuPowerConnector !== 'all' && motherboard.cpuPowerConnector !== activeFilters.cpuPowerConnector) {
          return false
        }
        if (
          activeFilters.storageInterface !== 'all' &&
          !motherboard.supportedStorageInterfaces.some(
            (interfaceValue: string) => interfaceValue === activeFilters.storageInterface,
          )
        ) {
          return false
        }
        if (motherboard.m2Slots < activeFilters.minM2Slots || motherboard.m2Slots > activeFilters.maxM2Slots) {
          return false
        }
        if (motherboard.sataPorts < activeFilters.minSataPorts || motherboard.sataPorts > activeFilters.maxSataPorts) {
          return false
        }
        return true
      }
      case 'psu': {
        const psu = component as (typeof psus)[number]
        if (activeFilters.formFactor !== 'all' && psu.formFactor !== activeFilters.formFactor) {
          return false
        }
        if (activeFilters.efficiencyRating !== 'all' && psu.efficiencyRating !== activeFilters.efficiencyRating) {
          return false
        }
        if (
          activeFilters.cpuPowerConnector !== 'all' &&
          !psu.cpuPowerConnectors.some(
            (connector: string) => connector === activeFilters.cpuPowerConnector,
          )
        ) {
          return false
        }
        if (activeFilters.modular !== 'all') {
          const modularEnabled = activeFilters.modular === 'true'
          if (psu.modular !== modularEnabled) {
            return false
          }
        }
        if (psu.wattage < activeFilters.minWattage || psu.wattage > activeFilters.maxWattage) {
          return false
        }
        return true
      }
      case 'case': {
        const caseItem = component as (typeof cases)[number]
        const selectedMotherboardFormFactor = activeFilters.motherboardFormFactor as string
        const selectedPsuFormFactor = activeFilters.psuFormFactor as string

        if (
          activeFilters.motherboardFormFactor !== 'all' &&
          !caseItem.supportedMotherboardFormFactors.some(
            (formFactor) => formFactor === selectedMotherboardFormFactor,
          )
        ) {
          return false
        }
        if (
          activeFilters.psuFormFactor !== 'all' &&
          !caseItem.supportedPsuFormFactors.some((formFactor) => formFactor === selectedPsuFormFactor)
        ) {
          return false
        }
        if (caseItem.maxGpuLengthMm < activeFilters.minGpuLength || caseItem.maxGpuLengthMm > activeFilters.maxGpuLength) {
          return false
        }
        if (caseItem.maxCpuCoolerHeightMm < activeFilters.minCpuCoolerHeight || caseItem.maxCpuCoolerHeightMm > activeFilters.maxCpuCoolerHeight) {
          return false
        }
        return true
      }
      case 'cooling': {
        const cooling = component as (typeof coolings)[number]
        if (activeFilters.socket !== 'all' && !cooling.socketSupport.includes(activeFilters.socket)) {
          return false
        }
        if (cooling.heightMm < activeFilters.minHeightMm || cooling.heightMm > activeFilters.maxHeightMm) {
          return false
        }
        if (cooling.maxTdpW < activeFilters.minMaxTdpW || cooling.maxTdpW > activeFilters.maxMaxTdpW) {
          return false
        }
        return true
      }
      default:
        return true
    }
  })
}
