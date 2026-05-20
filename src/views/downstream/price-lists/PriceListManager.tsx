'use client'

import { useState } from 'react'
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

const PriceListManager = () => {
  const [selectedAgent, setSelectedAgent] = useState('a001')

  const packages = [
    { sku: 'JP-10GB-7D', country: 'Nhật Bản', name: '10GB 7 Ngày', basePrice: 5.00, retailPrice: 8.00, agentPrice: 6.50, appliedRule: 'Ghi đè Gói (Package Level)' },
    { sku: 'JP-UNL-15D', country: 'Nhật Bản', name: 'Không Giới Hạn 15 Ngày', basePrice: 12.00, retailPrice: 18.00, agentPrice: 14.40, appliedRule: 'Quốc gia (-20%)' },
    { sku: 'US-5GB-10D', country: 'Hoa Kỳ', name: '5GB 10 Ngày', basePrice: 8.00, retailPrice: 14.00, agentPrice: 11.90, appliedRule: 'Tier Platinum (-15%)' },
    { sku: 'TH-50GB-10D', country: 'Thái Lan', name: '50GB 10 Ngày', basePrice: 3.50, retailPrice: 6.00, agentPrice: 5.10, appliedRule: 'Quốc gia (-15%)' },
    { sku: 'EU-10GB-30D', country: 'Châu Âu (33 nước)', name: '10GB 30 Ngày', basePrice: 15.00, retailPrice: 24.00, agentPrice: 20.40, appliedRule: 'Tier Platinum (-15%)' },
  ]

  const getRuleColor = (rule: string) => {
    if (rule.includes('Gói')) return 'error' // Highest priority
    if (rule.includes('Quốc gia')) return 'warning' // Medium priority
    return 'primary' // Default/Tier priority
  }

  return (
    <>
      <PageHeader
        title="Bảng giá Cuối cùng (Final Price List)"
        description="Bảng mô phỏng giá bán cuối cùng mà đại lý nhìn thấy sau khi đã áp dụng mọi quy tắc tính giá (Tier > Quốc gia > Gói)."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' }, 
          { label: 'Phân phối' }, 
          { label: 'Quản lý Bảng giá' }
        ]}
        actions={
          <Button variant='contained' color='success' startIcon={<i className='tabler-file-spreadsheet' />}>Xuất Excel</Button>
        }
        className='mbe-6'
      />

      <Card className='border-none shadow-sm mbe-6 bg-slate-50'>
        <CardContent className='p-6'>
          <Grid2 container spacing={4} alignItems='center'>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant='subtitle2' className='font-bold mbe-2 uppercase text-slate-500'>Xem giá với tư cách Đại lý:</Typography>
              <TextField 
                select 
                fullWidth 
                size='small' 
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-user' /></InputAdornment>
                }}
              >
                <MenuItem value='a001'>TravelConnect Solutions (PLATINUM)</MenuItem>
                <MenuItem value='a002'>Global eSIM Hub (GOLD)</MenuItem>
                <MenuItem value='a003'>CheapData Agency (SILVER)</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Box className='flex gap-4 items-center bg-white p-4 rounded-xl border'>
                <i className='tabler-info-circle text-primary text-2xl' />
                <Typography variant='body2' className='text-slate-600'>
                  Đại lý <strong>TravelConnect Solutions</strong> đang áp dụng chính sách <strong>PLATINUM (-15% Global)</strong>. 
                  Các quy tắc ghi đè theo <span className='text-warning font-bold'>Quốc gia</span> hoặc <span className='text-error font-bold'>Gói</span> sẽ được ưu tiên hiển thị.
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      <Card className='border-none shadow-sm'>
        <Box className='p-6 border-be flex justify-between items-center'>
          <Grid2 container spacing={4} className='w-full'>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField 
                fullWidth 
                placeholder='Tìm kiếm SKU...' 
                size='small'
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField select fullWidth size='small' defaultValue='all' label='Quốc gia/Vùng'>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='jp'>Nhật Bản</MenuItem>
                <MenuItem value='us'>Hoa Kỳ</MenuItem>
                <MenuItem value='th'>Thái Lan</MenuItem>
                <MenuItem value='eu'>Châu Âu</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField select fullWidth size='small' defaultValue='all' label='Dung lượng (GB)'>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='1'>1 GB</MenuItem>
                <MenuItem value='5'>5 GB</MenuItem>
                <MenuItem value='10'>10 GB</MenuItem>
                <MenuItem value='50'>50 GB</MenuItem>
                <MenuItem value='unlimited'>Không giới hạn</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField select fullWidth size='small' defaultValue='all' label='Thời hạn (Ngày)'>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='7'>7 Ngày</MenuItem>
                <MenuItem value='10'>10 Ngày</MenuItem>
                <MenuItem value='15'>15 Ngày</MenuItem>
                <MenuItem value='30'>30 Ngày</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField select fullWidth size='small' defaultValue='all' label='Quy tắc áp dụng'>
                <MenuItem value='all'>Tất cả quy tắc</MenuItem>
                <MenuItem value='pkg'>Ghi đè Gói</MenuItem>
                <MenuItem value='country'>Ghi đè Quốc gia</MenuItem>
                <MenuItem value='tier'>Giá mặc định (Tier)</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-black uppercase text-[11px]'>Gói cước (SKU)</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Quốc gia/Vùng</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Giá Gốc (NCC)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Giá Bán Chợ (Retail)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right bg-primary/5 text-primary'>Giá Đại Lý (Agent)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Lợi Nhuận Gộp</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Quy tắc áp dụng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((pkg) => {
                const profit = pkg.agentPrice - pkg.basePrice
                
                return (
                  <TableRow key={pkg.sku} hover>
                    <TableCell>
                      <Typography variant='body2' className='font-bold'>{pkg.name}</Typography>
                      <Typography variant='caption' className='text-slate-400'>{pkg.sku}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' className='font-bold'>{pkg.country}</Typography>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Typography variant='body2' className='text-slate-500'>
                        {pkg.basePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </Typography>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Typography variant='body2' className='text-slate-500'>
                        {pkg.retailPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </Typography>
                    </TableCell>
                    <TableCell className='text-right bg-primary/5'>
                      <Typography variant='subtitle2' className='font-black text-primary'>
                        {pkg.agentPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </Typography>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Typography variant='body2' className='font-bold text-success'>
                        {profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
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

export default PriceListManager
