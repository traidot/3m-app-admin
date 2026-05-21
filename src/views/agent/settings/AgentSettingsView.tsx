'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'
import Snackbar from '@mui/material/Snackbar'
import Avatar from '@mui/material/Avatar'

type AppSettings = {
  appName: string
  tagline: string
  primaryColor: string
  defaultLanguage: 'vi' | 'en'
  defaultCurrency: 'VND' | 'USD'
  hotline: string
  supportEmail: string
  zaloLink: string
  facebookLink: string
  websiteLink: string
  termsUrl: string
  privacyUrl: string
  payments: { momo: boolean; vnpay: boolean; card: boolean; bank: boolean; wallet: boolean; cod: boolean }
  showCoupons: boolean
  showReferral: boolean
  enableNotifications: boolean
}

type AdminSettings = {
  workspaceName: string
  ownerName: string
  ownerEmail: string
  timezone: string
  dateFormat: string
  emailOnNewOrder: boolean
  emailOnRefund: boolean
  emailOnLowStock: boolean
  twoFactorRequired: boolean
  sessionTimeoutMin: number
}

const DEFAULT_APP: AppSettings = {
  appName: '3M eSIM',
  tagline: 'eSIM du lịch toàn cầu — kết nối ngay khi đáp.',
  primaryColor: '#4F46E5',
  defaultLanguage: 'vi',
  defaultCurrency: 'VND',
  hotline: '1900 1234',
  supportEmail: 'support@myagent.vn',
  zaloLink: 'https://zalo.me/0901234567',
  facebookLink: 'https://facebook.com/myagent',
  websiteLink: 'https://myagent.vn',
  termsUrl: 'https://myagent.vn/terms',
  privacyUrl: 'https://myagent.vn/privacy',
  payments: { momo: true, vnpay: true, card: true, bank: true, wallet: false, cod: true },
  showCoupons: true,
  showReferral: false,
  enableNotifications: true
}

const DEFAULT_ADMIN: AdminSettings = {
  workspaceName: 'MyAgent eSIM',
  ownerName: 'Nguyễn Trọng Đức',
  ownerEmail: 'duc.nguyen@myagent.vn',
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  emailOnNewOrder: true,
  emailOnRefund: true,
  emailOnLowStock: false,
  twoFactorRequired: false,
  sessionTimeoutMin: 60
}

const PAYMENT_OPTIONS: { key: keyof AppSettings['payments']; label: string; icon: string }[] = [
  { key: 'momo', label: 'MoMo', icon: 'tabler-brand-mantine' },
  { key: 'vnpay', label: 'VNPay', icon: 'tabler-credit-card-pay' },
  { key: 'card', label: 'Thẻ Visa / Mastercard', icon: 'tabler-credit-card' },
  { key: 'bank', label: 'Chuyển khoản ngân hàng', icon: 'tabler-building-bank' },
  { key: 'wallet', label: 'Ví agent (cho B2B)', icon: 'tabler-wallet' },
  { key: 'cod', label: 'COD (SIM vật lý)', icon: 'tabler-cash' }
]

const SectionTitle = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
  <Box className='mbe-3'>
    <Typography variant='subtitle2' sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
      {children}
    </Typography>
    {hint && (
      <Typography variant='caption' color='text.secondary'>
        {hint}
      </Typography>
    )}
  </Box>
)

