'use client'

import Link from 'next/link'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { toast } from 'react-toastify'

import PageHeader from '@/components/layout/shared/PageHeader'

const MyDebtList = () => {
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const currentDebt = 5240.00
  const [paymentAmount, setPaymentAmount] = useState(currentDebt.toLocaleString('en-US', { minimumFractionDigits: 2 }))
  const [depositorName, setDepositorName] = useState('Asia Travel Hub')
  const [depositorBank, setDepositorBank] = useState('')
  const [transferReference, setTransferReference] = useState('')
  const [paymentNote, setPaymentNote] = useState('')
  const [paymentProofNames, setPaymentProofNames] = useState<string[]>([])
  const creditLimit = 50000.00
  const usageRatio = (currentDebt / creditLimit) * 100

  const statements = [
    { month: '04/2026', opening: 1000.00, purchases: 4240.00, payments: 0, closing: 5240.00, status: 'Chưa chốt', dueDate: '15/05/2026' },
    { month: '03/2026', opening: 0.00, purchases: 3500.00, payments: 2500.00, closing: 1000.00, status: 'Nợ tồn đọng', dueDate: '15/04/2026' },
    { month: '02/2026', opening: 500.00, purchases: 2000.00, payments: 2500.00, closing: 0.00, status: 'Đã thanh toán', dueDate: '15/03/2026' },
    { month: '01/2026', opening: 0.00, purchases: 1500.00, payments: 1000.00, closing: 500.00, status: 'Đã thanh toán', dueDate: '15/02/2026' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã thanh toán': return 'success'
      case 'Chưa chốt': return 'warning'
      case 'Nợ tồn đọng': return 'error'
      default: return 'default'
    }
  }

  const handlePaymentSubmit = () => {
    toast.success('Yêu cầu thanh toán công nợ đã được gửi. Kế toán sẽ kiểm tra chứng từ và cập nhật công nợ!')
    setOpenPaymentDialog(false)
  }

  const handleOpenPayment = (amount: number) => {
    setPaymentAmount(amount.toLocaleString('en-US', { minimumFractionDigits: 2 }))
    setOpenPaymentDialog(true)
  }

  const handlePaymentAmountChange = (value: string) => {
    const normalizedValue = value.replace(/[^\d.]/g, '')
    const [integerPart, decimalPart] = normalizedValue.split('.')
    const formattedInteger = Number(integerPart || 0).toLocaleString('en-US')
    const formattedValue = decimalPart === undefined ? formattedInteger : `${formattedInteger}.${decimalPart.slice(0, 2)}`

    setPaymentAmount(formattedValue)
  }

  const handlePaymentFileChange = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      setPaymentProofNames([])

      return
    }

    setPaymentProofNames(Array.from(fileList).map(file => file.name))
  }

  return (
    <>
      <PageHeader
        title="Công nợ của tôi (My Debt)"
        description="Kiểm tra hạn mức tín dụng, theo dõi sao kê hàng tháng và thanh toán công nợ đúng hạn để duy trì kết nối dịch vụ."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' }, 
          { label: 'Kênh Đại lý' }, 
          { label: 'Công nợ của tôi' }
        ]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-cash-banknote' />} onClick={() => handleOpenPayment(currentDebt)}>
            Thanh toán công nợ
          </Button>
        }
        className='mbe-6'
      />


      <Card className='border-none shadow-sm'>
        <Box className='p-6 border-be flex justify-between items-center'>
          <Typography variant='h6' className='font-black'>Sao kê hàng tháng (Monthly Statements)</Typography>
          <Stack direction='row' spacing={4}>
            <TextField 
              select
              size='small'
              defaultValue='2026'
              label='Năm'
              className='min-is-[100px]'
            >
              <MenuItem value='2026'>2026</MenuItem>
              <MenuItem value='2025'>2025</MenuItem>
              <MenuItem value='2024'>2024</MenuItem>
            </TextField>
            <TextField 
              size='small'
              placeholder='Tìm kiếm kỳ...' 
              InputProps={{
                startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment>
              }}
            />
          </Stack>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className='font-black uppercase text-[11px]'>Kỳ Sao kê</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Nợ Đầu Kỳ</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Đơn hàng (Phát sinh)</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Đã Thanh Toán</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right bg-error/5 text-error'>Nợ Cuối Kỳ</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Hạn Thanh Toán</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-center'>Trạng thái</TableCell>
                <TableCell className='font-black uppercase text-[11px] text-right'>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statements.map((stmt) => (
                <TableRow key={stmt.month} hover>
                  <TableCell>
                    <Typography variant='body2' className='font-black'>Tháng {stmt.month}</Typography>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='body2' className='text-slate-500'>
                      {stmt.opening.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </Typography>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='body2' className='font-bold text-error'>
                      +{stmt.purchases.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </Typography>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Typography variant='body2' className='font-bold text-success'>
                      -{stmt.payments.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </Typography>
                  </TableCell>
                  <TableCell className='text-right bg-error/5'>
                    <Typography variant='subtitle2' className='font-black text-error'>
                      {stmt.closing.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </Typography>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Typography variant='body2' className='text-slate-500 font-bold'>{stmt.dueDate}</Typography>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Chip label={stmt.status} color={getStatusColor(stmt.status) as any} size='small' variant='tonal' className='font-bold' />
                  </TableCell>
                  <TableCell className='text-right'>
                    <Stack direction='row' spacing={1} justifyContent='flex-end'>
                      <Button size='small' variant='outlined' color='secondary' startIcon={<i className='tabler-file-download' />}>Tải Invoice</Button>
                      {stmt.closing > 0 && (
                        <Button size='small' variant='contained' color='primary' onClick={() => handleOpenPayment(stmt.closing)}>
                          Thanh toán
                        </Button>
                      )}
                      <Button component={Link} href='/agent/finance/transactions' size='small' variant='tonal' color='primary'>Lịch sử Giao dịch</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth='sm' fullWidth>
        <DialogTitle className='font-black'>Thanh toán công nợ</DialogTitle>
        <DialogContent className='flex flex-col gap-4 p-6 pt-2'>
          <Typography variant='body2' className='text-slate-500 mbe-2'>
            Nhập thông tin nộp tiền và đính kèm ảnh chứng từ để kế toán đối soát công nợ.
          </Typography>

          <TextField
            fullWidth
            label='Số tiền thanh toán'
            value={paymentAmount}
            onChange={event => handlePaymentAmountChange(event.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position='start'>$</InputAdornment>
            }}
          />

          <Box>
            <Typography variant='subtitle2' className='font-black mbe-2'>
              Thông tin nộp tiền
            </Typography>
            <Stack spacing={4}>
              <TextField
                fullWidth
                label='Người nộp / Tên đại lý'
                value={depositorName}
                onChange={event => setDepositorName(event.target.value)}
              />
              <TextField
                fullWidth
                label='Ngân hàng / Tài khoản chuyển'
                placeholder='VD: VCB - 0987654321'
                value={depositorBank}
                onChange={event => setDepositorBank(event.target.value)}
              />
              <TextField
                fullWidth
                label='Mã giao dịch / Nội dung chuyển khoản'
                placeholder='VD: TTCD-ASIA-08052026'
                value={transferReference}
                onChange={event => setTransferReference(event.target.value)}
              />
              <TextField
                fullWidth
                multiline
                minRows={3}
                label='Ghi chú'
                placeholder='Thông tin bổ sung cho kế toán'
                value={paymentNote}
                onChange={event => setPaymentNote(event.target.value)}
              />
            </Stack>
          </Box>

          <Box className='rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4'>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent='space-between'>
              <Box className='min-w-0'>
                <Typography variant='subtitle2' className='font-black'>
                  Ảnh chứng từ
                </Typography>
                {paymentProofNames.length === 0 ? (
                  <Typography variant='caption' className='text-slate-500'>
                    Chưa chọn file ảnh
                  </Typography>
                ) : (
                  <>
                    <Typography variant='caption' className='text-slate-500 block'>
                      Đã chọn {paymentProofNames.length} file
                    </Typography>
                    <Typography variant='caption' className='text-slate-500 block truncate'>
                      {paymentProofNames.join(', ')}
                    </Typography>
                  </>
                )}
              </Box>
              <Button component='label' variant='outlined' startIcon={<i className='tabler-paperclip' />}>
                Đính kèm ảnh
                <input
                  hidden
                  multiple
                  type='file'
                  accept='image/*'
                  onChange={event => handlePaymentFileChange(event.target.files)}
                />
              </Button>
            </Stack>
          </Box>
          
          <Box className='p-6 bg-primary/5 rounded-lg border border-primary/20 mt-2'>
            <Typography variant='subtitle2' className='font-black text-primary mbe-2 text-lg'>Thông tin chuyển khoản:</Typography>
            <Typography variant='body1' className='text-slate-700 mbe-1'>Ngân hàng: <strong>Vietcombank (VCB)</strong></Typography>
            <Typography variant='body1' className='text-slate-700 mbe-1'>Số tài khoản: <strong>0123456789</strong></Typography>
            <Typography variant='body1' className='text-slate-700 mbe-1'>Chủ tài khoản: <strong>CONG TY TNHH ESIM MARKET</strong></Typography>
            <Typography variant='body1' className='text-slate-700 mt-4 p-3 bg-white/50 rounded border border-dashed border-primary/30'>
              Nội dung chuyển khoản: <strong className='text-primary'>THANH TOAN CONG NO [TÊN ĐẠI LÝ]</strong>
            </Typography>
            <Typography variant='caption' className='text-slate-500 mt-4 block italic'>
              * Sau khi chuyển khoản thành công, vui lòng chờ 15-30 phút để quản trị viên phê duyệt.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='outlined' color='secondary' onClick={() => setOpenPaymentDialog(false)}>
            Hủy
          </Button>
          <Button variant='contained' color='primary' onClick={handlePaymentSubmit} startIcon={<i className='tabler-send' />}>
            Gửi yêu cầu thanh toán
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default MyDebtList
