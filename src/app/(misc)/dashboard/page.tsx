'use client'

import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import { useRole, type Role } from '@/contexts/RoleContext'

type Feature = { icon: string; label: string }

type RoleCard = {
  role: Role
  badge: string
  title: string
  subtitle: string
  description: string
  icon: string
  accent: 'primary' | 'info'
  features: Feature[]
  cta: string
}

const ROLES: RoleCard[] = [
  {
    role: '3m',
    badge: 'Super Admin',
    title: 'Admin 3M',
    subtitle: 'Quản trị tổng hệ thống',
    description:
      'Trung tâm điều phối toàn bộ đại lý — kiểm soát chi nhánh, khách hàng và đơn hàng ở cấp tập đoàn.',
    icon: 'tabler-shield-check',
    accent: 'primary',
    features: [
      { icon: 'tabler-building-store', label: 'Quản lý đại lý app' },
      { icon: 'tabler-users', label: 'Khách hàng toàn hệ thống theo đại lý' },
      { icon: 'tabler-shopping-cart', label: 'Đơn hàng tổng hợp theo đại lý' },
      { icon: 'tabler-receipt-2', label: 'Bảng giá gói cước (chỉ xem)' }
    ],
    cta: 'Vào Admin 3M'
  },
  {
    role: 'agent',
    badge: 'Đại lý',
    title: 'Agent',
    subtitle: 'App riêng của đại lý',
    description:
      'Vận hành cửa hàng đại lý — tự quản gói cước, giá bán, khách hàng và đơn hàng của chính mình.',
    icon: 'tabler-briefcase',
    accent: 'info',
    features: [
      { icon: 'tabler-app-window', label: 'Quản lý app nói chung' },
      { icon: 'tabler-packages', label: 'Quản lý gói cước (CRUD)' },
      { icon: 'tabler-user-plus', label: 'Quản lý khách hàng' },
      { icon: 'tabler-shopping-bag', label: 'Quản lý đơn hàng' }
    ],
    cta: 'Vào Agent'
  }
]

const RoleSelectionPage = () => {
  const router = useRouter()
  const { setRole } = useRole()

  const handleSelect = (role: Role) => {
    setRole(role)
    router.push(role === '3m' ? '/3m/dashboard' : '/agent/dashboard')
  }

  return (
    <Box
      className='flex items-center justify-center min-bs-[100dvh] p-6'
      sx={{ backgroundColor: 'var(--mui-palette-background-default)' }}
    >
      <Box className='max-is-[1080px] is-full'>
        {/* Header */}
        <Box className='text-center mbe-12'>
          <Typography
            variant='overline'
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: 1.5
            }}
          >
            Hệ thống Quản lý eSIM
          </Typography>
          <Typography variant='h3' className='font-bold mbe-2 mbs-2'>
            Chọn môi trường làm việc
          </Typography>
          <Typography variant='body1' color='text.secondary' className='max-is-[620px] mli-auto'>
            Mỗi role có không gian, dữ liệu và quyền hạn riêng. Vui lòng chọn để tiếp tục.
          </Typography>
        </Box>

        {/* Role Cards */}
        <Grid2 container spacing={4}>
          {ROLES.map(card => (
            <Grid2 key={card.role} size={{ xs: 12, md: 6 }}>
              <Card
                variant='outlined'
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    borderColor: `var(--mui-palette-${card.accent}-main)`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Header row */}
                  <Box className='flex items-center justify-between mbe-6'>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `rgba(var(--mui-palette-${card.accent}-mainChannel) / 0.10)`,
                        color: `var(--mui-palette-${card.accent}-main)`
                      }}
                    >
                      <i className={`${card.icon} text-[28px]`} />
                    </Box>
                    <Chip
                      label={card.badge}
                      size='small'
                      color={card.accent}
                      variant='tonal'
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography variant='h4' className='font-bold mbe-1'>
                    {card.title}
                  </Typography>
                  <Typography
                    variant='subtitle2'
                    sx={{ color: `var(--mui-palette-${card.accent}-main)`, fontWeight: 600 }}
                    className='mbe-3'
                  >
                    {card.subtitle}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' className='mbe-6'>
                    {card.description}
                  </Typography>

                  {/* Divider line */}
                  <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mb: 3 }} />

                  {/* Features */}
                  <Typography
                    variant='caption'
                    sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.8 }}
                    className='mbe-3 block uppercase'
                  >
                    Tính năng chính
                  </Typography>
                  <Stack spacing={1.5} className='mbe-6'>
                    {card.features.map(f => (
                      <Box key={f.label} className='flex items-center gap-3'>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: `rgba(var(--mui-palette-${card.accent}-mainChannel) / 0.08)`,
                            color: `var(--mui-palette-${card.accent}-main)`,
                            flexShrink: 0
                          }}
                        >
                          <i className={`${f.icon} text-[16px]`} />
                        </Box>
                        <Typography variant='body2'>{f.label}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  {/* CTA */}
                  <Button
                    fullWidth
                    variant='contained'
                    color={card.accent}
                    size='large'
                    disableElevation
                    onClick={() => handleSelect(card.role)}
                    endIcon={<i className='tabler-arrow-right text-[18px]' />}
                  >
                    {card.cta}
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        {/* Footer */}
        <Box className='text-center mbs-10'>
          <Typography variant='caption' color='text.disabled'>
            © 2026 eSIM Market Ecosystem · Powered by DeepSync Technology
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default RoleSelectionPage
