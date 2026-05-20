'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, minLength, nonEmpty, forward, check } from 'valibot'
import type { InferInput } from 'valibot'

// Component Imports
import CommonDialog from './CommonDialog'
import CustomTextField from '@core/components/mui/TextField'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

interface ChangePasswordDialogProps {
  open: boolean
  onClose: () => void
  onChangePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

const buildSchema = (translate: (key: string) => string) =>
  object({
    oldPassword: pipe(string(), nonEmpty(translate('changePassword.oldPasswordRequired'))),
    newPassword: pipe(
      string(),
      nonEmpty(translate('changePassword.newPasswordRequired')),
      minLength(6, translate('changePassword.newPasswordMinLength'))
    ),
    confirmPassword: pipe(string(), nonEmpty(translate('changePassword.confirmPasswordRequired')))
  })

type FormData = InferInput<ReturnType<typeof buildSchema>>

export default function ChangePasswordDialog({
  open,
  onClose,
  onChangePassword,
}: ChangePasswordDialogProps) {
  const { t } = useI18n()

  const schema = buildSchema(t)

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: FormData) => {
    // Validate confirm password
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: t('changePassword.passwordsNotMatch'),
      })
      return
    }

    try {
      setLoading(true)
      await onChangePassword(data.oldPassword, data.newPassword)
      handleClose()
    } catch (error: any) {
      // Parse error từ backend response
      // apiPut throw error từ handleApiError, có field, message, category
      const errorMessage = error?.message || error?.response?.data?.message || 'Đã xảy ra lỗi';
      const errorField = error?.field || error?.response?.data?.field;

      // Nếu có field trong error (check exception), set error vào field đó
      // Nếu field là 'oldPassword' hoặc không có field, set vào oldPassword
      if (errorField === 'oldPassword' || !errorField) {
        setError('oldPassword', {
          type: 'manual',
          message: errorMessage,
        });
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <CommonDialog
      open={open}
      onClose={handleClose}
      title={t('changePassword.title')}
      maxWidth='sm'
      fullWidth
      actions={
        <>
          <Button variant='tonal' color='secondary' onClick={handleClose} disabled={loading}>
            {t('form.cancel')}
          </Button>
          <Button variant='contained' type='submit' form='change-password-form' disabled={loading}>
            {loading ? t('changePassword.changing') : t('changePassword.change')}
          </Button>
        </>
      }
    >
      <form id='change-password-form' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='oldPassword'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type={showOldPassword ? 'text' : 'password'}
                  label={t('changePassword.oldPassword')}
                  placeholder={t('changePassword.oldPasswordPlaceholder')}
                  error={!!errors.oldPassword}
                  helperText={errors.oldPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={showOldPassword ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='newPassword'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type={showNewPassword ? 'text' : 'password'}
                  label={t('changePassword.newPassword')}
                  placeholder={t('changePassword.newPasswordPlaceholder')}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message ?? t('changePassword.newPasswordMinLength')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={showNewPassword ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  label={t('changePassword.confirmPassword')}
                  placeholder={t('changePassword.confirmPasswordPlaceholder')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={showConfirmPassword ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
    </CommonDialog>
  )
}

