import { cases } from '../data/cases'
import { coolings } from '../data/coolings'
import { cpus } from '../data/cpus'
import { gpus } from '../data/gpus'
import { motherboards } from '../data/motherboards'
import { psus } from '../data/psus'
import { rams } from '../data/rams'
import { storages } from '../data/storages'
import type { Component, ComponentCategory } from '../types/hardware'

export const allComponents: Record<string, Component> = {}

for (const list of [
  cpus,
  gpus,
  rams,
  storages,
  motherboards,
  psus,
  cases,
  coolings,
]) {
  for (const item of list) {
    allComponents[item.id] = item
  }
}

export const configurationCategoryOrder: Array<{
  key: ComponentCategory
  label: string
}> = [
  { key: 'cpu', label: 'CPU' },
  { key: 'gpu', label: 'GPU' },
  { key: 'ram', label: 'RAM' },
  { key: 'storage', label: 'Pohrana' },
  { key: 'motherboard', label: 'Matična ploča' },
  { key: 'psu', label: 'Napajanje' },
  { key: 'case', label: 'Kućište' },
  { key: 'cooling', label: 'Hlađenje' },
]
