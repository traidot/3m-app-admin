import type { ReactNode } from 'react'
import type { ChipProps } from '@mui/material/Chip'

// Base menu item properties
interface BaseMenuItemProps {
  label: string
  icon?: string
  href?: string
  excludeLang?: boolean
  prefix?: ReactNode | ChipProps
  suffix?: ReactNode | ChipProps
  exactMatch?: boolean
  activeUrl?: string
  roles?: string[]
}

// Vertical Menu Types
export interface VerticalSectionDataType extends BaseMenuItemProps {
  isSection: true
  children?: VerticalMenuDataType[]
}

export interface VerticalSubMenuDataType extends BaseMenuItemProps {
  children: VerticalMenuDataType[]
  isSection?: never
}

export interface VerticalMenuItemDataType extends BaseMenuItemProps {
  children?: never
  isSection?: never
}

export type VerticalMenuDataType =
  | VerticalSectionDataType
  | VerticalSubMenuDataType
  | VerticalMenuItemDataType

// Horizontal Menu Types
export interface HorizontalSubMenuDataType extends BaseMenuItemProps {
  children: HorizontalMenuDataType[]
}

export interface HorizontalMenuItemDataType extends BaseMenuItemProps {
  children?: never
}

export type HorizontalMenuDataType = HorizontalSubMenuDataType | HorizontalMenuItemDataType