const AgentSettingsView = () => {
  const [tab, setTab] = useState<'app' | 'admin'>('app')
  const [app, setApp] = useState<AppSettings>(DEFAULT_APP)
  const [admin, setAdmin] = useState<AdminSettings>(DEFAULT_ADMIN)
  const [toast, setToast] = useState<string | null>(null)

  const setApp_ = <K extends keyof AppSettings>(k: K, v: AppSettings[K]) =>
    setApp(prev => ({ ...prev, [k]: v }))
  const setAdmin_ = <K extends keyof AdminSettings>(k: K, v: AdminSettings[K]) =>
    setAdmin(prev => ({ ...prev, [k]: v }))

  const handleSave = () => {
    setToast('Đã lưu cấu hình.')
  }

  const togglePayment = (key: keyof AppSettings['payments']) => {
    setApp(prev => ({ ...prev, payments: { ...prev.payments, [key]: !prev.payments[key] } }))
  }

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Cấu hình hệ thống
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Thiết lập chung cho cả app bán hàng (khách hàng dùng) và admin web (đại lý dùng).
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<i className='tabler-device-floppy' />}
          onClick={handleSave}
        >
          Lưu cấu hình
        </Button>
      </Box>

      {/* Tabs */}
      <Card variant='outlined'>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Tab
            value='app'
            label='App bán hàng'
            icon={<i className='tabler-device-mobile text-[18px]' />}
            iconPosition='start'
            sx={{ minHeight: 56 }}
          />
          <Tab
            value='admin'
            label='Admin web'
            icon={<i className='tabler-shield-cog text-[18px]' />}
            iconPosition='start'
            sx={{ minHeight: 56 }}
          />
        </Tabs>

        <CardContent sx={{ p: 4 }}>
          {tab === 'app' && <AppSettingsPanel app={app} setApp={setApp_} togglePayment={togglePayment} />}
          {tab === 'admin' && <AdminSettingsPanel admin={admin} setAdmin={setAdmin_} />}
        </CardContent>
      </Card>

      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  )
}

/* ====================== APP TAB ====================== */
const AppSettingsPanel = ({
  app,
  setApp,
  togglePayment
}: {
  app: AppSettings
  setApp: <K extends keyof AppSettings>(k: K, v: AppSettings[K]) => void
  togglePayment: (key: keyof AppSettings['payments']) => void
}) => (
  <Stack spacing={4} divider={<Divider />}>
    {/* Branding */}
    <Box>
      <SectionTitle hint='Thông tin app hiển thị cho khách hàng.'>Thương hiệu & nhận diện</SectionTitle>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <TextField
              size='small'
              fullWidth
              label='Tên app'
              value={app.appName}
              onChange={e => setApp('appName', e.target.value)}
            />
            <TextField
              size='small'
              fullWidth
              label='Slogan / Tagline'
              value={app.tagline}
              onChange={e => setApp('tagline', e.target.value)}
              helperText='Hiển thị trên trang chủ app, tối đa 80 ký tự.'
            />
            <TextField
              size='small'
              fullWidth
              label='Màu thương hiệu'
              value={app.primaryColor}
              onChange={e => setApp('primaryColor', e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 0.5,
                      backgroundColor: app.primaryColor,
                      border: '1px solid',
                      borderColor: 'divider',
                      mr: 1
                    }}
                  />
                )
              }}
            />
          </Stack>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5
            }}
          >
            <Avatar
              variant='rounded'
              sx={{
                width: 72,
                height: 72,
                bgcolor: `rgba(var(--mui-palette-primary-mainChannel) / 0.10)`,
                color: 'primary.main'
              }}
            >
              <i className='tabler-photo text-[32px]' />
            </Avatar>
            <Typography variant='caption' color='text.secondary'>
              Logo app (PNG, tối đa 1MB)
            </Typography>
            <Button size='small' variant='tonal' color='secondary' startIcon={<i className='tabler-upload' />}>
              Tải lên
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </Box>

    {/* Localization */}
    <Box>
      <SectionTitle>Ngôn ngữ & tiền tệ</SectionTitle>
      <Grid2 container spacing={3}>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            select
            label='Ngôn ngữ mặc định'
            value={app.defaultLanguage}
            onChange={e => setApp('defaultLanguage', e.target.value as AppSettings['defaultLanguage'])}
          >
            <MenuItem value='vi'>Tiếng Việt</MenuItem>
            <MenuItem value='en'>English</MenuItem>
          </TextField>
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            select
            label='Tiền tệ mặc định'
            value={app.defaultCurrency}
            onChange={e => setApp('defaultCurrency', e.target.value as AppSettings['defaultCurrency'])}
          >
            <MenuItem value='VND'>VND (₫)</MenuItem>
            <MenuItem value='USD'>USD ($)</MenuItem>
          </TextField>
        </Grid2>
      </Grid2>
    </Box>

    {/* Contact */}
    <Box>
      <SectionTitle hint='Hiển thị ở phần liên hệ và footer của app.'>Liên hệ & hỗ trợ</SectionTitle>
      <Grid2 container spacing={3}>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            label='Hotline'
            value={app.hotline}
            onChange={e => setApp('hotline', e.target.value)}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            label='Email hỗ trợ'
            value={app.supportEmail}
            onChange={e => setApp('supportEmail', e.target.value)}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            label='Zalo'
            value={app.zaloLink}
            onChange={e => setApp('zaloLink', e.target.value)}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            label='Facebook'
            value={app.facebookLink}
            onChange={e => setApp('facebookLink', e.target.value)}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            size='small'
            fullWidth
            label='Website'
            value={app.websiteLink}
            onChange={e => setApp('websiteLink', e.target.value)}
          />
        </Grid2>
      </Grid2>
    </Box>

    {/* Payments */}
    <Box>
      <SectionTitle hint='Bật/tắt phương thức thanh toán hiển thị cho khách.'>Phương thức thanh toán</SectionTitle>
      <Stack spacing={1}>
        {PAYMENT_OPTIONS.map(p => {
          const enabled = app.payments[p.key]
          return (
            <Box
              key={p.key}
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
                  backgroundColor: enabled
                    ? `rgba(var(--mui-palette-success-mainChannel) / 0.10)`
                    : 'action.hover',
                  color: enabled ? 'success.main' : 'text.secondary'
                }}
              >
                <i className={`${p.icon} text-[18px]`} />
              </Box>
              <Typography variant='body2' sx={{ fontWeight: 500, flex: 1 }}>
                {p.label}
              </Typography>
              <Switch size='small' checked={enabled} onChange={() => togglePayment(p.key)} />
            </Box>
          )
        })}
      </Stack>
    </Box>

    {/* Features */}
    <Box>
      <SectionTitle hint='Bật/tắt tính năng hiển thị trong app.'>Tính năng</SectionTitle>
      <Stack spacing={1.5}>
        <FeatureRow
          icon='tabler-discount'
          title='Hiển thị coupon'
          description='Cho phép khách hàng nhập mã giảm giá khi đặt đơn.'
          checked={app.showCoupons}
          onChange={v => setApp('showCoupons', v)}
        />
        <FeatureRow
          icon='tabler-users-plus'
          title='Chương trình giới thiệu'
          description='Cho khách hàng giới thiệu bạn bè để nhận thưởng.'
          checked={app.showReferral}
          onChange={v => setApp('showReferral', v)}
        />
        <FeatureRow
          icon='tabler-bell'
          title='Push notification'
          description='Gửi thông báo khuyến mãi, đơn hàng cho khách.'
          checked={app.enableNotifications}
          onChange={v => setApp('enableNotifications', v)}
        />
      </Stack>
    </Box>

    {/* Legal */}
    <Box>
      <SectionTitle>Pháp lý</SectionTitle>
      <Grid2 container spacing={3}>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            label='URL Điều khoản sử dụng'
            value={app.termsUrl}
            onChange={e => setApp('termsUrl', e.target.value)}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            label='URL Chính sách bảo mật'
            value={app.privacyUrl}
            onChange={e => setApp('privacyUrl', e.target.value)}
          />
        </Grid2>
      </Grid2>
    </Box>
  </Stack>
)

