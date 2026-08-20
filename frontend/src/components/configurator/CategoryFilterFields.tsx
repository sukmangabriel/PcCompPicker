import { cases } from '../../data/cases'
import { coolings } from '../../data/coolings'
import { cpus } from '../../data/cpus'
import { gpus } from '../../data/gpus'
import { motherboards } from '../../data/motherboards'
import { psus } from '../../data/psus'
import { rams } from '../../data/rams'
import { storages } from '../../data/storages'
import type { ComponentCategory } from '../../types/hardware'
import { RangeFilterField } from './RangeFilterField'
import { SelectFilterField } from './SelectFilterField'

type CategoryFilterFieldsProps = {
  activeCategory: ComponentCategory
  activeFilters: Record<string, any>
  updateCategoryFilter: (key: string, value: string | number) => void
}

function toOptions(values: string[], allLabel = 'Svi') {
  return [
    { value: 'all', label: allLabel },
    ...[...new Set(values)].map((value) => ({ value, label: value })),
  ]
}

export function CategoryFilterFields({
  activeCategory,
  activeFilters,
  updateCategoryFilter,
}: CategoryFilterFieldsProps) {
  if (activeCategory === 'cpu') {
    return (
      <>
        <SelectFilterField
          label="Proizvođač"
          value={activeFilters.manufacturer}
          options={toOptions(cpus.map((item) => item.manufacturer))}
          onChange={(value) => updateCategoryFilter('manufacturer', value)}
        />

        <SelectFilterField
          label="Socket"
          value={activeFilters.socket}
          options={toOptions(cpus.map((item) => item.socket))}
          onChange={(value) => updateCategoryFilter('socket', value)}
        />

        <RangeFilterField
          label="Jezgra"
          min={activeFilters.minCores}
          max={activeFilters.maxCores}
          minLimit={0}
          maxLimit={32}
          compact
          onMinChange={(value) => updateCategoryFilter('minCores', value)}
          onMaxChange={(value) => updateCategoryFilter('maxCores', value)}
        />

        <RangeFilterField
          label="Dretve"
          min={activeFilters.minThreads}
          max={activeFilters.maxThreads}
          minLimit={0}
          maxLimit={64}
          compact
          onMinChange={(value) => updateCategoryFilter('minThreads', value)}
          onMaxChange={(value) => updateCategoryFilter('maxThreads', value)}
        />
      </>
    )
  }

  if (activeCategory === 'gpu') {
    return (
      <>
        <SelectFilterField
          label="Proizvođač"
          value={activeFilters.manufacturer}
          options={toOptions(gpus.map((item) => item.manufacturer))}
          onChange={(value) => updateCategoryFilter('manufacturer', value)}
        />

        <SelectFilterField
          label="Interface"
          value={activeFilters.interface}
          options={toOptions(gpus.map((item) => item.interface))}
          onChange={(value) => updateCategoryFilter('interface', value)}
        />

        <SelectFilterField
          label="VRAM tip"
          value={activeFilters.memoryType}
          options={toOptions(gpus.map((item) => item.memoryType))}
          onChange={(value) => updateCategoryFilter('memoryType', value)}
        />

        <RangeFilterField
          label="Memorija (GB)"
          min={activeFilters.minMemoryGB}
          max={activeFilters.maxMemoryGB}
          minLimit={0}
          maxLimit={32}
          compact
          onMinChange={(value) => updateCategoryFilter('minMemoryGB', value)}
          onMaxChange={(value) => updateCategoryFilter('maxMemoryGB', value)}
        />
      </>
    )
  }

  if (activeCategory === 'ram') {
    return (
      <>
        <SelectFilterField
          label="Tip memorije"
          value={activeFilters.memoryType}
          options={toOptions(rams.map((item) => item.memoryType))}
          onChange={(value) => updateCategoryFilter('memoryType', value)}
        />

        <RangeFilterField
          label="Kapacitet (GB)"
          min={activeFilters.minCapacityGB}
          max={activeFilters.maxCapacityGB}
          minLimit={0}
          maxLimit={128}
          compact
          onMinChange={(value) => updateCategoryFilter('minCapacityGB', value)}
          onMaxChange={(value) => updateCategoryFilter('maxCapacityGB', value)}
        />

        <RangeFilterField
          label="Brzina (MHz)"
          min={activeFilters.minSpeedMHz}
          max={activeFilters.maxSpeedMHz}
          minLimit={0}
          maxLimit={8000}
          compact
          onMinChange={(value) => updateCategoryFilter('minSpeedMHz', value)}
          onMaxChange={(value) => updateCategoryFilter('maxSpeedMHz', value)}
        />

        <RangeFilterField
          label="Moduli"
          min={activeFilters.minModules}
          max={activeFilters.maxModules}
          minLimit={1}
          maxLimit={4}
          compact
          onMinChange={(value) => updateCategoryFilter('minModules', value)}
          onMaxChange={(value) => updateCategoryFilter('maxModules', value)}
        />
      </>
    )
  }

  if (activeCategory === 'storage') {
    return (
      <>
        <SelectFilterField
          label="Vrsta pohrane"
          value={activeFilters.storageType}
          options={toOptions(
            storages.map((item) => item.storageType),
            'Sve',
          )}
          onChange={(value) => updateCategoryFilter('storageType', value)}
        />

        <SelectFilterField
          label="Form factor"
          value={activeFilters.formFactor}
          options={toOptions(storages.map((item) => item.formFactor))}
          onChange={(value) => updateCategoryFilter('formFactor', value)}
        />

        <SelectFilterField
          label="Interface"
          value={activeFilters.interface}
          options={toOptions(storages.map((item) => item.interface))}
          onChange={(value) => updateCategoryFilter('interface', value)}
        />

        <RangeFilterField
          label="Kapacitet (GB)"
          min={activeFilters.minCapacityGB}
          max={activeFilters.maxCapacityGB}
          minLimit={0}
          maxLimit={4000}
          compact
          onMinChange={(value) => updateCategoryFilter('minCapacityGB', value)}
          onMaxChange={(value) => updateCategoryFilter('maxCapacityGB', value)}
        />
      </>
    )
  }

  if (activeCategory === 'motherboard') {
    return (
      <>
        <SelectFilterField
          label="Socket"
          value={activeFilters.socket}
          options={toOptions(motherboards.map((item) => item.socket))}
          onChange={(value) => updateCategoryFilter('socket', value)}
        />

        <SelectFilterField
          label="Chipset"
          value={activeFilters.chipset}
          options={toOptions(motherboards.map((item) => item.chipset))}
          onChange={(value) => updateCategoryFilter('chipset', value)}
        />

        <SelectFilterField
          label="Tip memorije"
          value={activeFilters.memoryType}
          options={toOptions(motherboards.map((item) => item.memoryType))}
          onChange={(value) => updateCategoryFilter('memoryType', value)}
        />

        <SelectFilterField
          label="Form factor"
          value={activeFilters.formFactor}
          options={toOptions(motherboards.map((item) => item.formFactor))}
          onChange={(value) => updateCategoryFilter('formFactor', value)}
        />

        <SelectFilterField
          label="PCIe"
          value={activeFilters.pcieVersion}
          options={toOptions(motherboards.map((item) => item.pcieVersion))}
          onChange={(value) => updateCategoryFilter('pcieVersion', value)}
        />

        <RangeFilterField
          label="Memorijski slotovi"
          min={activeFilters.minMemorySlots}
          max={activeFilters.maxMemorySlots}
          minLimit={0}
          maxLimit={8}
          compact
          onMinChange={(value) => updateCategoryFilter('minMemorySlots', value)}
          onMaxChange={(value) => updateCategoryFilter('maxMemorySlots', value)}
        />

        <RangeFilterField
          label="Maks. memorija (GB)"
          min={activeFilters.minMaxMemoryGB}
          max={activeFilters.maxMaxMemoryGB}
          minLimit={0}
          maxLimit={192}
          compact
          onMinChange={(value) => updateCategoryFilter('minMaxMemoryGB', value)}
          onMaxChange={(value) => updateCategoryFilter('maxMaxMemoryGB', value)}
        />

        <RangeFilterField
          label="Maks. brzina (MHz)"
          min={activeFilters.minMaxMemorySpeedMHz}
          max={activeFilters.maxMaxMemorySpeedMHz}
          minLimit={0}
          maxLimit={8000}
          compact
          onMinChange={(value) =>
            updateCategoryFilter('minMaxMemorySpeedMHz', value)
          }
          onMaxChange={(value) =>
            updateCategoryFilter('maxMaxMemorySpeedMHz', value)
          }
        />

        <SelectFilterField
          label="CPU power connector"
          value={activeFilters.cpuPowerConnector}
          options={toOptions(
            motherboards.map((item) => item.cpuPowerConnector),
          )}
          onChange={(value) => updateCategoryFilter('cpuPowerConnector', value)}
        />

        <SelectFilterField
          label="Podržani storage interface"
          value={activeFilters.storageInterface}
          options={toOptions(
            motherboards.flatMap((item) => item.supportedStorageInterfaces),
          )}
          onChange={(value) => updateCategoryFilter('storageInterface', value)}
        />

        <RangeFilterField
          label="M.2 slotovi"
          min={activeFilters.minM2Slots}
          max={activeFilters.maxM2Slots}
          minLimit={0}
          maxLimit={8}
          compact
          onMinChange={(value) => updateCategoryFilter('minM2Slots', value)}
          onMaxChange={(value) => updateCategoryFilter('maxM2Slots', value)}
        />

        <RangeFilterField
          label="SATA portovi"
          min={activeFilters.minSataPorts}
          max={activeFilters.maxSataPorts}
          minLimit={0}
          maxLimit={8}
          compact
          onMinChange={(value) => updateCategoryFilter('minSataPorts', value)}
          onMaxChange={(value) => updateCategoryFilter('maxSataPorts', value)}
        />
      </>
    )
  }

  if (activeCategory === 'psu') {
    return (
      <>
        <SelectFilterField
          label="Form factor"
          value={activeFilters.formFactor}
          options={toOptions(psus.map((item) => item.formFactor))}
          onChange={(value) => updateCategoryFilter('formFactor', value)}
        />

        <SelectFilterField
          label="Efikasnost"
          value={activeFilters.efficiencyRating}
          options={toOptions(
            psus.map((item) => item.efficiencyRating),
            'Sve',
          )}
          onChange={(value) => updateCategoryFilter('efficiencyRating', value)}
        />

        <SelectFilterField
          label="CPU power connector"
          value={activeFilters.cpuPowerConnector}
          options={toOptions(psus.flatMap((item) => item.cpuPowerConnectors))}
          onChange={(value) => updateCategoryFilter('cpuPowerConnector', value)}
        />

        <SelectFilterField
          label="Modularnost"
          value={activeFilters.modular}
          options={[
            { value: 'all', label: 'Sve' },
            { value: 'true', label: 'Modularno' },
            { value: 'false', label: 'Nije modularno' },
          ]}
          onChange={(value) => updateCategoryFilter('modular', value)}
        />

        <RangeFilterField
          label="Snaga (W)"
          min={activeFilters.minWattage}
          max={activeFilters.maxWattage}
          minLimit={0}
          maxLimit={1200}
          compact
          onMinChange={(value) => updateCategoryFilter('minWattage', value)}
          onMaxChange={(value) => updateCategoryFilter('maxWattage', value)}
        />
      </>
    )
  }

  if (activeCategory === 'case') {
    return (
      <>
        <SelectFilterField
          label="Form factor matične ploče"
          value={activeFilters.motherboardFormFactor}
          options={toOptions(
            cases.flatMap((item) => item.supportedMotherboardFormFactors),
          )}
          onChange={(value) =>
            updateCategoryFilter('motherboardFormFactor', value)
          }
        />

        <SelectFilterField
          label="Form factor napajanja"
          value={activeFilters.psuFormFactor}
          options={toOptions(
            cases.flatMap((item) => item.supportedPsuFormFactors),
          )}
          onChange={(value) => updateCategoryFilter('psuFormFactor', value)}
        />

        <RangeFilterField
          label="GPU duljina (mm)"
          min={activeFilters.minGpuLength}
          max={activeFilters.maxGpuLength}
          minLimit={0}
          maxLimit={500}
          compact
          onMinChange={(value) => updateCategoryFilter('minGpuLength', value)}
          onMaxChange={(value) => updateCategoryFilter('maxGpuLength', value)}
        />

        <RangeFilterField
          label="Max CPU cooler height (mm)"
          min={activeFilters.minCpuCoolerHeight}
          max={activeFilters.maxCpuCoolerHeight}
          minLimit={0}
          maxLimit={220}
          compact
          onMinChange={(value) =>
            updateCategoryFilter('minCpuCoolerHeight', value)
          }
          onMaxChange={(value) =>
            updateCategoryFilter('maxCpuCoolerHeight', value)
          }
        />
      </>
    )
  }

  if (activeCategory === 'cooling') {
    return (
      <>
        <SelectFilterField
          label="Socket podrška"
          value={activeFilters.socket}
          options={toOptions(coolings.flatMap((item) => item.socketSupport))}
          onChange={(value) => updateCategoryFilter('socket', value)}
        />

        <RangeFilterField
          label="Visina (mm)"
          min={activeFilters.minHeightMm}
          max={activeFilters.maxHeightMm}
          minLimit={0}
          maxLimit={220}
          compact
          onMinChange={(value) => updateCategoryFilter('minHeightMm', value)}
          onMaxChange={(value) => updateCategoryFilter('maxHeightMm', value)}
        />

        <RangeFilterField
          label="Max TDP (W)"
          min={activeFilters.minMaxTdpW}
          max={activeFilters.maxMaxTdpW}
          minLimit={0}
          maxLimit={350}
          compact
          onMinChange={(value) => updateCategoryFilter('minMaxTdpW', value)}
          onMaxChange={(value) => updateCategoryFilter('maxMaxTdpW', value)}
        />
      </>
    )
  }

  return null
}
