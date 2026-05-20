'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
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

import PageHeader from '@/components/layout/shared/PageHeader'

const SupplierPackages = () => {
  const { id } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Filter States
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [selectedCountries, setSelectedCountries] = useState<any[]>([])
  const [filterData, setFilterData] = useState('all')
  const [filterValidity, setFilterValidity] = useState('all')
  const [filterSimType, setFilterSimType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Mock data cho nhà cung cấp
  const supplierInfo = {
    AIRALO: { name: 'Airalo Global', total: 450, color: 'primary' },
    NOMAD: { name: 'Nomad Global', total: 1200, color: 'info' },
    GOMO: { name: 'GoMoWorld', total: 0, color: 'error' },
  }[String(id).toUpperCase()] || { name: 'Nhà cung cấp', total: 0, color: 'secondary' }

  const countriesList = [
    { name: 'Nhật Bản', code: 'JP', flag: '🇯🇵', region: 'Châu Á' },
    { name: 'Hàn Quốc', code: 'KR', flag: '🇰🇷', region: 'Châu Á' },
    { name: 'Thái Lan', code: 'TH', flag: '🇹🇭', region: 'Châu Á' },
    { name: 'Hoa Kỳ', code: 'US', flag: '🇺🇸', region: 'Mỹ' },
    { name: 'Châu Âu', code: 'EU', flag: '🇪🇺', region: 'Châu Âu' },
    { name: 'Việt Nam', code: 'VN', flag: '🇻🇳', region: 'Châu Á' },
    { name: 'Đài Loan', code: 'TW', flag: '🇹🇼', region: 'Châu Á' },
    { name: 'Trung Quốc', code: 'CN', flag: '🇨🇳', region: 'Châu Á' }
  ]

  // Mock packages state
  const [packages, setPackages] = useState([
    { id: 'PKG-001', name: 'Japan 10GB Premium', country: 'Nhật Bản', data: '10GB', duration: '30 Ngày', cost: 8.50, status: 'Active', type: 'Total' },
    { id: 'PKG-002', name: 'USA Fast Connection', country: 'Hoa Kỳ', data: '5GB', duration: '7 Ngày', cost: 12.00, status: 'Active', type: 'Daily' },
    { id: 'PKG-003', name: 'China Great Wall', country: 'Trung Quốc', data: '20GB', duration: '30 Ngày', cost: 15.00, status: 'Active', type: 'Total' },
    { id: 'PKG-004', name: 'Korea SKT Unlimited', country: 'Hàn Quốc', data: 'Unlimited', duration: '1 Ngày', cost: 1.50, status: 'Paused', type: 'Daily' },
    { id: 'PKG-005', name: 'Europe Summer Roaming', country: 'Châu Âu', data: '10GB', duration: '15 Ngày', cost: 11.00, status: 'Active', type: 'Total' },
    { id: 'PKG-006', name: 'Vietnam Viettel 4G', country: 'Việt Nam', data: '3GB', duration: '5 Ngày', cost: 0.50, status: 'Active', type: 'Total' },
  ])

  const handleUpdateQuotes = () => {
    setIsUpdating(true)
    setTimeout(() => {
      setPackages(prev => prev.map(p => ({
        ...p,
        cost: p.cost * 0.9 
      })))
      setIsUpdating(false)
      setIsUploadModalOpen(false)
    }, 2000)
  }

  const resetFilters = () => {
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
    
    const matchesContinent = selectedContinent === 'all' || countriesList.find(c => c.name === pkg.country)?.region === selectedContinent
    const matchesCountries = selectedCountries.length === 0 || selectedCountries.some(c => c.name === pkg.country)
    const matchesData = filterData === 'all' || pkg.data === filterData
    const matchesValidity = filterValidity === 'all' || pkg.duration === filterValidity
    const matchesSimType = filterSimType === 'all' || pkg.type === filterSimType
    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus

    return matchesSearch && matchesContinent && matchesCountries && matchesData && matchesValidity && matchesSimType && matchesStatus
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
        title={`Quản lý eSIM: ${supplierInfo.name}`}
        description={`Quản lý và cập nhật báo giá cho ${supplierInfo.total} gói cước từ ${supplierInfo.name}`}
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Nguồn cung', href: '/3m/upstream/suppliers' },
          { label: supplierInfo.name }
        ]}
        actions={
          <Button 
            variant='contained' 
            startIcon={<i className='tabler-refresh' />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Cập nhật thông tin báo giá
          </Button>
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
                {(selectedContinent !== 'all' || selectedCountries.length > 0 || filterData !== 'all' || filterValidity !== 'all' || filterSimType !== 'all' || filterStatus !== 'all' || searchQuery !== '') && (
                  <Button size='small' variant='text' color='error' onClick={resetFilters} startIcon={<i className='tabler-trash' />}>
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </Box>

              <Grid2 container spacing={6}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    size='small'
                    placeholder='Tìm theo ID hoặc tên gói...'
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
                <Grid2 size={{ xs: 12, md: 5 }}>
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
                    <MenuItem value='3GB'>3GB</MenuItem>
                    <MenuItem value='5GB'>5GB</MenuItem>
                    <MenuItem value='10GB'>10GB</MenuItem>
                    <MenuItem value='20GB'>20GB</MenuItem>
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
                    <MenuItem value='5 Ngày'>5 Ngày</MenuItem>
                    <MenuItem value='7 Ngày'>7 Ngày</MenuItem>
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
                Tìm thấy {filteredPackages.length} gói cước phù hợp
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
                        active={sortBy === 'id'}
                        direction={sortBy === 'id' ? sortOrder : 'asc'}
                        onClick={() => handleSort('id')}
                      >
                        Mã gói (ID)
                        {sortBy === 'id' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'name'}
                        direction={sortBy === 'name' ? sortOrder : 'asc'}
                        onClick={() => handleSort('name')}
                      >
                        Tên hiển thị & Quốc gia
                        {sortBy === 'name' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'data'}
                        direction={sortBy === 'data' ? sortOrder : 'asc'}
                        onClick={() => handleSort('data')}
                      >
                        Dung lượng
                        {sortBy === 'data' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'duration'}
                        direction={sortBy === 'duration' ? sortOrder : 'asc'}
                        onClick={() => handleSort('duration')}
                      >
                        Thời hạn
                        {sortBy === 'duration' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'type'}
                        direction={sortBy === 'type' ? sortOrder : 'asc'}
                        onClick={() => handleSort('type')}
                      >
                        Loại sim
                        {sortBy === 'type' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>
                      <TableSortLabel
                        active={sortBy === 'cost'}
                        direction={sortBy === 'cost' ? sortOrder : 'asc'}
                        onClick={() => handleSort('cost')}
                      >
                        Giá vốn (Cost)
                        {sortBy === 'cost' ? (
                          <Box component="span" sx={visuallyHidden}>
                            {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='font-black uppercase text-[11px]'>Trạng thái</TableCell>
                    <TableCell className='font-black uppercase text-[11px] text-right'>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                      <TableRow key={pkg.id} hover>
                        <TableCell>
                          <Typography variant='body2' className='font-black text-primary'>{pkg.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant='body2' className='font-black'>{pkg.name}</Typography>
                            <Box className='flex items-center gap-1 text-slate-400'>
                              <i className='tabler-map-pin text-[12px]' />
                              <Typography variant='caption'>{pkg.country}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={pkg.data} size='small' color='info' variant='tonal' className='font-bold' />
                        </TableCell>
                        <TableCell>
                          <Chip label={pkg.duration} size='small' color='secondary' variant='tonal' className='font-bold' />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={pkg.type} 
                            size='small' 
                            variant='outlined'
                            className='font-bold'
                            color={pkg.type === 'Daily' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' className='font-black text-slate-900'>${pkg.cost.toFixed(2)}</Typography>
                          <Typography variant='caption' className='text-slate-400 font-mono'>USD</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={pkg.status === 'Active' ? 'Đang bán' : 'Tạm dừng'} 
                            size='small' 
                            color={pkg.status === 'Active' ? 'success' : 'secondary'} 
                            variant='tonal'
                            className='font-bold'
                          />
                        </TableCell>
                        <TableCell className='text-right'>
                          <IconButton size='small' onClick={() => { setSelectedPkg(pkg); setIsDetailOpen(true); }}>
                            <i className='tabler-eye text-[18px]' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className='text-center p-10'>
                        <Typography variant='body2' className='text-slate-400'>Không tìm thấy gói cước nào</Typography>
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

      {/* Dialog Upload Báo giá */}
      <Dialog 
        open={isUploadModalOpen} 
        onClose={() => !isUpdating && setIsUploadModalOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle className='font-black'>Cập nhật báo giá mới (.xlsx)</DialogTitle>
        <DialogContent>
          <Typography variant='body2' className='mbe-4'>Tải lên file báo giá mới của <strong>{supplierInfo.name}</strong> để cập nhật giá vốn toàn hệ thống.</Typography>
          <Box className='p-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer'>
            <Avatar className='bg-primary/10 text-primary w-12 h-12 mbe-3'>
              <i className='tabler-cloud-upload text-2xl' />
            </Avatar>
            <Typography variant='body2' className='font-black'>Kéo thả file Excel vào đây hoặc click để chọn</Typography>
            <Typography variant='caption' className='text-slate-400'>Hỗ trợ .xlsx, .xls (Tối đa 20MB)</Typography>
          </Box>
        </DialogContent>
        <DialogActions className='p-6'>
          <Button color='secondary' onClick={() => setIsUploadModalOpen(false)} disabled={isUpdating}>Hủy</Button>
          <Button 
            variant='contained' 
            onClick={handleUpdateQuotes} 
            disabled={isUpdating}
            startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isUpdating ? 'Đang cập nhật...' : 'Bắt đầu cập nhật giá'}
          </Button>
        </DialogActions>
      </Dialog>
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
                      <Typography variant='body2' className='text-slate-500'>{supplierInfo.name}</Typography>
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
                        <Chip 
                          label={selectedPkg.status === 'Active' ? 'Đang bán' : 'Tạm dừng'} 
                          size='small' 
                          color={selectedPkg.status === 'Active' ? 'success' : 'secondary'} 
                          variant='tonal' 
                          className='font-black text-[10px] mbs-1' 
                        />
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
    </>
  )
}

export default SupplierPackages
