'use client'

import React, { useState } from 'react'
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
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'

import PageHeader from '@/components/layout/shared/PageHeader'

const ReconciliationList = () => {
  const [isMatchToolOpen, setIsMatchToolOpen] = useState(false)
  const [matchingStep, setMatchingStep] = useState<'upload' | 'processing' | 'result'>('upload')
  const [matchProgress, setMatchProgress] = useState(0)

  const transactions = [
    { 
      id: 'ORD-99812', 
      date: '2026-04-28 09:15', 
      sku: 'JP-10GB-7D',
      package: 'Nhật Bản 10GB 7 Ngày',
      agent: { name: 'TravelConnect', code: 'A001' },
      agentPrice: 6.50,
      supplier: { name: 'Airalo API', code: 'Airalo' },
      supplierCost: 5.00,
      systemStatus: 'Hoàn tất',
      matchStatus: 'Đã khớp' 
    },
    { 
      id: 'ORD-99811', 
      date: '2026-04-28 08:30', 
      sku: 'US-UNL-15D',
      package: 'Hoa Kỳ Không Giới Hạn',
      agent: { name: 'Global eSIM Hub', code: 'A002' },
      agentPrice: 18.00,
      supplier: { name: '1Global (Truphone)', code: '1Global' },
      supplierCost: 14.50,
      systemStatus: 'Hoàn tất',
      matchStatus: 'Đã khớp' 
    },
    { 
      id: 'ORD-99810', 
      date: '2026-04-27 18:20', 
      sku: 'TH-50GB-10D',
      package: 'Thái Lan 50GB',
      agent: { name: 'CheapData Agency', code: 'A003' },
      agentPrice: 5.10,
      supplier: { name: 'eSIM Go', code: 'eSIM Go' },
      supplierCost: 5.10, // Cost changed unexpectedly?
      systemStatus: 'Hoàn tất',
      matchStatus: 'Lệch giá vốn' // Mismatch example
    },
    { 
      id: 'ORD-99809', 
      date: '2026-04-27 15:45', 
      sku: 'EU-30GB-30D',
      package: 'Châu Âu 30GB',
      agent: { name: 'Asia Roaming', code: 'A005' },
      agentPrice: 22.50,
      supplier: { name: 'Redtea Mobile', code: 'Redtea' },
      supplierCost: 18.00,
      systemStatus: 'Lỗi phát hành', // Failed to issue but charged?
      matchStatus: 'Đang xử lý' 
    },
    { 
      id: 'ORD-99808', 
      date: '2026-04-27 10:00', 
      sku: 'SG-5GB-5D',
      package: 'Singapore 5GB',
      agent: { name: 'TravelConnect', code: 'A001' },
      agentPrice: 4.50,
      supplier: { name: 'Airalo API', code: 'Airalo' },
      supplierCost: 3.20,
      systemStatus: 'Hoàn tất',
      matchStatus: 'Đã khớp' 
    },
  ]

  // Mock global metrics
  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.agentPrice, 0)
  const totalCost = transactions.reduce((acc, curr) => acc + curr.supplierCost, 0)
  const totalProfit = totalRevenue - totalCost
  const profitMargin = (totalProfit / totalRevenue) * 100
  const mismatchedCount = transactions.filter(t => t.matchStatus !== 'Đã khớp').length

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'Đã khớp': return 'success'
      case 'Đang xử lý': return 'warning'
      case 'Lệch giá vốn': return 'error'
      default: return 'default'
    }
  }

  const handleStartMatching = () => {
    setMatchingStep('processing')
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setMatchProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setMatchingStep('result')
      }
    }, 200)
  }

  const handleCloseMatchTool = () => {
    setIsMatchToolOpen(false)
    setTimeout(() => {
      setMatchingStep('upload')
      setMatchProgress(0)
    }, 300)
  }

  return (
    <>
      <PageHeader
        title="Đối soát Giao dịch Toàn tuyến (End-to-End Reconciliation)"
        description="Bảng phân tích dòng tiền (Cashflow) chi tiết trên từng đơn hàng: Dòng tiền vào từ Đại lý (AR) và Dòng tiền ra cho Nhà cung cấp (AP)."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' }, 
          { label: 'Tài chính' }, 
          { label: 'Đối soát Giao dịch' }
        ]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button 
              variant='outlined' 
              color='secondary' 
              startIcon={<i className='tabler-adjustments' />}
              onClick={() => setIsMatchToolOpen(true)}
            >
              Công cụ Khớp lệnh
            </Button>
            <Button variant='contained' color='primary' startIcon={<i className='tabler-file-export' />}>Xuất File Đối soát</Button>
          </Stack>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6} className='mbe-6'>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent className='p-6'>
              <Typography variant='caption' className='font-bold text-slate-500 uppercase'>Doanh thu B2B (Đại lý)</Typography>
              <Typography variant='h4' className='font-black text-primary'>
                {totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent className='p-6'>
              <Typography variant='caption' className='font-bold text-slate-500 uppercase'>Chi phí Nhập (NCC)</Typography>
              <Typography variant='h4' className='font-black text-warning'>
                {totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent className='p-6'>
              <Typography variant='caption' className='font-bold text-slate-500 uppercase'>Lợi nhuận gộp</Typography>
              <Box className='flex items-baseline gap-2'>
                <Typography variant='h4' className='font-black text-success'>
                  {totalProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </Typography>
                <Chip label={`Margin: ${profitMargin.toFixed(1)}%`} size='small' color='success' variant='tonal' className='h-5 text-[10px]' />
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Card className='border-none shadow-sm bg-error/5 border-error/20 h-full'>
            <CardContent className='p-6 flex flex-col justify-between h-full'>
              <Box>
                <Typography variant='caption' className='font-bold text-error uppercase'>Giao dịch Lệch/Lỗi</Typography>
                <Typography variant='h3' className='font-black text-error mbe-1'>
                  {mismatchedCount} <span className='text-sm'>đơn</span>
                </Typography>
              </Box>
              <Typography variant='caption' className='text-slate-600 font-bold'>Cần kiểm tra lại log</Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Card className='border-none shadow-sm'>
        <Box className='p-6 border-be'>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField 
                fullWidth 
                placeholder='Tìm mã đơn hàng/SKU...' 
                size='small'
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth size='small' defaultValue='all' label='Lọc Đại lý (Downstream)'>
                <MenuItem value='all'>Tất cả Đại lý</MenuItem>
                <MenuItem value='a001'>TravelConnect</MenuItem>
                <MenuItem value='a002'>Global eSIM Hub</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth size='small' defaultValue='all' label='Lọc Nhà cung cấp (Upstream)'>
                <MenuItem value='all'>Tất cả Nhà cung cấp</MenuItem>
                <MenuItem value='airalo'>Airalo API</MenuItem>
                <MenuItem value='1global'>1Global</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth size='small' defaultValue='mismatch' label='Trạng thái Khớp lệnh'>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='matched'>Đã khớp</MenuItem>
                <MenuItem value='mismatch'>Lệch đối soát (Cần xử lý)</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-black uppercase text-[11px]'>Mã Đơn / Thời gian</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Gói cước (SKU)</TableCell>
                <TableCell className='font-black uppercase text-[11px] bg-primary/5 text-primary'>Đại lý (B2B)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right bg-primary/5 text-primary'>Thu (A)</TableCell>
                <TableCell className='font-black uppercase text-[11px] bg-warning/5 text-warning'>NCC (Nguồn)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right bg-warning/5 text-warning'>Chi (B)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Lãi (A-B)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Đối soát</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => {
                const profit = tx.agentPrice - tx.supplierCost
                const margin = (profit / tx.agentPrice) * 100

                return (
                  <TableRow key={tx.id} hover>
                    <TableCell>
                      <Typography variant='body2' className='font-bold text-primary'>{tx.id}</Typography>
                      <Typography variant='caption' className='text-slate-400'>{tx.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' className='font-bold'>{tx.package}</Typography>
                      <Typography variant='caption' className='text-slate-500'>{tx.sku}</Typography>
                    </TableCell>
                    
                    {/* Downstream Column */}
                    <TableCell className='bg-primary/5'>
                      <Typography variant='body2' className='font-bold'>{tx.agent.name}</Typography>
                      <Typography variant='caption' className='text-slate-500'>ID: {tx.agent.code}</Typography>
                    </TableCell>
                    <TableCell className='text-right bg-primary/5'>
                      <Typography variant='subtitle2' className='font-black text-primary'>
                        {tx.agentPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </Typography>
                    </TableCell>

                    {/* Upstream Column */}
                    <TableCell className='bg-warning/5'>
                      <Typography variant='body2' className='font-bold'>{tx.supplier.name}</Typography>
                      <Typography variant='caption' className='text-slate-500'>ID: {tx.supplier.code}</Typography>
                    </TableCell>
                    <TableCell className='text-right bg-warning/5'>
                      <Typography variant='subtitle2' className='font-black text-warning'>
                        {tx.supplierCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </Typography>
                    </TableCell>

                    {/* Profit Column */}
                    <TableCell className='text-right'>
                      <Typography variant='subtitle2' className={`font-black ${profit > 0 ? 'text-success' : 'text-error'}`}>
                        {profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </Typography>
                      <Typography variant='caption' className={`font-bold ${profit > 0 ? 'text-success/70' : 'text-error/70'}`}>
                        {margin.toFixed(1)}%
                      </Typography>
                    </TableCell>

                    <TableCell className='text-center'>
                      <Chip 
                        label={tx.matchStatus} 
                        color={getMatchStatusColor(tx.matchStatus) as any} 
                        size='small' 
                        variant={tx.matchStatus === 'Đã khớp' ? 'tonal' : 'filled'} 
                        className='font-bold'
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Stack direction='row' spacing={1} justifyContent='flex-end'>
                        <Button size='small' variant='outlined' color='secondary'>Chi tiết</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Match Tool Dialog */}
      <Dialog 
        open={isMatchToolOpen} 
        onClose={handleCloseMatchTool}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle className='flex justify-between items-center border-be p-6'>
          <Box>
            <Typography variant='h5' className='font-black'>Công cụ Khớp lệnh (Smart Matching Engine)</Typography>
            <Typography variant='caption' className='text-slate-500'>Tự động đối chiếu dữ liệu giữa Nhà cung cấp và Hệ thống</Typography>
          </Box>
          <Button onClick={handleCloseMatchTool} className='min-is-0 p-1'><i className='tabler-x text-xl' /></Button>
        </DialogTitle>
        
        <DialogContent className='p-6'>
          {matchingStep === 'upload' && (
            <Box className='flex flex-col gap-6 py-4'>
              <Alert icon={<i className='tabler-info-circle' />} severity='info' className='bg-info/5 border-info/20 text-info'>
                Tải lên file báo cáo (CSV/Excel) xuất từ cổng NCC (Airalo, eSIM Go, v.v.) để hệ thống bắt đầu so khớp.
              </Alert>
              
              <Grid2 container spacing={4}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField select fullWidth label='Chọn Nhà cung cấp' defaultValue='airalo'>
                    <MenuItem value='airalo'>Airalo API</MenuItem>
                    <MenuItem value='esimgo'>eSIM Go</MenuItem>
                    <MenuItem value='redtea'>Redtea Mobile</MenuItem>
                  </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField type='date' fullWidth label='Kỳ đối soát' InputLabelProps={{ shrink: true }} defaultValue='2026-04-01' />
                </Grid2>
              </Grid2>

              <Box 
                className='border-2 border-dashed border-slate-200 rounded-lg p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer'
                onClick={handleStartMatching}
              >
                <Avatar className='bg-primary/10 text-primary mb-4 bs-12 is-12'>
                  <i className='tabler-cloud-upload text-3xl' />
                </Avatar>
                <Typography variant='h6' className='font-black mbe-1 text-center'>Tải lên File báo cáo NCC</Typography>
                <Typography variant='caption' className='text-slate-500 text-center'>Hỗ trợ .csv, .xlsx (Tối đa 20MB)</Typography>
              </Box>
            </Box>
          )}

          {matchingStep === 'processing' && (
            <Box className='py-12 flex flex-col items-center gap-6'>
              <Box className='relative bs-24 is-24 flex items-center justify-center'>
                <i className='tabler-refresh text-primary text-5xl animate-spin' />
              </Box>
              <Box className='w-full max-w-sm'>
                <Typography variant='h6' className='font-black text-center mbe-2'>Đang phân tích dữ liệu...</Typography>
                <Typography variant='body2' className='text-center text-slate-500 mbe-4'>Đã xử lý {matchProgress}% dữ liệu đơn hàng</Typography>
                <LinearProgress variant='determinate' value={matchProgress} className='rounded-full bs-2' />
              </Box>
            </Box>
          )}

          {matchingStep === 'result' && (
            <Box className='flex flex-col gap-6 py-4'>
              <Box className='bg-success/5 border border-success/20 rounded-lg p-4 flex items-center gap-4'>
                <Avatar className='bg-success text-white'>
                  <i className='tabler-check' />
                </Avatar>
                <Box>
                  <Typography variant='subtitle2' className='font-black text-success uppercase'>Hoàn tất đối soát</Typography>
                  <Typography variant='caption' className='text-slate-600'>Phân tích xong 1,240 giao dịch trong kỳ.</Typography>
                </Box>
              </Box>

              <Grid2 container spacing={4}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Card variant='outlined' className='p-4 border-slate-200'>
                    <Typography variant='h4' className='font-black text-success'>1,232</Typography>
                    <Typography variant='caption' className='font-bold text-slate-500 uppercase italic'>Khớp hoàn toàn</Typography>
                  </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Card variant='outlined' className='p-4 border-error/30 bg-error/5 text-error'>
                    <Typography variant='h4' className='font-black'>6</Typography>
                    <Typography variant='caption' className='font-bold uppercase italic'>Lệch giá vốn</Typography>
                  </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Card variant='outlined' className='p-4 border-warning/30 bg-warning/5 text-warning'>
                    <Typography variant='h4' className='font-black'>2</Typography>
                    <Typography variant='caption' className='font-bold uppercase italic'>Thiếu trong hệ thống</Typography>
                  </Card>
                </Grid2>
              </Grid2>

              <Divider />

              <Box>
                <Typography variant='subtitle2' className='font-black uppercase mbe-3'>Chi tiết các đơn lệch/thiếu:</Typography>
                <TableContainer className='border rounded-lg max-bs-64'>
                  <Table size='small' stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell className='font-black text-[10px] uppercase'>Mã Đơn (NCC)</TableCell>
                        <TableCell className='font-black text-[10px] uppercase'>Vấn đề</TableCell>
                        <TableCell className='font-black text-[10px] uppercase text-right'>Giá Hệ thống</TableCell>
                        <TableCell className='font-black text-[10px] uppercase text-right'>Giá NCC</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell className='font-bold text-error'>AIR-22931</TableCell>
                        <TableCell><Chip label='Thiếu trong DB' size='small' color='warning' variant='tonal' /></TableCell>
                        <TableCell className='text-right'>$0.00</TableCell>
                        <TableCell className='text-right font-bold'>$5.50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-bold'>ORD-99810</TableCell>
                        <TableCell><Chip label='Lệch giá vốn' size='small' color='error' variant='tonal' /></TableCell>
                        <TableCell className='text-right'>$5.00</TableCell>
                        <TableCell className='text-right font-bold text-error'>$5.10</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions className='p-6 border-bs'>
          <Button variant='tonal' color='secondary' onClick={handleCloseMatchTool}>Hủy bỏ</Button>
          {matchingStep === 'result' ? (
            <Button variant='contained' color='primary' startIcon={<i className='tabler-file-download' />}>Tải báo cáo chi tiết (.xlsx)</Button>
          ) : (
            <Button variant='contained' color='primary' disabled={matchingStep === 'processing'} onClick={handleStartMatching}>Bắt đầu xử lý</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReconciliationList
