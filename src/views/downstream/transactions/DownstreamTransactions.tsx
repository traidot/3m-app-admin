'use client'

import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Avatar from '@mui/material/Avatar'
import Grid2 from '@mui/material/Grid2'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'

import PageHeader from '@/components/layout/shared/PageHeader'

const DownstreamTransactions = () => {
  const [isLogOpen, setIsLogOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)

  // Filter States
  const [agent, setAgent] = useState('all')
  const [supplier, setSupplier] = useState('all')
  const [pkgType, setPkgType] = useState('all')
  const [dataLimit, setDataLimit] = useState('all')
  const [validity, setValidity] = useState('all')
  
  const transactions = [
    { 
      id: 'ORD-7729-10A', 
      agent: 'Global eSIM Hub', 
      supplier: 'Singtel',
      package: 'Singapore 10GB (30D)',
      action: 'Mua',
      price: 12.50,
      cost: 9.80,
      downstreamStatus: 201, 
      upstreamStatus: 200,
      latency: '450ms',
      date: '2026-04-28 14:15:22' 
    },
    { 
      id: 'ORD-7729-10B', 
      agent: 'TravelConnect', 
      supplier: 'AIS Thailand',
      package: 'Thailand Unlimited (7D)',
      action: 'Mua',
      price: 8.00,
      cost: 6.20,
      downstreamStatus: 201, 
      upstreamStatus: 200,
      latency: '320ms',
      date: '2026-04-28 14:12:05' 
    },
    { 
      id: 'ORD-7729-10C', 
      agent: 'Nomad Partner', 
      supplier: 'Orange FR',
      package: 'Europe Pro 20GB',
      action: 'Huỷ',
      price: 25.00,
      cost: 18.50,
      downstreamStatus: 400, 
      upstreamStatus: null,
      latency: '110ms',
      date: '2026-04-28 13:55:10' 
    },
    { 
      id: 'ORD-7729-10D', 
      agent: 'TravelConnect', 
      supplier: 'KDDI Japan',
      package: 'Japan 5GB (15D)',
      action: 'Mua',
      price: 14.50,
      cost: 11.20,
      downstreamStatus: 201, 
      upstreamStatus: 500,
      latency: '820ms',
      date: '2026-04-28 13:45:00' 
    }
  ]

  const getStatusChip = (status: number | null) => {
    if (status === null) return <Chip label="N/A" size="small" variant='tonal' className='font-black' sx={{ opacity: 0.3 }} />
    if (status >= 200 && status < 300) return <Chip label="Thành công" size="small" color="success" variant='tonal' className='font-black' />
    if (status >= 400 && status < 500) return <Chip label="Thất bại" size="small" color="warning" variant='tonal' className='font-black' />
    return <Chip label="Thất bại" size="small" color="error" variant='tonal' className='font-black' />
  }

  return (
    <>
      <PageHeader
        title="Lịch sử giao dịch"
        description="Theo dõi luồng giao dịch từ Đại lý (Downstream) qua Hệ thống đến Nhà cung cấp (Upstream)."
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Phân phối' }, { label: 'Giao dịch' }]}
        actions={
          <Button variant='tonal' color='secondary' startIcon={<i className='tabler-file-spreadsheet' />}>
            Xuất Excel
          </Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6} className='mbe-6'>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4 p-6'>
              <Avatar variant='rounded' sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <i className='tabler-shopping-cart text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='caption' className='font-black uppercase text-slate-500'>Đơn hàng (24h)</Typography>
                <Typography variant='h4' className='font-black'>852</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4 p-6'>
              <Avatar variant='rounded' sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                <i className='tabler-check text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='caption' className='font-black uppercase text-slate-500'>Thành công</Typography>
                <Typography variant='h4' className='font-black text-success'>98.2%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='flex items-center gap-4 p-6'>
              <Avatar variant='rounded' sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                <i className='tabler-x text-2xl' />
              </Avatar>
              <Box>
                <Typography variant='caption' className='font-black uppercase text-slate-500'>Thất bại</Typography>
                <Typography variant='h4' className='font-black text-error'>1.8%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Card className='border-none shadow-sm mbe-6'>
        <CardContent>
          <Grid2 container spacing={4}>
            {/* Filter Group 1: Entities */}
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Đại lý (Downstream)</Typography>
              <Select fullWidth size='small' value={agent} onChange={(e) => setAgent(e.target.value)}>
                <MenuItem value='all'>Tất cả đại lý</MenuItem>
                <MenuItem value='global'>Global eSIM Hub</MenuItem>
                <MenuItem value='travel'>TravelConnect</MenuItem>
                <MenuItem value='nomad'>Nomad Partner</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Nhà cung cấp (Upstream)</Typography>
              <Select fullWidth size='small' value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                <MenuItem value='all'>Tất cả NCC</MenuItem>
                <MenuItem value='singtel'>Singtel</MenuItem>
                <MenuItem value='ais'>AIS Thailand</MenuItem>
                <MenuItem value='orange'>Orange FR</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Thời gian giao dịch (From - To)</Typography>
              <Stack direction='row' spacing={2}>
                <TextField fullWidth size='small' type='date' defaultValue='2026-04-01' />
                <TextField fullWidth size='small' type='date' defaultValue='2026-04-28' />
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 2 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 opacity-0 uppercase text-[11px] hidden md:block'>Tìm kiếm</Typography>
              <Button variant='contained' color='primary' fullWidth className='min-bs-[38px]' startIcon={<i className='tabler-search' />}>
                Lọc kết quả
              </Button>
            </Grid2>

            {/* Filter Group 2: Product Specs */}
            <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Loại gói eSIM</Typography>
              <Select fullWidth size='small' value={pkgType} onChange={(e) => setPkgType(e.target.value)}>
                <MenuItem value='all'>Tất cả loại</MenuItem>
                <MenuItem value='Daily'>Daily (Theo ngày)</MenuItem>
                <MenuItem value='Total'>Total (Tổng dung lượng)</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Dung lượng</Typography>
              <Select fullWidth size='small' value={dataLimit} onChange={(e) => setDataLimit(e.target.value)}>
                <MenuItem value='all'>Tất cả dung lượng</MenuItem>
                <MenuItem value='1GB'>1GB</MenuItem>
                <MenuItem value='5GB'>5GB</MenuItem>
                <MenuItem value='10GB'>10GB</MenuItem>
                <MenuItem value='Unlimited'>Không giới hạn</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Số ngày (Thời hạn)</Typography>
              <Select fullWidth size='small' value={validity} onChange={(e) => setValidity(e.target.value)}>
                <MenuItem value='all'>Tất cả thời hạn</MenuItem>
                <MenuItem value='1 Ngày'>1 Ngày</MenuItem>
                <MenuItem value='7 Ngày'>7 Ngày</MenuItem>
                <MenuItem value='30 Ngày'>30 Ngày</MenuItem>
              </Select>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      <Card className='border-none shadow-sm overflow-hidden'>
        <Box className='p-5 border-be bg-slate-50/50 flex justify-between items-center gap-4 flex-wrap'>
          <Typography variant='h6' className='font-black'>Danh sách Đơn hàng API</Typography>
          
          <Stack direction='row' spacing={4} className='items-center flex-wrap'>
            <TextField select size='small' defaultValue='all' label='Trạng thái luồng' className='min-is-[200px] bg-white'>
              <MenuItem value='all'>Tất cả trạng thái</MenuItem>
              <MenuItem value='success'>Thành công toàn bộ</MenuItem>
              <MenuItem value='failed_upstream'>Lỗi Nhà cung cấp</MenuItem>
              <MenuItem value='failed_downstream'>Lỗi đầu vào Đại lý</MenuItem>
            </TextField>
            <TextField 
              size='small' 
              placeholder='Tìm Order ID / Agent...' 
              className='min-is-[300px] bg-white'
              InputProps={{
                startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
              }}
            />
          </Stack>
        </Box>
        <TableContainer>
          <Table>
            <TableHead className='bg-slate-50'>
              <TableRow>
                <TableCell className='font-black uppercase text-[11px]'>Mã đơn hàng</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Đại lý (Downstream)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Hành động</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Sản phẩm / Chi tiết</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>NCC (Upstream)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Đại lý → Chợ</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Chợ → NCC</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Giá bán</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Giá gốc (Cost)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Thời gian</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Luồng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => {
                const agentColor = tx.agent === 'Global eSIM Hub' ? '#7367F0' : tx.agent === 'TravelConnect' ? '#00BAD1' : '#FF9F43';
                const supplierColor = tx.supplier === 'Singtel' ? '#EA5455' : tx.supplier === 'AIS Thailand' ? '#28C76F' : tx.supplier === 'Orange FR' ? '#FF9F43' : '#00BAD1';
                const rate = 25450; // Mock rate

                return (
                <TableRow key={tx.id} hover>
                  <TableCell>
                    <Typography variant='body2' className='font-black text-primary'>{tx.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box className='flex items-center gap-2'>
                      <Avatar 
                        variant='rounded' 
                        sx={{ 
                          backgroundColor: `${agentColor}15`, 
                          color: agentColor,
                          width: 28, 
                          height: 28,
                          fontSize: '10px',
                          fontWeight: '900'
                        }}
                      >
                        {tx.agent[0]}
                      </Avatar>
                      <Typography variant='body2' className='font-bold' sx={{ color: agentColor }}>{tx.agent}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Typography variant='body2' className='font-bold text-slate-500'>{tx.action}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant='body2' className='font-bold mbe-1 text-slate-800'>{tx.package.split(' (')[0]}</Typography>
                      <Stack direction='row' spacing={2}>
                        <Chip label={tx.package.match(/\d+GB|\d+MB|Unlimited/)?.[0] || 'Data'} size='small' color='primary' variant='tonal' className='font-black text-[10px] h-[20px]' />
                        <Chip label={tx.package.match(/\d+D/)?.[0]?.replace('D', ' Ngày') || 'Bền vững'} size='small' color='secondary' variant='tonal' className='font-black text-[10px] h-[20px]' />
                      </Stack>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className='flex items-center gap-2'>
                      <Avatar 
                        variant='rounded' 
                        sx={{ 
                          backgroundColor: `${supplierColor}15`, 
                          color: supplierColor,
                          width: 28, 
                          height: 28,
                          fontSize: '10px',
                          fontWeight: '900'
                        }}
                      >
                        {tx.supplier[0]}
                      </Avatar>
                      <Typography variant='body2' className='font-bold text-slate-500' sx={{ color: supplierColor }}>{tx.supplier}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell className='text-center'>
                    {getStatusChip(tx.downstreamStatus)}
                  </TableCell>
                  <TableCell className='text-center'>
                    {getStatusChip(tx.upstreamStatus)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='body2' className='font-black text-primary'>${tx.price.toFixed(2)}</Typography>
                    <Typography variant='caption' className='font-bold text-slate-400'>{(tx.price * rate).toLocaleString()}đ</Typography>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='body2' className='font-black text-slate-600'>${tx.cost.toFixed(2)}</Typography>
                    <Typography variant='caption' className='font-bold text-slate-400'>{(tx.cost * rate).toLocaleString()}đ</Typography>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='caption' className='font-bold text-slate-400'>{tx.date}</Typography>
                  </TableCell>
                  <TableCell className='text-center'>
                    <IconButton size='small' color='primary' onClick={() => { setSelectedLog(tx); setIsLogOpen(true); }}>
                      <i className='tabler-route text-xl' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog 
        open={isLogOpen} 
        onClose={() => setIsLogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle component='div' className='flex items-center justify-between border-be'>
          <Typography variant='h5' component='span' className='font-black'>Chi tiết luồng Giao dịch: {selectedLog?.id}</Typography>
          <IconButton onClick={() => setIsLogOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          {selectedLog && (
            <Timeline position="right" sx={{ p: 0 }}>
              {/* STEP 1: DOWNSTREAM REQUEST */}
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color={selectedLog.downstreamStatus < 400 ? 'success' : 'error'}>
                    <i className='tabler-arrow-down-left text-white text-[14px]' />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className='pb-8'>
                  <Box className='flex justify-between items-start mbe-2'>
                    <Box>
                      <Typography variant='subtitle2' className='font-black uppercase text-primary'>Downstream: Agent → Market</Typography>
                      <Typography variant='caption' className='text-slate-500'>Đại lý gửi yêu cầu mua hàng</Typography>
                    </Box>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Typography variant='caption' className='font-mono'>Latency: 25ms</Typography>
                      {getStatusChip(selectedLog.downstreamStatus)}
                    </Stack>
                  </Box>
                  <Box className='bg-[#1E1E1E] p-4 rounded-lg'>
                    <pre className='text-[#9CDCFE] font-mono text-xs m-0 overflow-x-auto'>
{`POST /api/v1/orders
From: ${selectedLog.agent}
Payload: {
  "sku": "PKG-SING-10G",
  "agent_ref": "AG-REQ-991"
}`}
                    </pre>
                  </Box>
                </TimelineContent>
              </TimelineItem>

              {/* STEP 2: UPSTREAM REQUEST */}
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color={selectedLog.upstreamStatus === null ? 'grey' : (selectedLog.upstreamStatus < 400 ? 'success' : 'error')}>
                    <i className='tabler-arrow-up-right text-white text-[14px]' />
                  </TimelineDot>
                </TimelineSeparator>
                <TimelineContent>
                  <Box className='flex justify-between items-start mbe-2'>
                    <Box>
                      <Typography variant='subtitle2' className='font-black uppercase text-secondary'>Upstream: Market → Supplier ({selectedLog.supplier})</Typography>
                      <Typography variant='caption' className='text-slate-500'>Hệ thống call API Nhà cung cấp để lấy mã eSIM</Typography>
                    </Box>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Typography variant='caption' className='font-mono'>Latency: {selectedLog.latency}</Typography>
                      {getStatusChip(selectedLog.upstreamStatus)}
                    </Stack>
                  </Box>
                  {selectedLog.upstreamStatus ? (
                    <Box className='bg-[#1E1E1E] p-4 rounded-lg border-is-4' sx={{ borderLeftColor: `${selectedLog.upstreamStatus < 400 ? 'success' : 'error'}.main` }}>
                      <pre className='text-[#CE9178] font-mono text-xs m-0 overflow-x-auto'>
{`POST /vendor/api/activate
To: ${selectedLog.supplier}
Response: {
  "status": "${selectedLog.upstreamStatus}",
  "esim_code": "${selectedLog.upstreamStatus < 400 ? 'ESIM-XYZ-123' : 'ERROR_VENDOR_BUSY'}",
  "cost": ${selectedLog.cost}
}`}
                      </pre>
                    </Box>
                  ) : (
                    <Box className='p-4 border-2 border-dashed rounded-lg border-slate-200 text-center'>
                      <Typography variant='caption' className='italic text-slate-400'>Luồng bị ngắt tại Downstream - Không gọi Upstream</Typography>
                    </Box>
                  )}
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DownstreamTransactions
