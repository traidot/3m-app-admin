'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

const DRAWER_WIDTH = 500

interface Role {
  id: string
  name: string
  description?: string | null
  role_type: string
  is_active: boolean
}

interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  avatar?: string | null
  is_active: boolean
  role?: 'sadmin' | 'admin' | 'user' // Deprecated
  roles?: Role[] // New
  version: number
}

type FormData = {
  email: string
  password: string
  name: string
  phone: string
  avatar: string
  is_active: boolean
  roleIds: string[]
}

type FormErrors = {
  email: string
  password: string
  name: string
  status?: string
  role?: string
}

interface UsersDrawerProps {
  open: boolean
  onClose: () => void
  selectedUser: User | null
  formData: FormData
  formErrors: FormErrors
  errorMessage: string | null
  saving: boolean
  currentUserId?: string | null
  roles: Role[]
  onFormChange: (field: keyof FormData, value: any) => void
  onSave: () => void
}

const UsersDrawer = ({
  open,
  onClose,
  selectedUser,
  formData,
  formErrors,
  errorMessage,
  saving,
  currentUserId,
  roles,
  onFormChange,
  onSave,
}: UsersDrawerProps) => {
  const { t } = useI18n()

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box sx={{ width: DRAWER_WIDTH, p: 3 }}>
        <Typography variant='h6' sx={{ mb: 3 }}>
          {selectedUser ? t('form.edit') : t('form.add')} {t('menu.users')}
        </Typography>

        {errorMessage && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
            <Typography variant='body2'>{errorMessage}</Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label={t('screens.system.users.email')}
              type='email'
              value={formData.email}
              onChange={e => onFormChange('email', e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
              disabled={!!selectedUser}
            />
          </Grid>
          {/* Chỉ hiển thị password khi tạo mới, không hiển thị khi edit */}
          {!selectedUser && (
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label={t('screens.system.users.password')}
                type='password'
                value={formData.password}
                onChange={e => onFormChange('password', e.target.value)}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required
              />
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label={t('screens.system.users.userName')}
              value={formData.name}
              onChange={e => onFormChange('name', e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              label={t('screens.system.users.phone')}
              value={formData.phone}
              onChange={e => onFormChange('phone', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              select
              label={t('screens.system.users.userRole')}
              value={formData.roleIds}
              onChange={e => onFormChange('roleIds', e.target.value)}
              slotProps={{
                select: {
                  multiple: true,
                  renderValue: (selected: any) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((roleId: string) => {
                        const role = roles.find(r => r.id === roleId)
                        return role ? (
                          <Chip key={roleId} label={role.name} size='small' />
                        ) : null
                      })}
                    </Box>
                  )
                }
              }}
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active === true}
                  onChange={e => onFormChange('is_active', e.target.checked)}
                  color='primary'
                  disabled={!!(selectedUser && currentUserId && currentUserId === selectedUser.id)}
                  title={selectedUser && currentUserId === selectedUser.id ? t('screens.system.users.cannotUpdateOwnStatus') : undefined}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{t('form.status')}</Typography>
                </Box>
              }
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button variant='outlined' onClick={onClose} disabled={saving}>
            {t('form.cancel')}
          </Button>
          <Button variant='contained' onClick={onSave} disabled={saving}>
            {saving ? <CircularProgress size={20} /> : t('form.save')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default UsersDrawer

