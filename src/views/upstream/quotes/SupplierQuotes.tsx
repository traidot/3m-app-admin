'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Grid2 from '@mui/material/Grid2'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'

import PageHeader from '@/components/layout/shared/PageHeader'

const SupplierQuotes = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('NCC1')
  const [currentTab, setCurrentTab] = useState(0) // Mặc định vào Danh sách Listing
  const [showValidation, setShowValidation] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const suppliers = [
    { id: 'NCC1', name: 'Nhà cung cấp 1', count: 277, logo: 'tabler-building-fortress', color: 'primary' },
    { id: 'ZEYFI', name: 'ZEYFI eSIM', count: 2835, logo: 'tabler-bolt', color: 'warning' },
    { id: 'NOMAD', name: 'Nomad Global', count: 150, logo: 'tabler-map-pin', color: 'success' },
    { id: 'AIRALO', name: 'Airalo API', count: 0, logo: 'tabler-antenna', color: 'info' }
  ]

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activePrices = [
    { id: 'ZEY-JP-10G', country: 'Japan', pkg: 'Japan Premium', data: '10GB', days: '30 Days', price: '$8.50', network: 'Softbank', status: 'Listed' },
    { id: 'ZEY-US-5G', country: 'USA', pkg: 'USA Fast', data: '5GB', days: '7 Days', price: '$12.00', network: 'AT&T', status: 'Listed' },
    { id: 'ZEY-VN-UNLIM', country: 'Vietnam', pkg: 'VN Unlimited', data: 'Unlimited', days: '1 Day', price: '$0.80', network: 'Viettel', status: 'Paused' },
    { id: 'ZEY-KR-3G', country: 'Korea', pkg: 'Korea Basic', data: '3GB', days: '5 Days', price: '$4.50', network: 'SKT', status: 'Listed' },
    { id: 'ZEY-EU-5G', country: 'Europe', pkg: 'EU Roaming', data: '5GB', days: '15 Days', price: '$9.00', network: 'Multiple', status: 'Listed' }
  ]

  const validationData = [
    { id: 1, pkgId: 'ZEY-JP-10G', country: 'Japan', pkg: '10GB', oldPrice: '$8.50', newPrice: '$8.00', change: '-5.8%', status: 'Price Down', health: 'Clean' },
    { id: 4, pkgId: 'ZEY-EU-ERR', country: 'Europe', pkg: '5GB', oldPrice: '$9.00', newPrice: '$0.00', change: 'ERR', status: 'Invalid Price', health: 'Error' }
  ]

  const currentSupplierInfo = suppliers.find(s => s.id === selectedSupplier)

  return (
    <>
      <PageHeader
        title="Quản lý Nguồn cung & Báo giá (Supplier Quotes)"
        description="Quản lý chi tiết danh sách báo giá và niêm yết sản phẩm từ các nhà cung cấp"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Nguồn cung' }, { label: 'Báo giá & Listing' }]}
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Sidebar Chọn Supplier */}
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Card className='border-none shadow-sm sticky top-24'>
            <CardContent>
              <Box className='flex justify-between items-center mbe-4'>
                <Typography variant='subtitle2' className='font-black uppercase text-slate-500 text-[11px]'>Danh sách Nhà cung cấp</Typography>
                <Chip label={filteredSuppliers.length} size='small' variant='tonal' color='secondary' />
              </Box>

              <TextField
                fullWidth
                size='small'
                placeholder='Tìm nhanh nhà cung cấp...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='mbe-4'
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-search text-slate-400' />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <Stack spacing={2} className='max-h-[500px] overflow-y-auto'>
                {filteredSuppliers.map((s) => (
                  <Box 
                    key={s.id} 
                    onClick={() => { setSelectedSupplier(s.id); setCurrentTab(0); setShowValidation(false); }}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedSupplier === s.id ? 'bg-primary/10 border-primary/30 shadow-sm' : 'hover:bg-slate-50 border-transparent'}`}
                  >
                    <Box className='flex items-center gap-3'>
                      <Avatar variant='rounded' color={s.color as any} className={`bg-${s.color}/10 text-${s.color}`}>
                        <i className={s.logo} />
                      </Avatar>
                      <Box>
                        <Typography variant='body2' className={`font-black ${selectedSupplier === s.id ? 'text-primary' : ''}`}>{s.name}</Typography>
                        <Typography variant='caption' className='text-slate-400'>{s.count} báo giá</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Nội dung quản lý chi tiết */}
        <Grid2 size={{ xs: 12, md: 9 }}>
          <Stack spacing={6}>
            <Card className='border-none shadow-sm'>
              <Box className='border-be'>
                <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} className='px-6 pt-2'>
                  <Tab label="Danh sách Báo giá" icon={<i className='tabler-file-invoice' />} iconPosition='start' />
                  <Tab label="Tổng quan" icon={<i className='tabler-chart-pie' />} iconPosition='start' />
                  <Tab label="Lịch sử Nạp file" icon={<i className='tabler-history' />} iconPosition='start' />
                  <Tab label="Chuẩn hóa dữ liệu" icon={<i className='tabler-wand' />} iconPosition='start' />
                </Tabs>
              </Box>

              <CardContent>
                {/* Tab 0: Danh sách Báo giá */}
                {currentTab === 0 && (
                  <Box>
                    <Box className='flex justify-between items-center mbe-6'>
                      <Box>
                        <Typography variant='h6' className='font-black'>Bảng giá hiện hành của {currentSupplierInfo?.name}</Typography>
                        <Typography variant='caption' className='text-slate-500'>Hiển thị tất cả eSIM được báo giá từ nhà cung cấp này.</Typography>
                      </Box>
                      <Stack direction='row' spacing={2}>
                        <TextField 
                          size='small' 
                          placeholder='Tìm theo quốc gia, ID...' 
                          className='min-is-[250px]'
                          slotProps={{ input: { startAdornment: <InputAdornment position='start'><i className='tabler-search' /></InputAdornment> } }}
                        />
                        <Button variant='contained' startIcon={<i className='tabler-cloud-upload' />} onClick={() => setShowValidation(true)}>Nạp báo giá mới</Button>
                      </Stack>
                    </Box>
                    <TableContainer className='rounded-xl border'>
                      <Table>
                        <TableHead className='bg-slate-50'>
                          <TableRow>
                            <TableCell className='font-black uppercase text-[11px]'>Mã gói / NCC</TableCell>
                            <TableCell className='font-black uppercase text-[11px]'>Vùng / Quốc gia</TableCell>
                            <TableCell className='font-black uppercase text-[11px]'>Data / Ngày</TableCell>
                            <TableCell className='font-black uppercase text-[11px]'>Giá vốn (USD)</TableCell>
                            <TableCell className='font-black uppercase text-[11px]'>Trạng thái</TableCell>
                            <TableCell className='font-black uppercase text-[11px] text-right'>Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {activePrices.map((row, index) => (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Typography variant='body2' className='font-black text-primary'>{row.id}</Typography>
                                <Typography variant='caption' className='text-slate-400'>{row.pkg}</Typography>
                              </TableCell>
                              <TableCell className='font-bold'>{row.country}</TableCell>
                              <TableCell>
                                <Box className='flex items-center gap-2'>
                                  <Chip label={row.data} size='small' variant='tonal' color='info' className='font-bold' />
                                  <Typography variant='caption' className='text-slate-500'>{row.days}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell className='font-black text-slate-900'>{row.price}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={row.status === 'Listed' ? 'Đang bán' : 'Tạm dừng'} 
                                  size='small' 
                                  color={row.status === 'Listed' ? 'success' : 'secondary'} 
                                  variant='tonal'
                                  className='font-bold'
                                />
                              </TableCell>
                              <TableCell className='text-right'>
                                <IconButton size='small'><i className='tabler-edit text-[18px]' /></IconButton>
                                <IconButton size='small'><i className='tabler-dots-vertical text-[18px]' /></IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Tab 1: Tổng quan */}
                {currentTab === 1 && (
                  <Grid2 container spacing={6}>
                    <Grid2 size={{ xs: 12 }}>
                      <Alert severity="info" className='mbe-6 font-bold' icon={<i className='tabler-rocket' />}>
                        Chế độ Marketplace: Mọi gói cước nạp vào đều được listing tự động. Hiện có {currentSupplierInfo?.count} listing đang hoạt động.
                      </Alert>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Box className='p-6 bg-slate-50 rounded-2xl border h-full'>
                        <Typography variant='h6' className='font-black mbe-2 text-primary'>Tỷ lệ Listing thành công</Typography>
                        <Typography variant='body2' className='mbe-4 text-slate-500'>Độ chuẩn hóa dữ liệu đầu vào.</Typography>
                        <Box className='mbe-4'>
                          <Box className='flex justify-between mbe-1'>
                            <Typography variant='caption' className='font-bold'>Dữ liệu đã chuẩn hóa</Typography>
                            <Typography variant='caption' className='font-bold'>98.5%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={98.5} color='primary' className='h-2 rounded-full' />
                        </Box>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Box className='p-6 bg-slate-900 text-white rounded-2xl border h-full'>
                        <Typography variant='h6' className='text-white font-black mbe-2'>Đồng bộ Marketplace</Typography>
                        <Stack spacing={3}>
                          <Button fullWidth variant='contained' className='bg-white text-slate-900 hover:bg-slate-100 font-black' startIcon={<i className='tabler-refresh' />}>
                            Cập nhật Listing ngay
                          </Button>
                        </Stack>
                      </Box>
                    </Grid2>
                  </Grid2>
                )}

                {/* Tab 2: Lịch sử Nạp file */}
                {currentTab === 2 && (
                  <Stack spacing={4}>
                    {[1, 2, 3].map((i) => (
                      <Box key={i} className='p-4 border rounded-xl flex justify-between items-center hover:bg-slate-50 transition-colors'>
                        <Box className='flex items-center gap-3'>
                          <Avatar className='bg-info/10 text-info'><i className='tabler-file-upload' /></Avatar>
                          <Box>
                            <Typography variant='body2' className='font-black'>{selectedSupplier}_Full_Listing_v{i}.xlsx</Typography>
                            <Typography variant='caption' className='text-slate-400'>Tự động listing 2.5k gói • 2{i}/04/2026</Typography>
                          </Box>
                        </Box>
                        <Button size='small' variant='tonal'>Xem Listing</Button>
                      </Box>
                    ))}
                  </Stack>
                )}

                {/* Tab 3: Chuẩn hóa */}
                {currentTab === 3 && (
                  <Box className='text-center p-10'>
                    <Avatar variant='rounded' className='mx-auto mbe-4 bg-primary/10 text-primary w-12 h-12'>
                      <i className='tabler-wand text-2xl' />
                    </Avatar>
                    <Typography variant='h6' className='font-black'>Chuẩn hóa dữ liệu Marketplace</Typography>
                    <Typography variant='body2' className='mbe-6 text-slate-500'>Tự động ánh xạ tên Quốc gia và đơn vị Data của NCC sang chuẩn Marketplace.</Typography>
                    <Button variant='contained' component={Link} href={`/3m/upstream/suppliers/${selectedSupplier.toLowerCase()}/mapping`}>
                      Mở trình Chuẩn hóa (Normalization)
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Quy trình nạp & Listing (Staging Area) */}
            {showValidation && (
              <Card className='border-none shadow-lg border-2 border-primary animate-in fade-in slide-in-from-bottom-4 duration-500'>
                <CardContent>
                  <Box className='flex justify-between items-center mbe-6'>
                    <Box>
                      <Typography variant='h6' className='font-black'>⚡ Tự động chuẩn hóa & Listing ({selectedSupplier})</Typography>
                      <Typography variant='caption'>Đang chuẩn hóa <strong>2.8k gói</strong> để niêm yết lên Marketplace...</Typography>
                    </Box>
                    <Stack direction='row' spacing={2}>
                      <Button variant='tonal' color='secondary' onClick={() => setShowValidation(false)}>Hủy</Button>
                      <Button variant='contained' color='primary' startIcon={<i className='tabler-rocket' />}>Bắt đầu Niêm yết</Button>
                    </Stack>
                  </Box>
                  
                  <TableContainer className='rounded-xl border'>
                    <Table>
                      <TableHead className='bg-slate-50'>
                        <TableRow>
                          <TableCell className='font-black text-[11px] uppercase'>Tên gói NCC</TableCell>
                          <TableCell className='font-black text-[11px] uppercase'>Vùng (Chuẩn hóa)</TableCell>
                          <TableCell className='font-black text-[11px] uppercase'>Giá vốn</TableCell>
                          <TableCell className='font-black text-[11px] uppercase'>Trạng thái Listing</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {validationData.map((row, index) => (
                          <TableRow key={index} hover>
                            <TableCell className='font-bold'>{row.pkg}</TableCell>
                            <TableCell>
                              <Box className='flex items-center gap-1'>
                                <i className='tabler-world text-primary text-xs' />
                                <Typography variant='body2' className='font-black'>{row.country}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell className={`font-black ${row.health === 'Error' ? 'text-error underline' : 'text-primary'}`}>{row.newPrice}</TableCell>
                            <TableCell>
                              <Box className='flex items-center gap-1'>
                                <i className={`tabler-${row.health === 'Clean' ? 'check text-success' : 'alert-circle text-error'}`} />
                                <Typography variant='caption'>{row.status === 'Price Down' ? 'Sẵn sàng niêm yết' : row.status}</Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid2>
      </Grid2>
    </>
  )
}

export default SupplierQuotes
