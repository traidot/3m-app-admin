'use client'

// React Imports
import type { ReactNode } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
  variant?: 'h4' | 'h5' | 'h6'
  breadcrumbs?: BreadcrumbItem[]
}

const PageHeader = ({
  title,
  description,
  actions,
  className = '',
  variant = 'h5',
  breadcrumbs,
}: PageHeaderProps) => {
  return (
    <>
      <Card className={className}>
        <Box className='flex flex-col gap-4 p-6'>
          {/* Title and Actions */}
          <Box className='flex justify-between flex-col items-start md:flex-row md:items-center gap-4'>
            <Box className='flex flex-col gap-1'>
              <Typography variant={variant}>{title}</Typography>
              {description && (
                <Typography variant='body2' color='text.secondary'>
                  {description}
                </Typography>
              )}
            </Box>
            {actions && <Box className='flex items-center gap-2'>{actions}</Box>}
          </Box>
        </Box>
      </Card>

      {/* Breadcrumbs dưới header, trên nội dung */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Box className='flex flex-wrap items-center gap-1 text-xs md:text-sm text-textSecondary mt-3 mb-2'>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1

            return (
              <Box key={`${item.label}-${index}`} className='flex items-center gap-1'>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className='hover:text-primary-main transition-colors'
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Typography
                    variant='body2'
                    color={isLast ? 'text.primary' : 'text.secondary'}
                  >
                    {item.label}
                  </Typography>
                )}
                {!isLast && <span className='text-textDisabled'>/</span>}
              </Box>
            )
          })}
        </Box>
      )}
    </>
  )
}

export default PageHeader

