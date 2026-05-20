'use client'

// React Imports
import type { ReactNode } from 'react'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// MUI Imports
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Box from '@mui/material/Box'

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  label: string
  href?: string
}

/**
 * Breadcrumb Component
 * Common breadcrumb component with home icon
 *
 * @param items - Array of breadcrumb items (e.g., [{ label: 'Trang chủ', href: '/' }, { label: 'System' }, { label: 'Users' }])
 * @param className - Optional additional CSS classes
 */
interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <Box className={classnames('pl-1', className)}>
      <Breadcrumbs aria-label='breadcrumb' separator='›'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          // First item with home icon
          if (isFirst) {
            if (isLast || !item.href) {
              return (
                <Box key={index} className='flex items-center gap-1'>
                  <i className='tabler-home text-base' />
                  <Typography color='text.primary' className='capitalize'>
                    {item.label}
                  </Typography>
                </Box>
              )
            }

            return (
              <Link
                key={index}
                href={item.href}
                className='flex items-center gap-1 text-inherit no-underline hover:underline hover:text-primary'
              >
                {/* <i className='tabler-home text-base' /> */}
                <Typography className='capitalize'>{item.label}</Typography>
              </Link>
            )
          }

          // Last item (no link)
          if (isLast || !item.href) {
            return (
              <Typography key={index} color='text.primary' className='capitalize'>
                {item.label}
              </Typography>
            )
          }

          // Middle items (with link)
          return (
            <Link
              key={index}
              href={item.href}
              className='text-inherit no-underline hover:underline hover:text-primary capitalize'
            >
              {item.label}
            </Link>
          )
        })}
      </Breadcrumbs>
    </Box>
  )
}

export default Breadcrumb

