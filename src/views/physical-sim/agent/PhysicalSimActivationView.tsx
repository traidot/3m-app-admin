'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Grid2 from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Link from 'next/link'

import PageHeader from '@/components/layout/shared/PageHeader'

const PhysicalSimActivationView = () => {
  const searchParams = useSearchParams()
  const queryIccid = searchParams ? searchParams.get('iccid') : ''

  // Input state
  const [iccid, setIccid] = useState('')
  const [detectedSim, setDetectedSim] = useState<any>(null)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  
  // Operational states
  const [isActivating, setIsActivating] = useState(false)
  const [activationResult, setActivationResult] = useState<any>(null)
  const [isResultOpen, setIsResultOpen] = useState(false)

  // Filter States for Step 2
  const [filterCountry, setFilterCountry] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterData, setFilterData] = useState('all')
  const [filterDays, setFilterDays] = useState('all')

  // Mock list of ready SIMs in agent's inventory
  const readyBlankSims = [
    { iccid: '8985209000000000010', supplier: 'Hồng Kông', serialNumber: 'SN-HKG-00201' },
    { iccid: '8985209000000000011', supplier: 'Hồng Kông', serialNumber: 'SN-HKG-00202' },
    { iccid: '8981209000000000401', supplier: 'Mỹ', serialNumber: 'SN-USA-00401' },
    { iccid: '8981209000000000402', supplier: 'Mỹ', serialNumber: 'SN-USA-00402' }
  ]

  // Mock Packages based on carrier
  const packagesList: any = {
    'Hồng Kông': [
      { id: 'HK-PRO10', name: 'HK-PRO10', data: '10GB Data', validity: '30 Ngày', price: 90000, dataQuota: '10GB Tốc độ cao (4G/5G)', calls: '100 Phút gọi nội địa', network: 'CSL HK Network', description: 'Gói cước data tốc độ cao, hỗ trợ hotspot chia sẻ internet.', country: 'Hồng Kông', type: 'total', dataVal: 10, days: 30 },
      { id: 'HK-MAX50', name: 'HK-MAX50', data: '50GB Data', validity: '30 Ngày', price: 150000, dataQuota: '50GB Tốc độ cao (4G/5G)', calls: '300 Phút gọi nội địa', network: '3HK Network', description: 'Dung lượng cực khủng phù hợp cho nhu cầu làm việc và công tác lâu dài.', country: 'Hồng Kông', type: 'total', dataVal: 50, days: 30 },
      { id: 'HK-DAILY1', name: 'HK-DAILY1', data: '1GB Data', validity: '1 Ngày', price: 10000, dataQuota: '1GB Tốc độ cao / Ngày', calls: 'Không hỗ trợ gọi', network: 'China Mobile HK', description: 'Gói ngắn hạn tiết kiệm cho khách trung chuyển hoặc ở lại 1 ngày.', country: 'Hồng Kông', type: 'daily', dataVal: 1, days: 1 },
      { id: 'HK-JP-TRAVEL7', name: 'HK-JP-TRAVEL7', data: '10GB Data', validity: '7 Ngày', price: 180000, dataQuota: '10GB Tốc độ cao tại Nhật', calls: 'Không hỗ trợ gọi', network: 'Softbank Roaming', description: 'Gói du lịch Nhật Bản tốc độ cao, roaming ổn định.', country: 'Nhật Bản', type: 'total', dataVal: 10, days: 7 },
      { id: 'HK-KR-DAILY5', name: 'HK-KR-DAILY5', data: '2GB/Ngày Data', validity: '5 Ngày', price: 120000, dataQuota: '2GB Tốc độ cao / Ngày', calls: 'Không hỗ trợ gọi', network: 'SK Telecom Roaming', description: 'Gói ngày tiện lợi khi đi du lịch Hàn Quốc.', country: 'Hàn Quốc', type: 'daily', dataVal: 2, days: 5 },
      { id: 'HK-VN-DAILY30', name: 'HK-VN-DAILY30', data: '4GB/Ngày Data', validity: '30 Ngày', price: 110000, dataQuota: '4GB Tốc độ cao / Ngày', calls: 'Miễn phí gọi nội mạng', network: 'Viettel Roaming', description: 'Gói cước data theo ngày siêu rẻ cho khách du lịch Việt Nam.', country: 'Việt Nam', type: 'daily', dataVal: 4, days: 30 }
    ],
    'Mỹ': [
      { id: 'US-TRAVEL5', name: 'US-TRAVEL5', data: '5GB Data', validity: '5 Ngày', price: 120000, dataQuota: '5GB Tốc độ cao (5G LTE)', calls: 'Miễn phí cuộc gọi nội bộ', network: 'T-Mobile USA', description: 'Gói du lịch Mỹ hoàn hảo, sóng tốt tại hầu hết các bang.', country: 'Mỹ', type: 'total', dataVal: 5, days: 5 },
      { id: 'US-FAST15', name: 'US-FAST15', data: '15GB Data', validity: '15 Ngày', price: 250000, dataQuota: '15GB Tốc độ cao (5G LTE)', calls: '150 phút nội mạng & quốc tế', network: 'AT&T USA', description: 'Kết nối ổn định, tốc độ load mượt mà thích hợp cho du lịch tự túc.', country: 'Mỹ', type: 'total', dataVal: 15, days: 15 },
      { id: 'US-UNLIMITED', name: 'US-UNLIMITED', data: 'Không giới hạn', validity: '30 Ngày', price: 600000, dataQuota: 'Không giới hạn Dung lượng', calls: 'Không giới hạn gọi & SMS nội địa', network: 'Verizon Wireless', description: 'Đỉnh cao kết nối Mỹ với Data và gọi thoại hoàn toàn không giới hạn.', country: 'Mỹ', type: 'total', dataVal: 'unlimited', days: 30 },
      { id: 'US-CA-MX-TRAVEL15', name: 'US-CA-MX-TRAVEL15', data: '20GB Data', validity: '15 Ngày', price: 450000, dataQuota: '20GB Roaming Bắc Mỹ', calls: 'Miễn phí thoại Bắc Mỹ', network: 'Rogers/Telcel', description: 'Gói liên minh Bắc Mỹ, tự động chuyển vùng Mỹ - Canada - Mexico cực mượt.', country: 'Canada & Mexico', type: 'total', dataVal: 20, days: 15 },
      { id: 'US-DAILY2', name: 'US-DAILY2', data: '2GB/Ngày Data', validity: '10 Ngày', price: 190000, dataQuota: '2GB Tốc độ cao / Ngày', calls: 'Không hỗ trợ gọi', network: 'T-Mobile USA', description: 'Gói data theo ngày cực kỳ tối ưu cho chuyến đi Mỹ 10 ngày.', country: 'Mỹ', type: 'daily', dataVal: 2, days: 10 }
    ]
  }

  // Pre-fill ICCID if query param exists
  useEffect(() => {
    if (queryIccid) {
      setIccid(queryIccid)
      handleCheckIccid(queryIccid)
    }
  }, [queryIccid])

  const handleCheckIccid = (targetIccid: string) => {
    const sim = readyBlankSims.find(s => s.iccid === targetIccid)
    if (sim) {
      setDetectedSim(sim)
      // Reset filters when detected SIM changes
      setFilterCountry('all')
      setFilterType('all')
      setFilterData('all')
      setFilterDays('all')
      
      // Auto select first package of this carrier
      const carrierPackages = packagesList[sim.supplier] || []
      if (carrierPackages.length > 0) {
        setSelectedPackage(carrierPackages[0])
      }
    } else {
      setDetectedSim(null)
      setSelectedPackage(null)
    }
  }

  const handleIccidChange = (val: string) => {
    setIccid(val)
    if (val.length >= 19) {
      handleCheckIccid(val)
    } else {
      setDetectedSim(null)
      setSelectedPackage(null)
    }
  }

  const handleSelectPackage = (pkgId: string) => {
    if (detectedSim) {
      const carrierPackages = packagesList[detectedSim.supplier] || []
      const pkg = carrierPackages.find((p: any) => p.id === pkgId)
      setSelectedPackage(pkg)
    }
  }

  // Computed package list based on the 4 filters
  const filteredPackages = (() => {
    if (!detectedSim) return []
    const basePackages = packagesList[detectedSim.supplier] || []
    return basePackages.filter((pkg: any) => {
      // 1. Filter Country
      if (filterCountry !== 'all' && pkg.country !== filterCountry) return false
      
      // 2. Filter Type
      if (filterType !== 'all' && pkg.type !== filterType) return false
      
      // 3. Filter Data
      if (filterData !== 'all') {
        if (filterData === '1gb-5gb') {
          if (pkg.dataVal === 'unlimited' || pkg.dataVal > 5) return false
        } else if (filterData === '10gb-20gb') {
          if (pkg.dataVal === 'unlimited' || pkg.dataVal < 10 || pkg.dataVal > 20) return false
        } else if (filterData === '50gb') {
          if (pkg.dataVal === 'unlimited' || pkg.dataVal < 50) return false
        } else if (filterData === 'unlimited') {
          if (pkg.dataVal !== 'unlimited') return false
        }
      }
      
      // 4. Filter Days
      if (filterDays !== 'all') {
        if (filterDays === '1-5') {
          if (pkg.days > 5) return false
        } else if (filterDays === '7-15') {
          if (pkg.days < 7 || pkg.days > 15) return false
        } else if (filterDays === '30') {
          if (pkg.days !== 30) return false
        }
      }
      
      return true
    })
  })()

  // Auto-select package from the filtered list when filters change or SIM detected
  useEffect(() => {
    if (detectedSim) {
      if (!selectedPackage || !filteredPackages.some((p: any) => p.id === selectedPackage.id)) {
        setSelectedPackage(filteredPackages[0] || null)
      }
    }
  }, [filterCountry, filterType, filterData, filterDays, detectedSim])

  const handleActivateSim = () => {
    if (!detectedSim || !selectedPackage) return

    setIsActivating(true)

    // Simulate API Provisioning call to Carrier via 3M
    setTimeout(() => {
      setIsActivating(false)
      const mockResult = {
        iccid: detectedSim.iccid,
        supplier: detectedSim.supplier,
        package: selectedPackage.name,
        dataQuota: selectedPackage.dataQuota,
        calls: selectedPackage.calls,
        network: selectedPackage.network,
        validity: selectedPackage.validity,
        transactionId: `ACT-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Kích hoạt thành công',
        date: new Date().toLocaleString('vi-VN')
      }
      setActivationResult(mockResult)
      setIsResultOpen(true)
      
      // Reset form
      setIccid('')
      setDetectedSim(null)
      setSelectedPackage(null)
    }, 2500)
  }

  const getSupplierColor = (supplier: string) => {
    switch (supplier) {
      case 'Hồng Kông': return '#FF4D4D'
      case 'Mỹ': return '#0090FF'
      default: return '#7367F0'
    }
  }

  return (
    <>
      <PageHeader
        title="Kích hoạt Phôi SIM (Gán gói cước)"
        description="Chọn phôi SIM trắng có sẵn trong kho, nạp gói cước khách hàng yêu cầu để kích hoạt thuê bao vật lý hoạt động."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/agent/dashboard' },
          { label: 'Kênh Đại lý' },
          { label: 'Kích hoạt SIM' }
        ]}
        actions={
          <Button 
            component={Link} 
            href='/agent/physical-sim/inventory'
            variant='tonal' 
            color='secondary' 
            startIcon={<i className='tabler-arrow-left' />}
            size='small'
          >
            Quay lại Kho phôi
          </Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Step Form */}
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Card className='border-none shadow-sm'>
            <CardContent className='p-6 space-y-6'>
              <Typography variant='h6' className='font-black flex items-center gap-2'>
                <i className='tabler-bolt text-xl text-success animate-pulse' /> Nhập thông tin Kích hoạt SIM
              </Typography>

              <Divider />

              <Stack spacing={6}>
                {/* Step 1: Input ICCID */}
                <Box className='space-y-2'>
                  <Typography variant='subtitle2' className='font-black uppercase text-[11px] text-slate-500'>
                    Bước 1: Quét / Nhập số ICCID Phôi SIM
                  </Typography>
                  <Stack direction='row' spacing={2}>
                    <TextField 
                      fullWidth 
                      size='small' 
                      placeholder='Nhập số ICCID hoặc quét mã phôi (VD: 8984409000000000010)' 
                      value={iccid}
                      onChange={e => handleIccidChange(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <i className='tabler-barcode text-slate-400' />
                          </InputAdornment>
                        )
                      }}
                    />
                    <Button 
                      variant='contained' 
                      color='secondary' 
                      onClick={() => {
                        // Pick random blank SIM
                        const randomSim = readyBlankSims[Math.floor(Math.random() * readyBlankSims.length)]
                        handleIccidChange(randomSim.iccid)
                      }}
                      sx={{ minWidth: 100, fontSize: '11px', fontWeight: 'bold' }}
                    >
                      Quét
                    </Button>
                  </Stack>
                  
                  {detectedSim ? (
                    <Alert severity='success' className='border-none mt-2 p-1 text-xs' icon={<i className='tabler-circle-check text-xs mt-0.5' />}>
                      Đã nhận diện phôi SIM: <b>{detectedSim.supplier}</b> (Số Seri: {detectedSim.serialNumber})
                    </Alert>
                  ) : iccid.length >= 19 ? (
                    <Alert severity='error' className='border-none mt-2 p-1 text-xs' icon={<i className='tabler-alert-triangle text-xs mt-0.5' />}>
                      Mã ICCID không tồn tại trong kho phôi SIM trắng của bạn hoặc đã bị kích hoạt!
                    </Alert>
                  ) : null}
                </Box>

                {/* Step 2: Choose package */}
                {detectedSim && (
                  <Box className='space-y-4'>
                    <Typography variant='subtitle2' className='font-black uppercase text-[11px] text-slate-500'>
                      Bước 2: Chọn Gói Cước gán vào SIM
                    </Typography>

                    {/* Rich Filter Control Bar */}
                    <Card variant='outlined' className='p-3 bg-slate-50/50 border-slate-100 rounded-xl mb-4'>
                      <Grid2 container spacing={3}>
                        {/* 1. Quốc gia */}
                        <Grid2 size={{ xs: 12, sm: 3 }}>
                          <FormControl fullWidth size='small'>
                            <InputLabel id='filter-country-label'>Quốc gia</InputLabel>
                            <Select
                              labelId='filter-country-label'
                              label='Quốc gia'
                              value={filterCountry}
                              onChange={(e) => setFilterCountry(e.target.value)}
                              className='bg-white'
                            >
                              <MenuItem value='all'>Tất cả quốc gia</MenuItem>
                              {Array.from(new Set((packagesList[detectedSim.supplier] || []).map((p: any) => p.country))).map((country: any) => (
                                <MenuItem key={country} value={country}>{country}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid2>

                        {/* 2. Loại gói (Type) */}
                        <Grid2 size={{ xs: 12, sm: 3 }}>
                          <FormControl fullWidth size='small'>
                            <InputLabel id='filter-type-label'>Loại gói</InputLabel>
                            <Select
                              labelId='filter-type-label'
                              label='Loại gói'
                              value={filterType}
                              onChange={(e) => setFilterType(e.target.value)}
                              className='bg-white'
                            >
                              <MenuItem value='all'>Tất cả loại gói</MenuItem>
                              <MenuItem value='daily'>Daily (Theo ngày)</MenuItem>
                              <MenuItem value='total'>Total (Dung lượng tổng)</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid2>

                        {/* 3. Dung lượng (Data) */}
                        <Grid2 size={{ xs: 12, sm: 3 }}>
                          <FormControl fullWidth size='small'>
                            <InputLabel id='filter-data-label'>Dung lượng</InputLabel>
                            <Select
                              labelId='filter-data-label'
                              label='Dung lượng'
                              value={filterData}
                              onChange={(e) => setFilterData(e.target.value)}
                              className='bg-white'
                            >
                              <MenuItem value='all'>Tất cả dung lượng</MenuItem>
                              <MenuItem value='1gb-5gb'>1GB - 5GB</MenuItem>
                              <MenuItem value='10gb-20gb'>10GB - 20GB</MenuItem>
                              <MenuItem value='50gb'>Từ 50GB trở lên</MenuItem>
                              <MenuItem value='unlimited'>Không giới hạn (Unlimited)</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid2>

                        {/* 4. Số ngày (Days) */}
                        <Grid2 size={{ xs: 12, sm: 3 }}>
                          <FormControl fullWidth size='small'>
                            <InputLabel id='filter-days-label'>Số ngày</InputLabel>
                            <Select
                              labelId='filter-days-label'
                              label='Số ngày'
                              value={filterDays}
                              onChange={(e) => setFilterDays(e.target.value)}
                              className='bg-white'
                            >
                              <MenuItem value='all'>Tất cả số ngày</MenuItem>
                              <MenuItem value='1-5'>1 - 5 ngày</MenuItem>
                              <MenuItem value='7-15'>7 - 15 ngày</MenuItem>
                              <MenuItem value='30'>30 ngày</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid2>
                      </Grid2>
                    </Card>

                    {filteredPackages.length === 0 ? (
                      <Alert severity='info' variant='outlined' className='w-full'>
                        Không tìm thấy gói cước nào phù hợp với bộ lọc đã chọn. Vui lòng đặt lại bộ lọc.
                      </Alert>
                    ) : (
                      <Grid2 container spacing={4}>
                        {filteredPackages.map((pkg: any) => (
                          <Grid2 size={{ xs: 12, sm: 4 }} key={pkg.id}>
                            <Card 
                              onClick={() => setSelectedPackage(pkg)}
                              variant='outlined'
                              sx={{
                                p: 4,
                                cursor: 'pointer',
                                borderColor: selectedPackage?.id === pkg.id ? getSupplierColor(detectedSim.supplier) : 'divider',
                                bgcolor: selectedPackage?.id === pkg.id ? `${getSupplierColor(detectedSim.supplier)}05` : 'transparent',
                                transition: 'all 0.2s',
                                borderWidth: selectedPackage?.id === pkg.id ? '2px' : '1px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                '&:hover': {
                                  borderColor: getSupplierColor(detectedSim.supplier),
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }
                              }}
                            >
                              <Box>
                                <Typography variant='h6' className='font-black text-slate-800'>{pkg.name}</Typography>
                                <Box className='mbs-2 space-y-1'>
                                  <Chip label={pkg.data} size='small' variant='tonal' color='info' sx={{ height: 16, fontSize: '9px', fontWeight: 'bold' }} />
                                  <Chip label={pkg.validity} size='small' variant='tonal' color='secondary' sx={{ height: 16, fontSize: '9px', fontWeight: 'bold' }} />
                                </Box>
                                
                                <Stack spacing={1.5} className='mbs-3 text-slate-600 text-xs'>
                                  <Box className='flex gap-1.5 items-center'>
                                    <i className='tabler-antenna text-[13px] text-primary' />
                                    <Typography variant='caption' className='text-slate-500 font-medium'>{pkg.network}</Typography>
                                  </Box>
                                  <Box className='flex gap-1.5 items-center'>
                                    <i className='tabler-world-upload text-[13px] text-info' />
                                    <Typography variant='caption' className='text-slate-600 font-bold'>{pkg.dataQuota}</Typography>
                                  </Box>
                                  <Box className='flex gap-1.5 items-center'>
                                    <i className='tabler-phone text-[13px] text-success' />
                                    <Typography variant='caption' className='text-slate-500'>{pkg.calls}</Typography>
                                  </Box>
                                  <Typography variant='caption' className='text-[10px] text-slate-400 italic block line-clamp-2 leading-tight mbs-1'>
                                    {pkg.description}
                                  </Typography>
                                </Stack>
                              </Box>
                              
                              <Box>
                                <Divider className='my-3' />
                                <Typography variant='subtitle1' className='font-black text-primary text-right'>
                                  {pkg.price.toLocaleString('vi-VN')} đ
                                </Typography>
                              </Box>
                            </Card>
                          </Grid2>
                        ))}
                      </Grid2>
                    )}
                  </Box>
                )}

                {/* Step 3: Payment Summary & Proceed */}
                {detectedSim && selectedPackage && (
                  <Box className='space-y-4'>
                    <Divider />
                    <Typography variant='subtitle2' className='font-black uppercase text-[11px] text-slate-500'>
                      Bước 3: Tóm tắt giao dịch
                    </Typography>
                    
                    <Card variant='outlined' className='bg-slate-50/50 p-4 border-slate-100 rounded-xl'>
                      <Stack spacing={2}>
                        <Box className='flex justify-between items-center'>
                          <Typography variant='body2' className='text-slate-500'>Nhà mạng kích hoạt:</Typography>
                          <Typography variant='body2' className='font-bold' sx={{ color: getSupplierColor(detectedSim.supplier) }}>
                            {detectedSim.supplier}
                          </Typography>
                        </Box>
                        <Box className='flex justify-between items-center'>
                          <Typography variant='body2' className='text-slate-500'>Mã ICCID Phôi:</Typography>
                          <Typography variant='body2' className='font-mono font-bold text-slate-800'>{detectedSim.iccid}</Typography>
                        </Box>
                        <Box className='flex justify-between items-center'>
                          <Typography variant='body2' className='text-slate-500'>Gói cước gán:</Typography>
                          <Typography variant='body2' className='font-bold text-slate-800'>
                            {selectedPackage.name}
                          </Typography>
                        </Box>
                        <Box className='flex justify-between items-center'>
                          <Typography variant='body2' className='text-slate-500'>Nhà mạng đối tác:</Typography>
                          <Typography variant='body2' className='font-medium text-slate-700'>{selectedPackage.network}</Typography>
                        </Box>
                        <Box className='flex justify-between items-center'>
                          <Typography variant='body2' className='text-slate-500'>Dung lượng Data:</Typography>
                          <Typography variant='body2' className='font-bold text-slate-850' sx={{ color: 'info.main' }}>{selectedPackage.dataQuota}</Typography>
                        </Box>
                        <Box className='flex justify-between items-center'>
                          <Typography variant='body2' className='text-slate-500'>Thời hạn gói:</Typography>
                          <Typography variant='body2' className='font-medium text-slate-700'>{selectedPackage.validity}</Typography>
                        </Box>
                        <Box className='flex justify-between items-center'>
                          <Typography variant='body2' className='text-slate-500'>Thoại & SMS:</Typography>
                          <Typography variant='body2' className='font-medium text-slate-700'>{selectedPackage.calls}</Typography>
                        </Box>
                        <Divider />
                        <Box className='flex justify-between items-center'>
                          <Typography variant='body1' className='font-black text-slate-800'>Tổng tiền thanh toán gói:</Typography>
                          <Typography variant='h5' className='font-black text-primary'>{selectedPackage.price.toLocaleString('vi-VN')} đ</Typography>
                        </Box>
                      </Stack>
                    </Card>

                    <Button 
                      variant='contained' 
                      color='success' 
                      fullWidth 
                      size='large'
                      onClick={handleActivateSim}
                      disabled={isActivating}
                      startIcon={isActivating ? <i className='tabler-loader animate-spin' /> : <i className='tabler-bolt' />}
                    >
                      {isActivating ? 'Đang gửi lệnh kích hoạt lên Nhà mạng...' : 'Xác nhận Kích hoạt SIM'}
                    </Button>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Right Side: Process instructions & recent actions */}
        <Grid2 size={{ xs: 12, md: 5 }}>
          <Stack spacing={6}>
            {/* Guide */}
            <Card className='border-none shadow-sm bg-success/5 border border-success/10'>
              <CardContent className='p-5'>
                <Typography variant='h6' className='font-black text-success mbe-3 flex items-center gap-2'>
                  <i className='tabler-antenna' /> Cơ chế kích hoạt phôi SIM
                </Typography>
                <Typography variant='body2' color='textSecondary' className='space-y-2 leading-relaxed'>
                  1. Nhân viên quét mã vạch ICCID in trên phôi SIM vật lý hoặc chọn số từ kho của mình.<br />
                  2. Chọn gói cước mà khách hàng muốn mua.<br />
                  3. Khi nhấn xác nhận, hệ thống 3M sẽ <b>gọi API Provisioning trực tiếp lên cổng kỹ thuật của nhà mạng</b> để cấu hình gói cước này gán vào dải chip vật lý tương ứng.<br />
                  4. Sau khi cổng nhà mạng phản hồi thành công, chiếc phôi SIM vật lý trắng lập tức được kích hoạt sóng và gói cước. Bàn giao SIM vật lý cho khách lắp máy dùng ngay.
                </Typography>
              </CardContent>
            </Card>

            {/* Simulating printer/activation history logs */}
            <Card className='border-none shadow-sm'>
              <CardContent className='p-5'>
                <Typography variant='h6' className='font-black mbe-4 flex items-center gap-2'>
                  <i className='tabler-history text-xl text-primary' /> Kích hoạt gần đây
                </Typography>
                <Stack spacing={4}>
                  <Box className='flex gap-3 items-start border-b pb-3 border-dashed'>
                    <Avatar sx={{ bgcolor: 'rgba(40, 199, 111, 0.1)', color: '#28C76F', width: 28, height: 28 }}>
                      <i className='tabler-circle-check text-sm' />
                    </Avatar>
                    <Box className='flex-1'>
                      <Typography variant='body2' className='font-bold'>Kích hoạt thành công SIM Hồng Kông</Typography>
                      <Typography variant='caption' color='textSecondary' className='block'>Gói HK-PRO10 - SĐT: +852 9128 3341</Typography>
                      <Typography variant='caption' color='textSecondary' className='block font-mono text-[9px] mt-0.5'>ICCID: 8985209000000000012</Typography>
                    </Box>
                  </Box>

                  <Box className='flex gap-3 items-start pb-1'>
                    <Avatar sx={{ bgcolor: 'rgba(40, 199, 111, 0.1)', color: '#28C76F', width: 28, height: 28 }}>
                      <i className='tabler-circle-check text-sm' />
                    </Avatar>
                    <Box className='flex-1'>
                      <Typography variant='body2' className='font-bold'>Kích hoạt thành công SIM Mỹ</Typography>
                      <Typography variant='caption' color='textSecondary' className='block'>Gói US-TRAVEL5 - SĐT: +1 (202) 555-0143</Typography>
                      <Typography variant='caption' color='textSecondary' className='block font-mono text-[9px] mt-0.5'>ICCID: 8981209000000000400</Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid2>
      </Grid2>

      {/* Success Dialog */}
      <Dialog
        open={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle className='text-center pt-6 pb-2 border-b'>
          <i className='tabler-circle-check text-6xl text-success block mx-auto mbe-2 animate-bounce' />
          <Typography component='span' variant='h5' className='font-black text-success'>KÍCH HOẠT THÀNH CÔNG!</Typography>
        </DialogTitle>
        <DialogContent className='p-6'>
          {activationResult && (
            <Stack spacing={4} className='mbs-2'>
              <Box className='p-3 bg-slate-50 rounded-xl space-y-1 border text-center'>
                <Typography variant='caption' color='textSecondary' className='uppercase font-bold text-[9px] block'>Mã ICCID Phôi SIM kích hoạt</Typography>
                <Typography variant='h5' className='font-mono font-black text-primary'>{activationResult.iccid}</Typography>
              </Box>

              <Stack spacing={2} className='border rounded-xl p-4 bg-slate-50/20'>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Mã giao dịch</Typography>
                  <Typography variant='body2' className='font-mono font-bold text-slate-800'>{activationResult.transactionId}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Nhà mạng</Typography>
                  <Typography variant='body2' className='font-bold' sx={{ color: getSupplierColor(activationResult.supplier) }}>
                    {activationResult.supplier}
                  </Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Mã ICCID</Typography>
                  <Typography variant='body2' className='font-mono font-bold text-slate-800 text-xs'>{activationResult.iccid}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Gói cước đã gán</Typography>
                  <Typography variant='body2' className='font-bold text-slate-800'>{activationResult.package}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Nhà mạng đối tác</Typography>
                  <Typography variant='body2' className='font-medium text-slate-700'>{activationResult.network}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Dung lượng Data</Typography>
                  <Typography variant='body2' className='font-bold text-info'>{activationResult.dataQuota}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Gọi thoại & SMS</Typography>
                  <Typography variant='body2' className='font-medium text-slate-700'>{activationResult.calls}</Typography>
                </Box>
                <Box className='flex justify-between py-1 border-b border-dashed'>
                  <Typography variant='body2' className='text-slate-500'>Thời hạn gói</Typography>
                  <Typography variant='body2' className='font-medium text-slate-700'>{activationResult.validity}</Typography>
                </Box>
                <Box className='flex justify-between py-1'>
                  <Typography variant='body2' className='text-slate-500'>Thời gian</Typography>
                  <Typography variant='body2' className='font-medium text-slate-700'>{activationResult.date}</Typography>
                </Box>
              </Stack>

              <Alert severity='success' className='border-none text-xs' icon={<i className='tabler-info-circle text-xs mt-0.5' />}>
                Phôi SIM vật lý này đã sẵn sàng. Vui lòng bàn giao SIM cho khách hàng lắp vào thiết bị để bắt đầu truy cập internet.
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions className='p-6 pt-0 justify-center'>
          <Button variant='contained' color='primary' fullWidth onClick={() => setIsResultOpen(false)}>
            Hoàn tất & Tiếp tục gán SIM mới
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PhysicalSimActivationView
