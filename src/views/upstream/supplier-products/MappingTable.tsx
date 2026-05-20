'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Grid2 from '@mui/material/Grid2'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Pagination from '@mui/material/Pagination'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import Autocomplete from '@mui/material/Autocomplete'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import Stack from '@mui/material/Stack'

import Link from 'next/link'
import PriceImportWizard from '@/views/upstream/import/PriceImportWizard'

import PageHeader from '@/components/layout/shared/PageHeader'

const MappingTable = () => {
  const [importOpen, setImportOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPkg, setSelectedPkg] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Filter States
  const [selectedSupplier, setSelectedSupplier] = useState('all')
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [selectedCountries, setSelectedCountries] = useState<any[]>([])
  const [filterData, setFilterData] = useState('all')
  const [filterValidity, setFilterValidity] = useState('all')
  const [filterSimType, setFilterSimType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  const suppliersList = [
    { value: 'all', label: 'Tất cả Nhà cung cấp', icon: 'tabler-layers-intersect' },
    { value: 'Airalo', label: 'Airalo Global', icon: 'tabler-square-rounded-letter-a' },
    { value: 'Nomad', label: 'Nomad Global', icon: 'tabler-square-rounded-letter-n' },
    { value: 'KeepGo', label: 'KeepGo', icon: 'tabler-square-rounded-letter-k' }
  ]

  const countriesList = [
    { name: 'Nhật Bản', code: 'JP', flag: '🇯🇵', region: 'Châu Á' },
    { name: 'Hàn Quốc', code: 'KR', flag: '🇰🇷', region: 'Châu Á' },
    { name: 'Thái Lan', code: 'TH', flag: '🇹🇭', region: 'Châu Á' },
    { name: 'Hoa Kỳ', code: 'US', flag: '🇺🇸', region: 'Mỹ' },
    { name: 'Châu Âu', code: 'EU', flag: '🇪🇺', region: 'Châu Âu' },
    { name: 'Việt Nam', code: 'VN', flag: '🇻🇳', region: 'Châu Á' },
    { name: 'Đài Loan', code: 'TW', flag: '🇹🇼', region: 'Châu Á' },
    { name: 'Trung Quốc', code: 'CN', flag: '🇨🇳', region: 'Châu Á' },
    { name: 'Vương Quốc Anh', code: 'GB', flag: '🇬🇧', region: 'Châu Âu' },
    { name: 'Pháp', code: 'FR', flag: '🇫🇷', region: 'Châu Âu' },
  ]

  // Mock packages state
  const [packages] = useState([
    { id: 'PKG-001', supplier: 'Airalo', name: 'Japan 10GB Premium', country: 'Nhật Bản', data: '10GB', duration: '30 Ngày', cost: 8.50, status: 'Active', type: 'Total' },
    { id: 'PKG-002', supplier: 'Nomad', name: 'USA Fast Connection', country: 'Hoa Kỳ', data: '5GB', duration: '7 Ngày', cost: 12.00, status: 'Active', type: 'Daily' },
    { id: 'PKG-003', supplier: 'Airalo', name: 'China Great Wall', country: 'Trung Quốc', data: '20GB', duration: '30 Ngày', cost: 15.00, status: 'Active', type: 'Total' },
    { id: 'PKG-004', supplier: 'KeepGo', name: 'Europe Discovery', country: 'Châu Âu', data: 'Unlimited', duration: '1 Ngày', cost: 1.50, status: 'Paused', type: 'Daily' },
    { id: 'PKG-005', supplier: 'Nomad', name: 'UK Business Pro', country: 'Vương Quốc Anh', data: '50GB', duration: '90 Ngày', cost: 45.00, status: 'Active', type: 'Total' },
  ])

  const resetFilters = () => {
    setSelectedSupplier('all')
    setSelectedContinent('all')
    setSelectedCountries([])
    setFilterData('all')
    setFilterValidity('all')
    setFilterSimType('all')
    setFilterStatus('all')
    setSortBy('none')
    setSortOrder('asc')
    setSearchQuery('')
  }

  const [sortBy, setSortBy] = useState('none')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSupplier = selectedSupplier === 'all' || pkg.supplier === selectedSupplier
    const matchesContinent = selectedContinent === 'all' || countriesList.find(c => c.name === pkg.country)?.region === selectedContinent
    const matchesCountries = selectedCountries.length === 0 || selectedCountries.some(c => c.name === pkg.country)
    const matchesData = filterData === 'all' || pkg.data === filterData
    const matchesValidity = filterValidity === 'all' || pkg.duration === filterValidity
    const matchesSimType = filterSimType === 'all' || pkg.type === filterSimType
    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus

    return matchesSearch && matchesSupplier && matchesContinent && matchesCountries && matchesData && matchesValidity && matchesSimType && matchesStatus
  }).sort((a, b) => {
    if (sortBy === 'none') return 0
    
    let valA: any = a[sortBy as keyof typeof a]
    let valB: any = b[sortBy as keyof typeof b]

    if (sortBy === 'cost') {
      valA = parseFloat(valA)
      valB = parseFloat(valB)
    } else {
      valA = String(valA).toLowerCase()
      valB = String(valB).toLowerCase()
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc'
    setSortOrder(isAsc ? 'desc' : 'asc')
    setSortBy(property)
  }

  return (
    <>
      <PageHeader
        title="Kho Sản phẩm Upstream"
        description="Quản lý toàn bộ gói cước từ tất cả nhà cung cấp, lọc theo khu vực và quốc gia"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Nguồn cung' }, { label: 'Tất cả sản phẩm' }]}
        actions={
          <Box className='flex gap-2'>
            <Button
              variant='outlined'
              startIcon={<i className='tabler-file-upload' />}
              onClick={() => setImportOpen(true)}
            >
              Import Báo giá
            </Button>
            <Button variant='contained' startIcon={<i className='tabler-refresh' />}>Đồng bộ Toàn sàn</Button>
          </Box>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Unified Filter Bar */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='border-none shadow-sm'>
            <CardContent>
              <Box className='flex justify-between items-center mbe-6'>
                <Typography variant='h6' className='font-black uppercase text-sm text-slate-500'>Bộ lọc tìm kiếm</Typography>
                {(selectedSupplier !== 'all' || selectedContinent !== 'all' || selectedCountries.length > 0 || filterData !== 'all' || filterValidity !== 'all' || filterSimType !== 'all' || filterStatus !== 'all' || searchQuery !== '') && (
                  <Button size='small' variant='text' color='error' onClick={resetFilters} startIcon={<i className='tabler-trash' />}>
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </Box>

              <Grid2 container spacing={6}>
                <Grid2 size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    size='small'
                    placeholder='Tìm nhanh ID, tên gói...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  <TextField 
                    select 
                    fullWidth 
                    size='small' 
                    label='Nhà cung cấp' 
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                  >
                    {suppliersList.map(s => (
                      <MenuItem key={s.value} value={s.value}>
                        <Box className='flex items-center gap-2'>
                          <i className={s.icon} />
                          {s.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 2 }}>
                  <TextField 
                    select 
                    fullWidth 
                    size='small' 
                    label='Châu lục' 
                    value={selectedContinent}
                    onChange={(e) => setSelectedContinent(e.target.value)}
                  >
                    <MenuItem value='all'>Tất cả châu lục</MenuItem>
                    <MenuItem value='Châu Á'>Châu Á</MenuItem>
                    <MenuItem value='Châu Âu'>Châu Âu</MenuItem>
                    <MenuItem value='Mỹ'>Châu Mỹ</MenuItem>
                    <MenuItem value='Toàn cầu'>Toàn cầu</MenuItem>
                  </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Autocomplete
                    multiple
                    size='small'
                    options={countriesList}
                    getOptionLabel={(option) => option.name}
                    value={selectedCountries}
                    onChange={(_, newValue) => setSelectedCountries(newValue)}
                    disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField {...params} label='Chọn Quốc gia' placeholder='Tìm quốc gia...' />
                    )}
                    renderOption={(props, option, { selected }) => {
                      const { key, ...optionProps } = props;
                      return (
                        <li key={key} {...optionProps}>
                          <Checkbox
                            icon={<i className='tabler-square' />}
                            checkedIcon={<i className='tabler-square-check-filled' />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.flag} {option.name}
                        </li>
                      );
                    }}
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

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField 
                    select 
                    fullWidth 
                    size='small' 
                    label='Dung lượng' 
                    value={filterData}
                    onChange={(e) => setFilterData(e.target.value)}
                  >
                    <MenuItem value='all'>Tất cả dung lượng</MenuItem>
                    <MenuItem value='5GB'>5GB</MenuItem>
                    <MenuItem value='10GB'>10GB</MenuItem>
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
                    onChange={(e) => setFilterValidity(e.target.value)}
                  >
                    <MenuItem value='all'>Tất cả thời hạn</MenuItem>
                    <MenuItem value='1 Ngày'>1 Ngày</MenuItem>
                    <MenuItem value='7 Ngày'>7 Ngày</MenuItem>
                    <MenuItem value='30 Ngày'>30 Ngày</MenuItem>
                    <MenuItem value='90 Ngày'>90 Ngày</MenuItem>
                  </TextField>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField 
                    select 
                    fullWidth 
                    size='small' 
                    label='Loại sim' 
                    value={filterSimType}
                    onChange={(e) => setFilterSimType(e.target.value)}
                  >
                    <MenuItem value='all'>Tất cả loại sim</MenuItem>
                    <MenuItem value='Daily'>Daily (Theo ngày)</MenuItem>
                    <MenuItem value='Total'>Total (Tổng dung lượng)</MenuItem>
                  </TextField>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField 
                    select 
                    fullWidth 
                    size='small' 
                    label='Trạng thái' 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                    <MenuItem value='Active'>Đang bán</MenuItem>
                    <MenuItem value='Paused'>Tạm dừng</MenuItem>
                  </TextField>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        {/* Bảng dữ liệu chính */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='border-none shadow-sm'>
            <Box className='p-5 border-be flex justify-between items-center bg-slate-50/50'>
              <Typography variant='body2' className='text-slate-500 font-bold'>
                Tìm thấy {filteredPackages.length} gói cước từ Upstream
              </Typography>
              <Button 
                variant='tonal' 
                color='primary' 
                size='small' 
                startIcon={<i className='tabler-file-download' />}
                className='font-black'
              >
                Xuất Excel
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead className='bg-slate-50'>
                  <TableRow>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'supplier'}
                        direction={sortBy === 'supplier' ? sortOrder : 'asc'}
                        onClick={() => handleSort('supplier')}
                      >
                        Nhà cung cấp
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'id'}
                        direction={sortBy === 'id' ? sortOrder : 'asc'}
                        onClick={() => handleSort('id')}
                      >
                        Mã gói (ID)
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'name'}
                        direction={sortBy === 'name' ? sortOrder : 'asc'}
                        onClick={() => handleSort('name')}
                      >
                        Tên hiển thị & Quốc gia
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'data'}
                        direction={sortBy === 'data' ? sortOrder : 'asc'}
                        onClick={() => handleSort('data')}
                      >
                        Dung lượng
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'duration'}
                        direction={sortBy === 'duration' ? sortOrder : 'asc'}
                        onClick={() => handleSort('duration')}
                      >
                        Thời hạn
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px] text-center'>Loại sim</TableCell>
                    <TableCell className='font-black uppercase text-[11px] text-right'>
                      <TableSortLabel
                        active={sortBy === 'cost'}
                        direction={sortBy === 'cost' ? sortOrder : 'asc'}
                        onClick={() => handleSort('cost')}
                      >
                        Giá vốn (Cost)
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px] text-center'>Trạng thái</TableCell>
                    <TableCell className='font-black uppercase text-[11px] text-right'>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => {
                      const supplierColor = pkg.supplier === 'Airalo' ? '#7367F0' : pkg.supplier === 'Nomad' ? '#00BAD1' : '#EA5455';
                      
                      return (
                      <TableRow key={pkg.id} hover>
                        <TableCell>
                          <Box className='flex items-center gap-2'>
                            <Avatar 
                              variant='rounded' 
                              sx={{ 
                                backgroundColor: `${supplierColor}15`, 
                                color: supplierColor,
                                width: 32, 
                                height: 32,
                                fontSize: '0.75rem',
                                fontWeight: '900'
                              }}
                            >
                              {pkg.supplier[0]}
                            </Avatar>
                            <Typography variant='body2' className='font-bold' sx={{ color: supplierColor }}>{pkg.supplier}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell className='font-mono text-xs text-primary font-bold'>{pkg.id}</TableCell>
                        <TableCell>
                          <Typography variant='body2' className='font-black'>{pkg.name}</Typography>
                          <Typography variant='caption' className='text-slate-400 italic'>{pkg.country}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={pkg.data} size='small' variant='tonal' color='info' className='font-bold text-[10px]' />
                        </TableCell>
                        <TableCell>
                          <Chip label={pkg.duration} size='small' variant='tonal' color='secondary' className='font-bold text-[10px]' />
                        </TableCell>
                        <TableCell className='text-center'>
                          <Chip 
                            label={pkg.type} 
                            size='small' 
                            variant='outlined'
                            className='font-bold'
                            color={pkg.type === 'Daily' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell className='text-right font-black text-primary'>
                          ${pkg.cost.toFixed(2)}
                          <Typography variant='caption' className='block text-slate-400 font-normal font-mono'>USD</Typography>
                        </TableCell>
                        <TableCell className='text-center'>
                          <Chip 
                            label={pkg.status === 'Active' ? 'Đang bán' : 'Tạm dừng'} 
                            size='small' 
                            color={pkg.status === 'Active' ? 'success' : 'default'} 
                            variant='tonal'
                            className='font-black'
                          />
                        </TableCell>
                        <TableCell className='text-right'>
                          <IconButton size='small' onClick={() => { setSelectedPkg(pkg); setIsDetailOpen(true); }}><i className='tabler-eye text-[18px]' /></IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className='text-center p-10'>
                        <Typography variant='body2' className='text-slate-400'>Không tìm thấy gói cước nào phù hợp</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box className='p-4 border-t flex justify-center'>
              <Pagination count={5} color='primary' shape='rounded' />
            </Box>
          </Card>
        </Grid2>
      </Grid2>

      {/* Enhanced Detail Dialog */}
      <Dialog 
        open={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle className='flex items-center justify-between p-6 bg-slate-50'>
          <Box className='flex items-center gap-3'>
            <Avatar variant='rounded' className='bg-primary/10 text-primary'>
              <i className='tabler-info-circle text-2xl' />
            </Avatar>
            <Box>
              <Typography variant='h5' className='font-black'>Chi tiết Gói cước Upstream</Typography>
              <Typography variant='caption' className='text-slate-400'>Mã gói: {selectedPkg?.id}</Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setIsDetailOpen(false)} size='small' className='bg-white shadow-sm'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          {selectedPkg && (
            <Grid2 container spacing={6}>
              {/* Header Info Card */}
              <Grid2 size={{ xs: 12 }}>
                <Box className='p-5 rounded-2xl bg-primary/5 border border-primary/10 flex justify-between items-center'>
                  <Box>
                    <Typography variant='h4' className='font-black text-primary'>{selectedPkg.name}</Typography>
                    <Box className='flex items-center gap-2 mbs-1'>
                      <Typography variant='body2' className='font-bold text-slate-600'>{selectedPkg.country}</Typography>
                      <Box className='w-1 h-1 rounded-full bg-slate-300' />
                      <Typography variant='body2' className='text-slate-500'>{selectedPkg.supplier}</Typography>
                    </Box>
                  </Box>
                  <Box className='text-right'>
                    <Typography variant='h3' className='font-black text-primary'>${selectedPkg.cost.toFixed(2)}</Typography>
                    <Typography variant='caption' className='text-slate-400 uppercase font-black'>Giá vốn (USD)</Typography>
                  </Box>
                </Box>
              </Grid2>

              {/* Technical Specifications */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant='subtitle2' className='font-black uppercase text-[11px] text-slate-400 mbe-3 flex items-center gap-2'>
                  <i className='tabler-settings-automation text-base' /> Thông số kỹ thuật
                </Typography>
                <Card className='border border-slate-100 shadow-none bg-slate-50/50'>
                  <CardContent className='p-4'>
                    <Grid2 container spacing={4}>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='text-slate-400 block'>Dung lượng</Typography>
                        <Typography variant='body2' className='font-black'>{selectedPkg.data}</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='text-slate-400 block'>Thời hạn</Typography>
                        <Typography variant='body2' className='font-black'>{selectedPkg.duration}</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='text-slate-400 block'>Loại Sim</Typography>
                        <Chip label={selectedPkg.type} size='small' color='primary' variant='tonal' className='font-black text-[10px] mbs-1' />
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='text-slate-400 block'>Trạng thái</Typography>
                        <Chip label='Đang bán' size='small' color='success' variant='tonal' className='font-black text-[10px] mbs-1' />
                      </Grid2>
                    </Grid2>
                  </CardContent>
                </Card>
              </Grid2>

              {/* Network & Connectivity */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant='subtitle2' className='font-black uppercase text-[11px] text-slate-400 mbe-3 flex items-center gap-2'>
                  <i className='tabler-broadcast text-base' /> Mạng & Kết nối
                </Typography>
                <Card className='border border-slate-100 shadow-none bg-slate-50/50'>
                  <CardContent className='p-4'>
                    <Grid2 container spacing={4}>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='text-slate-400 block'>Tốc độ mạng</Typography>
                        <Typography variant='body2' className='font-black flex items-center gap-1'>
                          <i className='tabler-bolt text-warning' /> 4G / 5G
                        </Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='text-slate-400 block'>Hotspot (Phát wifi)</Typography>
                        <Typography variant='body2' className='font-black text-success'>Có hỗ trợ</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='text-slate-400 block'>Hỗ trợ cuộc gọi</Typography>
                        <Typography variant='body2' className='font-black text-slate-400 italic'>Không hỗ trợ</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='text-slate-400 block'>Nạp tiền (Top-up)</Typography>
                        <Typography variant='body2' className='font-black'>Có thể nạp thêm</Typography>
                      </Grid2>
                    </Grid2>
                  </CardContent>
                </Card>
              </Grid2>

              {/* Policy & Activation */}
              <Grid2 size={{ xs: 12 }}>
                <Typography variant='subtitle2' className='font-black uppercase text-[11px] text-slate-400 mbe-3 flex items-center gap-2'>
                  <i className='tabler-file-certificate text-base' /> Chính sách & Kích hoạt
                </Typography>
                <Card className='border border-slate-100 shadow-none'>
                  <CardContent className='p-0'>
                    <Box className='p-4 border-be flex justify-between items-center'>
                      <Box className='flex items-center gap-3'>
                        <Box className='w-8 h-8 rounded-full bg-info/10 text-info flex items-center justify-center'>
                          <i className='tabler-rocket' />
                        </Box>
                        <Typography variant='body2' className='font-bold'>Thời điểm kích hoạt</Typography>
                      </Box>
                      <Typography variant='body2' className='font-black text-slate-600'>Kích hoạt ngay khi cài đặt thành công</Typography>
                    </Box>
                    <Box className='p-4 border-be flex justify-between items-center'>
                      <Box className='flex items-center gap-3'>
                        <Box className='w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center'>
                          <i className='tabler-id' />
                        </Box>
                        <Typography variant='body2' className='font-bold'>Yêu cầu eKYC (Định danh)</Typography>
                      </Box>
                      <Typography variant='body2' className='font-black text-success text-right'>Không yêu cầu giấy tờ tùy thân</Typography>
                    </Box>
                    <Box className='p-4 flex justify-between items-center'>
                      <Box className='flex items-center gap-3'>
                        <Box className='w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center'>
                          <i className='tabler-api' />
                        </Box>
                        <Typography variant='body2' className='font-bold'>Phương thức cài đặt</Typography>
                      </Box>
                      <Typography variant='body2' className='font-black text-slate-600 text-right'>Quét mã QR hoặc Nhập thủ công</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-2 border-bs bg-slate-50'>
          <Button variant='tonal' color='secondary' onClick={() => setIsDetailOpen(false)} className='bg-white'>Đóng</Button>
          <Button variant='contained' color='primary' startIcon={<i className='tabler-copy' />}>Sao chép Mã gói</Button>
        </DialogActions>
      </Dialog>
      {/* Import Báo giá Dialog */}
      <Dialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        maxWidth='xl'
        fullWidth
        scroll='paper'
        aria-labelledby='import-dialog-title'
      >
        <DialogTitle id='import-dialog-title' sx={{ m: 0, p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box className='flex items-center justify-between'>
            <Box className='flex items-center gap-2'>
              <i className='tabler-file-upload text-primary text-xl' />
              <Typography variant='h6' className='font-black'>Import Báo giá Nhà cung cấp</Typography>
            </Box>
            <IconButton onClick={() => setImportOpen(false)} size='small' aria-label='close'>
              <i className='tabler-x' />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4, pt: 3 }}>
          <PriceImportWizard onClose={() => setImportOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MappingTable
