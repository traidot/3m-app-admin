'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Grid2 from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import Pagination from '@mui/material/Pagination'

import { toast } from 'react-toastify'
import PageHeader from '@/components/layout/shared/PageHeader'

const AgentProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [selectedCountries, setSelectedCountries] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [openDialog, setOpenDialog] = useState(false)
  
  // New Filter States
  const [filterData, setFilterData] = useState('all')
  const [filterValidity, setFilterValidity] = useState('all')
  const [filterSimType, setFilterSimType] = useState('all')
  
  // Sorting States
  const [sortBy, setSortBy] = useState('none')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // Pagination States
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleOpenDialog = (product: any) => {
    setSelectedProduct(product)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }

  const countries = [
    { name: 'Nhật Bản', code: 'JP', flag: '🇯🇵', region: 'Châu Á' },
    { name: 'Hàn Quốc', code: 'KR', flag: '🇰🇷', region: 'Châu Á' },
    { name: 'Thái Lan', code: 'TH', flag: '🇹🇭', region: 'Châu Á' },
    { name: 'Hoa Kỳ', code: 'US', flag: '🇺🇸', region: 'Mỹ' },
    { name: 'Châu Âu', code: 'EU', flag: '🇪🇺', region: 'Châu Âu' },
    { name: 'Việt Nam', code: 'VN', flag: '🇻🇳', region: 'Châu Á' },
    { name: 'Đài Loan', code: 'TW', flag: '🇹🇼', region: 'Châu Á' },
    { name: 'Trung Quốc', code: 'CN', flag: '🇨🇳', region: 'Châu Á' }
  ]

  const baseProducts = [
    { code: 'JP-30D-10GB', name: 'Nhật Bản Siêu Tốc', country: 'Nhật Bản', data: '10GB', validity: '30 Ngày', price: '$12.50', status: 'Đang hoạt động', type: 'Total' },
    { code: 'EU-15D-5GB', name: 'Roaming Châu Âu', country: 'Châu Âu', data: '5GB', validity: '15 Ngày', price: '$9.00', status: 'Đang hoạt động', type: 'Daily' },
    { code: 'US-30D-20GB', name: 'Mỹ Không giới hạn', country: 'Hoa Kỳ', data: '20GB', validity: '30 Ngày', price: '$22.00', status: 'Tạm dừng', type: 'Total' },
    { code: 'VN-30D-20GB', name: 'Viettel 4G Local', country: 'Việt Nam', data: '20GB', validity: '30 Ngày', price: '$5.50', status: 'Đang hoạt động', type: 'Total' },
    { code: 'TH-07D-Unlimited', name: 'Thái Lan Travel', country: 'Thái Lan', data: 'Unlimited', validity: '7 Ngày', price: '$6.20', status: 'Đang hoạt động', type: 'Daily' },
    { code: 'TH-15D-15GB', name: 'Thái Lan Business', country: 'Thái Lan', data: '15GB', validity: '15 Ngày', price: '$12.00', status: 'Đang hoạt động', type: 'Total' },
    { code: 'TH-30D-50GB', name: 'Thái Lan Dài Hạn', country: 'Thái Lan', data: '50GB', validity: '30 Ngày', price: '$25.00', status: 'Đang hoạt động', type: 'Total' },
    { code: 'KR-14D-10GB', name: 'Hàn Quốc Tốc Độ Cao', country: 'Hàn Quốc', data: '10GB', validity: '14 Ngày', price: '$15.00', status: 'Đang hoạt động', type: 'Daily' },
    { code: 'TW-05D-3GB', name: 'Đài Loan Ngắn Ngày', country: 'Đài Loan', data: '3GB', validity: '5 Ngày', price: '$4.50', status: 'Đang hoạt động', type: 'Total' },
    { code: 'CN-30D-50GB', name: 'Trung Quốc Vượt Tường Lửa', country: 'Trung Quốc', data: '50GB', validity: '30 Ngày', price: '$28.00', status: 'Đang hoạt động', type: 'Total' }
  ]

  const products = Array.from({ length: 50 }).map((_, index) => {
    const base = baseProducts[index % baseProducts.length];
    return {
      id: `${index + 1}`,
      code: `${base.code}-${index + 1}`,
      name: `${base.name} (Gói ${index + 1})`,
      country: base.country,
      data: base.data,
      validity: base.validity,
      price: base.price,
      type: base.type,
      status: index % 7 === 0 ? 'Tạm dừng' : 'Đang hoạt động'
    }
  })

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchContinent = selectedContinent === 'all' || countries.find(c => c.name === p.country)?.region === selectedContinent;
    const matchCountries = selectedCountries.length === 0 || selectedCountries.some(c => c.name === p.country);
    const matchData = filterData === 'all' || p.data === filterData;
    const matchValidity = filterValidity === 'all' || p.validity === filterValidity;
    const matchSimType = filterSimType === 'all' || p.type === filterSimType;
    const matchStatus = p.status === 'Đang hoạt động';

    return matchSearch && matchContinent && matchCountries && matchData && matchValidity && matchSimType && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'none') return 0;
    
    let valA: any = a[sortBy as keyof typeof a];
    let valB: any = b[sortBy as keyof typeof b];

    if (sortBy === 'price') {
      valA = parseFloat(valA.replace('$', ''));
      valB = parseFloat(valB.replace('$', ''));
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  })

  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)

  const resetFilters = () => {
    setFilterData('all')
    setFilterValidity('all')
    setFilterSimType('all')
    setSelectedContinent('all')
    setSelectedCountries([])
    setSearchTerm('')
    setSortBy('none')
    setPage(1)
  }

  return (
    <>
      <PageHeader
        title="Danh sách eSIM"
        description="Danh sách và quản lý các gói cước eSIM theo từng vùng lãnh thổ trên toàn cầu"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Chợ eSIM' }, { label: 'Danh sách eSIM' }]}
        className='mbe-6'
      />

      <Card className='border-none shadow-sm mbe-6'>
        <CardContent>
          <Box className='flex justify-between items-center mbe-6'>
            <Typography variant='h6' className='font-black uppercase text-sm text-slate-500'>Bộ lọc tìm kiếm</Typography>
            {(selectedContinent !== 'all' || selectedCountries.length > 0 || filterData !== 'all' || filterValidity !== 'all' || filterSimType !== 'all' || searchTerm !== '' || sortBy !== 'none') && (
              <Button size='small' variant='text' color='error' onClick={resetFilters} startIcon={<i className='tabler-trash' />}>
                Xóa tất cả bộ lọc
              </Button>
            )}
          </Box>
          
          <Grid2 container spacing={6}>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <TextField 
                select 
                fullWidth 
                size='small' 
                label='Khu vực (Châu lục)' 
                value={selectedContinent}
                onChange={(e) => { setSelectedContinent(e.target.value); setPage(1); }}
              >
                <MenuItem value='all'>Tất cả khu vực</MenuItem>
                <MenuItem value='Châu Á'>Châu Á</MenuItem>
                <MenuItem value='Châu Âu'>Châu Âu</MenuItem>
                <MenuItem value='Mỹ'>Châu Mỹ</MenuItem>
                <MenuItem value='Toàn cầu'>Toàn cầu</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Autocomplete
                multiple
                size='small'
                options={countries}
                getOptionLabel={(option) => option.name}
                value={selectedCountries}
                onChange={(_, newValue) => { setSelectedCountries(newValue); setPage(1); }}
                disableCloseOnSelect
                renderInput={(params) => (
                  <TextField {...params} label='Chọn Quốc gia' placeholder='Tìm quốc gia...' />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={<i className='tabler-square' />}
                      checkedIcon={<i className='tabler-square-check-filled' />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.flag} {option.name}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={`${option.flag} ${option.name}`}
                      {...getTagProps({ index })}
                      size='small'
                      variant='tonal'
                      key={option.code}
                    />
                  ))
                }
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size='small'
                placeholder='Tìm theo tên gói cước...'
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='tabler-search' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField 
                select 
                fullWidth 
                size='small' 
                label='Sắp xếp theo' 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <IconButton size='small' onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        <i className={sortOrder === 'asc' ? 'tabler-sort-ascending' : 'tabler-sort-descending'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              >
                <MenuItem value='none'>Mặc định</MenuItem>
                <MenuItem value='price'>Giá cước</MenuItem>
                <MenuItem value='data'>Dung lượng</MenuItem>
                <MenuItem value='validity'>Thời hạn</MenuItem>
              </TextField>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField 
                select 
                fullWidth 
                size='small' 
                label='Dung lượng' 
                value={filterData}
                onChange={(e) => { setFilterData(e.target.value); setPage(1); }}
              >
                <MenuItem value='all'>Tất cả dung lượng</MenuItem>
                <MenuItem value='5GB'>5GB</MenuItem>
                <MenuItem value='10GB'>10GB</MenuItem>
                <MenuItem value='15GB'>15GB</MenuItem>
                <MenuItem value='20GB'>20GB</MenuItem>
                <MenuItem value='50GB'>50GB</MenuItem>
                <MenuItem value='Unlimited'>Không giới hạn</MenuItem>
              </TextField>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField 
                select 
                fullWidth 
                size='small' 
                label='Thời hạn' 
                value={filterValidity}
                onChange={(e) => { setFilterValidity(e.target.value); setPage(1); }}
              >
                <MenuItem value='all'>Tất cả thời hạn</MenuItem>
                <MenuItem value='5 Ngày'>5 Ngày</MenuItem>
                <MenuItem value='7 Ngày'>7 Ngày</MenuItem>
                <MenuItem value='14 Ngày'>14 Ngày</MenuItem>
                <MenuItem value='15 Ngày'>15 Ngày</MenuItem>
                <MenuItem value='30 Ngày'>30 Ngày</MenuItem>
              </TextField>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField 
                select 
                fullWidth 
                size='small' 
                label='Loại sim' 
                value={filterSimType}
                onChange={(e) => { setFilterSimType(e.target.value); setPage(1); }}
              >
                <MenuItem value='all'>Tất cả loại</MenuItem>
                <MenuItem value='Daily'>Gói Daily (Theo ngày)</MenuItem>
                <MenuItem value='Total'>Gói Total (Tổng dung lượng)</MenuItem>
              </TextField>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card className='border-none shadow-sm'>
        <CardContent>
          <Box className='flex justify-between items-center mbe-4'>
            <Typography variant='h6' className='font-black'>
              Danh sách Gói cước
              <Chip label={filteredProducts.length} size='small' className='mis-2' variant='tonal' color='primary' />
            </Typography>
          </Box>

          <Box className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-slate-50 border-be'>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Gói cước</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Quốc gia</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Loại sim</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Dung lượng</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Thời hạn</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Giá</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className='border-be last:border-0 hover:bg-slate-50/50'>
                    <td className='p-4'>
                      <Box>
                        <Typography variant='body2' className='font-black'>{p.name}</Typography>
                        <Typography variant='caption' className='font-mono text-slate-400'>{p.code}</Typography>
                      </Box>
                    </td>
                    <td className='p-4'>
                      <Box className='flex items-center gap-2'>
                        <Typography variant='body2'>{countries.find(c => c.name === p.country)?.flag || '🌐'}</Typography>
                        <Typography variant='body2'>{p.country}</Typography>
                      </Box>
                    </td>
                    <td className='p-4'>
                      <Chip 
                        label={p.type} 
                        size='small' 
                        variant='tonal' 
                        color={p.type === 'Daily' ? 'warning' : 'info'} 
                        className='font-bold'
                      />
                    </td>
                    <td className='p-4'><Typography variant='body2' className='font-bold'>{p.data}</Typography></td>
                    <td className='p-4'><Typography variant='body2'>{p.validity}</Typography></td>
                    <td className='p-4'><Typography variant='body2' className='font-black text-primary'>{p.price}</Typography></td>
                    <td className='p-4 text-right'>
                      <Button 
                        size='small' 
                        variant='tonal' 
                        color='primary' 
                        onClick={() => handleOpenDialog(p)}
                        startIcon={<i className='tabler-info-circle' />}
                        className='font-black'
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <Box className='flex justify-between items-center mts-6'>
            <Typography variant='body2' className='text-slate-500'>
              Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredProducts.length)} trên tổng số {filteredProducts.length} kết quả
            </Typography>
            <Pagination 
              count={Math.ceil(filteredProducts.length / pageSize)} 
              page={page} 
              onChange={(_, value) => setPage(value)} 
              color='primary' 
              shape='rounded'
            />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth='sm'>
        <DialogTitle className='flex items-center justify-between p-6'>
          <Box>
            <Typography variant='h5' className='font-black'>Chi tiết Gói cước</Typography>
            <Typography variant='caption' className='text-slate-400 uppercase font-bold tracking-widest'>Thông tin kỹ thuật & Tích hợp</Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} size='small' className='bg-slate-100'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6 pt-0'>
          <Box className='p-6 bg-primary rounded-2xl text-white mbe-6 relative overflow-hidden'>
            <Box className='relative z-10 flex justify-between items-start'>
              <Box>
                <Typography variant='h4' className='text-white font-black mbe-1'>{selectedProduct?.name}</Typography>
                <Chip 
                  label={selectedProduct?.code} 
                  size='small' 
                  className='bg-white/20 text-white font-mono border-none' 
                  onClick={() => {
                    navigator.clipboard.writeText(selectedProduct?.code);
                    toast.success('Đã sao chép SKU vào bộ nhớ tạm!');
                  }}
                />
              </Box>
              <Typography variant='h3' className='text-white font-black'>{selectedProduct?.price}</Typography>
            </Box>
            <i className='tabler-world absolute -right-4 -bottom-4 text-8xl text-white/10 rotate-12' />
          </Box>

          <Typography variant='subtitle2' className='font-black mbe-4 uppercase text-[11px] text-slate-500 tracking-widest'>Thông số Gói cước</Typography>
          <Grid2 container spacing={4} className='mbe-8'>
            <Grid2 size={{ xs: 6, sm: 3 }}>
              <Box className='p-3 rounded-xl bg-slate-50 border border-slate-100 text-center'>
                <i className='tabler-database text-primary text-xl mbe-1' />
                <Typography variant='caption' className='block text-slate-400 uppercase font-bold text-[9px]'>Dung lượng</Typography>
                <Typography variant='body2' className='font-black'>{selectedProduct?.data}</Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 6, sm: 3 }}>
              <Box className='p-3 rounded-xl bg-slate-50 border border-slate-100 text-center'>
                <i className='tabler-calendar-stats text-primary text-xl mbe-1' />
                <Typography variant='caption' className='block text-slate-400 uppercase font-bold text-[9px]'>Thời hạn</Typography>
                <Typography variant='body2' className='font-black'>{selectedProduct?.validity}</Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 6, sm: 3 }}>
              <Box className='p-3 rounded-xl bg-slate-50 border border-slate-100 text-center'>
                <i className='tabler-signal-4g text-primary text-xl mbe-1' />
                <Typography variant='caption' className='block text-slate-400 uppercase font-bold text-[9px]'>Loại Sim</Typography>
                <Typography variant='body2' className='font-black'>{selectedProduct?.type}</Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 6, sm: 3 }}>
              <Box className='p-3 rounded-xl bg-slate-50 border border-slate-100 text-center'>
                <i className='tabler-map-pin text-primary text-xl mbe-1' />
                <Typography variant='caption' className='block text-slate-400 uppercase font-bold text-[9px]'>Quốc gia</Typography>
                <Typography variant='body2' className='font-black'>{selectedProduct?.country}</Typography>
              </Box>
            </Grid2>
          </Grid2>

          <Box className='flex items-center justify-between mbe-2'>
            <Typography variant='subtitle2' className='font-black uppercase text-[11px] text-slate-500 tracking-widest'>Mẫu lệnh gọi API (cURL)</Typography>
            <Button size='small' variant='text' color='primary' className='font-black' onClick={() => {
              const code = `curl -X POST "https://api.esimmarket.com/v1/orders" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sku": "${selectedProduct?.code}",
    "quantity": 1,
    "agent_reference": "YOUR_ORDER_ID"
  }'`;
              navigator.clipboard.writeText(code);
              toast.success('Đã sao chép mã cURL!');
            }}>Sao chép mã</Button>
          </Box>
          <Box className='p-4 bg-slate-900 rounded-xl overflow-x-auto mbe-6'>
            <pre className='text-[10px] text-success m-0 font-mono leading-relaxed'>
              {`curl -X POST "https://api.esimmarket.com/v1/orders" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sku": "${selectedProduct?.code}",
    "quantity": 1,
    "agent_reference": "YOUR_ORDER_ID"
  }'`}
            </pre>
          </Box>

          <Box className='p-4 rounded-xl bg-warning/5 border border-warning/10'>
            <Typography variant='caption' className='text-warning font-bold flex items-center gap-2 uppercase'>
              <i className='tabler-alert-circle' /> Lưu ý quan trọng
            </Typography>
            <Typography variant='body2' className='text-slate-600 mts-1 text-[12px]'>
              Gói cước này chỉ hỗ trợ mua sỉ thông qua API. Vui lòng kiểm tra số dư ví hoặc hạn mức công nợ trước khi thực hiện giao dịch để tránh lỗi gián đoạn.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className='p-6 pt-0 flex gap-3'>
          <Button fullWidth onClick={handleCloseDialog} color='secondary' variant='tonal' className='font-black'>Đóng</Button>
          <Button fullWidth variant='contained' href='/agent/system/api' component={Link} startIcon={<i className='tabler-file-description' />} className='font-black'>
            Tài liệu API
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AgentProductCatalog
