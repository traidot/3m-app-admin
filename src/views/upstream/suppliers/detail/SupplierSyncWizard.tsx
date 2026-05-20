'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Grid2 from '@mui/material/Grid2'
import Avatar from '@mui/material/Avatar'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'

import PageHeader from '@/components/layout/shared/PageHeader'

const SupplierSyncWizard = () => {
  const { id } = useParams()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)
  
  const supplierName = id === 'airalo' ? 'Airalo Global' : 'Nomad Global'
  const steps = ['Tải lên Báo giá (Excel)', 'Đồng bộ API NCC', 'Kiểm định & Phê duyệt']

  // Mock dữ liệu kiểm định cho Bước 3
  const [validationResults, setValidationResults] = useState([
    { id: 'Z-01', name: 'Japan 10GB', cost: 8.50, status: 'Valid', type: 'Update' },
    { id: 'Z-02', name: 'USA 5GB', cost: 12.00, status: 'Valid', type: 'New' },
    { id: 'Z-03', name: 'UK 1GB', cost: 0.00, status: 'Error', type: 'Invalid' },
    { id: 'Z-04', name: 'Global Pro', cost: 45.00, status: 'Warning', type: 'Check' },
  ])

  const handleUploadFile = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setFileUploaded(true)
      setActiveStep(1)
    }, 1500)
  }

  const handleSyncAPI = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setActiveStep(2)
    }, 2000)
  }

  const handleCommitToDB = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setActiveStep(3) // Thành công
    }, 1500)
  }

  return (
    <>
      <PageHeader
        title={`Quy trình Đồng bộ: ${supplierName}`}
        description="Thực hiện theo trình tự: Upload file -> Sync API -> Kiểm định dữ liệu"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Nhà cung cấp', href: '/3m/upstream/suppliers' },
          { label: supplierName, href: `/3m/upstream/suppliers/${id}/packages` },
          { label: 'Luồng Đồng bộ' }
        ]}
        className='mbe-6'
      />

      <Card className='border-none shadow-sm mbe-6'>
        <CardContent className='p-10'>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Grid2 container spacing={6}>
        {/* BƯỚC 1: UPLOAD FILE */}
        {activeStep === 0 && (
          <Grid2 size={{ xs: 12 }}>
            <Card className='border-none shadow-sm'>
              <CardContent className='p-20 text-center flex flex-col items-center'>
                <Avatar variant='rounded' className='w-20 h-20 bg-primary/10 text-primary mbe-6'>
                  <i className='tabler-file-spreadsheet text-5xl' />
                </Avatar>
                <Typography variant='h4' className='font-black mbe-2'>Bước 1: Tải lên Báo giá Excel</Typography>
                <Typography variant='body1' className='text-slate-500 mbe-8 max-is-[600px] mx-auto'>
                  Vui lòng tải lên file báo giá mới nhất để làm cơ sở đối soát giá vốn cho các gói eSIM từ API.
                </Typography>
                <Box 
                  className='p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer mbe-8 w-full max-is-[600px]'
                  onClick={handleUploadFile}
                >
                  <Typography variant='h6' className='font-black text-slate-400'>Click hoặc kéo thả file .xlsx vào đây</Typography>
                </Box>
                <Button variant='tonal' color='secondary'>Tải file mẫu</Button>
              </CardContent>
            </Card>
          </Grid2>
        )}

        {/* BƯỚC 2: SYNC API */}
        {activeStep === 1 && (
          <Grid2 size={{ xs: 12 }}>
            <Card className='border-none shadow-sm'>
              <CardContent className='p-20 text-center flex flex-col items-center'>
                <Avatar variant='rounded' className='w-20 h-20 bg-info/10 text-info mbe-6'>
                  <i className='tabler-api text-5xl' />
                </Avatar>
                <Typography variant='h4' className='font-black mbe-2'>Bước 2: Đồng bộ từ API {supplierName}</Typography>
                <Typography variant='body1' className='text-slate-500 mbe-8 max-is-[600px] mx-auto'>
                  Đã nhận diện file báo giá. Bây giờ, hệ thống sẽ gọi API để lấy danh sách eSIM thực tế và đối chiếu giá.
                </Typography>
                <Button 
                  variant='contained' 
                  size='large' 
                  className='px-12'
                  startIcon={<i className='tabler-refresh' />}
                  onClick={handleSyncAPI}
                >
                  Bắt đầu Đồng bộ API ngay
                </Button>
              </CardContent>
            </Card>
          </Grid2>
        )}

        {/* BƯỚC 3: KIỂM ĐỊNH & PHÊ DUYỆT */}
        {activeStep === 2 && (
          <Grid2 size={{ xs: 12 }}>
            <Stack spacing={6}>
              <Alert severity="warning" variant='standard'>
                <AlertTitle className='font-black text-lg'>Phát hiện gói cước cần xử lý!</AlertTitle>
                Dữ liệu từ API và File đã được gộp lại. Vui lòng kiểm tra các dòng màu đỏ/vàng trước khi duyệt.
              </Alert>

              <Card className='border-none shadow-sm overflow-hidden'>
                <Box className='p-6 bg-slate-900 text-white flex justify-between items-center'>
                  <Box>
                    <Typography variant='h6' className='text-white font-black'>Bảng Kiểm Định & So Sánh Giá</Typography>
                    <Typography variant='caption' className='text-slate-400 font-bold'>Dữ liệu chuẩn hóa dựa trên File & API mới nhất</Typography>
                  </Box>
                  <Stack direction='row' spacing={3}>
                    <Button 
                      variant='contained' 
                      className='bg-success text-white hover:bg-success/90 font-black px-8'
                      startIcon={<i className='tabler-check' />}
                      onClick={handleCommitToDB}
                    >
                      Phê duyệt & Nhập kho (DB)
                    </Button>
                  </Stack>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead className='bg-slate-50'>
                      <TableRow>
                        <TableCell className='font-black uppercase text-[11px]'>Mã gói</TableCell>
                        <TableCell className='font-black uppercase text-[11px]'>Tên eSIM</TableCell>
                        <TableCell className='font-black uppercase text-[11px] text-right'>Giá Vốn (Cost)</TableCell>
                        <TableCell className='font-black uppercase text-[11px] text-center'>Kiểm định</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {validationResults.map((res) => (
                        <TableRow key={res.id} hover>
                          <TableCell className='font-mono text-xs'>{res.id}</TableCell>
                          <TableCell className='font-bold'>{res.name}</TableCell>
                          <TableCell className='text-right font-black text-primary'>${res.cost.toFixed(2)}</TableCell>
                          <TableCell className='text-center'>
                            <Chip 
                              label={res.status} 
                              size='small' 
                              color={res.status === 'Valid' ? 'success' : res.status === 'Error' ? 'error' : 'warning'} 
                              variant='tonal'
                              className='font-black'
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Stack>
          </Grid2>
        )}

        {/* BƯỚC THÀNH CÔNG */}
        {activeStep === 3 && (
          <Grid2 size={{ xs: 12 }}>
            <Card className='border-none shadow-sm text-center p-20'>
              <Avatar className='mx-auto w-24 h-24 bg-success/10 text-success mbe-8'>
                <i className='tabler-shield-check text-6xl' />
              </Avatar>
              <Typography variant='h2' className='font-black mbe-2 text-success'>Phê duyệt Hoàn tất!</Typography>
              <Typography variant='h6' className='text-slate-500 mbe-10'>
                Báo giá mới đã được niêm yết lên sàn eSIM Market.
              </Typography>
              <Button 
                variant='contained' 
                size='large' 
                className='px-12'
                onClick={() => router.push(`/3m/upstream/suppliers/${id}/packages`)}
              >
                Về màn hình Quản lý
              </Button>
            </Card>
          </Grid2>
        )}

        {/* BẢNG LỊCH SỬ ĐỒNG BỘ (LUÔN HIỂN THỊ Ở DƯỚI) */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='border-none shadow-sm overflow-hidden'>
            <Box className='p-5 border-be bg-slate-50 flex items-center gap-2'>
              <i className='tabler-history text-xl text-slate-600' />
              <Typography variant='h6' className='font-black'>Lịch sử Nhật ký Hệ thống</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className='font-black uppercase text-[11px]'>Ngày thực hiện</TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>Loại thao tác</TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>Nội dung / Nguồn</TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>Trạng thái</TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>Người thực hiện</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { date: '28/04/2026 00:15', type: 'Đồng bộ Full', source: 'Excel + API Airalo', status: 'Success', user: 'David Admin' },
                    { date: '27/04/2026 14:20', type: 'Cập nhật File', source: 'PriceList_Q2.xlsx', status: 'Success', user: 'David Admin' },
                  ].map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell className='font-bold text-slate-600'>{row.date}</TableCell>
                      <TableCell><Chip label={row.type} size='small' variant='tonal' color='info' className='font-black'/></TableCell>
                      <TableCell><Typography variant='body2' className='font-mono text-xs'>{row.source}</Typography></TableCell>
                      <TableCell>
                        <Box className='flex items-center gap-1'>
                          <Box className='w-2 h-2 rounded-full bg-success' />
                          <Typography variant='caption' className='font-bold'>{row.status}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box className='flex items-center gap-2'>
                          <Avatar sx={{ width: 24, height: 24 }} className='text-[10px] bg-slate-200'>DA</Avatar>
                          <Typography variant='caption' className='font-bold'>{row.user}</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid2>
      </Grid2>

      {/* Overlay xử lý */}
      <Dialog open={isProcessing}>
        <DialogContent className='p-10 flex flex-col items-center gap-4'>
          <CircularProgress size={60} thickness={4} />
          <Typography variant='h6' className='font-black'>Đang chuẩn hóa dữ liệu...</Typography>
          <Typography variant='caption' className='text-slate-500'>Vui lòng đợi trong giây lát</Typography>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SupplierSyncWizard
