'use client'

import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import { ROLE_PRESETS, SCREENS, type ScreenKey } from '@/views/agent/users/data'
import {
  DEFAULT_ROLE_PERMISSIONS,
  resetRolePermissions,
  setRolePermissions,
  useRolePermissions,
  type ManagedRole,
  type RolePermissions
} from '@/views/agent/users/permissionsStore'

const MANAGED_ROLES: { key: ManagedRole; icon: string; description: string }[] = [
  {
    key: 'owner',
    icon: 'tabler-crown',
    description: 'Quyền cao nhất. Toàn quyền hệ thống và phân quyền user khác.'
  },
  {
    key: 'manager',
    icon: 'tabler-shield-check',
    description: 'Quản lý vận hành: app, gói cước, KH, đơn hàng. Không can thiệp user.'
  },
  {
    key: 'staff',
    icon: 'tabler-user',
    description: 'Nhân viên trực tiếp xử lý đơn và chăm sóc khách hàng.'
  }
]

const RolePermissionsView = () => {
  const stored = useRolePermissions()
  const [draft, setDraft] = useState<RolePermissions>(stored)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setDraft(stored)
  }, [stored])

  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(stored), [draft, stored])

  const toggle = (role: ManagedRole, screen: ScreenKey) => {
    setDraft(prev => ({
      ...prev,
      [role]: { ...prev[role], [screen]: !prev[role][screen] }
    }))
  }

  const handleSave = () => {
    setRolePermissions(draft)
    setToast('Đã lưu phân quyền. Áp dụng cho toàn bộ user thuộc vai trò này.')
  }

  const handleReset = () => {
    setDraft(DEFAULT_ROLE_PERMISSIONS)
  }

  const handleRevert = () => {
    setDraft(stored)
  }

  const handleResetGlobal = () => {
    resetRolePermissions()
    setToast('Đã khôi phục về cấu hình mặc định.')
  }

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Phân quyền vai trò
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Cấu hình quyền truy cập màn hình cho 3 vai trò chính. Cấu hình ở đây sẽ áp dụng cho tất cả
            user thuộc vai trò tương ứng.
          </Typography>
        </Box>
        <Stack direction='row' spacing={2}>
          <Button
            variant='tonal'
            color='secondary'
            startIcon={<i className='tabler-restore' />}
            onClick={handleResetGlobal}
          >
            Khôi phục mặc định
          </Button>
        </Stack>
      </Box>

      <Alert severity='info' icon={<i className='tabler-info-circle' />} className='mbe-6'>
        Vai trò <strong>Tuỳ chỉnh</strong> không quản lý ở đây — set trực tiếp khi tạo từng user trong
        màn hình Người dùng nội bộ.
      </Alert>

      {/* Role cards */}
      <Grid2 container spacing={4}>
        {MANAGED_ROLES.map(r => {
          const preset = ROLE_PRESETS[r.key]
          const perms = draft[r.key]
          const grantedCount = Object.values(perms).filter(Boolean).length

          return (
            <Grid2 key={r.key} size={{ xs: 12, lg: 4 }}>
              <Card variant='outlined' sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent className='flex-1'>
                  {/* Card header */}
                  <Box className='flex items-start gap-3 mbe-3'>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `rgba(var(--mui-palette-${preset.color}-mainChannel) / 0.10)`,
                        color: `var(--mui-palette-${preset.color}-main)`,
                        flexShrink: 0
                      }}
                    >
                      <i className={`${r.icon} text-[24px]`} />
                    </Box>
                    <Box className='flex-1'>
                      <Box className='flex items-center gap-2'>
                        <Typography variant='h6' className='font-bold'>
                          {preset.label}
                        </Typography>
                        <Chip
                          size='small'
                          variant='tonal'
                          color={preset.color}
                          label={`${grantedCount}/${SCREENS.length}`}
                        />
                      </Box>
                      <Typography variant='caption' color='text.secondary'>
                        {r.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 2 }} />

                  {/* Permissions */}
                  <Stack spacing={1}>
                    {SCREENS.map(s => {
                      const enabled = perms[s.key]
                      const isLocked = r.key === 'owner' && s.key === 'users'
                      return (
                        <Box
                          key={s.key}
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            backgroundColor: enabled ? 'action.hover' : 'transparent',
                            border: '1px solid',
                            borderColor: enabled ? 'transparent' : 'divider'
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 0.75,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: enabled
                                ? `rgba(var(--mui-palette-success-mainChannel) / 0.12)`
                                : 'transparent',
                              color: enabled ? 'success.main' : 'text.disabled',
                              flexShrink: 0
                            }}
                          >
                            <i className={`${s.icon} text-[14px]`} />
                          </Box>
                          <Typography variant='body2' sx={{ fontWeight: 500, flex: 1 }}>
                            {s.label}
                          </Typography>
                          <Switch
                            size='small'
                            checked={enabled}
                            disabled={isLocked}
                            onChange={() => !isLocked && toggle(r.key, s.key)}
                          />
                        </Box>
                      )
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>
          )
        })}
      </Grid2>

      {/* Sticky save bar */}
      {isDirty && (
        <Box
          sx={{
            position: 'sticky',
            bottom: 16,
            mt: 4,
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.main',
            backgroundColor: 'background.paper',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <i className='tabler-alert-circle text-[20px] text-[var(--mui-palette-warning-main)]' />
          <Typography variant='body2' className='flex-1'>
            Có thay đổi chưa lưu. Bấm <strong>Lưu thay đổi</strong> để áp dụng cho user thuộc các vai trò
            này.
          </Typography>
          <Button variant='tonal' color='secondary' onClick={handleRevert}>
            Hoàn tác
          </Button>
          <Button
            variant='contained'
            startIcon={<i className='tabler-device-floppy text-[18px]' />}
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        </Box>
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  )
}

export default RolePermissionsView
