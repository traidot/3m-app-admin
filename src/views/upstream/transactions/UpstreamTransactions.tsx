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

import PageHeader from '@/components/layout/shared/PageHeader'

const UpstreamTransactions = () => {
  const [isLogOpen, setIsLogOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [isEsimOpen, setIsEsimOpen] = useState(false)
  const [selectedEsim, setSelectedEsim] = useState<any>(null)

  // Filter States
  const [supplier, setSupplier] = useState('all')
  const [region, setRegion] = useState('all')
  const [status, setStatus] = useState('all')
  const [simType, setSimType] = useState('all')
  const [dataLimit, setDataLimit] = useState('all')
  const [validity, setValidity] = useState('all')

  const transactions = [
    { 
      id: 'TX-9821', 
      supplier: 'Airalo', 
      action: 'Mua', 
      package: { name: 'Japan Premium', data: '10GB', validity: '30 Ngày' }, 
      amount: '$8.50', 
      status: 'Thành công', 
      date: '28/04/2026 01:15',
      esimInfo: {
        iccid: '8984400000000000001',
        qrCode: 'LPA:1$smdp.plus$AIRALO-JAPAN-001',
        server: 'smdp.plus',
        matchingKey: 'AIRALO-JAPAN-001'
      }
    },
    { id: 'TX-9820', supplier: 'Nomad', action: 'Mua', package: { name: 'USA Fast Connection', data: '20GB', validity: '30 Ngày' }, amount: '$22.00', status: 'Thành công', date: '28/04/2026 00:45' },
    { id: 'TX-9819', supplier: 'Airalo', action: 'Mua', package: { name: 'USA Traveler', data: '5GB', validity: '15 Ngày' }, amount: '$12.00', status: 'Thất bại', date: '27/04/2026 23:30' },
    { id: 'TX-9818', supplier: 'KeepGo', action: 'Huỷ', package: { name: 'Global Roaming', data: '1GB', validity: '1 Ngày' }, amount: '$0.00', status: 'Thành công', date: '27/04/2026 22:10' },
    { 
      id: 'TX-9817', 
      supplier: 'Nomad', 
      action: 'Mua', 
      package: { name: 'UK Business Pro', data: '50GB', validity: '90 Ngày' }, 
      amount: '$45.00', 
      status: 'Thành công', 
      date: '27/04/2026 21:55',
      esimInfo: {
        iccid: '8984400000000000002',
        qrCode: 'LPA:1$rsp.truphone.com$NOMAD-UK-PRO',
        server: 'rsp.truphone.com',
        matchingKey: 'NOMAD-UK-PRO'
      }
    },
  ]

  return (
    <>
      <PageHeader
        title="Lịch sử giao dịch Upstream"
        description="Nhật ký chi tiết các lệnh gọi API, mua hàng và biến động số dư với Nhà cung cấp"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Nguồn cung' }, { label: 'Lịch sử giao dịch' }]}
        actions={
          <Button variant='contained' color='success' size='small' startIcon={<i className='tabler-file-download' />}>
            Xuất Excel
          </Button>
        }
        className='mbe-6'
      />

      <Card className='border-none shadow-sm mbe-6'>
        <CardContent>
          <Grid2 container spacing={4}>
            {/* Row 1 */}
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Nhà cung cấp</Typography>
              <Select fullWidth size='small' value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                <MenuItem value='all'>Tất cả NCC</MenuItem>
                <MenuItem value='airalo'>Airalo Global</MenuItem>
                <MenuItem value='nomad'>Nomad Global</MenuItem>
                <MenuItem value='keepgo'>KeepGo</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Vùng / Quốc gia</Typography>
              <Select fullWidth size='small' value={region} onChange={(e) => setRegion(e.target.value)}>
                <MenuItem value='all'>Toàn cầu</MenuItem>
                <MenuItem value='asia'>Châu Á</MenuItem>
                <MenuItem value='europe'>Châu Âu</MenuItem>
                <MenuItem value='america'>Châu Mỹ</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Khoảng thời gian (From - To)</Typography>
              <Stack direction='row' spacing={2}>
                <TextField fullWidth size='small' type='date' defaultValue='2026-04-01' />
                <TextField fullWidth size='small' type='date' defaultValue='2026-04-28' />
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 2 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Trạng thái</Typography>
              <Select fullWidth size='small' value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                <MenuItem value='success'>Thành công (Success)</MenuItem>
                <MenuItem value='failed'>Thất bại (Failed)</MenuItem>
              </Select>
            </Grid2>

            {/* Row 2 - New Filters */}
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Loại eSIM</Typography>
              <Select fullWidth size='small' value={simType} onChange={(e) => setSimType(e.target.value)}>
                <MenuItem value='all'>Tất cả loại</MenuItem>
                <MenuItem value='Daily'>Daily (Theo ngày)</MenuItem>
                <MenuItem value='Total'>Total (Tổng dung lượng)</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Dung lượng</Typography>
              <Select fullWidth size='small' value={dataLimit} onChange={(e) => setDataLimit(e.target.value)}>
                <MenuItem value='all'>Tất cả dung lượng</MenuItem>
                <MenuItem value='1GB'>1GB</MenuItem>
                <MenuItem value='5GB'>5GB</MenuItem>
                <MenuItem value='10GB'>10GB</MenuItem>
                <MenuItem value='Unlimited'>Không giới hạn</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Thời hạn (Ngày)</Typography>
              <Select fullWidth size='small' value={validity} onChange={(e) => setValidity(e.target.value)}>
                <MenuItem value='all'>Tất cả thời hạn</MenuItem>
                <MenuItem value='1 Ngày'>1 Ngày</MenuItem>
                <MenuItem value='7 Ngày'>7 Ngày</MenuItem>
                <MenuItem value='30 Ngày'>30 Ngày</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 opacity-0 uppercase text-[11px] hidden md:block'>Tìm kiếm</Typography>
              <Button variant='contained' color='primary' fullWidth className='min-bs-[38px]' startIcon={<i className='tabler-search' />}>
                Lọc kết quả
              </Button>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      <Card className='border-none shadow-sm overflow-hidden'>
        <Box className='p-5 border-be bg-slate-50/50 flex justify-between items-center gap-4 flex-wrap'>
          <Stack direction='row' spacing={4}>
            <Box>
              <Typography variant='caption' className='font-black uppercase text-slate-400'>Tổng chi (Tháng này)</Typography>
              <Typography variant='h5' className='font-black text-primary'>$2,450.80</Typography>
            </Box>
            <Box className='border-is ps-4'>
              <Typography variant='caption' className='font-black uppercase text-slate-400'>Số lệnh thất bại</Typography>
              <Typography variant='h5' className='font-black text-error'>12</Typography>
            </Box>
          </Stack>
          <TextField 
            size='small' 
            placeholder='Tìm theo mã giao dịch...' 
            className='min-is-[300px] bg-white'
            InputProps={{
              startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
            }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead className='bg-slate-50'>
              <TableRow>
                <TableCell className='font-black uppercase text-[11px]'>Mã GD</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Nhà cung cấp</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Hành động</TableCell>
                <TableCell className='font-black uppercase text-[11px]'>Sản phẩm / Chi tiết</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Số tiền</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Trạng thái</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Thời gian</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Log / eSIM</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => {
                const supplierColor = tx.supplier === 'Airalo' ? '#7367F0' : tx.supplier === 'Nomad' ? '#00BAD1' : '#EA5455';

                return (
                <TableRow key={tx.id} hover>
                  <TableCell className='font-mono text-xs font-bold text-slate-600'>{tx.id}</TableCell>
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
                      <Typography variant='body2' className='font-bold' sx={{ color: supplierColor }}>{tx.supplier}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' className='font-black'>{tx.action}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant='body2' className='font-black text-slate-700'>{tx.package.name}</Typography>
                      <Box className='flex items-center gap-1 mbs-0.5'>
                        <Chip label={tx.package.data} size='small' variant='tonal' color='info' sx={{ height: 16, fontSize: '9px', fontWeight: 'bold' }} />
                        <Chip label={tx.package.validity} size='small' variant='tonal' color='secondary' sx={{ height: 16, fontSize: '9px', fontWeight: 'bold' }} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell className='text-right font-black text-primary'>
                    {tx.amount}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Chip 
                      label={tx.status} 
                      size='small' 
                      color={tx.status === 'Thành công' ? 'success' : 'error'} 
                      variant='tonal'
                      className='font-black'
                    />
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='caption' className='font-bold text-slate-500'>{tx.date}</Typography>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Stack direction='row' spacing={1} justifyContent='center'>
                      <IconButton size='small' onClick={() => { setSelectedLog(tx); setIsLogOpen(true); }}>
                        <i className='tabler-code text-[18px]' />
                      </IconButton>
                      {tx.esimInfo && (
                        <IconButton size='small' color='primary' onClick={() => { setSelectedEsim(tx); setIsEsimOpen(true); }}>
                          <i className='tabler-qrcode text-[18px]' />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Log Dialog */}
      <Dialog 
        open={isLogOpen} 
        onClose={() => setIsLogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle component='div' className='flex items-center justify-between'>
          <Typography variant='h5' component='span' className='font-black'>API Request/Response Log</Typography>
          <IconButton onClick={() => setIsLogOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box className='flex flex-col gap-4 m-bs-2'>
              <Box className='flex justify-between items-center bg-slate-50 p-4 rounded-lg'>
                <Box>
                  <Typography variant='caption' className='text-slate-500'>Mã giao dịch</Typography>
                  <Typography variant='body1' className='font-mono font-bold'>{selectedLog.id}</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' className='text-slate-500'>Trạng thái</Typography>
                  <Box>
                    <Chip 
                      label={selectedLog.status} 
                      size='small' 
                      color={selectedLog.status === 'Thành công' ? 'success' : 'error'} 
                      variant='tonal'
                      className='font-black'
                    />
                  </Box>
                </Box>
              </Box>

              <Typography variant='subtitle2' className='font-black uppercase text-slate-500 mt-2'>Request Payload</Typography>
              <Box className='bg-[#1E1E1E] rounded-lg p-4 overflow-x-auto'>
                <pre className='text-[#D4D4D4] font-mono text-xs m-0'>
{`POST /v2/orders
Host: api.${selectedLog.supplier.toLowerCase()}.com
Content-Type: application/json
Authorization: Bearer ***

{
  "package_id": "${selectedLog.package.name}",
  "quantity": 1,
  "reference_id": "${selectedLog.id}"
}`}
                </pre>
              </Box>

              <Typography variant='subtitle2' className='font-black uppercase text-slate-500 mt-2'>Response Body</Typography>
              <Box className='bg-[#1E1E1E] rounded-lg p-4 overflow-x-auto'>
                <pre className='text-[#D4D4D4] font-mono text-xs m-0'>
{selectedLog.status === 'Thành công' ? `{
  "data": {
    "order_id": "ORD-${Math.floor(Math.random() * 10000)}",
    "status": "completed",
    "iccid": "${selectedLog.esimInfo?.iccid || '8984400000000000000'}",
    "amount": "${selectedLog.amount}"
  },
  "meta": {
    "message": "Success"
  }
}` : `{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "The wallet balance is not enough to process this order."
  }
}`}
                </pre>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='contained' color='primary' onClick={() => setIsLogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* eSIM Details Dialog */}
      <Dialog 
        open={isEsimOpen} 
        onClose={() => setIsEsimOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle component='div' className='flex items-center justify-between border-b p-5'>
          <Box>
            <Typography variant='h5' className='font-black'>Chi tiết eSIM Upstream</Typography>
            <Typography variant='caption' color='textSecondary'>Cung cấp bởi {selectedEsim?.supplier}</Typography>
          </Box>
          <IconButton onClick={() => setIsEsimOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          {selectedEsim?.esimInfo && (
            <Box className='flex flex-col items-center gap-6'>
              {/* QR Code Placeholder */}
              <Box 
                className='w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:border-primary transition-colors cursor-pointer'
                onClick={() => {}}
              >
                <i className='tabler-qrcode text-slate-300 text-6xl group-hover:text-primary transition-colors' />
                <Box className='absolute bottom-2 left-0 right-0 text-center'>
                  <Typography variant='caption' className='text-[8px] font-mono text-slate-400'>{selectedEsim.esimInfo.qrCode}</Typography>
                </Box>
              </Box>

              <Box className='w-full space-y-4'>
                <Box className='p-4 bg-slate-50 rounded-xl border border-slate-100'>
                  <Typography variant='caption' className='font-black uppercase text-slate-400 block mbe-1'>Mã ICCID</Typography>
                  <Box className='flex items-center justify-between'>
                    <Typography variant='body1' className='font-mono font-black text-primary'>{selectedEsim.esimInfo.iccid}</Typography>
                    <IconButton size='small'><i className='tabler-copy text-sm' /></IconButton>
                  </Box>
                </Box>

                <Grid2 container spacing={4}>
                  <Grid2 size={{ xs: 6 }}>
                    <Box className='p-3 bg-slate-50 rounded-lg border border-slate-100'>
                      <Typography variant='caption' className='font-black uppercase text-slate-400 block mbe-1'>SM-DP+ Address</Typography>
                      <Typography variant='body2' className='font-mono font-bold truncate'>{selectedEsim.esimInfo.server}</Typography>
                    </Box>
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Box className='p-3 bg-slate-50 rounded-lg border border-slate-100'>
                      <Typography variant='caption' className='font-black uppercase text-slate-400 block mbe-1'>Matching Key</Typography>
                      <Typography variant='body2' className='font-mono font-bold truncate'>{selectedEsim.esimInfo.matchingKey}</Typography>
                    </Box>
                  </Grid2>
                </Grid2>

                <Box>
                  <Typography variant='subtitle2' className='font-black mbe-2'>Hướng dẫn kích hoạt</Typography>
                  <Stack spacing={2}>
                    <Box className='flex gap-3'>
                      <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: 'primary.main' }}>1</Avatar>
                      <Typography variant='body2'>Vào <b>Cài đặt {'>'} Di động {'>'} Thêm eSIM</b></Typography>
                    </Box>
                    <Box className='flex gap-3'>
                      <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: 'primary.main' }}>2</Avatar>
                      <Typography variant='body2'>Quét mã QR ở trên hoặc nhập thủ công SM-DP+ và Matching Key</Typography>
                    </Box>
                    <Box className='flex gap-3'>
                      <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: 'primary.main' }}>3</Avatar>
                      <Typography variant='body2'>Đợi hệ thống kích hoạt (khoảng 30-60 giây)</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='tonal' color='secondary' onClick={() => setIsEsimOpen(false)}>Đóng</Button>
          <Button variant='contained' color='success' startIcon={<i className='tabler-file-spreadsheet' />}>Xuất Excel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UpstreamTransactions
