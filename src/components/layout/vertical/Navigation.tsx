'use client'

// React Imports
import { useEffect, useMemo, useRef } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { styled, useColorScheme, useTheme } from '@mui/material/styles'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { Mode } from '@core/types'
import type { Locale } from '@configs/i18n'
import type { RootState } from '@/redux-store'

// Component Imports
import VerticalNav, { NavHeader, NavCollapseIcons } from '@menu/vertical-menu'
import VerticalMenu from './VerticalMenu'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import defaultMenuData from '@/data/navigation/verticalMenuData'

// Role Hook Import
import { useRole } from '@/contexts/RoleContext'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'

import { useRouter } from 'next/navigation'

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  mode: Mode
}

const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: 'none',
  '&.scrolled': {
    opacity: 1
  }
}))

const Navigation = (props: Props) => {
  // Props
  const { dictionary, mode } = props

  // Hooks
  const router = useRouter()
  const verticalNavOptions = useVerticalNav()
  const { updateSettings, settings } = useSettings()
  const { mode: muiMode, systemMode: muiSystemMode } = useColorScheme()
  const theme = useTheme()
  const { role, setRole } = useRole()

  const customMenuData = useMemo(() => {
    const baseMenu = defaultMenuData(dictionary)
    const menuDict = (dictionary as any).screens?.menu || (dictionary as any).menu || {}

    return baseMenu.map(item => {
      if ((item.label || '') === (menuDict.chat ?? '') && item.children) {
        return {
          ...item,
          children: item.children.map(child =>
            child.activeUrl === '/chat'
              ? {
                ...child,
              }
              : child
          )
        }
      }
      return item
    })
  }, [dictionary])

  // Refs
  const shadowRef = useRef(null)

  // Vars
  const { isCollapsed, isHovered, collapseVerticalNav, isBreakpointReached } = verticalNavOptions
  const isSemiDark = settings.semiDark

  const currentMode = muiMode === 'system' ? muiSystemMode : muiMode || mode

  const isDark = currentMode === 'dark'

  const scrollMenu = (container: any, isPerfectScrollbar: boolean) => {
    container = isBreakpointReached || !isPerfectScrollbar ? container.target : container

    if (shadowRef && container.scrollTop > 0) {
      // @ts-ignore
      if (!shadowRef.current.classList.contains('scrolled')) {
        // @ts-ignore
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      // @ts-ignore
      shadowRef.current.classList.remove('scrolled')
    }
  }

  useEffect(() => {
    if (settings.layout === 'collapsed') {
      collapseVerticalNav(true)
    } else {
      collapseVerticalNav(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  return (
    // eslint-disable-next-line lines-around-comment
    // Sidebar Vertical Menu
    <VerticalNav
      customStyles={navigationCustomStyles(verticalNavOptions, theme)}
      collapsedWidth={71}
      backgroundColor='var(--mui-palette-background-paper)'
      // eslint-disable-next-line lines-around-comment
      // The following condition adds the data-dark attribute to the VerticalNav component
      // when semiDark is enabled and the mode or systemMode is light
      {...(isSemiDark &&
        !isDark && {
        'data-dark': ''
      })}
    >
      {/* Nav Header including Logo & nav toggle icons  */}
      <NavHeader>
        <Link href='/dashboard'>
          <Logo />
        </Link>
        {!(isCollapsed && !isHovered) && (
          <NavCollapseIcons
            lockedIcon={<i className='tabler-chevron-left text-xl' />}
            unlockedIcon={<i className='tabler-chevron-right text-xl' />}
            closeIcon={<i className='tabler-x text-xl' />}
            onClick={() => updateSettings({ layout: !isCollapsed ? 'collapsed' : 'vertical' })}
          />
        )}
      </NavHeader>
      <StyledBoxForShadow ref={shadowRef} />
      
      {!(isCollapsed && !isHovered) && (
        <Box className="px-6 pb-2 pt-4 flex flex-col gap-2">
          <Typography variant='caption' className='text-slate-400 font-bold uppercase'>Chế độ (Demo)</Typography>
          <ToggleButtonGroup
            color="primary"
            value={role}
            exclusive
            onChange={(_, newRole) => {
              if (newRole) {
                setRole(newRole)
                router.push(newRole === 'admin' ? '/3m/dashboard' : '/agent/dashboard')
              }
            }}
            size="small"
            fullWidth
          >
            <ToggleButton value="admin" className='text-xs'>Admin 3M</ToggleButton>
            <ToggleButton value="agent" className='text-xs'>Đại lý</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      <VerticalMenu dictionary={dictionary} scrollMenu={scrollMenu} menuData={customMenuData} />
    </VerticalNav>
  )
}

export default Navigation
