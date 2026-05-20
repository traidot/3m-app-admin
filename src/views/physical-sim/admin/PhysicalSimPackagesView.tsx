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
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'

import PageHeader from '@/components/layout/shared/PageHeader'

interface PackageItem {
  id: string
  code: string
  name: string
  supplier: 'Hồng Kông' | 'Mỹ'
  type: 'Daily' | 'Total'
  dataCap: string
  duration: number
  baseCost: number
  agentPrice: number
  status: 'Đang hoạt động' | 'Tạm ngưng'
}

interface MockAgent {
  id: string
  name: string
  tier: 'PLATINUM' | 'GOLD' | 'BRONZE'
  discountPercent: number
}

const PhysicalSimPackagesView = () => {
  // Mock initial package list
  const [packages, setPackages] = useState<PackageItem[]>([
    {
      id: 'PKG-1',
      code: 'HK-DAILY1',
      name: 'HK Daily Essential',
      supplier: 'Hồng Kông',
      type: 'Daily',
      dataCap: '1GB/Ngày',
      duration: 1,
      baseCost: 10000,
      agentPrice: 15000,
      status: 'Đang hoạt động'
    },
    {
      id: 'PKG-2',
      code: 'HK-DAILY3',
      name: 'HK Daily HighCap',
      supplier: 'Hồng Kông',
      type: 'Daily',
      dataCap: '3GB/Ngày',
      duration: 3,
      baseCost: 30000,
      agentPrice: 45000,
      status: 'Đang hoạt động'
    },
    {
      id: 'PKG-3',
      code: 'HK-PRO10',
      name: 'HK Pro Traveler 30D',
      supplier: 'Hồng Kông',
      type: 'Total',
      dataCap: '10GB',
      duration: 30,
      baseCost: 70000,
      agentPrice: 90000,
      status: 'Đang hoạt động'
    },
    {
      id: 'PKG-4',
      code: 'US-TRAVEL5',
      name: 'US Travel Lite 5D',
      supplier: 'Mỹ',
      type: 'Total',
      dataCap: '5GB',
      duration: 5,
      baseCost: 95000,
      agentPrice: 120000,
      status: 'Đang hoạt động'
    },
    {
      id: 'PKG-5',
      code: 'US-UNLIMITED7',
      name: 'US Unlimited Premium',
      supplier: 'Mỹ',
      type: 'Total',
      dataCap: 'Không giới hạn',
      duration: 7,
      baseCost: 190000,
      agentPrice: 250000,
      status: 'Đang hoạt động'
    }
  ])

  // Mock Agents for Personalized Price monitoring
  const mockAgents: MockAgent[] = [
    { id: 'A001', name: 'TravelConnect Solutions', tier: 'PLATINUM', discountPercent: 15 },
    { id: 'A002', name: 'Global eSIM Hub', tier: 'GOLD', discountPercent: 10 },
    { id: 'A003', name: 'Việt Nam Sim Tour', tier: 'BRONZE', discountPercent: 5 }
  ]

  const [selectedAgentId, setSelectedAgentId] = useState<string>('all')
  const selectedAgent = mockAgents.find(a => a.id === selectedAgentId)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dataFilter, setDataFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Dialog control state (CRUD)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null)

  // Import Dialog states
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importSelectedList, setImportSelectedList] = useState<string[]>([])

  // Form inputs state
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [supplier, setSupplier] = useState<'Hồng Kông' | 'Mỹ'>('Hồng Kông')
  const [type, setType] = useState<'Daily' | 'Total'>('Daily')
  const [dataCap, setDataCap] = useState('')
  const [duration, setDuration] = useState<number>(1)
  const [baseCost, setBaseCost] = useState<number>(0)
  const [agentPrice, setAgentPrice] = useState<number>(0)
  const [status, setStatus] = useState<boolean>(true)

  // Catalog packages ready to import
  const mockCatalogPackages = [
    { sku: 'HK-SUPREME15', name: 'HK Supreme Unlimited 15D', supplier: 'Hồng Kông' as const, type: 'Total' as const, dataCap: '15GB', duration: 15, baseCost: 110000, agentPrice: 145000 },
    { sku: 'US-WEEKLY10', name: 'US Super Fast 7D', supplier: 'Mỹ' as const, type: 'Daily' as const, dataCap: '2GB/Ngày', duration: 7, baseCost: 130000, agentPrice: 170000 },
    { sku: 'HK-DAILY5', name: 'HK Daily Extra 5D', supplier: 'Hồng Kông' as const, type: 'Daily' as const, dataCap: '5GB/Ngày', duration: 5, baseCost: 55000, agentPrice: 75000 },
    { sku: 'US-PRO30', name: 'US Long Stay Pro 30D', supplier: 'Mỹ' as const, type: 'Total' as const, dataCap: '30GB', duration: 30, baseCost: 320000, agentPrice: 420000 }
  ]

  // Statistics
  const totalPackages = packages.length
  const activePackages = packages.filter(p => p.status === 'Đang hoạt động').length
  const hkPackages = packages.filter(p => p.supplier === 'Hồng Kông').length
  const usPackages = packages.filter(p => p.supplier === 'Mỹ').length

  const avgProfitPercent = totalPackages > 0
    ? Math.round(
        (packages.reduce((sum, p) => sum + ((p.agentPrice - p.baseCost) / p.agentPrice), 0) / totalPackages) * 100
      )
    : 0

  // Distinct lists for data cap and duration
  const distinctDataCaps = Array.from(new Set(packages.map(p => p.dataCap)))
  const distinctDurations = Array.from(new Set(packages.map(p => p.duration))).sort((a, b) => a - b)

  // Filter Logic
  const filteredPackages = packages.filter(p => {
    const matchesSearch = p.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSupplier = supplierFilter === 'all' || p.supplier === supplierFilter
    const matchesType = typeFilter === 'all' || p.type === typeFilter
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    const matchesData = dataFilter === 'all' || p.dataCap === dataFilter
    const matchesDuration = durationFilter === 'all' || p.duration.toString() === durationFilter

    return matchesSearch && matchesSupplier && matchesType && matchesStatus && matchesData && matchesDuration
  })

  // Import Dialog Checkbox Toggle
  const handleToggleImportSelect = (sku: string) => {
    setImportSelectedList(prev => 
      prev.includes(sku) ? prev.filter(item => item !== sku) : [...prev, sku]
    )
  }

  // Import Dialog Submit Action
  const handleImportConfirm = () => {
    if (importSelectedList.length === 0) {
      alert('Vui lòng chọn ít nhất một gói cước để import!')
      return
    }

    const packagesToImport = mockCatalogPackages.filter(p => importSelectedList.includes(p.sku))
    
    // Skip duplicate codes
    const existingCodes = packages.map(p => p.code)
    const newItems: PackageItem[] = []

    packagesToImport.forEach(p => {
      if (existingCodes.includes(p.sku)) {
        alert(`Gói cước với mã ${p.sku} đã tồn tại trong danh sách!`)
        return
      }
      newItems.push({
        id: `PKG-${Date.now()}-${p.sku}`,
        code: p.sku,
        name: p.name,
        supplier: p.supplier,
        type: p.type,
        dataCap: p.dataCap,
        duration: p.duration,
        baseCost: p.baseCost,
        agentPrice: p.agentPrice,
        status: 'Đang hoạt động'
      })
    })

    if (newItems.length > 0) {
      setPackages(prev => [...prev, ...newItems])
      alert(`Đã import thành công ${newItems.length} gói cước mới vào danh sách SIM Vật lý!`)
    }

    setIsImportOpen(false)
    setImportSelectedList([])
  }

  // Open Form for Create (Manual Add option preserved as secondary)
  const handleOpenCreate = () => {
    setEditingPkg(null)
    setCode('')
    setName('')
    setSupplier('Hồng Kông')
    setType('Daily')
    setDataCap('1GB/Ngày')
    setDuration(1)
    setBaseCost(15000)
    setAgentPrice(25000)
    setStatus(true)
    setIsFormOpen(true)
  }

  // Open Form for Edit
  const handleOpenEdit = (pkg: PackageItem) => {
    setEditingPkg(pkg)
    setCode(pkg.code)
    setName(pkg.name)
    setSupplier(pkg.supplier)
    setType(pkg.type)
    setDataCap(pkg.dataCap)
    setDuration(pkg.duration)
    setBaseCost(pkg.baseCost)
    setAgentPrice(pkg.agentPrice)
    setStatus(pkg.status === 'Đang hoạt động')
    setIsFormOpen(true)
  }

  // Save Form Handler
  const handleSave = () => {
    if (!code || !name || !dataCap || duration <= 0 || baseCost < 0 || agentPrice <= 0) {
      alert('Vui lòng điền đầy đủ và chính xác tất cả các trường thông tin!')
      return
    }

    if (editingPkg) {
      // Edit
      setPackages(prev => prev.map(p => p.id === editingPkg.id ? {
        ...p,
        code,
        name,
        supplier,
        type,
        dataCap,
        duration,
        baseCost,
        agentPrice,
        status: status ? 'Đang hoạt động' : 'Tạm ngưng'
      } : p))
    } else {
      // Create
      const newPkg: PackageItem = {
        id: `PKG-${Date.now()}`,
        code,
        name,
        supplier,
        type,
        dataCap,
        duration,
        baseCost,
        agentPrice,
        status: status ? 'Đang hoạt động' : 'Tạm ngưng'
      }
      setPackages(prev => [...prev, newPkg])
    }
    setIsFormOpen(false)
  }

  // Toggle status directly in list
  const handleToggleStatus = (id: string) => {
    setPackages(prev => prev.map(p => p.id === id ? {
      ...p,
      status: p.status === 'Đang hoạt động' ? 'Tạm ngưng' : 'Đang hoạt động'
    } : p))
  }

  // Delete Handler
  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa gói cước này khỏi hệ thống không?')) {
      setPackages(prev => prev.filter(p => p.id !== id))
    }
  }

  const getSupplierAvatar = (supplier: string) => {
    switch (supplier) {
      case 'Hồng Kông': return { bg: '#FF4D4D', char: 'H' }
      case 'Mỹ': return { bg: '#0090FF', char: 'M' }
      default: return { bg: '#7367F0', char: 'S' }
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'primary'
      case 'GOLD': return 'warning'
      case 'BRONZE': return 'secondary'
      default: return 'default'
    }
  }

  return (
    <>
      <PageHeader
        title="Quản lý Gói cước SIM Vật lý"
        description="Cấu hình định mức giá nhập kho, giá bán chuẩn và kiểm tra bảng giá đại lý cá nhân hóa theo từng tài khoản."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/3m/dashboard' },
          { label: 'Kho SIM Vật lý' },
          { label: 'Quản lý Gói cước' }
        ]}
        className='mbe-6'
      />

      {/* Statistics Summary Cards */}
      <Grid2 container spacing={4} className='mbe-6'>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-primary/5 border border-primary/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Tổng số gói cước</Typography>
                <Typography variant='h5' className='font-black text-primary'>{totalPackages} gói</Typography>
                <Typography variant='caption' color='textSecondary' className='text-[10px] block mt-1'>Đang hoạt động: <b>{activePackages}</b></Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'primary.tonal', color: 'primary.main', width: 42, height: 42 }}>
                <i className='tabler-packages text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-error/5 border border-error/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Gói cước Hồng Kông</Typography>
                <Typography variant='h5' className='font-black text-error'>{hkPackages} gói</Typography>
                <Typography variant='caption' color='textSecondary' className='text-[10px] block mt-1'>Kênh cung cấp HK Telecom</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'error.tonal', color: 'error.main', width: 42, height: 42 }}>
                <i className='tabler-world text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-info/5 border border-info/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Gói cước Mỹ</Typography>
                <Typography variant='h5' className='font-black text-info'>{usPackages} gói</Typography>
                <Typography variant='caption' color='textSecondary' className='text-[10px] block mt-1'>Mạng roaming US T-Mobile</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'info.tonal', color: 'info.main', width: 42, height: 42 }}>
                <i className='tabler-plane-departure text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm bg-success/5 border border-success/10'>
            <CardContent className='p-4 flex items-center justify-between'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[10px] block mbe-1'>Lợi nhuận dự kiến TB</Typography>
                <Typography variant='h5' className='font-black text-success'>{avgProfitPercent}%</Typography>
                <Typography variant='caption' color='textSecondary' className='text-[10px] block mt-1'>Tính trên doanh số đại lý</Typography>
              </Box>
              <Avatar variant='rounded' sx={{ bgcolor: 'success.tonal', color: 'success.main', width: 42, height: 42 }}>
                <i className='tabler-trending-up text-xl' />
              </Avatar>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Admin Price Personalization Panel */}
      <Card className='border-none shadow-sm mbe-6 bg-warning/5 border border-warning/10'>
        <CardContent className='p-5'>
          <Grid2 container spacing={4} alignItems='center' justifyContent='space-between'>
            <Grid2 size={{ xs: 12, md: 7 }} className='flex items-start gap-4'>
              <Avatar variant='rounded' sx={{ bgcolor: 'warning.tonal', color: 'warning.main', width: 44, height: 44 }}>
                <i className='tabler-adjustments-alt text-2xl' />
              </Avatar>
              <Box>
                <Box className='flex items-center gap-2 mbe-1'>
                  <Typography variant='h6' className='font-black text-warning'>
                    Giám sát & Tính Giá Cá Nhân Hóa Theo Đại Lý
                  </Typography>
                  {selectedAgent && (
                    <Chip 
                      label={`Tier ${selectedAgent.tier}: -${selectedAgent.discountPercent}%`} 
                      color='warning' 
                      size='small' 
                      className='font-black text-[9px] h-5'
                    />
                  )}
                </Box>
                <Typography variant='body2' className='text-slate-600 font-medium'>
                  {selectedAgentId === 'all' 
                    ? 'Đang xem bảng giá Bán lẻ Chuẩn của hệ thống. Bạn có thể chọn một đại lý cụ thể bên phải để kiểm tra chính xác bảng giá cá nhân hóa của họ.' 
                    : `Hệ thống đang hiển thị bảng giá được chiết khấu riêng cho đại lý <strong>${selectedAgent?.name}</strong>. Cột Đơn giá Đại lý và Lợi nhuận đã được cập nhật tương ứng.`
                  }
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }} className='flex items-center gap-3 justify-end'>
              <Typography variant='subtitle2' className='font-black text-slate-500 text-xs uppercase whitespace-nowrap'>
                Chọn đại lý kiểm tra:
              </Typography>
              <Select 
                size='small' 
                value={selectedAgentId} 
                onChange={e => setSelectedAgentId(e.target.value)}
                fullWidth
                className='bg-white'
              >
                <MenuItem value='all'>Tất cả đại lý (Giá gốc chuẩn)</MenuItem>
                {mockAgents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.tier})
                  </MenuItem>
                ))}
              </Select>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Advanced Filters & Create Button */}
      <Card className='border-none shadow-sm mbe-6'>
        <CardContent>
          <Grid2 container spacing={4} alignItems='center'>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Tìm kiếm gói</Typography>
              <TextField
                fullWidth
                size='small'
                placeholder='Nhập mã gói hoặc tên gói cước...'
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
            <Grid2 size={{ xs: 12, sm: 6, md: 1.5 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Quốc gia</Typography>
              <Select fullWidth size='small' value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='Hồng Kông'>Hồng Kông</MenuItem>
                <MenuItem value='Mỹ'>Mỹ</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 1.5 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Loại (Type)</Typography>
              <Select fullWidth size='small' value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='Daily'>Daily</MenuItem>
                <MenuItem value='Total'>Total</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 1.5 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Dung lượng</Typography>
              <Select fullWidth size='small' value={dataFilter} onChange={e => setDataFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả</MenuItem>
                {distinctDataCaps.map(cap => (
                  <MenuItem key={cap} value={cap}>{cap}</MenuItem>
                ))}
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 1.5 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Số ngày</Typography>
              <Select fullWidth size='small' value={durationFilter} onChange={e => setDurationFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả</MenuItem>
                {distinctDurations.map(day => (
                  <MenuItem key={day} value={day.toString()}>{day} ngày</MenuItem>
                ))}
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 1.5 }}>
              <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500'>Trạng thái</Typography>
              <Select fullWidth size='small' value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <MenuItem value='all'>Tất cả</MenuItem>
                <MenuItem value='Đang hoạt động'>Hoạt động</MenuItem>
                <MenuItem value='Tạm ngưng'>Tạm ngưng</MenuItem>
              </Select>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 1.5 }} className='text-right mt-4 md:mt-0'>
              <Button 
                variant='contained' 
                color='primary' 
                startIcon={<i className='tabler-download text-xs' />}
                onClick={() => setIsImportOpen(true)}
                fullWidth
                size='small'
                className='py-2 font-bold text-xs'
              >
                Import gói
              </Button>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      {/* Package Management List */}
      <Card className='border-none shadow-sm overflow-hidden'>
        {selectedAgentId !== 'all' && (
          <Box className='p-3 bg-warning/10 border-b border-warning/15 flex items-center justify-between'>
            <Typography variant='body2' className='font-black text-warning text-xs flex items-center gap-1'>
              <i className='tabler-alert-circle text-sm' />
              Chế độ giám sát: Đang hiển thị bảng giá đã áp dụng chiết khấu Cấp {selectedAgent?.tier} (-{selectedAgent?.discountPercent}%) cho đại lý. Tính năng chỉnh sửa trực tiếp bị khóa.
            </Typography>
            <Button size='small' color='warning' className='font-black text-[10px] py-0' onClick={() => setSelectedAgentId('all')}>
              Quay lại Giá Gốc chuẩn
            </Button>
          </Box>
        )}
        <TableContainer>
          <Table>
            <TableHead className='bg-slate-50'>
              <TableRow>
                <TableCell className='font-bold text-xs uppercase'>Mã gói</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Tên gói cước</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Nhà mạng phôi</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Dạng gói</TableCell>
                <TableCell className='font-bold text-xs uppercase'>Dung lượng</TableCell>
                <TableCell className='font-bold text-xs uppercase text-center'>Số ngày</TableCell>
                <TableCell className='font-bold text-xs uppercase text-right'>Giá gốc nhập</TableCell>
                <TableCell className='font-bold text-xs uppercase text-right bg-primary/5 text-primary border-l-2 border-primary'>Giá bán đại lý</TableCell>
                <TableCell className='font-bold text-xs uppercase text-right'>Lợi nhuận</TableCell>
                <TableCell className='font-bold text-xs uppercase text-center'>Trạng thái</TableCell>
                <TableCell className='font-bold text-xs uppercase text-center'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => {
                  const avatar = getSupplierAvatar(pkg.supplier)
                  
                  // Calculate discount if an agent is selected
                  const discountPercent = selectedAgent ? selectedAgent.discountPercent : 0
                  const agentPriceVal = selectedAgent ? pkg.agentPrice * (1 - discountPercent / 100) : pkg.agentPrice
                  const profitVal = agentPriceVal - pkg.baseCost
                  const profitPct = agentPriceVal > 0 ? Math.round((profitVal / agentPriceVal) * 100) : 0

                  return (
                    <TableRow key={pkg.id} hover>
                      <TableCell className='font-mono font-bold text-slate-800 text-xs'>{pkg.code}</TableCell>
                      <TableCell className='font-bold text-slate-700'>{pkg.name}</TableCell>
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
                            {pkg.supplier}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pkg.type === 'Daily' ? 'Daily (Ngày)' : 'Total (Tổng)'}
                          color={pkg.type === 'Daily' ? 'info' : 'warning'}
                          size='small'
                          variant='tonal'
                          className='font-bold text-[10px]'
                        />
                      </TableCell>
                      <TableCell className='font-semibold text-slate-600 text-xs'>{pkg.dataCap}</TableCell>
                      <TableCell className='text-center font-bold text-slate-700'>{pkg.duration} ngày</TableCell>
                      <TableCell className='text-right font-medium text-slate-500'>
                        {pkg.baseCost.toLocaleString('vi-VN')} đ
                      </TableCell>
                      <TableCell className='text-right font-black text-primary bg-primary/5 border-l-2 border-primary'>
                        {selectedAgent && (
                          <Typography variant='caption' className='text-slate-400 block line-through text-[10px] font-normal'>
                            {pkg.agentPrice.toLocaleString('vi-VN')} đ
                          </Typography>
                        )}
                        <Typography variant='body2' className='font-black'>
                          {agentPriceVal.toLocaleString('vi-VN')} đ
                        </Typography>
                        {selectedAgent && (
                          <Chip 
                            label={`Cấp ${selectedAgent.tier} (-${selectedAgent.discountPercent}%)`} 
                            color={getTierColor(selectedAgent.tier) as any} 
                            size='small' 
                            variant='tonal'
                            className='font-black text-[8px] h-4 mt-1 px-1'
                          />
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Typography variant='body2' className={`font-black text-xs ${profitVal >= 0 ? 'text-success' : 'text-error'}`}>
                          {profitVal >= 0 ? '+' : ''}{profitVal.toLocaleString('vi-VN')} đ
                        </Typography>
                        <Typography variant='caption' className='text-slate-400 text-[10px] block'>
                          ({profitPct}%)
                        </Typography>
                      </TableCell>
                      <TableCell className='text-center'>
                        <FormControlLabel
                          control={
                            <Switch 
                              size='small' 
                              checked={pkg.status === 'Đang hoạt động'} 
                              onChange={() => handleToggleStatus(pkg.id)}
                              color='success'
                              disabled={selectedAgentId !== 'all'}
                            />
                          }
                          label={
                            <Typography variant='caption' className={`font-bold text-[10px] ${pkg.status === 'Đang hoạt động' ? 'text-success' : 'text-slate-400'}`}>
                              {pkg.status}
                            </Typography>
                          }
                          sx={{ m: 0 }}
                        />
                      </TableCell>
                      <TableCell className='text-center'>
                        {selectedAgentId === 'all' ? (
                          <Stack direction='row' spacing={1} justifyContent='center'>
                            <Tooltip title="Chỉnh sửa gói cước">
                              <IconButton size='small' color='primary' onClick={() => handleOpenEdit(pkg)}>
                                <i className='tabler-edit text-[18px]' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa gói cước">
                              <IconButton size='small' color='error' onClick={() => handleDelete(pkg.id)}>
                                <i className='tabler-trash text-[18px]' />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Chip 
                            label="Đã khóa cấu hình" 
                            color="secondary" 
                            size="small" 
                            variant="tonal" 
                            className="font-bold text-[9px] h-5"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align='center' sx={{ py: 6 }}>
                    <Typography color='textSecondary' variant='body2'>
                      Không tìm thấy gói cước nào khớp với bộ lọc cấu hình.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Import Gói cước Dialog */}
      <Dialog
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle component='div' className='flex items-center justify-between border-b p-5'>
          <Typography variant='h5' className='font-black flex items-center gap-2'>
            <i className='tabler-download text-primary' />
            Import Gói cước từ Danh mục eSIM
          </Typography>
          <IconButton onClick={() => setIsImportOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          <Typography variant='body2' className='text-slate-500 mbe-4 font-medium'>
            Chọn các gói cước đang có sẵn trên Chợ eSIM (eSIM Marketplace) để tích hợp và nạp trực tiếp cho Phôi SIM vật lý.
          </Typography>
          <TableContainer className='border rounded-lg overflow-hidden'>
            <Table>
              <TableHead className='bg-slate-50'>
                <TableRow>
                  <TableCell padding='checkbox' align='center'>
                    <i className='tabler-square-check text-slate-400' />
                  </TableCell>
                  <TableCell className='font-bold text-xs uppercase'>Mã SKU</TableCell>
                  <TableCell className='font-bold text-xs uppercase'>Tên gói cước</TableCell>
                  <TableCell className='font-bold text-xs uppercase'>Vùng mạng</TableCell>
                  <TableCell className='font-bold text-xs uppercase'>Dung lượng</TableCell>
                  <TableCell className='font-bold text-xs uppercase text-center'>Số ngày</TableCell>
                  <TableCell className='font-bold text-xs uppercase text-right'>Giá gốc</TableCell>
                  <TableCell className='font-bold text-xs uppercase text-right'>Đơn giá đại lý chuẩn</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCatalogPackages.map((pkg) => {
                  const isChecked = importSelectedList.includes(pkg.sku)
                  const isAlreadyExists = packages.some(p => p.code === pkg.sku)
                  
                  return (
                    <TableRow 
                      key={pkg.sku} 
                      hover 
                      selected={isChecked} 
                      onClick={() => !isAlreadyExists && handleToggleImportSelect(pkg.sku)}
                      sx={{ cursor: isAlreadyExists ? 'not-allowed' : 'pointer', opacity: isAlreadyExists ? 0.6 : 1 }}
                    >
                      <TableCell padding='checkbox' align='center'>
                        <Checkbox 
                          size='small' 
                          checked={isChecked || isAlreadyExists} 
                          disabled={isAlreadyExists}
                        />
                      </TableCell>
                      <TableCell className='font-mono font-bold text-xs text-slate-800'>{pkg.sku}</TableCell>
                      <TableCell className='font-bold text-slate-700'>{pkg.name}</TableCell>
                      <TableCell>
                        <Chip label={pkg.supplier} size='small' variant='tonal' color={pkg.supplier === 'Hồng Kông' ? 'error' : 'info'} className='font-bold text-[10px]' />
                      </TableCell>
                      <TableCell className='font-semibold text-slate-600 text-xs'>{pkg.dataCap}</TableCell>
                      <TableCell className='text-center font-bold text-slate-700'>{pkg.duration} ngày</TableCell>
                      <TableCell className='text-right font-medium text-slate-500'>{pkg.baseCost.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell className='text-right font-black text-slate-800'>{pkg.agentPrice.toLocaleString('vi-VN')} đ</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box className='mt-4 flex justify-between items-center bg-primary/5 p-3 rounded-lg border border-primary/10'>
            <Typography variant='caption' className='text-primary font-black text-xs'>
              <i className='tabler-info-circle text-xs mr-1' />
              Các gói đã được cấu hình trong hệ thống SIM vật lý sẽ hiển thị trạng thái đã chọn và bị vô hiệu hóa chọn lại.
            </Typography>
            <Typography variant='subtitle2' className='font-black text-slate-700'>
              Đã chọn: <span className='text-primary'>{importSelectedList.length} gói</span>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className='p-6 pt-0 border-t mt-4'>
          <Button variant='tonal' color='secondary' onClick={() => setIsImportOpen(false)}>Hủy</Button>
          <Button 
            variant='contained' 
            color='primary' 
            onClick={handleImportConfirm}
            disabled={importSelectedList.length === 0}
            startIcon={<i className='tabler-download' />}
          >
            Import {importSelectedList.length} gói cước
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add / Edit Dialog Form */}
      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle component='div' className='flex items-center justify-between border-b p-5'>
          <Typography variant='h5' className='font-black'>
            {editingPkg ? 'Chỉnh sửa Gói cước' : 'Thêm Gói cước SIM Vật lý mới'}
          </Typography>
          <IconButton onClick={() => setIsFormOpen(false)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-6'>
          <Stack spacing={4} className='mt-2'>
            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant='subtitle2' className='font-black mbe-1 uppercase text-[10px] text-slate-500'>Mã gói cước (Không khoảng trống)</Typography>
                <TextField 
                  fullWidth 
                  size='small' 
                  placeholder='Ví dụ: HK-DAILY2' 
                  value={code} 
                  onChange={e => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  disabled={!!editingPkg}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant='subtitle2' className='font-black mbe-1 uppercase text-[10px] text-slate-500'>Tên hiển thị gói</Typography>
                <TextField 
                  fullWidth 
                  size='small' 
                  placeholder='Ví dụ: HK Daily Premium' 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant='subtitle2' className='font-black mbe-1 uppercase text-[10px] text-slate-500'>Nhà mạng phôi hỗ trợ</Typography>
                <Select fullWidth size='small' value={supplier} onChange={e => setSupplier(e.target.value as any)}>
                  <MenuItem value='Hồng Kông'>Hồng Kông (HK Telecom)</MenuItem>
                  <MenuItem value='Mỹ'>Mỹ (T-Mobile Roaming)</MenuItem>
                </Select>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant='subtitle2' className='font-black mbe-1 uppercase text-[10px] text-slate-500'>Dạng gói cước</Typography>
                <Select fullWidth size='small' value={type} onChange={e => setType(e.target.value as any)}>
                  <MenuItem value='Daily'>Daily (Theo ngày, reset mỗi đêm)</MenuItem>
                  <MenuItem value='Total'>Total (Tổng dung lượng cố định)</MenuItem>
                </Select>
              </Grid2>
            </Grid2>

            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant='subtitle2' className='font-black mbe-1 uppercase text-[10px] text-slate-500'>Dung lượng mạng</Typography>
                <TextField 
                  fullWidth 
                  size='small' 
                  placeholder='Ví dụ: 2GB/Ngày, 15GB hoặc Không giới hạn' 
                  value={dataCap} 
                  onChange={e => setDataCap(e.target.value)}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant='subtitle2' className='font-black mbe-1 uppercase text-[10px] text-slate-500'>Chu kỳ sử dụng (Ngày)</Typography>
                <TextField 
                  fullWidth 
                  size='small' 
                  type='number' 
                  placeholder='Số ngày sử dụng' 
                  value={duration} 
                  onChange={e => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant='subtitle2' className='font-black mbe-1 uppercase text-[10px] text-slate-500'>Giá gốc nhập kho (Base Cost)</Typography>
                <TextField 
                  fullWidth 
                  size='small' 
                  type='number' 
                  placeholder='Đơn vị: VNĐ' 
                  value={baseCost} 
                  onChange={e => setBaseCost(Math.max(0, parseInt(e.target.value) || 0))}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>đ</InputAdornment>
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant='subtitle2' className='font-black mbe-1 uppercase text-[10px] text-slate-500'>Giá bán Đại lý (Agent Price)</Typography>
                <TextField 
                  fullWidth 
                  size='small' 
                  type='number' 
                  placeholder='Đơn vị: VNĐ' 
                  value={agentPrice} 
                  onChange={e => setAgentPrice(Math.max(0, parseInt(e.target.value) || 0))}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>đ</InputAdornment>
                  }}
                />
              </Grid2>
            </Grid2>

            <Box className='p-3 bg-success/5 border border-success/15 rounded-lg flex justify-between items-center'>
              <Box>
                <Typography variant='caption' color='textSecondary' className='uppercase font-black text-[9px] block'>Tỷ suất lợi nhuận thu về</Typography>
                <Typography variant='h6' className='font-black text-success'>
                  +{Math.max(0, agentPrice - baseCost).toLocaleString('vi-VN')} đ ({agentPrice > 0 ? Math.round(((agentPrice - baseCost) / agentPrice) * 100) : 0}%)
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch 
                    checked={status} 
                    onChange={e => setStatus(e.target.checked)} 
                    color='success'
                  />
                }
                label={<span className='font-bold text-xs'>Hoạt động</span>}
                sx={{ m: 0 }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button variant='tonal' color='secondary' onClick={() => setIsFormOpen(false)}>Hủy</Button>
          <Button variant='contained' color='primary' onClick={handleSave}>
            {editingPkg ? 'Lưu chỉnh sửa' : 'Thêm gói cước'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PhysicalSimPackagesView
