'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid2 from '@mui/material/Grid2'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

import PageHeader from '@/components/layout/shared/PageHeader'

const SupplierMappingConfig = ({ id }: { id: string }) => {
  // Giả lập các cột đọc được từ File Excel/API của Supplier
  const supplierFields = [
    '#', 'Region', 'Country or region', 'Type', 'Days', 'Package', 
    'Operator', 'Wholesale Price USD', 'Activate Mode', 'API Product code',
    'FUP', 'Roaming/Local', 'ACTION POLICY'
  ]

  // Các trường chuẩn của hệ thống mình
  const systemFields = [
    { key: 'externalCode', name: 'Mã định danh (Unique Code)', required: true, desc: 'Dùng để định danh gói cước khi gọi API mua' },
    { key: 'name', name: 'Tên gói cước', required: true, desc: 'Tên hiển thị trên Marketplace' },
    { key: 'region', name: 'Vùng / Lãnh thổ', required: false, desc: 'Châu Á, Châu Âu, Toàn cầu...' },
    { key: 'country', name: 'Quốc gia', required: true, desc: 'Nước áp dụng gói cước' },
    { key: 'dataAmount', name: 'Dung lượng Data', required: true, desc: 'Ví dụ: 1GB, 10GB, Unlimited' },
    { key: 'validityDays', name: 'Thời hạn (Ngày)', required: true, desc: 'Số ngày sử dụng' },
    { key: 'costPrice', name: 'Giá vốn (Wholesale)', required: true, desc: 'Giá nhà cung cấp bán cho sàn' },
    { key: 'currency', name: 'Tiền tệ', required: false, desc: 'USD, VND, JPY...' },
    { key: 'operator', name: 'Nhà mạng', required: false, desc: 'Viettel, China Unicom...' },
    { key: 'apn', name: 'Cấu hình APN', required: false, desc: 'Điểm truy cập mạng' }
  ]

  const [mapping, setMapping] = useState<Record<string, string>>({
    externalCode: 'API Product code',
    name: 'Country or region',
    country: 'Country or region',
    dataAmount: 'Package',
    validityDays: 'Days',
    costPrice: 'Wholesale Price USD'
  })

  const handleMappingChange = (sysKey: string, supplierField: string) => {
    setMapping(prev => ({ ...prev, [sysKey]: supplierField }))
  }

  return (
    <>
      <PageHeader
        title={`Cấu hình Mapping: ${id.toUpperCase()}`}
        description="Ánh xạ các trường dữ liệu từ Supplier vào hệ thống eSIM Market chuẩn"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Nguồn cung', href: '/3m/upstream/suppliers' },
          { label: 'Mapping Config' }
        ]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-device-floppy' />}>Lưu cấu hình Mapping</Button>
        }
        className='mbe-6'
      />

      <Alert severity="info" className='mbe-6'>
        Hệ thống đã tự động nhận diện <strong>{supplierFields.length} trường dữ liệu</strong> từ nguồn cấp. Vui lòng kiểm tra và khớp các trường bắt buộc.
      </Alert>

      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card className='border-none shadow-sm'>
            <TableContainer>
              <Table>
                <TableHead className='bg-slate-50'>
                  <TableRow>
                    <TableCell className='font-black uppercase text-[11px]'>Trường Hệ thống (Marketplace)</TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>Ánh xạ từ Supplier</TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {systemFields.map((field) => (
                    <TableRow key={field.key} hover>
                      <TableCell>
                        <Box>
                          <Typography variant='body2' className='font-black'>
                            {field.name} {field.required && <span className='text-error'>*</span>}
                          </Typography>
                          <Typography variant='caption' className='text-slate-400'>{field.desc}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          size='small'
                          value={mapping[field.key] || ''}
                          onChange={(e) => handleMappingChange(field.key, e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value=""><em>-- Không ánh xạ --</em></MenuItem>
                          {supplierFields.map(sf => (
                            <MenuItem key={sf} value={sf}>{sf}</MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        {mapping[field.key] ? (
                          <Chip label="Đã khớp" size='small' color='success' variant='tonal' className='font-bold' />
                        ) : (
                          field.required ? 
                            <Chip label="Chưa có" size='small' color='error' variant='tonal' className='font-bold' /> :
                            <Chip label="Tùy chọn" size='small' color='secondary' variant='tonal' className='font-bold' />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card className='border-none shadow-sm'>
            <CardContent>
              <Typography variant='h6' className='font-black mbe-4'>Xem trước (Preview)</Typography>
              <Typography variant='body2' className='mbe-4'>Dữ liệu thực tế sau khi ánh xạ thử nghiệm 1 dòng:</Typography>
              
              <Box className='bg-slate-900 text-white p-4 rounded-xl font-mono text-xs overflow-hidden'>
                <pre>{JSON.stringify({
                  externalCode: "A-006-ES-ZD-C4-1D",
                  name: "Japan - 500MB - 1 Day",
                  dataAmount: "500MB",
                  validityDays: 1,
                  costPrice: 1.5,
                  currency: "USD"
                }, null, 2)}</pre>
              </Box>
              
              <Divider className='my-6' />
              
              <Typography variant='h6' className='font-black mbe-2'>Hàm xử lý (Transformers)</Typography>
              <Typography variant='body2' className='text-slate-500 mbe-4 text-xs'>
                Hệ thống tự động phát hiện định dạng số và ngày tháng. Bạn có thể cấu hình nâng cao tại đây.
              </Typography>
              <Button fullWidth variant='tonal' size='small' startIcon={<i className='tabler-settings-automation' />}>
                Cấu hình Transformers
              </Button>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default SupplierMappingConfig