/* ====================== ADMIN TAB ====================== */
const AdminSettingsPanel = ({
  admin,
  setAdmin
}: {
  admin: AdminSettings
  setAdmin: <K extends keyof AdminSettings>(k: K, v: AdminSettings[K]) => void
}) => (
  <Stack spacing={4} divider={<Divider />}>
    <Box>
      <SectionTitle hint='Thông tin tổ chức và chủ tài khoản.'>Workspace</SectionTitle>
      <Grid2 container spacing={3}>
        <Grid2 size={12}>
          <TextField
            size='small'
            fullWidth
            label='Tên workspace'
            value={admin.workspaceName}
            onChange={e => setAdmin('workspaceName', e.target.value)}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            label='Tên chủ tài khoản'
            value={admin.ownerName}
            onChange={e => setAdmin('ownerName', e.target.value)}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            label='Email chủ tài khoản'
            value={admin.ownerEmail}
            onChange={e => setAdmin('ownerEmail', e.target.value)}
          />
        </Grid2>
      </Grid2>
    </Box>

    <Box>
      <SectionTitle>Múi giờ & định dạng</SectionTitle>
      <Grid2 container spacing={3}>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            select
            label='Múi giờ'
            value={admin.timezone}
            onChange={e => setAdmin('timezone', e.target.value)}
          >
            <MenuItem value='Asia/Ho_Chi_Minh'>Asia/Ho_Chi_Minh (GMT+7)</MenuItem>
            <MenuItem value='Asia/Bangkok'>Asia/Bangkok (GMT+7)</MenuItem>
            <MenuItem value='Asia/Singapore'>Asia/Singapore (GMT+8)</MenuItem>
            <MenuItem value='Asia/Tokyo'>Asia/Tokyo (GMT+9)</MenuItem>
          </TextField>
        </Grid2>
        <Grid2 size={6}>
          <TextField
            size='small'
            fullWidth
            select
            label='Định dạng ngày'
            value={admin.dateFormat}
            onChange={e => setAdmin('dateFormat', e.target.value)}
          >
            <MenuItem value='DD/MM/YYYY'>DD/MM/YYYY (31/12/2026)</MenuItem>
            <MenuItem value='YYYY-MM-DD'>YYYY-MM-DD (2026-12-31)</MenuItem>
            <MenuItem value='MM/DD/YYYY'>MM/DD/YYYY (12/31/2026)</MenuItem>
          </TextField>
        </Grid2>
      </Grid2>
    </Box>

    <Box>
      <SectionTitle hint='Gửi email thông báo về các sự kiện quan trọng.'>Thông báo email</SectionTitle>
      <Stack spacing={1.5}>
        <FeatureRow
          icon='tabler-shopping-cart'
          title='Đơn hàng mới'
          description='Email cho chủ tài khoản khi có đơn mới phát sinh.'
          checked={admin.emailOnNewOrder}
          onChange={v => setAdmin('emailOnNewOrder', v)}
        />
        <FeatureRow
          icon='tabler-receipt-refund'
          title='Hoàn tiền / huỷ đơn'
          description='Email khi có đơn được hoàn tiền hoặc huỷ.'
          checked={admin.emailOnRefund}
          onChange={v => setAdmin('emailOnRefund', v)}
        />
        <FeatureRow
          icon='tabler-alert-triangle'
          title='Cảnh báo nguồn cung'
          description='Email khi gói cước có rổ nguồn sắp/đã hết hàng.'
          checked={admin.emailOnLowStock}
          onChange={v => setAdmin('emailOnLowStock', v)}
        />
      </Stack>
    </Box>

    <Box>
      <SectionTitle>Bảo mật</SectionTitle>
      <Stack spacing={3}>
        <FormControlLabel
          control={
            <Switch
              checked={admin.twoFactorRequired}
              onChange={e => setAdmin('twoFactorRequired', e.target.checked)}
            />
          }
          label={
            <Box>
              <Box className='flex items-center gap-2'>
                <Typography variant='body2' sx={{ fontWeight: 500 }}>
                  Bắt buộc 2FA cho tất cả user
                </Typography>
                <Chip size='small' variant='tonal' color='warning' label='Khuyến nghị' />
              </Box>
              <Typography variant='caption' color='text.secondary'>
                Toàn bộ user nội bộ phải bật xác thực 2 lớp để đăng nhập.
              </Typography>
            </Box>
          }
        />
        <TextField
          size='small'
          fullWidth
          type='number'
          label='Thời gian timeout phiên (phút)'
          value={admin.sessionTimeoutMin}
          onChange={e => setAdmin('sessionTimeoutMin', Number(e.target.value))}
          helperText='User sẽ bị đăng xuất sau khoảng thời gian không hoạt động.'
          sx={{ maxWidth: 320 }}
        />
      </Stack>
    </Box>
  </Stack>
)

const FeatureRow = ({
  icon,
  title,
  description,
  checked,
  onChange
}: {
  icon: string
  title: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) => (
  <Box
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
        backgroundColor: checked
          ? `rgba(var(--mui-palette-success-mainChannel) / 0.10)`
          : 'action.hover',
        color: checked ? 'success.main' : 'text.secondary',
        flexShrink: 0
      }}
    >
      <i className={`${icon} text-[18px]`} />
    </Box>
    <Box className='flex-1'>
      <Typography variant='body2' sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant='caption' color='text.secondary'>
        {description}
      </Typography>
    </Box>
    <Switch size='small' checked={checked} onChange={e => onChange(e.target.checked)} />
  </Box>
)

export default AgentSettingsView
