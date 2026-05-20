'use client'

import { useState } from 'react'
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
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'

const PhysicalSimHistoryView = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')

  const [selectedTx, setSelectedTx] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Mock activation history data for Admin (combining all agents' activities)
  const mockHistoryData = [
    {
      txId: 'ACT-771822',
      agentName: 'Đại lý Hoàng Phong',
      iccid: '8985209000000000012',
      supplier: 'Hồng Kông',
      package: 'HK-PRO10 (10GB - 30 Ngày)',
      amountCharged: 90000,
      status: 'Thành công',
      date: '19/05/2026 08:30',
      serialNumber: 'SN-HKG-00203',
      apiResponse: 'SUCCESS: SIM_PROVISIONED (API Carrier)',
      pin: '1234',
      puk: '87654323',
      channel: 'Web Portal'
    },
    {
      txId: 'ACT-554129',
      agentName: 'Đại lý VietTravel',
      iccid: '8981209000000000400',
      supplier: 'Mỹ',
      package: 'US-TRAVEL5 (5GB - 5 Ngày)',
      amountCharged: 120000,
      status: 'Thành công',
      date: '15/05/2026 10:15',
      serialNumber: 'SN-USA-00400',
      apiResponse: 'SUCCESS: PROV_OK (API Carrier)',
      pin: '1111',
      puk: '55443322',
      channel: 'Direct API'
    },
    {
      txId: 'ACT-332918',
      agentName: 'Đại lý GlobalConnect',
      iccid: '8985209000000000015',
      supplier: 'Hồng Kông',
      package: 'HK-DAILY1 (1GB - 1 Ngày)',
      amountCharged: 0,
      status: 'Thất bại',
      date: '14/05/2026 16:20',
      serialNumber: 'SN-HKG-00205',
      apiResponse: 'ERROR: PROVISIONING_TIMEOUT (Nhà mạng không phản hồi API)',
      pin: '1111',
      puk: '55443325',
      channel: 'Direct API'
    },
    {
      txId: 'ACT-112093',
      agentName: 'Đại lý SmileTelecom',
      iccid: '8981209000000000402',
      supplier: 'Mỹ',
      package: 'US-TRAVEL5 (5GB - 5 Ngày)',
      amountCharged: 120000,
      status: 'Thành công',
      date: '12/05/2026 09:40',
      serialNumber: 'SN-USA-00402',
      apiResponse: 'SUCCESS: PROV_OK (API Carrier)',
      pin: '1212',
      puk: '99887766',
      channel: 'Web Portal'
    }
  ]

  // Filter Logic
  const filteredHistory = mockHistoryData.filter(tx => {
    const matchesSearch = tx.iccid.includes(searchQuery) || 
      tx.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.agentName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSupplier = supplierFilter === 'all' || tx.supplier === supplierFilter
    const matchesAgent = agentFilter === 'all' || tx.agentName === agentFilter
    const matchesChannel = channelFilter === 'all' || tx.channel === channelFilter

    return matchesSearch && matchesSupplier && matchesAgent && matchesChannel
  })

  const getSupplierAvatar = (supplier: string) => {
    switch (supplier) {
      case 'Hồng Kông': return { bg: '#FF4D4D', char: 'H' }
      case 'Mỹ': return { bg: '#0090FF', char: 'M' }
      default: return { bg: '#7367F0', char: 'S' }
    }
  }

  // Get distinct values for filter selectors
  const distinctAgents = Array.from(new Set(mockHistoryData.map(tx => tx.agentName)))

  return (
    <>
      <PageHeader
        title="Lịch sử Kích hoạt SIM (Hệ thống)"
        description="Quản lý và giám sát toàn bộ lịch sử kích hoạt nạp gói cước vật lý của tất cả các Đại lý đối tác."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/3m/dashboard' },
          { label: 'Kho SIM Vật lý' },
          { label: 'Lịch sử Kích hoạt' }
        ]}
        className='mbe-6'
      />

      {/* Summary Widgets Row */}
      <Grid2 container spacing={4} className='mbe-6'>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-primary/5 border border-primary/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Tổng lượt kích hoạt</Typography>
                <Typography variant='h5' className='font-black text-primary'>245 lượt</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'primary.tonal', color: 'primary.main', width: 40, height: 40 }}>
                <i className='tabler-database text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-info/5 border border-info/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Kích hoạt Web Portal</Typography>
                <Typography variant='h5' className='font-black text-info'>112 lượt</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'info.tonal', color: 'info.main', width: 40, height: 40 }}>
                <i className='tabler-world text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-warning/5 border border-warning/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Kích hoạt qua API</Typography>
                <Typography variant='h5' className='font-black text-warning'>133 lượt</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'warning.tonal', color: 'warning.main', width: 40, height: 40 }}>
                <i className='tabler-code text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-success/5 border border-success/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Tổng chi ví đại lý</Typography>
                <Typography variant='h5' className='font-black text-success'>24.500.000 đ</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'success.tonal', color: 'success.main', width: 40, height: 40 }}>
                <i className='tabler-wallet text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Advanced Filters */}
      <Card className='border-none shadow-sm mbe-6'>
        <CardContent>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Tìm kiếm nhanh</Typography>
              <TextField
                fullWidth
                size='small'
                placeholder='Tìm mã GD, ICCID, tên Đại lý...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-search' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Lọc theo Đại lý</Typography>
              <Select fullWidth size='small' value={agentFilter} onChange={e => setAgentFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả đại lý</MenuItem>
                {distinctAgents.map(name => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Nhà mạng phôi</Typography>
              <Select fullWidth size='small' value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả nhà mạng</MenuItem>
                <MenuItem value='Hồng Kông'>Hồng Kông</MenuItem>
                <MenuItem value='Mỹ'>Mỹ</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Kênh kích hoạt</Typography>
              <Select fullWidth size='small' value={channelFilter} onChange={e => setChannelFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả các kênh</MenuItem>
                <MenuItem value='Web Portal'>Web Portal</MenuItem>
                <MenuItem value='Direct API'>Direct API</MenuItem>
              </Select>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card className='border-none shadow-sm overflow-hidden'>
        <TableContainer>
          <Table>
            <TableHead className='bg-slate-50'>
              <TableRow>
                <TableCell className='font-bold text-xs uppercase'>Mã giao dịch</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Đại lý kích hoạt</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Kênh kích hoạt</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Mã ICCID</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Nhà mạng</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Gói cước</TableCell>
                <TableCell className='font-bold text-xs uppercase text-right'>Phí trừ ví</TableCell>
                <TableCell className='font-bold text-xs uppercase text-center'>Trạng thái</TableCell>
                <TableCell className='font-bold text-xs uppercase text-right'>Thời gian</TableCell>
                <TableCell className='font-bold text-xs uppercase text-center'>Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((tx, idx) => {
                  const avatar = getSupplierAvatar(tx.supplier)
                  return (
                    <TableRow key={tx.txId || idx} hover>
                      <TableCell className='font-mono text-xs font-bold text-slate-600'>{tx.txId}</TableCell>
                      <TableCell className='font-black text-slate-800 text-sm'>{tx.agentName}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<i className={tx.channel === 'Web Portal' ? 'tabler-world text-sm' : 'tabler-code text-sm'} />}
                          label={tx.channel}
                          color={tx.channel === 'Web Portal' ? 'info' : 'warning'}
                          size='small'
                          variant='tonal'
                          className='font-bold text-[10px]'
                        />
                      </TableCell>
                      <TableCell className='font-mono text-xs text-slate-500'>{tx.iccid}</TableCell>
                      <TableCell>
                        <Box className='flex items-center gap-2'>
                          <Avatar 
                            variant='rounded' 
                            sx={{ 
                              backgroundColor: `${avatar.bg}15`, 
                              color: avatar.bg,
                              width: 26, 
                              height: 26,
                              fontSize: '11px',
                              fontWeight: '900'
                            }}
                          >
                            {avatar.char}
                          </Avatar>
                          <Typography variant='body2' className='font-bold' sx={{ color: avatar.bg }}>
                            {tx.supplier}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' className='font-semibold text-slate-700'>
                          {tx.package.split(' (')[0]}
                        </Typography>
                        <Typography variant='caption' color='textSecondary' className='block text-[10px]'>
                          {tx.package.includes('(') ? `(${tx.package.split(' (')[1]}` : ''}
                        </Typography>
                      </TableCell>
                      <TableCell className='text-right font-black text-slate-800'>
                        {tx.amountCharged > 0 ? `${tx.amountCharged.toLocaleString('vi-VN')} đ` : '0 đ'}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Chip 
                          label={tx.status} 
                          size='small' 
                          color={tx.status === 'Thành công' ? 'success' : 'error'} 
                          variant='tonal'
                          className='font-bold text-xs'
                        />
                      </TableCell>
                      <TableCell className='text-right'>
                        <Typography variant='caption' className='font-medium text-slate-500'>
                          {tx.date}
                        </Typography>
                      </TableCell>
                      <TableCell className='text-center'>
                        <IconButton 
                          size='small' 
                          color='primary'
                          onClick={() => {
                            setSelectedTx(tx)
                            setIsDetailOpen(true)
                          }}
                        >
                          <i className='tabler-eye text-[18px]' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align='center' sx={{ py: 6 }}>
                    <Typography color='textSecondary' variant='body2'>
                      Không tìm thấy lịch sử kích hoạt nào trùng khớp trên toàn hệ thống.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle component='div' className='flex items-center justify-between border-b p-5'>
          <Box>
            <Typography variant='h5' className='font-black'>Chi tiết Kích hoạt SIM (Hệ thống)</Typography>
            <Typography variant='caption' color='textSecondary'>Đại lý thực hiện: {selectedTx?.agentName}</Typography>
          </Box>
          <IconButton onClick={() => setIsDetailOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          {selectedTx && (
            <Stack spacing={4}>
              <Box className='p-4 bg-slate-50 rounded-xl flex justify-between items-center border'>
                <Box>
                  <Typography variant='caption' color='textSecondary' className='uppercase font-bold text-[9px] block'>Doanh thu thu về ví</Typography>
                  <Typography variant='h5' className='font-black text-success'>{selectedTx.amountCharged.toLocaleString('vi-VN')} đ</Typography>
                </Box>
                <Chip 
                  label={selectedTx.status} 
                  color={selectedTx.status === 'Thành công' ? 'success' : 'error'} 
                  variant='tonal'
                  className='font-bold'
                />
              </Box>

              <Stack spacing={2} className='border rounded-xl p-4'>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Mã giao dịch</Typography>
                  <Typography variant='body2' className='font-mono font-bold text-slate-800'>{selectedTx.txId}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Đại lý đối tác</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>{selectedTx.agentName}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Kênh kích hoạt</Typography>
                  <Chip
                    icon={<i className={selectedTx.channel === 'Web Portal' ? 'tabler-world text-xs' : 'tabler-code text-xs'} />}
                    label={selectedTx.channel}
                    color={selectedTx.channel === 'Web Portal' ? 'info' : 'warning'}
                    size='small'
                    variant='tonal'
                    className='font-bold text-[9px]'
                  />
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Nhà mạng phôi</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>{selectedTx.supplier}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Mã ICCID</Typography>
                  <Typography variant='body2' className='font-mono font-bold text-slate-800 text-xs'>{selectedTx.iccid}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Số Serial phôi</Typography>
                  <Typography variant='body2' className='font-mono font-bold text-slate-800 text-xs'>{selectedTx.serialNumber}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Mã PIN / PUK</Typography>
                  <Typography variant='body2' className='font-mono font-bold text-slate-800 text-xs'>
                    PIN: {selectedTx.pin} / PUK: {selectedTx.puk}
                  </Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Gói cước đã nạp</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>{selectedTx.package}</Typography>
                </Box>
                <Box className='flex justify-between py-1'>
                  <Typography variant='body2' className='text-slate-500'>Thời gian kích hoạt</Typography>
                  <Typography variant='body2' className='font-medium text-slate-700'>{selectedTx.date}</Typography>
                </Box>
              </Stack>

              <Box className='space-y-2'>
                <Typography variant='subtitle2' className='font-black uppercase text-[11px] text-slate-500'>Carrier API Gateway Log</Typography>
                <Box className='bg-[#1E1E1E] rounded-lg p-3 overflow-x-auto'>
                  <pre className='text-[#D4D4D4] font-mono text-xs m-0 leading-relaxed'>
                    {selectedTx.apiResponse}
                  </pre>
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='contained' color='primary' onClick={() => setIsDetailOpen(false)} fullWidth>Đóng nhật ký</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PhysicalSimHistoryView
