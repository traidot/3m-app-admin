'use client'

// React Imports
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { VerticalNavContextProps } from '@menu/contexts/verticalNavContext'

// Next Imports
import Image from 'next/image'
// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

type LogoTextProps = {
  isHovered?: VerticalNavContextProps['isHovered']
  isCollapsed?: VerticalNavContextProps['isCollapsed']
  transitionDuration?: VerticalNavContextProps['transitionDuration']
  isBreakpointReached?: VerticalNavContextProps['isBreakpointReached']
  color?: CSSProperties['color']
}

const LogoText = styled.span<LogoTextProps>`
  color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
  font-size: 1.375rem;
  line-height: 1.09091;
  font-weight: 700;
  letter-spacing: 0.25px;
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed, isBreakpointReached }) =>
    !isBreakpointReached && isCollapsed && !isHovered
      ? 'opacity: 0; margin-inline-start: 0;'
      : 'opacity: 1; margin-inline-start: 12px;'}
`

const SimpleLogo = ({
  color,
  customLogo,
  customName
}: {
  color?: CSSProperties['color']
  customLogo?: React.ReactNode
  customName?: string
}) => {
  const defaultLogo = customLogo || (
    <Image
      src='/images/logos/logo.png'
      alt='Logo'
      width={32}
      height={32}
      className='object-contain'
      priority
    />
  )
  const companyName = customName || themeConfig.templateName

  return (
    <div className='flex items-center'>
      {defaultLogo}
      <span className='ms-3 text-xl font-bold' style={{ color }}>
        {companyName}
      </span>
    </div>
  )
}

const FullLogo = ({
  color,
  customLogo,
  customName
}: {
  color?: CSSProperties['color']
  customLogo?: React.ReactNode
  customName?: string
}) => {
  // Refs
  const logoTextRef = useRef<HTMLSpanElement>(null)

  // Hooks
  const verticalNav = useVerticalNav()
  const settingsContext = useSettings()
  const settings = settingsContext?.settings
  const layout = settings?.layout || 'vertical'

  // Vars
  const { isHovered, transitionDuration, isBreakpointReached } = verticalNav

  useEffect(() => {
    if (layout !== 'collapsed') {
      return
    }

    if (logoTextRef && logoTextRef.current) {
      if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
        logoTextRef.current?.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout, isBreakpointReached])

  // Determine logo and name
  const defaultLogo = customLogo || (
    <div className='flex items-center justify-center bg-primary rounded p-1'>
      <i className='tabler-shopping-cart text-white text-2xl' />
    </div>
  )
  const companyName = customName || themeConfig.templateName

  return (
    <div className='flex items-center'>
      {defaultLogo}
      <LogoText
        color={color}
        ref={logoTextRef}
        isHovered={isHovered}
        isCollapsed={layout === 'collapsed'}
        transitionDuration={transitionDuration}
        isBreakpointReached={isBreakpointReached}
      >
        {companyName}
      </LogoText>
    </div>
  )
}

const Logo = ({
  color,
  simple = false,
  customLogo,
  customName
}: {
  color?: CSSProperties['color']
  simple?: boolean
  customLogo?: React.ReactNode
  customName?: string
}) => {
  if (simple) {
    return <SimpleLogo color={color} customLogo={customLogo} customName={customName} />
  }

  return <FullLogo color={color} customLogo={customLogo} customName={customName} />
}

export default Logo
