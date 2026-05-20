'use client'

import { useState } from 'react'
import Link from 'next/link'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'

import PageHeader from '@/components/layout/shared/PageHeader'

const AgentPriceList = ({ id }: { id: string }) => {
  const [currency, setCurrency] = useState('USD')
  
  if (!id) return null

  const agentName = id.toUpperCase() === 'A001' ? 'TravelConnect Solutions' : 'Global eSIM Hub'
  const agentTier = id.toUpperCase() === 'A001' ? 'PLATINUM' : 'GOLD'

  // Mock exchange rates
  const rates: Record<string, number> = {
    USD: 25450,
    JPY: 165
  }

  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [dataLimit, setDataLimit] = useState('all')
  const [duration, setDuration] = useState('all')
  const [esimType, setEsimType] = useState('all')
  const [packageType, setPackageType] = useState('all')

  const packages = [
    { sku: 'JP-10GB-7D', country: 'Nhật Bản', name: '10GB 7 Ngày', basePrice: 5.00, agentPrice: 6.50, appliedRule: 'Ghi đè Gói (Package Level)', esimType: 'eSIM', packageType: 'Total', data: '10' },
    { sku: 'JP-UNL-15D', country: 'Nhật Bản', name: 'Không Giới Hạn 15 Ngày', basePrice: 12.00, agentPrice: 14.40, appliedRule: 'Quốc gia (+20%)', esimType: 'eSIM', packageType: 'Daily', data: 'unlimited' },
    { sku: 'US-5GB-10D', country: 'Hoa Kỳ', name: '5GB 10 Ngày', basePrice: 8.00, agentPrice: 11.90, appliedRule: `Tier ${agentTier}`, esimType: 'eSIM', packageType: 'Total', data: '5' },
    { sku: 'TH-50GB-10D', country: 'Thái Lan', name: '50GB 10 Ngày', basePrice: 3.50, agentPrice: 5.10, appliedRule: 'Quốc gia (+15%)', esimType: 'Physical', packageType: 'Total', data: '50' },
    { sku: 'EU-10GB-30D', country: 'Châu Âu (33 nước)', name: '10GB 30 Ngày', basePrice: 15.00, agentPrice: 20.40, appliedRule: `Tier ${agentTier}`, esimType: 'eSIM', packageType: 'Total', data: '10' },
    
    // real physical SIM packages added with same formula
    { sku: 'HK-DAILY1', country: 'Hồng Kông', name: 'HK Daily Essential', basePrice: 0.39, agentPrice: 0.45, appliedRule: `Tier ${agentTier} (-15%)`, esimType: 'Physical', packageType: 'Daily', data: '1' },
    { sku: 'HK-DAILY3', country: 'Hồng Kông', name: 'HK Daily HighCap', basePrice: 1.18, agentPrice: 1.42, appliedRule: 'Quốc gia (+20%)', esimType: 'Physical', packageType: 'Daily', data: '3' },
    { sku: 'HK-PRO10', country: 'Hồng Kông', name: 'HK Pro Traveler 30D', basePrice: 2.75, agentPrice: 3.54, appliedRule: 'Ghi đè Gói (Package Level)', esimType: 'Physical', packageType: 'Total', data: '10' },
    { sku: 'US-TRAVEL5', country: 'Mỹ', name: 'US Travel Lite 5D', basePrice: 3.73, agentPrice: 4.29, appliedRule: `Tier ${agentTier} (-15%)`, esimType: 'Physical', packageType: 'Total', data: '5' },
    { sku: 'US-UNLIMITED7', country: 'Mỹ', name: 'US Unlimited Premium', basePrice: 7.47, agentPrice: 8.59, appliedRule: `Tier ${agentTier} (-15%)`, esimType: 'Physical', packageType: 'Total', data: 'unlimited' }
  ]

  const filteredPackages = packages.filter(p => {
    if (search && !p.sku.toLowerCase().includes(search.toLowerCase()) && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (region !== 'all') {
      const matchNames = region === 'mỹ' ? ['mỹ', 'hoa kỳ'] : [region]
      const matchesCountry = matchNames.some(name => p.country.toLowerCase().includes(name))
      if (!matchesCountry) return false
    }
    if (dataLimit !== 'all' && p.data !== dataLimit) return false
    if (duration !== 'all' && !p.name.includes(duration)) return false
    if (esimType !== 'all' && p.esimType !== esimType) return false
    if (packageType !== 'all' && p.packageType !== packageType) return false
    return true
  })

  const getRuleColor = (rule: string) => {
    if (rule.includes('Gói')) return 'error'
    if (rule.includes('Quốc gia')) return 'warning'
    return 'primary'
  }

  const formatPrice = (amount: number, cur: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatVND = (amount: number, cur: string) => {
    const vndAmount = amount * rates[cur]
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(vndAmount)
  }

  return (
    <>
      <PageHeader
        title={`Bảng giá Đại lý: ${agentName}`}
        description={`Danh sách giá bán cuối cùng được áp dụng cho đại lý này sau khi tính toán mọi quy tắc chiết khấu.`}
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' }, 
          { label: 'Đại lý', href: '/3m/downstream/agents' }, 
          { label: agentName, href: `/3m/downstream/agents/${id}` },
          { label: 'Bảng giá' }
        ]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button variant='tonal' color='secondary' component={Link} href={`/3m/downstream/agents/${id}`}>Quay lại</Button>
            <Button variant='contained' color='success' startIcon={<i className='tabler-file-spreadsheet' />}>Xuất Excel</Button>
          </Stack>
        }
        className='mbe-6'
      />

      <Box className='mbe-6 p-6 bg-primary/5 border border-dashed border-primary/20 rounded-xl'>
        <Box className='flex items-start gap-4 mbe-4'>
          <i className='tabler-info-circle text-primary text-2xl mt-1' />
          <Box className='flex-1'>
            <Box className='flex justify-between items-start'>
              <Box>
                <Typography variant='h6' className='font-black text-primary mbe-1'>Nguyên tắc áp dụng giá cho {agentName}</Typography>
                <Typography variant='body2' className='text-slate-600 font-medium mbe-2'>
                  Hệ thống tự động tính toán giá bán dựa trên thứ tự ưu tiên: <strong>Gói cước &gt; Quốc gia &gt; Cấp bậc (Tier)</strong>.
                </Typography>
              </Box>
              <Chip 
                label={`Đơn vị tiền tệ: ${currency}`} 
                color='primary' 
                variant='filled' 
                className='font-black shadow-sm'
                icon={<i className='tabler-currency' />}
              />
            </Box>
          </Box>
        </Box>
        
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box className='p-4 bg-white rounded-lg border border-primary/10 h-full'>
              <Typography variant='subtitle2' className='font-black text-primary uppercase text-[11px] mbe-2'>1. Giá theo Cấp bậc (Mặc định)</Typography>
              <Typography variant='body2' className='text-slate-600'>
                Áp dụng Markup <strong>{agentTier === 'PLATINUM' ? '+15%' : '+10%'}</strong> trên giá gốc cho toàn bộ sản phẩm không có quy tắc ghi đè.
              </Typography>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box className='p-4 bg-white rounded-lg border border-warning/20 h-full border-l-4 border-l-warning'>
              <Typography variant='subtitle2' className='font-black text-warning uppercase text-[11px] mbe-2'>2. Ghi đè theo Quốc gia</Typography>
              <Typography variant='body2' className='text-slate-600'>
                Nhật Bản: <strong>+20%</strong><br />
                Thái Lan: <strong>+15%</strong><br />
                Các nước khác: Theo tỷ lệ Tier mặc định.
              </Typography>
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      <Card className='border-none shadow-sm'>
        <Box className='p-6 border-be'>
          <Grid2 container spacing={4} className='w-full'>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField 
                fullWidth 
                placeholder='Tìm kiếm SKU, tên gói...' 
                size='small'
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField select fullWidth size='small' value={region} onChange={e => setRegion(e.target.value)} label='Vùng/Quốc gia'>
                <MenuItem value='all'>Tất cả vùng</MenuItem>
                <MenuItem value='nhật bản'>Nhật Bản</MenuItem>
                <MenuItem value='mỹ'>Mỹ / Hoa Kỳ</MenuItem>
                <MenuItem value='thái lan'>Thái Lan</MenuItem>
                <MenuItem value='hồng kông'>Hồng Kông</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField select fullWidth size='small' value={esimType} onChange={e => setEsimType(e.target.value)} label='Loại SIM'>
                <MenuItem value='all'>Tất cả loại SIM</MenuItem>
                <MenuItem value='eSIM'>eSIM</MenuItem>
                <MenuItem value='Physical'>Physical SIM</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField select fullWidth size='small' value={packageType} onChange={e => setPackageType(e.target.value)} label='Loại gói'>
                <MenuItem value='all'>Tất cả loại gói</MenuItem>
                <MenuItem value='Daily'>Gói Daily</MenuItem>
                <MenuItem value='Total'>Gói Total</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 1.5 }}>
              <TextField select fullWidth size='small' value={dataLimit} onChange={e => setDataLimit(e.target.value)} label='Dung lượng'>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='5'>5 GB</MenuItem>
                <MenuItem value='10'>10 GB</MenuItem>
                <MenuItem value='unlimited'>Unlimited</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 1.5 }}>
              <TextField select fullWidth size='small' value={duration} onChange={e => setDuration(e.target.value)} label='Thời hạn'>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='7'>7 Ngày</MenuItem>
                <MenuItem value='15'>15 Ngày</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-black uppercase text-[11px]'>Gói cước (SKU)</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Phân loại</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Giá Gốc (NCC)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right bg-primary/5 text-primary border-l-2 border-primary'>Giá Đại lý</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right text-success'>Lợi nhuận</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Cơ sở tính giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPackages.map((pkg) => {
                const profit = pkg.agentPrice - pkg.basePrice
                
                return (
                  <TableRow key={pkg.sku} hover>
                    <TableCell>
                      <Typography variant='body2' className='font-black'>{pkg.name}</Typography>
                      <Typography variant='caption' className='text-slate-400'>{pkg.sku}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box className='flex flex-col'>
                        <Typography variant='body2' className='font-bold'>{pkg.country}</Typography>
                        <Box className='flex gap-1'>
                          <Chip label={pkg.esimType} size='small' variant='tonal' className='text-[9px] h-4' />
                          <Chip label={pkg.packageType} size='small' variant='tonal' color='info' className='text-[9px] h-4' />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Typography variant='body2' className='font-bold text-slate-700'>{formatPrice(pkg.basePrice, currency)}</Typography>
                      <Typography variant='caption' className='text-slate-400 block'>{formatVND(pkg.basePrice, currency)}</Typography>
                    </TableCell>
                    <TableCell className='text-right bg-primary/5 border-l-2 border-primary'>
                      <Typography variant='subtitle2' className='font-black text-primary'>
                        {formatPrice(pkg.agentPrice, currency)}
                      </Typography>
                      <Typography variant='caption' className='text-primary/60 font-black block'>
                        {formatVND(pkg.agentPrice, currency)}
                      </Typography>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Typography variant='body2' className='font-black text-success'>
                        {formatPrice(profit, currency)}
                      </Typography>
                      <Typography variant='caption' className='text-success/60 block'>
                        {formatVND(profit, currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={pkg.appliedRule} 
                        color={getRuleColor(pkg.appliedRule) as any} 
                        size='small' 
                        variant='tonal' 
                        className='font-bold'
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  )
}

export default AgentPriceList
