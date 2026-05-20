'use client'

import { useMemo, useState } from 'react'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'

import PageHeader from '@/components/layout/shared/PageHeader'

type CurrencyCode = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'AUD' | 'SGD'
type RateStatus = 'Active' | 'Inactive'

type ExchangeRateRecord = {
  id: number
  currency: CurrencyCode
  pair: string
  rate: number
  status: RateStatus
  updatedBy: string
  updatedAt: string
}

const currencies: CurrencyCode[] = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'SGD']

const currencyColors: Partial<Record<CurrencyCode, 'primary' | 'success' | 'info' | 'warning' | 'secondary'>> = {
  USD: 'primary',
  EUR: 'success',
  JPY: 'info',
  GBP: 'warning'
}

const initialHistory: ExchangeRateRecord[] = [
  {
    id: 1,
    currency: 'USD',
    pair: 'USD/VND',
    rate: 25540,
    status: 'Active',
    updatedBy: 'Admin',
    updatedAt: '2026-05-01 10:30'
  },
  {
    id: 2,
    currency: 'EUR',
    pair: 'EUR/VND',
    rate: 27120,
    status: 'Active',
    updatedBy: 'Admin',
    updatedAt: '2026-05-01 11:00'
  },
  {
    id: 3,
    currency: 'USD',
    pair: 'USD/VND',
    rate: 25420,
    status: 'Inactive',
    updatedBy: 'Admin',
    updatedAt: '2026-04-01 09:15'
  },
  {
    id: 4,
    currency: 'JPY',
    pair: 'JPY/VND',
    rate: 165.5,
    status: 'Active',
    updatedBy: 'System',
    updatedAt: '2026-05-01 00:01'
  }
]

const formatTimestamp = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const parseRateInput = (value: string) => {
  const normalizedValue = value.replace(/,/g, '').trim()
  const rate = Number.parseFloat(normalizedValue)

  return Number.isFinite(rate) && rate > 0 ? rate : null
}

const formatRateInput = (value: string) => {
  const sanitizedValue = value.replace(/,/g, '').replace(/[^\d.]/g, '')
  const [rawIntegerPart = '', rawDecimalPart = ''] = sanitizedValue.split('.')
  const integerPart = rawIntegerPart.replace(/^0+(?=\d)/, '')
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (sanitizedValue.includes('.')) {
    return `${formattedInteger || '0'}.${rawDecimalPart}`
  }

  return formattedInteger
}

