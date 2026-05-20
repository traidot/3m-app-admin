'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, optional, minLength, maxLength, regex, nonEmpty, transform } from 'valibot'
import type { InferInput } from 'valibot'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CommonDialog from '@/components/common/CommonDialog'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

interface ProfileData {
  id: string
  email: string
  name?: string
  phone?: string
  role?: string
}

interface EditProfileDialogProps {
  open: boolean
  onClose: () => void
  profile: ProfileData
  onUpdate: (data: {
    name: string
    phone?: string
    role?: string
  }) => Promise<void>
}

const buildSchema = (translate: (key: string) => string) =>
  object({
    name: pipe(string(), nonEmpty(translate('profile.nameRequired')), maxLength(100, translate('profile.nameMaxLength'))),
    phone: optional(string()),
    role: pipe(string(), regex(/^(sadmin|admin|user)$/, translate('profile.roleInvalid')))
  })

type FormData = InferInput<ReturnType<typeof buildSchema>>

export default function EditProfileDialog({
  open,
  onClose,
  profile,
  onUpdate,
}: EditProfileDialogProps) {
  const { t } = useI18n()

  const schema = buildSchema(t)

  const roles = [
    { value: 'sadmin', label: t('profile.roleSadmin') },
    { value: 'admin', label: t('profile.roleAdmin') },
    { value: 'user', label: t('profile.roleUser') },
  ]

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      name: profile.name ?? '',
      phone: profile.phone ?? '',
      role: profile.role ?? '-',
    },
  })

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        phone: profile.phone ?? '',
        role: profile.role ?? '-',
      })
    }
  }, [profile, reset])

  const handleClose = () => {
    reset({
      name: profile.name ?? '',
      phone: profile.phone ?? '',
      role: profile.role ?? '-',
    })
    onClose()
  }

  const onSubmit = async (data: FormData) => {
    // Validate phone nếu có giá trị (chỉ validate khi không phải empty)
    if (data.phone && data.phone.trim() !== '') {
      const trimmedPhone = data.phone.trim()
      // Validate format
      if (!/^[0-9+\-\s()]+$/.test(trimmedPhone)) {
        setError('phone', {
          type: 'manual',
          message: t('profile.phoneInvalid'),
        })
        return
      }
      // Validate length
      if (trimmedPhone.length < 10) {
        setError('phone', {
          type: 'manual',
          message: t('profile.phoneMinLength'),
        })
        return
      }
      if (trimmedPhone.length > 20) {
        setError('phone', {
          type: 'manual',
          message: t('profile.phoneMaxLength'),
        })
        return
      }
    }

    try {
      await onUpdate({
        name: data.name,
        // Nếu phone là empty string, gửi undefined để backend biết cần xóa
        // Nếu phone có giá trị, gửi giá trị đã trim
        phone: data.phone && data.phone.trim() !== '' ? data.phone.trim() : undefined,
        role: data.role || undefined,
      })
    } catch (error) {
      // Error handled by parent
    }
  }

  return (
    <CommonDialog
      open={open}
      onClose={handleClose}
      title={t('profile.editTitle')}
      maxWidth='sm'
      actions={
        <>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            {t('form.cancel')}
          </Button>
          <Button variant='contained' type='submit' form='edit-profile-form'>
            {t('form.save')}
          </Button>
        </>
      }
    >
      <form id='edit-profile-form' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
              <Controller
                name='name'
                control={control}
                render={({ field }: { field: any }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={t('profile.fullName')}
                    placeholder={t('profile.fullNamePlaceholder')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label={t('profile.email')}
                value={profile.email}
                disabled
                helperText={t('profile.emailCannotChange')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='phone'
                control={control}
                render={({ field }: { field: any }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={t('profile.phone')}
                    placeholder={t('profile.phonePlaceholder')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='role'
              control={control}
              render={({ field }: { field: any }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label={t('profile.role')}
                  error={!!errors.role}
                  helperText={errors.role?.message}
                >
                  {roles.map(role => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </CustomTextField>
              )}
            />
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  )
}

