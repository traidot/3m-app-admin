'use client'

import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import Stack from '@mui/material/Stack'
import Grid2 from '@mui/material/Grid2'
import Alert from '@mui/material/Alert'

import AppDrawer from '@/components/common/AppDrawer'
import {
  ROLE_PRESETS,
  SCREENS,
  type InternalUser,
  type RolePreset,
  type ScreenKey
} from './data'
import { useRolePermissions, type ManagedRole } from './permissionsStore'

export type DrawerMode = 'view' | 'edit' | 'create'

type Props = {
  open: boolean
  mode: DrawerMode
  user: InternalUser | null
  onClose: () => void
  onSave: (next: InternalUser) => void
  onSwitchMode: (mode: DrawerMode) => void
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

const emptyUser = (): InternalUser => ({
  id: `USR-${Math.floor(Math.random() * 9000 + 1000)}`,
  name: '',
  email: '',
  phone: '',
  rolePreset: 'staff',
  permissions: ROLE_PRESETS.staff.permissions,
  status: 'active',
  lastLoginAt: null,
  joinedAt: new Date().toISOString().slice(0, 10)
})

const UserDrawer = ({ open, mode, user, onClose, onSave, onSwitchMode }: Props) => {
  const rolePerms = useRolePermissions()
  const [form, setForm] = useState<InternalUser>(user ?? emptyUser())

  useEffect(() => {
    const base = user ?? emptyUser()
    // Sync permissions from store for non-custom presets so view always shows current rule.
    const effective =
      base.rolePreset === 'custom' ? base.permissions : { ...rolePerms[base.rolePreset as ManagedRole] }
    setForm({ ...base, permissions: effective })
  }, [user, open, rolePerms])

  const isEdit = mode === 'edit' || mode === 'create'
  const isCreate = mode === 'create'

  const setField = <K extends keyof InternalUser>(key: K, value: InternalUser[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const togglePermission = (screen: ScreenKey) => {
    setForm(prev => ({
      ...prev,
      rolePreset: 'custom',
      permissions: { ...prev.permissions, [screen]: !prev.permissions[screen] }
    }))
  }

  const applyPreset = (preset: RolePreset) => {
    setForm(prev => ({
      ...prev,
      rolePreset: preset,
      permissions:
        preset === 'custom' ? prev.permissions : { ...rolePerms[preset as ManagedRole] }
    }))
  }

  const grantedCount = Object.values(form.permissions).filter(Boolean).length
  const presetMeta = ROLE_PRESETS[form.rolePreset]

  const headerTitle = isCreate
    ? 'Thêm người dùng mới'
    : isEdit
      ? 'Chỉnh sửa người dùng'
      : 'Chi tiết người dùng'

  const subject = !isCreate ? (
    <Box className='flex items-center gap-3'>
      <Avatar
        sx={{
          width: 56,
          height: 56,
          bgcolor: `rgba(var(--mui-palette-primary-mainChannel) / 0.12)`,
          color: 'primary.main',
          fontWeight: 700,
          fontSize: 18
        }}
      >
        {initials(form.name || 'NA')}
      </Avatar>
      <Box className='flex-1 min-is-0'>
        <Typography variant='h5' className='font-bold' noWrap>
          {form.name || 'Chưa đặt tên'}
        </Typography>
        <Box className='flex items-center gap-2 mbs-1 flex-wrap'>
          <Chip size='small' variant='tonal' color={presetMeta.color} label={presetMeta.label} />
          <Chip
            size='small'
            variant='tonal'
            color={form.status === 'active' ? 'success' : 'secondary'}
            label={form.status === 'active' ? 'Hoạt động' : 'Vô hiệu hoá'}
          />
        </Box>
      </Box>
    </Box>
  ) : undefined

  const footer = isEdit ? (
    <>
      <Button
        variant='tonal'
        color='secondary'
        onClick={() => (isCreate ? onClose() : onSwitchMode('view'))}
      >
        Huỷ
      </Button>
      <Button
        variant='contained'
        startIcon={<i className='tabler-device-floppy text-[18px]' />}
        onClick={() => {
          onSave(form)
          if (!isCreate) onSwitchMode('view')
        }}
      >
        {isCreate ? 'Tạo người dùng' : 'Lưu thay đổi'}
      </Button>
    </>
  ) : (
    <>
      <Button variant='tonal' color='secondary' onClick={onClose}>
        Đóng
      </Button>
      <Button
        variant='contained'
        startIcon={<i className='tabler-pencil text-[18px]' />}
        onClick={() => onSwitchMode('edit')}
      >
        Chỉnh sửa
      </Button>
    </>
  )

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={600}
      title={headerTitle}
      subtitle={!isCreate ? form.id : undefined}
      subject={subject}
      footer={footer}
    >
      <Stack spacing={3}>
          {/* Info section */}
          <Box>
            <Typography variant='subtitle2' className='uppercase mbe-2' sx={{ letterSpacing: 0.8 }}>
              Thông tin tài khoản
            </Typography>
            <Grid2 container spacing={3}>
              <Grid2 size={12}>
                <TextField
                  size='small'
                  fullWidth
                  label='Họ và tên'
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  disabled={!isEdit}
                />
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  size='small'
                  fullWidth
                  label='Email'
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  disabled={!isCreate}
                  helperText={!isCreate ? 'Email không thể thay đổi sau khi tạo' : undefined}
                />
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  size='small'
                  fullWidth
                  label='Số điện thoại'
                  value={form.phone}
                  onChange={e => setField('phone', e.target.value)}
                  disabled={!isEdit}
                />
              </Grid2>
              <Grid2 size={12}>
                <TextField
                  size='small'
                  fullWidth
                  select
                  label='Trạng thái'
                  value={form.status}
                  onChange={e => setField('status', e.target.value as InternalUser['status'])}
                  disabled={!isEdit}
                >
                  <MenuItem value='active'>Hoạt động</MenuItem>
                  <MenuItem value='inactive'>Vô hiệu hoá</MenuItem>
                </TextField>
              </Grid2>
            </Grid2>
          </Box>

          <Divider />

          {/* Role preset */}
          <Box>
            <Box className='flex items-center justify-between mbe-2'>
              <Typography variant='subtitle2' className='uppercase' sx={{ letterSpacing: 0.8 }}>
                Vai trò
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {grantedCount} / {SCREENS.length} màn hình được cấp quyền
              </Typography>
            </Box>
            <Grid2 container spacing={1.5}>
              {(Object.keys(ROLE_PRESETS) as RolePreset[]).map(preset => {
                const meta = ROLE_PRESETS[preset]
                const selected = form.rolePreset === preset
                return (
                  <Grid2 key={preset} size={{ xs: 6, md: 3 }}>
                    <Box
                      onClick={() => isEdit && applyPreset(preset)}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: selected ? `${meta.color}.main` : 'divider',
                        backgroundColor: selected ? 'action.selected' : 'transparent',
                        cursor: isEdit ? 'pointer' : 'default',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Typography variant='body2' sx={{ fontWeight: 600 }} color={selected ? `${meta.color}.main` : 'text.primary'}>
                        {meta.label}
                      </Typography>
                    </Box>
                  </Grid2>
                )
              })}
            </Grid2>
            {form.rolePreset === 'custom' && (
              <Alert severity='info' icon={<i className='tabler-info-circle' />} className='mbs-3'>
                Bạn đang dùng vai trò tuỳ chỉnh. Quyền truy cập từng màn hình được set thủ công bên dưới.
              </Alert>
            )}
          </Box>

          <Divider />

          {/* Permission matrix */}
          <Box>
            <Typography variant='subtitle2' className='uppercase mbe-3' sx={{ letterSpacing: 0.8 }}>
              Quyền theo màn hình
            </Typography>
            <Stack spacing={1}>
              {SCREENS.map(s => (
                <Box
                  key={s.key}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: form.permissions[s.key]
                        ? `rgba(var(--mui-palette-success-mainChannel) / 0.10)`
                        : 'action.hover',
                      color: form.permissions[s.key] ? 'success.main' : 'text.secondary',
                      flexShrink: 0
                    }}
                  >
                    <i className={`${s.icon} text-[18px]`} />
                  </Box>
                  <Box className='flex-1'>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      {s.label}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {s.description}
                    </Typography>
                  </Box>
                  <Switch
                    size='small'
                    checked={form.permissions[s.key]}
                    onChange={() => isEdit && togglePermission(s.key)}
                    disabled={!isEdit}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
    </AppDrawer>
  )
}

export default UserDrawer