const ExchangeRateManagement = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [vcbRate, setVcbRate] = useState<number | null>(null)
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [manualRate, setManualRate] = useState(formatRateInput('25540'))
  const [history, setHistory] = useState<ExchangeRateRecord[]>(initialHistory)

  const activeRates = useMemo(
    () =>
      currencies
        .map(curr => history.find(row => row.currency === curr && row.status === 'Active'))
        .filter((row): row is ExchangeRateRecord => Boolean(row)),
    [history]
  )

  const handleSyncVCB = () => {
    setIsSyncing(true)
    setTimeout(() => {
      const mockRates: Record<CurrencyCode, number> = {
        USD: 25485,
        EUR: 27050,
        JPY: 163.2,
        GBP: 31500,
        AUD: 16750,
        SGD: 19520
      }

      setVcbRate(mockRates[currency] || 25000)
      setIsSyncing(false)
    }, 1500)
  }

  const handleSaveRate = () => {
    const nextRate = parseRateInput(manualRate)

    if (!nextRate) return

    setHistory(currentHistory => {
      const nextId = Math.max(...currentHistory.map(row => row.id)) + 1
      const pair = `${currency}/VND`
      const inactiveHistory = currentHistory.map(row =>
        row.currency === currency && row.status === 'Active' ? { ...row, status: 'Inactive' as const } : row
      )

      return [
        {
          id: nextId,
          currency,
          pair,
          rate: nextRate,
          status: 'Active',
          updatedBy: 'Admin',
          updatedAt: formatTimestamp(new Date())
        },
        ...inactiveHistory
      ]
    })

    setManualRate(formatRateInput(nextRate.toString()))
    setVcbRate(null)
  }

  return (
    <>
      <PageHeader
        title='Quản lý Tỉ giá (Exchange Rates)'
        description='Thiết lập tỉ giá các loại ngoại tệ sang VND cho toàn hệ thống. Hỗ trợ đồng bộ từ Vietcombank.'
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Tài chính' }, { label: 'Tỉ giá' }]}
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Left Column: All Active Rates & Set Form */}
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Stack spacing={6}>
            {/* All Active Rates Summary Card */}
            <Card className='border-none shadow-sm'>
              <CardHeader
                title='Tỉ giá đang áp dụng'
                subheader='Toàn bộ tỉ giá active cho các loại ngoại tệ'
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <i className='tabler-trending-up' />
                  </Avatar>
                }
              />
              <Divider />
              <CardContent className='p-0'>
                <Box className='flex flex-col'>
                  {activeRates.map((item, index) => (
                    <Box
                      key={item.currency}
                      className={`flex items-center justify-between p-4 ${index !== activeRates.length - 1 ? 'border-b' : ''} hover:bg-slate-50 transition-colors`}
                    >
                      <Box className='flex items-center gap-3'>
                        <Avatar
                          variant='rounded'
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '12px',
                            fontWeight: '900',
                            bgcolor: `${currencyColors[item.currency] ?? 'secondary'}.main`,
                            color: 'white'
                          }}
                        >
                          {item.currency[0]}
                        </Avatar>
                        <Typography variant='body1' className='font-black'>
                          {item.pair}
                        </Typography>
                      </Box>
                      <Box className='text-right'>
                        <Typography variant='h6' className='font-black text-primary'>
                          {item.rate.toLocaleString()} đ
                        </Typography>
                        <Typography variant='caption' className='text-slate-400 font-bold'>
                          Cập nhật: {item.updatedAt}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Manual Set Form */}
            <Card className='border-none shadow-sm'>
              <CardHeader
                title='Thiết lập tỉ giá mới'
                subheader='Chọn loại tệ và nhập tỉ giá áp dụng'
                action={
                  <Button
                    variant='tonal'
                    color='success'
                    size='small'
                    onClick={handleSyncVCB}
                    disabled={isSyncing}
                    startIcon={
                      isSyncing ? <CircularProgress size={16} color='inherit' /> : <i className='tabler-refresh' />
                    }
                  >
                    {isSyncing ? 'Đang lấy...' : `Đồng bộ ${currency} từ VCB`}
                  </Button>
                }
              />
              <Divider />
              <CardContent className='space-y-4'>
                <Grid2 container spacing={4}>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>
                      Loại ngoại tệ
                    </Typography>
                    <Select
                      fullWidth
                      size='small'
                      value={currency}
                      onChange={e => {
                        setCurrency(e.target.value as CurrencyCode)
                        setVcbRate(null)
                      }}
                    >
                      {currencies.map(curr => (
                        <MenuItem key={curr} value={curr}>
                          {curr}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 8 }}>
                    <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>
                      Tỉ giá quy đổi (VND)
                    </Typography>
                    <TextField
                      fullWidth
                      variant='outlined'
                      size='small'
                      value={manualRate}
                      onChange={e => setManualRate(formatRateInput(e.target.value))}
                      inputProps={{ inputMode: 'decimal' }}
                      InputProps={{
                        endAdornment: <InputAdornment position='end'>VND</InputAdornment>,
                        className: 'font-black'
                      }}
                    />
                  </Grid2>
                </Grid2>

                {vcbRate && (
                  <Box className='p-3 bg-success/5 rounded border border-success/20 flex items-center justify-between anim-fade-in'>
                    <Typography variant='caption' className='text-success font-bold'>
                      Tỉ giá {currency} tham chiếu VCB: <b>{vcbRate.toLocaleString()} VND</b>
                    </Typography>
                    <Button
                      size='small'
                      variant='contained'
                      color='success'
                      className='text-[10px] h-6'
                      onClick={() => setManualRate(formatRateInput(vcbRate.toString()))}
                    >
                      Áp dụng
                    </Button>
                  </Box>
                )}

                <Box className='p-4 bg-slate-50 rounded-lg'>
                  <Typography variant='caption' color='textSecondary' className='italic'>
                    * Ghi chú: Tỉ giá mới sẽ trở thành tỉ giá đang sử dụng cho {currency}/VND.
                  </Typography>
                </Box>

                <Button
                  variant='contained'
                  fullWidth
                  size='large'
                  startIcon={<i className='tabler-device-floppy' />}
                  onClick={handleSaveRate}
                >
                  Lưu & Áp dụng tỉ giá {currency}
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid2>

        {/* Right Column: History Table */}
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardHeader title='Lịch sử thay đổi tỉ giá' subheader='Nhật ký thiết lập tỉ giá cho các loại ngoại tệ' />
            <TableContainer>
              <Table>
                <TableHead className='bg-slate-50'>
                  <TableRow>
                    <TableCell className='font-black uppercase text-[11px]'>Cặp tiền</TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>Tỉ giá</TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>Cập nhật</TableCell>
                    <TableCell className='font-black uppercase text-[11px] text-center'>Trạng thái</TableCell>
                    <TableCell className='font-black uppercase text-[11px] text-right'>Người set</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map(row => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Chip label={row.pair} size='small' className='font-black bg-slate-100' />
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' className='font-black text-primary'>
                          {row.rate.toLocaleString()} VND
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='caption' className='font-bold text-slate-500 block text-[10px]'>
                          {row.updatedAt}
                        </Typography>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Chip
                          label={row.status === 'Active' ? 'Đang dùng' : 'Ngưng dùng'}
                          size='small'
                          color={row.status === 'Active' ? 'primary' : 'default'}
                          variant={row.status === 'Active' ? 'filled' : 'outlined'}
                          className='font-black text-[10px]'
                        />
                      </TableCell>
                      <TableCell className='text-right'>
                        <Typography variant='body2' className='font-bold'>
                          {row.updatedBy}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default ExchangeRateManagement
