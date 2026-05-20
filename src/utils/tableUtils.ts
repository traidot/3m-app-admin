import type { FilterFn } from '@tanstack/react-table'

export const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  const itemValue = row.getValue(columnId)
  return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
}
