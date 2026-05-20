'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid2 from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'

const PhysicalSimImportView = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [supplier, setSupplier] = useState('Hồng Kông')
  
  // File upload states
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewData, setPreviewData] = useState<any[]>([])

  // API sync states
  const [apiSupplier, setApiSupplier] = useState('Hồng Kông Gateway API')
  const [startIccid, setStartIccid] = useState('')
  const [endIccid, setEndIccid] = useState('')
  const [quantity, setQuantity] = useState(100)
  const [isSyncing, setIsSyncing] = useState(false)

  // Simulation handlers
  const handleFileDrop = (e: any) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadedFile({ name: 'Lo_SIM_HongKong_May2026.xlsx', size: '24.5 KB' })
          
          // Generate mock preview data
          setPreviewData([
            { iccid: '8985209000000000010', serial: 'SN-HKG-00201', pin: '1234', puk: '87654321' },
            { iccid: '8985209000000000011', serial: 'SN-HKG-00202', pin: '1234', puk: '87654322' },
            { iccid: '8985209000000000012', serial: 'SN-HKG-00203', pin: '1234', puk: '87654323' },
            { iccid: '8985209000000000013', serial: 'SN-HKG-00204', pin: '1234', puk: '87654324' },
            { iccid: '8985209000000000014', serial: 'SN-HKG-00205', pin: '1234', puk: '87654325' }
          ])
          return 100
        }
        return prev + 25
      })
    }, 200)
  }

  const handleConfirmImport = () => {
    alert(`Đã nhập kho thành công lô SIM trắng từ file với ${previewData.length + 95} phôi SIM!`)
    setUploadedFile(null)
    setPreviewData([])
  }

  const handleApiSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      alert(`Đồng bộ thành công ${quantity} phôi SIM trắng ${apiSupplier} từ dải ${startIccid || '8985209000000000000'}!`)
      setStartIccid('')
      setEndIccid('')
    }, 2000)
  }

  return (
    <>
      <PageHeader
        title="Nhập kho Phôi SIM"
        description="Đăng ký dải số phôi SIM vật lý mới vào hệ thống 3M Admin."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/3m/dashboard' },
          { label: 'Kho SIM Vật lý', href: '/3m/physical-sim/inventory' },
          { label: 'Nhập kho Phôi SIM' }
        ]}
        actions={
          <Button 
            component={Link} 
            href='/3m/physical-sim/inventory'
            variant='tonal' 
            color='secondary' 
            startIcon={<i className='tabler-arrow-left' />}
            size='small'
          >
            Quay lại Kho
          </Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Left Side: Forms */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='p-6'>
              {/* File Upload Form */}
              <Stack spacing={6}>
                <Grid2 container spacing={4}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Nhà cung cấp phôi</Typography>
                    <Select fullWidth size='small' value={supplier} onChange={e => setSupplier(e.target.value)}>
                      <MenuItem value='Hồng Kông'>Hồng Kông (HK Telecom)</MenuItem>
                      <MenuItem value='Mỹ'>Mỹ (US Carrier Partner)</MenuItem>
                    </Select>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Ghi chú lô nhập</Typography>
                    <TextField fullWidth size='small' placeholder='VD: Lô phôi SIM đợt hè 2026' />
                  </Grid2>
                </Grid2>

                {/* Dropzone area */}
                <Box 
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => {
                    // Trigger mock file upload
                    handleFileDrop({ preventDefault: () => {} })
                  }}
                  sx={{
                    border: '2px dashed',
                    borderColor: uploadedFile ? 'success.main' : 'divider',
                    borderRadius: 2,
                    p: 8,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: 'slate-50/50',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(115, 103, 240, 0.02)'
                    }
                  }}
                >
                  <i className={`tabler-cloud-upload text-5xl mb-2 ${uploadedFile ? 'text-success' : 'text-slate-400'}`} />
                  {uploadedFile ? (
                    <Box>
                      <Typography variant='h6' className='font-bold text-success'>{uploadedFile.name}</Typography>
                      <Typography variant='caption' color='textSecondary'>{uploadedFile.size} - Tải lên thành công</Typography>
                    </Box>
                  ) : isUploading ? (
                    <Box sx={{ width: '100%', maxW: 300, mx: 'auto' }}>
                      <Typography variant='body2' className='mbe-2 font-bold'>Đang xử lý file...</Typography>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant='h6' className='font-bold text-slate-700'>Kéo thả file hoặc Click để tải lên</Typography>
                      <Typography variant='caption' color='textSecondary' className='block mt-1'>
                        Hỗ trợ định dạng .xlsx, .xls, .csv. Dung lượng tối đa 10MB
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Template download & Notes */}
                <Alert severity='info' className='border-none' icon={<i className='tabler-info-circle text-lg' />}>
                  Để tránh lỗi cấu trúc cột, vui lòng sử dụng file mẫu chuẩn của hệ thống: {' '}
                  <Typography 
                    component='span' 
                    color='primary' 
                    className='font-bold underline cursor-pointer hover:text-primary-dark text-sm'
                    onClick={() => alert('Đang tải file mẫu phôi SIM (template_blank_sims.xlsx)')}
                  >
                    Tải File mẫu Excel (.xlsx)
                  </Typography>
                </Alert>

                {/* Preview Section */}
                {previewData.length > 0 && (
                  <Box className='space-y-4'>
                    <Divider />
                    <Typography variant='h6' className='font-black flex justify-between items-center'>
                      Xem trước dữ liệu ({previewData.length + 95} dòng)
                      <Chip label='File Hợp Lệ' color='success' size='small' className='font-bold' />
                    </Typography>

                    <TableContainer className='border rounded-lg max-h-[250px] overflow-y-auto'>
                      <Table size='small'>
                        <TableHead className='bg-slate-50'>
                          <TableRow>
                            <TableCell className='font-bold text-xs uppercase'>ICCID</TableCell>
                            <TableCell className='font-bold text-xs uppercase'>Số Seri</TableCell>
                            <TableCell className='font-bold text-xs uppercase'>Mã PIN</TableCell>
                            <TableCell className='font-bold text-xs uppercase'>Mã PUK</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {previewData.map((row, idx) => (
                            <TableRow key={idx}>
                              <TableCell className='font-mono text-xs font-bold text-slate-700'>{row.iccid}</TableCell>
                              <TableCell className='font-mono text-xs text-slate-500'>{row.serial}</TableCell>
                              <TableCell className='font-mono text-xs'>{row.pin}</TableCell>
                              <TableCell className='font-mono text-xs'>{row.puk}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Button 
                      variant='contained' 
                      color='success' 
                      fullWidth
                      size='large'
                      onClick={handleConfirmImport}
                    >
                      Xác nhận nhập kho {previewData.length + 95} Phôi SIM
                    </Button>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
 
        {/* Right Side: Help Guides & Recent Import History */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Stack spacing={6}>
            {/* Guide Card */}
            <Card className='border-none shadow-sm bg-primary/5 border border-primary/10'>
              <CardContent className='p-5'>
                <Typography variant='h6' className='font-black text-primary mbe-3 flex items-center gap-2'>
                  <i className='tabler-book-2 text-xl' /> Hướng dẫn nhập kho
                </Typography>
                <Typography variant='body2' color='textSecondary' className='space-y-2 leading-relaxed'>
                  1. <b>Chọn Nhà cung cấp phôi</b> đúng với hãng SIM vật lý đang nhập.<br />
                  2. <b>Cấu trúc file Excel:</b> Các cột bắt buộc bao gồm `iccid` (20 chữ số), `serial`, `pin` và `puk`. Cột `pin` và `puk` có thể để trống.<br />
                  3. <b>Trùng lặp:</b> Hệ thống sẽ tự động bỏ qua các số ICCID đã tồn tại sẵn trong hệ thống và chỉ nạp thêm các số mới.<br />
                  4. Sau khi phôi SIM được nạp vào, trạng thái của chúng sẽ là <b>"Trong kho 3M"</b>. Bạn có thể tiến hành <b>Bàn giao Đại lý</b> ngay sau đó.
                </Typography>
              </CardContent>
            </Card>
 
            {/* History Logs */}
            <Card className='border-none shadow-sm'>
              <CardContent className='p-5'>
                <Typography variant='h6' className='font-black mbe-4 flex items-center gap-2'>
                  <i className='tabler-history text-xl' /> Nhật ký nhập kho gần đây
                </Typography>
                <Stack spacing={4}>
                  <Box className='flex gap-3 items-start'>
                    <Avatar sx={{ bgcolor: 'success.tonal', color: 'success.main', width: 28, height: 28 }}>
                      <i className='tabler-circle-check text-sm' />
                    </Avatar>
                    <Box className='flex-1'>
                      <Typography variant='body2' className='font-bold'>Nhập 500 SIM trắng Hồng Kông</Typography>
                      <Typography variant='caption' color='textSecondary' className='block'>Bởi File Excel - 16/05/2026 08:00</Typography>
                    </Box>
                  </Box>
                  
                  <Box className='flex gap-3 items-start'>
                    <Avatar sx={{ bgcolor: 'success.tonal', color: 'success.main', width: 28, height: 28 }}>
                      <i className='tabler-circle-check text-sm' />
                    </Avatar>
                    <Box className='flex-1'>
                      <Typography variant='body2' className='font-bold'>Nhập 200 SIM trắng Mỹ</Typography>
                      <Typography variant='caption' color='textSecondary' className='block'>Đồng bộ API Mỹ Gate - 15/05/2026 09:30</Typography>
                    </Box>
                  </Box>
 
                  <Box className='flex gap-3 items-start'>
                    <Avatar sx={{ bgcolor: 'error.tonal', color: 'error.main', width: 28, height: 28 }}>
                      <i className='tabler-circle-x text-sm' />
                    </Avatar>
                    <Box className='flex-1'>
                      <Typography variant='body2' className='font-bold text-error'>Nhập kho thất bại (File lỗi định dạng)</Typography>
                      <Typography variant='caption' color='textSecondary' className='block'>Lô phôi SIM đợt tháng 4 - 28/04/2026 15:40</Typography>
                      <Typography variant='caption' className='text-error font-medium block mt-1 bg-error/5 p-1 rounded'>
                        Lỗi: Cột 'iccid' bị thiếu dòng số 12
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid2>
      </Grid2>
    </>
  )
}

export default PhysicalSimImportView
