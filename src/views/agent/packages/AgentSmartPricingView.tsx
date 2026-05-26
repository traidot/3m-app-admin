'use client'

import { Fragment, useMemo, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableSortLabel from '@mui/material/TableSortLabel'
import TablePagination from '@mui/material/TablePagination'
import Alert from '@mui/material/Alert'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from 'next/link'
import * as XLSX from 'xlsx'

import {
  selectSourceByPriorityOrder,
  calculateSmartPrice,
  cheapestSource,
  costVND,
  marginPct,
  USD_TO_VND,
  AGENT_PACKAGES,
  type AgentPackage,
  type SupplierSource,
  type Region,
  type CriterionType
} from './data'
import PricingHistoryDrawer, { type PricingBatch } from './PricingHistoryDrawer'

type RegionalMarkup = {
  region: Region
  markup: number
}

type CountryMarkup = {
  countryCode: string
  markup: number
}

const criterionDetails = {
  price: {
    title: 'Tối ưu Giá vốn tốt nhất (Price)',
    desc: 'Luôn tự động định tuyến về nguồn cung rẻ nhất trong rổ để tối ưu hóa biên độ lợi nhuận.',
    icon: 'tabler-coin'
  },
  quality: {
    title: 'Chất lượng hàng đầu (Quality)',
    desc: 'Định tuyến về nguồn cung có điểm chất lượng và độ ổn định mạng cao nhất từ báo cáo người dùng.',
    icon: 'tabler-star'
  },
  bestseller: {
    title: 'Sản lượng bán chạy (Best Seller)',
    desc: 'Định tuyến về nguồn cung có doanh số bán ra vượt trội trên hệ thống.',
    icon: 'tabler-trending-up'
  }
}

const formatPackageData = (pkg: AgentPackage) =>
  pkg.dataGB === 'unlimited' ? 'Không giới hạn' : `${pkg.dataGB}GB`

const simTypeLabel = (pkg: AgentPackage) => (pkg.simType === 'esim' ? 'eSIM' : 'Vật lý')

const quotaTypeLabel = (pkg: AgentPackage) => (pkg.quotaType === 'daily' ? 'Daily' : 'Total')

const STEPS = [
  'Bước 1: Định giá thông minh',
  'Bước 2: Xác nhận quy tắc / Xuất Excel',
  'Bước 3: Tải Excel đã chỉnh sửa',
  'Bước 4: Xác nhận & Áp dụng'
]

const AgentSmartPricingView = () => {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Primary State for packages in simulation
  const [packages, setPackages] = useState<AgentPackage[]>(AGENT_PACKAGES)
  const [batches, setBatches] = useState<PricingBatch[]>([])

  // Dynamic Pricing Workflow State
  const [activeStep, setActiveStep] = useState<number>(0)
  const [isExcelImported, setIsExcelImported] = useState(false)
  const [excelFileName, setExcelFileName] = useState('')
  const [excelUpdatedCount, setExcelUpdatedCount] = useState(0)
  const [historyOpen, setHistoryOpen] = useState(false)

  // Initialize and load packages and batches from localStorage
  useEffect(() => {
    const storedPkgs = localStorage.getItem('3m_agent_packages')
    if (storedPkgs) {
      try {
        const parsed = JSON.parse(storedPkgs) as AgentPackage[]
        const nextPackages = Array.isArray(parsed) && parsed.length >= AGENT_PACKAGES.length
          ? parsed
          : AGENT_PACKAGES

        setPackages(nextPackages)
        localStorage.setItem('3m_agent_packages', JSON.stringify(nextPackages))
      } catch (e) {
        console.error(e)
      }
    } else {
      localStorage.setItem('3m_agent_packages', JSON.stringify(AGENT_PACKAGES))
    }

    const storedBatches = localStorage.getItem('3m_pricing_batches')
    if (storedBatches) {
      try {
        setBatches(JSON.parse(storedBatches))
      } catch (e) {
        console.error(e)
      }
    } else {
      const seeded: PricingBatch[] = [
        {
          id: 'BATCH-004',
          appliedAt: '2026-05-26 11:42',
          type: 'rule',
          version: 'v1.2',
          priorityOrder: ['price', 'quality', 'bestseller'],
          globalMarkup: 15,
          regionalOverrides: ['Châu Á (+20%)', 'Châu Âu (+18%)'],
          countryOverrides: [],
          packagesCount: 7,
          status: 'success',
          appliedBy: 'Đại lý David',
          packagesSnapshot: [
            { id: 'PKG-001', name: 'eSIM đi Nhật Bản', region: 'Asia', country: 'Nhật Bản', supplier: 'eSIM Access', costVND: 107100, costUSD: 4.2, markupPct: 20, sellPriceVND: 129000 },
            { id: 'PKG-002', name: 'eSIM đi Hàn Quốc', region: 'Asia', country: 'Hàn Quốc', supplier: 'GoMoWorld', costVND: 183600, costUSD: 7.2, markupPct: 20, sellPriceVND: 220000 },
            { id: 'PKG-003', name: 'eSIM Châu Âu 30 nước', region: 'Europe', country: 'Châu Âu (30 nước)', supplier: 'Airalo Wholesale', costVND: 303450, costUSD: 11.9, markupPct: 18, sellPriceVND: 358000 },
            { id: 'PKG-004', name: 'SIM vật lý đi Mỹ', region: 'America', country: 'Hoa Kỳ', supplier: 'eSIM Access', costVND: 471750, costUSD: 18.5, markupPct: 15, sellPriceVND: 543000 },
            { id: 'PKG-005', name: 'eSIM Đông Nam Á 8 nước', region: 'Asia', country: 'Đông Nam Á', supplier: 'GoMoWorld', costVND: 89250, costUSD: 3.5, markupPct: 20, sellPriceVND: 107000 },
            { id: 'PKG-006', name: 'eSIM Toàn cầu 100 nước', region: 'Global', country: 'Toàn cầu', supplier: 'Airalo Wholesale', costVND: 892500, costUSD: 35.0, markupPct: 15, sellPriceVND: 1026000 },
            { id: 'PKG-007', name: 'SIM vật lý đi Thái Lan', region: 'Asia', country: 'Thái Lan', supplier: 'GoMoWorld', costVND: 158100, costUSD: 6.2, markupPct: 20, sellPriceVND: 199000 }
          ]
        },
        {
          id: 'BATCH-003',
          appliedAt: '2026-05-20 09:30',
          type: 'rule',
          version: 'v1.1',
          priorityOrder: ['quality', 'price', 'bestseller'],
          globalMarkup: 12,
          regionalOverrides: ['Châu Á (+15%)'],
          countryOverrides: ['Nhật Bản (+25%)'],
          packagesCount: 5,
          status: 'success',
          appliedBy: 'Đại lý David',
          packagesSnapshot: [
            { id: 'PKG-001', name: 'eSIM đi Nhật Bản', region: 'Asia', country: 'Nhật Bản', supplier: 'Airalo Wholesale', costVND: 126225, costUSD: 4.95, markupPct: 25, sellPriceVND: 158000 },
            { id: 'PKG-002', name: 'eSIM đi Hàn Quốc', region: 'Asia', country: 'Hàn Quốc', supplier: 'eSIM Access', costVND: 198900, costUSD: 7.8, markupPct: 15, sellPriceVND: 229000 },
            { id: 'PKG-003', name: 'eSIM Châu Âu 30 nước', region: 'Europe', country: 'Châu Âu (30 nước)', supplier: 'eSIM Access', costVND: 316200, costUSD: 12.4, markupPct: 12, sellPriceVND: 354000 },
            { id: 'PKG-005', name: 'eSIM Đông Nam Á 8 nước', region: 'Asia', country: 'Đông Nam Á', supplier: 'Airalo Wholesale', costVND: 99450, costUSD: 3.9, markupPct: 15, sellPriceVND: 114000 },
            { id: 'PKG-006', name: 'eSIM Toàn cầu 100 nước', region: 'Global', country: 'Toàn cầu', supplier: 'Airalo Wholesale', costVND: 892500, costUSD: 35.0, markupPct: 12, sellPriceVND: 1000000 }
          ]
        },
        {
          id: 'BATCH-002',
          appliedAt: '2026-05-10 14:15',
          type: 'rule',
          version: 'v1.0',
          priorityOrder: ['price', 'quality', 'bestseller'],
          globalMarkup: 10,
          regionalOverrides: [],
          countryOverrides: [],
          packagesCount: 7,
          status: 'success',
          appliedBy: 'Hệ thống Auto',
          packagesSnapshot: [
            { id: 'PKG-001', name: 'eSIM đi Nhật Bản', region: 'Asia', country: 'Nhật Bản', supplier: 'eSIM Access', costVND: 107100, costUSD: 4.2, markupPct: 10, sellPriceVND: 118000 },
            { id: 'PKG-002', name: 'eSIM đi Hàn Quốc', region: 'Asia', country: 'Hàn Quốc', supplier: 'GoMoWorld', costVND: 183600, costUSD: 7.2, markupPct: 10, sellPriceVND: 202000 },
            { id: 'PKG-003', name: 'eSIM Châu Âu 30 nước', region: 'Europe', country: 'Châu Âu (30 nước)', supplier: 'Airalo Wholesale', costVND: 303450, costUSD: 11.9, markupPct: 10, sellPriceVND: 334000 },
            { id: 'PKG-004', name: 'SIM vật lý đi Mỹ', region: 'America', country: 'Hoa Kỳ', supplier: 'eSIM Access', costVND: 471750, costUSD: 18.5, markupPct: 10, sellPriceVND: 519000 },
            { id: 'PKG-005', name: 'eSIM Đông Nam Á 8 nước', region: 'Asia', country: 'Đông Nam Á', supplier: 'GoMoWorld', costVND: 89250, costUSD: 3.5, markupPct: 10, sellPriceVND: 98000 },
            { id: 'PKG-006', name: 'eSIM Toàn cầu 100 nước', region: 'Global', country: 'Toàn cầu', supplier: 'Airalo Wholesale', costVND: 892500, costUSD: 35.0, markupPct: 10, sellPriceVND: 982000 },
            { id: 'PKG-007', name: 'SIM vật lý đi Thái Lan', region: 'Asia', country: 'Thái Lan', supplier: 'GoMoWorld', costVND: 158100, costUSD: 6.2, markupPct: 10, sellPriceVND: 174000 }
          ]
        },
        {
          id: 'BATCH-001',
          appliedAt: '2026-05-01 08:00',
          type: 'rule',
          version: 'v0.9',
          priorityOrder: ['price', 'quality', 'bestseller'],
          globalMarkup: 15,
          regionalOverrides: [],
          countryOverrides: [],
          packagesCount: 7,
          status: 'failed',
          appliedBy: 'Đại lý David'
        }
      ]
      setBatches(seeded)
      localStorage.setItem('3m_pricing_batches', JSON.stringify(seeded))
    }
  }, [])

  const currentVersion = useMemo(() => {
    const successBatches = batches.filter(b => b.status === 'success')
    if (successBatches.length === 0) return 'v1.0'
    return successBatches[0].version
  }, [batches])

  const nextVersion = useMemo(() => {
    const clean = currentVersion.replace('v', '')
    const num = parseFloat(clean)
    if (isNaN(num)) return 'v1.1'
    return `v${(num + 0.1).toFixed(1)}`
  }, [currentVersion])

  // 1. Supplier Source Criterion State
  const [priorityOrder, setPriorityOrder] = useState<CriterionType[]>(['price', 'quality', 'bestseller'])

  // 2. Pricing Rules State
  const [globalMarkup, setGlobalMarkup] = useState<number>(15)
  const [regionalMarkups, setRegionalMarkups] = useState<RegionalMarkup[]>([
    { region: 'Asia', markup: 20 },
    { region: 'Europe', markup: 18 }
  ])
  const [countryMarkups, setCountryMarkups] = useState<CountryMarkup[]>([])

  // Advanced Filtering, Sorting & Pagination State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [orderBy, setOrderBy] = useState<'id' | 'data' | 'duration' | 'cost' | 'price' | 'margin'>('id')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(100)
  
  // Custom Toast State
  const [showToast, setShowToast] = useState<boolean>(false)
  const [toastMsg, setToastMsg] = useState<string>('')
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success')

  // Selection options for adding dynamic rules
  const [selectedRegionToAdd, setSelectedRegionToAdd] = useState<Region | ''>('')
  const [selectedCountryToAdd, setSelectedCountryToAdd] = useState<string>('')

  // Reset page to 0 whenever filters or pricing inputs change
  useEffect(() => {
    setPage(0)
  }, [searchQuery, regionFilter, countryFilter, priorityOrder, globalMarkup, regionalMarkups, countryMarkups])

  // Country Options derived from package list for Country Overrides
  const countryList = useMemo(() => {
    const map = new Map<string, { code: string; label: string; flag: string }>()
    packages.forEach(p => map.set(p.countryCode, { code: p.countryCode, label: p.country, flag: p.flag }))
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label))
  }, [packages])

  // Dynamic Rule handlers
  const handleAddRegionalRule = () => {
    if (!selectedRegionToAdd) return
    if (regionalMarkups.some(r => r.region === selectedRegionToAdd)) return
    setRegionalMarkups(prev => [...prev, { region: selectedRegionToAdd as Region, markup: 15 }])
    setSelectedRegionToAdd('')
  }

  const handleRemoveRegionalRule = (regionToRemove: Region) => {
    setRegionalMarkups(prev => prev.filter(r => r.region !== regionToRemove))
  }

  const handleAddCountryRule = () => {
    if (!selectedCountryToAdd) return
    if (countryMarkups.some(c => c.countryCode === selectedCountryToAdd)) return
    setCountryMarkups(prev => [...prev, { countryCode: selectedCountryToAdd, markup: 25 }])
    setSelectedCountryToAdd('')
  }

  const handleRemoveCountryRule = (codeToRemove: string) => {
    setCountryMarkups(prev => prev.filter(c => c.countryCode !== codeToRemove))
  }

  // Priority Re-ordering handler
  const movePriority = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= priorityOrder.length) return
    const newOrder = [...priorityOrder]
    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIndex]
    newOrder[targetIndex] = temp
    setPriorityOrder(newOrder)
  }

  // SIMULATOR CORE LOGIC
  const simulationResults = useMemo(() => {
    return packages.map(pkg => {
      // 1. Get original stats
      const originalSource = cheapestSource(pkg)
      const originalCost = costVND(pkg)
      const originalPrice = pkg.sellPriceVND
      const originalMargin = marginPct(pkg)

      // 2. Select supplier based on smart criterion
      const simulatedSource = selectSourceByPriorityOrder(pkg, priorityOrder)
      const simulatedCostVND = simulatedSource ? Math.round(simulatedSource.costUSD * USD_TO_VND) : 0

      // 3. Find correct markup pct using hierarchy
      const countryOverride = countryMarkups.find(c => c.countryCode === pkg.countryCode)
      const regionalOverride = regionalMarkups.find(r => r.region === pkg.region)

      let appliedMarkup = globalMarkup
      let ruleType: 'Quốc gia' | 'Vùng' | 'Chung' = 'Chung'

      if (countryOverride) {
        appliedMarkup = countryOverride.markup
        ruleType = 'Quốc gia'
      } else if (regionalOverride) {
        appliedMarkup = regionalOverride.markup
        ruleType = 'Vùng'
      }

      // 4. Calculate simulated price & margin
      const simulatedPrice = calculateSmartPrice(simulatedCostVND, appliedMarkup, true)
      const simulatedMargin = simulatedCostVND > 0
        ? Math.round(((simulatedPrice - simulatedCostVND) / simulatedCostVND) * 100)
        : 0

      return {
        pkg,
        originalSource,
        originalCost,
        originalPrice,
        originalMargin,
        simulatedSource,
        simulatedCostVND,
        simulatedPrice,
        simulatedMargin,
        appliedMarkup,
        ruleType
      }
    })
  }, [packages, priorityOrder, globalMarkup, regionalMarkups, countryMarkups])

  // Filtered simulator results for user review
  const filteredResults = useMemo(() => {
    return simulationResults.filter(item => {
      // Search Filter
      const matchSearch =
        item.pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pkg.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pkg.id.toLowerCase().includes(searchQuery.toLowerCase())

      // Region Filter
      const matchRegion = regionFilter === 'all' || item.pkg.region === regionFilter

      // Country Filter
      const matchCountry = countryFilter === 'all' || item.pkg.countryCode === countryFilter

      return matchSearch && matchRegion && matchCountry
    })
  }, [simulationResults, searchQuery, regionFilter, countryFilter])

  // Sorted Results
  const sortedResults = useMemo(() => {
    const grouped = new Map<string, typeof filteredResults>()

    filteredResults.forEach(item => {
      const key = item.pkg.countryCode
      const items = grouped.get(key) ?? []
      items.push(item)
      grouped.set(key, items)
    })

    const compareItems = (a: typeof filteredResults[number], b: typeof filteredResults[number]) => {
      let comparison = 0
      if (orderBy === 'id') {
        comparison = a.pkg.id.localeCompare(b.pkg.id)
      } else if (orderBy === 'data') {
        const dataA = a.pkg.dataGB === 'unlimited' ? Number.MAX_SAFE_INTEGER : a.pkg.dataGB
        const dataB = b.pkg.dataGB === 'unlimited' ? Number.MAX_SAFE_INTEGER : b.pkg.dataGB
        comparison = dataA - dataB
      } else if (orderBy === 'duration') {
        comparison = a.pkg.durationDays - b.pkg.durationDays
      } else if (orderBy === 'cost') {
        comparison = a.simulatedCostVND - b.simulatedCostVND
      } else if (orderBy === 'price') {
        comparison = a.simulatedPrice - b.simulatedPrice
      } else if (orderBy === 'margin') {
        comparison = a.simulatedMargin - b.simulatedMargin
      }
      return order === 'asc' ? comparison : -comparison
    }

    return Array.from(grouped.values())
      .sort((a, b) => a[0].pkg.country.localeCompare(b[0].pkg.country))
      .flatMap(group => [...group].sort(compareItems))
  }, [filteredResults, orderBy, order])

  // Paginated Results
  const paginatedResults = useMemo(() => {
    return sortedResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [sortedResults, page, rowsPerPage])

  const countryPackageCountByCode = useMemo(() => {
    const counts = new Map<string, number>()
    sortedResults.forEach(item => counts.set(item.pkg.countryCode, (counts.get(item.pkg.countryCode) ?? 0) + 1))
    return counts
  }, [sortedResults])

  const countryGroupedPaginatedResults = useMemo(() => {
    const groups = new Map<
      string,
      {
        key: string
        country: string
        region: string
        flag: string
        items: typeof paginatedResults
      }
    >()

    paginatedResults.forEach(item => {
      const key = item.pkg.countryCode
      const group = groups.get(key) ?? {
        key,
        country: item.pkg.country,
        region: item.pkg.region,
        flag: item.pkg.flag,
        items: []
      }

      group.items.push(item)
      groups.set(key, group)
    })

    return Array.from(groups.values())
  }, [paginatedResults])

  // Alert stats calculated from simulation
  const simulatorStats = useMemo(() => {
    let warningCount = 0
    let profitIncreaseCount = 0
    let totalOriginalProfit = 0
    let totalSimulatedProfit = 0

    simulationResults.forEach(item => {
      const origProfit = item.originalPrice - item.originalCost
      const simProfit = item.simulatedPrice - item.simulatedCostVND

      totalOriginalProfit += origProfit
      totalSimulatedProfit += simProfit

      if (item.simulatedMargin < 10) {
        warningCount++
      }
      if (simProfit > origProfit) {
        profitIncreaseCount++
      }
    })

    const profitDiff = totalSimulatedProfit - totalOriginalProfit

    return {
      warningCount,
      profitIncreaseCount,
      profitDiff,
      totalSimulatedProfit
    }
  }, [simulationResults])

  // Sorting Handler
  const handleSortRequest = (property: 'id' | 'data' | 'duration' | 'cost' | 'price' | 'margin') => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // Pagination Handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // CLIENT-SIDE EXPORT EXCEL LOGIC
  const handleExportExcel = () => {
    try {
      const dataToExport = simulationResults.map(item => ({
        'Mã gói cước': item.pkg.id,
        'Tên gói cước': item.pkg.name,
        'Vùng': item.pkg.region,
        'Quốc gia': item.pkg.country,
        'Nhà cung cấp sỉ': item.simulatedSource?.supplier ?? '—',
        'Giá vốn sỉ (VND)': item.simulatedCostVND,
        'Tỉ lệ Markup áp dụng (%)': item.appliedMarkup,
        'Giá bán lẻ mới (VND)': item.simulatedPrice
      }))

      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Dinh_Gia_Smart')

      // Set elegant column widths
      const colWidths = [
        { wch: 15 }, // Mã gói
        { wch: 25 }, // Tên gói
        { wch: 12 }, // Vùng
        { wch: 15 }, // Quốc gia
        { wch: 20 }, // Nhà cung cấp
        { wch: 18 }, // Giá vốn sỉ
        { wch: 22 }, // Tỉ lệ Markup
        { wch: 22 }  // Giá bán lẻ mới
      ]
      worksheet['!cols'] = colWidths

      XLSX.writeFile(workbook, `Smart_Pricing_Simulator_${new Date().toISOString().slice(0, 10)}.xlsx`)

      setToastMsg('Xuất biểu giá Excel thành công!')
      setToastSeverity('success')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    } catch (error) {
      console.error('Export Excel failed:', error)
      setToastMsg('Lỗi khi xuất file Excel!')
      setToastSeverity('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    }
  }

  // CLIENT-SIDE IMPORT EXCEL LOGIC
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const parsedData = XLSX.utils.sheet_to_json<any>(worksheet)

        let importedCount = 0
        const updatedPackages = packages.map(pkg => {
          // Find matching row in Excel using ID
          const excelRow = parsedData.find(
            row => row['Mã gói cước'] === pkg.id || row['ID'] === pkg.id || row['id'] === pkg.id
          )
          
          if (excelRow) {
            const importedPrice = Number(excelRow['Giá bán lẻ mới (VND)']) || Number(excelRow['Giá bán']) || Number(excelRow['sellPriceVND'])
            if (!isNaN(importedPrice) && importedPrice > 0) {
              importedCount++
              return {
                ...pkg,
                sellPriceVND: importedPrice
              }
            }
          }
          return pkg
        })

        if (importedCount > 0) {
          setPackages(updatedPackages)
          setIsExcelImported(true)
          setExcelFileName(file.name)
          setExcelUpdatedCount(importedCount)
          setToastMsg(`Nhập Excel thành công! Đã ghi đè biểu giá mô phỏng của ${importedCount} gói cước (Phiên bản mới: ${nextVersion}).`)
          setToastSeverity('success')
        } else {
          setToastMsg('Không tìm thấy dữ liệu hoặc mã gói cước hợp lệ trong file Excel!')
          setToastSeverity('warning')
        }
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } catch (error) {
        console.error('Import Excel failed:', error)
        setToastMsg('Lỗi định dạng file Excel! Hãy đảm bảo cột "Mã gói cước" và "Giá bán lẻ mới (VND)" có dữ liệu.')
        setToastSeverity('error')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    }
    reader.readAsArrayBuffer(file)
    event.target.value = '' // Clear selection to allow uploading same file
  }

  const handleApplyPricing = () => {
    // 1. Save simulated results as packages retail price in main view
    const updated = simulationResults.map(item => {
      return {
        ...item.pkg,
        pinnedSourceId: item.simulatedSource ? item.simulatedSource.id : null,
        sellPriceVND: item.simulatedPrice,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      }
    })
    
    // Save packages to localStorage
    localStorage.setItem('3m_agent_packages', JSON.stringify(updated))

    // 2. Create packages snapshot for this specific batch run
    const snapshot = simulationResults.map(item => ({
      id: item.pkg.id,
      name: item.pkg.name,
      region: item.pkg.region,
      country: item.pkg.country,
      supplier: item.simulatedSource?.supplier ?? '—',
      costVND: item.simulatedCostVND,
      costUSD: item.simulatedSource?.costUSD ?? 0,
      markupPct: item.appliedMarkup,
      sellPriceVND: item.simulatedPrice
    }))

    // 3. Create and append the new Batch
    const newBatchId = `BATCH-${String(batches.length + 1).padStart(3, '0')}`
    
    const newBatch: PricingBatch = isExcelImported 
      ? {
          id: newBatchId,
          appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'excel',
          version: nextVersion,
          excelFileName: excelFileName || 'smart_pricing_sheet.xlsx',
          packagesCount: excelUpdatedCount || packages.length,
          status: 'success',
          appliedBy: 'Đại lý David',
          packagesSnapshot: snapshot
        }
      : {
          id: newBatchId,
          appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'rule',
          version: nextVersion,
          priorityOrder: priorityOrder,
          globalMarkup: globalMarkup,
          regionalOverrides: regionalMarkups.map(r => `${r.region} (+${r.markup}%)`),
          countryOverrides: countryMarkups.map(c => {
            const countryMeta = countryList.find(item => item.code === c.countryCode)
            return `${countryMeta?.label || c.countryCode} (+${c.markup}%)`
          }),
          packagesCount: packages.length,
          status: 'success',
          appliedBy: 'Đại lý David',
          packagesSnapshot: snapshot
        }

    const updatedBatches = [newBatch, ...batches]
    setBatches(updatedBatches)
    localStorage.setItem('3m_pricing_batches', JSON.stringify(updatedBatches))

    // Reset Excel import state
    setIsExcelImported(false)
    setExcelFileName('')

    setToastMsg(
      isExcelImported 
        ? `Đã áp dụng biểu giá Excel (${nextVersion}) thành công cho ${excelUpdatedCount} gói cước!`
        : `Định giá thông minh theo Quy tắc (${nextVersion}) áp dụng thành công cho ${packages.length} gói cước!`
    )
    setToastSeverity('success')
    setShowToast(true)
    
    setTimeout(() => {
      router.push('/agent/packages')
    }, 1500)
  }

  return (
    <Box className='relative' sx={{ p: 4 }}>
      {/* Hidden file input for Excel upload */}
      <input
        type='file'
        accept='.xlsx, .xls'
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImportExcel}
      />

      {/* Toast Notification */}
      {showToast && (
        <Box
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <Alert
            severity={toastSeverity}
            variant='filled'
            icon={
              <i
                className={
                  toastSeverity === 'success'
                    ? 'tabler-circle-check text-[22px]'
                    : toastSeverity === 'warning'
                    ? 'tabler-alert-triangle text-[22px]'
                    : toastSeverity === 'error'
                    ? 'tabler-circle-x text-[22px]'
                    : 'tabler-info-circle text-[22px]'
                }
              />
            }
            sx={{ boxShadow: 6, py: 1.5, px: 3, fontSize: '0.95rem' }}
          >
            {toastMsg}
          </Alert>
        </Box>
      )}

      {/* BREADCRUMBS & HEADER */}
      <Box className='mbe-6'>
        <Breadcrumbs separator={<i className='tabler-chevron-right text-[14px]' />} className='mbe-2'>
          <Link href='/agent/packages' passHref>
            <Typography variant='body2' color='text.secondary' sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
              Quản lý gói cước
            </Typography>
          </Link>
          <Typography variant='body2' color='text.primary'>
            Định giá thông minh
          </Typography>
        </Breadcrumbs>

        <Box className='flex items-center justify-between flex-wrap gap-4'>
          <Box className='flex items-center gap-3.5'>
            <IconButton onClick={() => router.push('/agent/packages')} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <i className='tabler-arrow-left text-[20px]' />
            </IconButton>
            <Box>
              <Typography variant='h4' className='font-bold mbe-1'>
                Định giá thông minh (Smart Pricing Engine)
              </Typography>
              <Typography component='div' variant='body2' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                Tuyển chọn nguồn cung tối ưu và tự động điều chỉnh biểu giá bán lẻ theo quy tắc phân cấp toàn sàn.
                <Chip
                  size='small'
                  label={`Phiên bản hiện tại: ${currentVersion}`}
                  color='info'
                  variant='tonal'
                  sx={{ height: 20, fontSize: '0.75rem', fontWeight: 600 }}
                />
              </Typography>
            </Box>
          </Box>

          <Stack direction='row' spacing={2} className='flex-wrap gap-y-2'>
            <Button
              variant='tonal'
              color='secondary'
              startIcon={<i className='tabler-history text-[18px]' />}
              onClick={() => router.push('/agent/packages/history')}
            >
              Lịch sử định giá
            </Button>
            
            {activeStep === 0 && (
              <>
                <Button
                  variant='tonal'
                  color='secondary'
                  startIcon={<i className='tabler-x' />}
                  onClick={() => router.push('/agent/packages')}
                >
                  Huỷ bỏ
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  endIcon={<i className='tabler-arrow-right' />}
                  onClick={() => setActiveStep(1)}
                  disabled={packages.length === 0}
                >
                  Xác nhận Quy tắc ➡️
                </Button>
              </>
            )}

            {activeStep === 1 && (
              <>
                <Button
                  variant='tonal'
                  color='secondary'
                  startIcon={<i className='tabler-arrow-left' />}
                  onClick={() => setActiveStep(0)}
                >
                  Quay lại
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<i className='tabler-download text-[18px]' />}
                  onClick={() => {
                    handleExportExcel();
                    setActiveStep(2);
                  }}
                >
                  Xuất Excel chỉnh sửa 📥
                </Button>
                <Button
                  variant='tonal'
                  color='info'
                  endIcon={<i className='tabler-arrow-right' />}
                  onClick={() => setActiveStep(2)}
                >
                  Bỏ qua Excel ➡️
                </Button>
                <Button
                  variant='contained'
                  color='success'
                  startIcon={<i className='tabler-check' />}
                  onClick={() => {
                    setIsExcelImported(false);
                    handleApplyPricing();
                  }}
                >
                  Áp dụng Quy tắc ({nextVersion})
                </Button>
              </>
            )}

            {activeStep === 2 && (
              <>
                <Button
                  variant='tonal'
                  color='secondary'
                  startIcon={<i className='tabler-arrow-left' />}
                  onClick={() => setActiveStep(1)}
                >
                  Quay lại
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<i className='tabler-upload text-[18px]' />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Chọn file Excel 📤
                </Button>
                <Button
                  variant='contained'
                  color='success'
                  endIcon={<i className='tabler-arrow-right' />}
                  onClick={() => setActiveStep(3)}
                  disabled={!isExcelImported}
                >
                  Xác nhận Excel ➡️
                </Button>
              </>
            )}

            {activeStep === 3 && (
              <>
                <Button
                  variant='tonal'
                  color='secondary'
                  startIcon={<i className='tabler-arrow-left' />}
                  onClick={() => setActiveStep(2)}
                >
                  Quay lại
                </Button>
                <Button
                  variant='contained'
                  color='warning'
                  startIcon={<i className='tabler-file-spreadsheet' />}
                  onClick={handleApplyPricing}
                >
                  Áp dụng biểu giá Excel ({nextVersion}) 🚀
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Box>

      {/* STEPPER PROGRESS BAR */}
      <Paper variant='outlined' sx={{ p: 5, mb: 6, borderRadius: 1.5, backgroundColor: 'background.paper' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': { color: 'primary.main' },
                      '&.Mui-completed': { color: 'success.main' }
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: activeStep === index ? 700 : 500, fontSize: '0.9rem' }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </Paper>

      {/* RULE CONFIGURATION + FULL-WIDTH PREVIEW TABLE */}
      <Grid2 container spacing={6}>
        {/* STEP 1: SUPPLIER CRITERION */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              opacity: activeStep === 0 ? 1 : 0.4,
              pointerEvents: activeStep === 0 ? 'auto' : 'none',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
          >
            <Card variant='outlined'>
              <CardContent sx={{ p: 5 }}>
                <Box className='flex items-center gap-2 mbe-4'>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.1)',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className='tabler-route text-[18px]' />
                  </Box>
                  <Typography variant='h6' className='font-bold'>
                    1. Tiêu chí chọn nguồn cung
                  </Typography>
                </Box>
                <Alert severity='info' icon={<i className='tabler-info-circle' />} className='mbe-4'>
                  Hệ thống tự động lọc rổ nguồn cung từng gói và định tuyến nhà cung cấp theo thứ tự áp dụng (lần lượt từ trên xuống dưới nếu có trùng giá trị hoặc thiếu thông tin) dưới đây.
                </Alert>

                <Stack spacing={3}>
                  {priorityOrder.map((crit, index) => {
                    const detail = criterionDetails[crit]
                    const isFirst = index === 0
                    const isLast = index === priorityOrder.length - 1

                    return (
                      <Box
                        key={crit}
                        sx={{
                          p: 3,
                          borderRadius: 1.5,
                          border: '1px solid',
                          borderColor: isFirst ? 'primary.main' : 'divider',
                          backgroundColor: isFirst ? 'action.selected' : 'background.paper',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 3,
                          boxShadow: isFirst ? 1 : 0,
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: 2
                          }
                        }}
                      >
                        <Box className='flex items-start gap-3' sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 1,
                              backgroundColor: isFirst
                                ? 'rgba(var(--mui-palette-primary-mainChannel) / 0.15)'
                                : 'action.hover',
                              color: isFirst ? 'primary.main' : 'text.secondary',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mt: 0.5
                            }}
                          >
                            <i className={`${detail.icon} text-[20px]`} />
                          </Box>
                          <Box>
                            <Box className='flex items-center gap-2 flex-wrap mbe-1'>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                {detail.title}
                              </Typography>
                              <Chip
                                size='small'
                                variant='tonal'
                                color={index === 0 ? 'primary' : index === 1 ? 'info' : 'default'}
                                label={`Ưu tiên ${index + 1}`}
                                sx={{ height: 20, fontSize: '0.75rem', fontWeight: 600 }}
                              />
                            </Box>
                            <Typography variant='caption' color='text.secondary'>
                              {detail.desc}
                            </Typography>
                          </Box>
                        </Box>

                        <Stack direction='column' spacing={0.5} alignItems='center'>
                          <IconButton
                            size='small'
                            onClick={() => movePriority(index, 'up')}
                            disabled={isFirst}
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              p: 1,
                              '&.Mui-disabled': { opacity: 0.3 }
                            }}
                          >
                            <i className='tabler-arrow-up text-[16px]' />
                          </IconButton>
                          <IconButton
                            size='small'
                            onClick={() => movePriority(index, 'down')}
                            disabled={isLast}
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              p: 1,
                              '&.Mui-disabled': { opacity: 0.3 }
                            }}
                          >
                            <i className='tabler-arrow-down text-[16px]' />
                          </IconButton>
                        </Stack>
                      </Box>
                    )
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid2>

        {/* STEP 2: PRICING RULES (MARKUP ENGINE) */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              opacity: activeStep === 0 ? 1 : 0.4,
              pointerEvents: activeStep === 0 ? 'auto' : 'none',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
          >
            <Card variant='outlined'>
              <CardContent sx={{ p: 5 }}>
                <Box className='flex items-center gap-2 mbe-4'>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.1)',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className='tabler-math text-[18px]' />
                  </Box>
                  <Typography variant='h6' className='font-bold'>
                    2. Quy tắc định giá bán lẻ
                  </Typography>
                </Box>

                {/* 1. Global Rule */}
                <Card variant='outlined' className='p-4 mbe-5' sx={{ backgroundColor: 'action.hover' }}>
                  <Box className='flex justify-between items-center mbe-2'>
                    <Typography sx={{ fontWeight: 600 }}>Tỉ lệ Markup Toàn hệ thống</Typography>
                    <Chip size='small' variant='tonal' color='primary' label='Mức 1 (Global)' />
                  </Box>
                  <TextField
                    type='number'
                    size='small'
                    value={globalMarkup}
                    onChange={e => setGlobalMarkup(Math.max(0, Number(e.target.value)))}
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>%</InputAdornment>
                    }}
                    helperText='Giá bán lẻ = Giá vốn nguồn cung * (1 + X%)'
                  />
                </Card>

                {/* 2. Regional Overrides */}
                <Box className='mbe-5'>
                  <Box className='flex justify-between items-center mbe-2.5'>
                    <Typography variant='body2' className='font-bold'>Ghi đè tỉ lệ theo Vùng địa lý</Typography>
                    <Chip size='small' variant='tonal' color='info' label='Mức 2 (Vùng)' />
                  </Box>

                  {/* Regional list */}
                  <Stack spacing={2} className='mbe-3'>
                    {regionalMarkups.map((regRule, idx) => (
                      <Box key={regRule.region} className='flex items-center gap-2'>
                        <TextField
                          size='small'
                          label='Vùng'
                          value={regRule.region}
                          disabled
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          type='number'
                          size='small'
                          label='Markup %'
                          value={regRule.markup}
                          onChange={e => {
                            const val = Math.max(0, Number(e.target.value))
                            setRegionalMarkups(prev =>
                              prev.map((r, i) => (i === idx ? { ...r, markup: val } : r))
                            )
                          }}
                          sx={{ width: 125 }}
                          InputProps={{
                            endAdornment: <InputAdornment position='end'>%</InputAdornment>
                          }}
                        />
                        <IconButton color='error' size='small' onClick={() => handleRemoveRegionalRule(regRule.region)}>
                          <i className='tabler-trash text-[18px]' />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>

                  {/* Add regional form */}
                  <Box className='flex gap-2 items-center'>
                    <TextField
                      select
                      size='small'
                      label='Chọn vùng ghi đè...'
                      value={selectedRegionToAdd}
                      onChange={e => setSelectedRegionToAdd(e.target.value as Region)}
                      sx={{ flex: 1 }}
                    >
                      <MenuItem value='Asia'>Châu Á (Asia)</MenuItem>
                      <MenuItem value='Europe'>Châu Âu (Europe)</MenuItem>
                      <MenuItem value='America'>Châu Mỹ (America)</MenuItem>
                      <MenuItem value='Africa'>Châu Phi (Africa)</MenuItem>
                      <MenuItem value='Oceania'>Châu Đại Dương (Oceania)</MenuItem>
                      <MenuItem value='Global'>Toàn cầu (Global)</MenuItem>
                    </TextField>
                    <Button
                      variant='tonal'
                      size='medium'
                      onClick={handleAddRegionalRule}
                      disabled={!selectedRegionToAdd || regionalMarkups.some(r => r.region === selectedRegionToAdd)}
                      startIcon={<i className='tabler-plus text-[16px]' />}
                    >
                      Thêm
                    </Button>
                  </Box>
                </Box>

                {/* 3. Country Overrides */}
                <Box>
                  <Box className='flex justify-between items-center mbe-2.5'>
                    <Typography variant='body2' className='font-bold'>Ghi đè theo Quốc gia riêng biệt</Typography>
                    <Chip size='small' variant='tonal' color='warning' label='Mức 3 (Quốc gia)' />
                  </Box>

                  {/* Country list */}
                  <Stack spacing={2} className='mbe-3'>
                    {countryMarkups.map((cRule, idx) => {
                      const countryMeta = countryList.find(c => c.code === cRule.countryCode)
                      return (
                        <Box key={cRule.countryCode} className='flex items-center gap-2'>
                          <TextField
                            size='small'
                            label='Quốc gia'
                            value={`${countryMeta?.flag ?? ''} ${countryMeta?.label ?? cRule.countryCode}`}
                            disabled
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            type='number'
                            size='small'
                            label='Markup %'
                            value={cRule.markup}
                            onChange={e => {
                              const val = Math.max(0, Number(e.target.value))
                              setCountryMarkups(prev =>
                                prev.map((c, i) => (i === idx ? { ...c, markup: val } : c))
                              )
                            }}
                            sx={{ width: 125 }}
                            InputProps={{
                              endAdornment: <InputAdornment position='end'>%</InputAdornment>
                            }}
                          />
                          <IconButton color='error' size='small' onClick={() => handleRemoveCountryRule(cRule.countryCode)}>
                            <i className='tabler-trash text-[18px]' />
                          </IconButton>
                        </Box>
                      )
                    })}
                  </Stack>

                  {/* Add country form */}
                  <Box className='flex gap-2 items-center'>
                    <TextField
                      select
                      size='small'
                      label='Chọn quốc gia ghi đè...'
                      value={selectedCountryToAdd}
                      onChange={e => setSelectedCountryToAdd(e.target.value)}
                      sx={{ flex: 1 }}
                    >
                      {countryList
                        .filter(c => !countryMarkups.some(cm => cm.countryCode === c.code))
                        .map(c => (
                          <MenuItem key={c.code} value={c.code}>
                            {c.flag} {c.label} ({c.code})
                          </MenuItem>
                        ))}
                    </TextField>
                    <Button
                      variant='tonal'
                      size='medium'
                      onClick={handleAddCountryRule}
                      disabled={!selectedCountryToAdd}
                      startIcon={<i className='tabler-plus text-[16px]' />}
                    >
                      Thêm
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid2>

        {/* FULL-WIDTH SIMULATOR DASHBOARD (5000+ packages capability) */}
        <Grid2 size={{ xs: 12 }}>
          <Card variant='outlined' sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* STATS HEADER WITH ADVANCED FILTERS */}
            <Box className='p-5 bg-background' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box className='flex items-center justify-between mbe-4 flex-wrap gap-3'>
                <Typography variant='h6' className='font-bold'>
                  Bảng mô phỏng kết quả định giá
                </Typography>
                <Stack direction='row' spacing={2} className='flex-wrap gap-y-2' alignItems='center'>
                  <TextField
                    placeholder='Tìm theo tên, ID...'
                    size='small'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 260 }, backgroundColor: 'background.paper' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-search text-[16px]' />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    select
                    size='small'
                    label='Vùng lọc'
                    value={regionFilter}
                    onChange={e => setRegionFilter(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 170 }, backgroundColor: 'background.paper' }}
                  >
                    <MenuItem value='all'>Tất cả vùng</MenuItem>
                    <MenuItem value='Asia'>Châu Á</MenuItem>
                    <MenuItem value='Europe'>Châu Âu</MenuItem>
                    <MenuItem value='America'>Châu Mỹ</MenuItem>
                    <MenuItem value='Global'>Toàn cầu</MenuItem>
                  </TextField>
                  <TextField
                    select
                    size='small'
                    label='Quốc gia lọc'
                    value={countryFilter}
                    onChange={e => setCountryFilter(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 200 }, backgroundColor: 'background.paper' }}
                  >
                    <MenuItem value='all'>Tất cả quốc gia</MenuItem>
                    {countryList.map(c => (
                      <MenuItem key={c.code} value={c.code}>
                        {c.flag} {c.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Box>

              {/* REMOVED STATS CARDS ROW AS REQUESTED */}
            </Box>

            {/* SEQUENTIAL FLOW GUIDANCE BLOCK */}
            <Box sx={{ p: 5, bg: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
              {activeStep === 0 && (
                <Alert severity='info' icon={<i className='tabler-route text-[22px]' />}>
                  <strong>Bước 1:</strong> Thiết lập tiêu chí chọn nguồn và Markup ở cột bên trái. 
                  Biểu giá bên dưới sẽ tự động tính toán mô phỏng theo quy tắc thời gian thực. 
                  Nhấn nút <strong>"Xác nhận Quy tắc ➡️"</strong> ở góc trên bên phải để tiếp tục.
                </Alert>
              )}
              {activeStep === 1 && (
                <Alert 
                  severity='success' 
                  icon={<i className='tabler-settings text-[22px]' />}
                  action={
                    <Button size='small' variant='tonal' color='success' onClick={() => setActiveStep(2)}>
                      Sang Bước 3 để Nhập Excel ➡️
                    </Button>
                  }
                >
                  <strong>Bước 2 (Đã xác nhận quy tắc):</strong> Bạn có thể chọn 
                  <strong>"Áp dụng Quy tắc trực tiếp"</strong> để lưu đợt chạy này, hoặc nhấn 
                  <strong>"Xuất Excel chỉnh sửa"</strong> để tải file Excel về tinh chỉnh giá bán lẻ thủ công.
                </Alert>
              )}
              {activeStep === 2 && (
                <Stack spacing={4}>
                  <Alert severity='warning' icon={<i className='tabler-file-spreadsheet text-[22px]' />}>
                    <strong>Bước 3:</strong> Bạn hãy thực hiện chỉnh sửa cột <strong>"Giá bán lẻ mới (VND)"</strong> 
                    trong file Excel vừa tải về, sau đó tải file lên đây để nạp biểu giá đã tinh chỉnh.
                  </Alert>

                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: '2px dashed',
                      borderColor: isExcelImported ? 'success.main' : 'primary.main',
                      borderRadius: 1.5,
                      p: 6,
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: isExcelImported
                        ? 'rgba(var(--mui-palette-success-mainChannel) / 0.05)'
                        : 'rgba(var(--mui-palette-primary-mainChannel) / 0.02)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: isExcelImported
                          ? 'rgba(var(--mui-palette-success-mainChannel) / 0.1)'
                          : 'rgba(var(--mui-palette-primary-mainChannel) / 0.05)',
                        borderColor: isExcelImported ? 'success.dark' : 'primary.dark'
                      }
                    }}
                  >
                    <i className={`tabler-${isExcelImported ? 'circle-check' : 'cloud-upload'} text-[40px] ${isExcelImported ? 'text-success' : 'text-primary'}`} />
                    <Typography sx={{ mt: 2, fontWeight: 600, fontSize: '1rem' }}>
                      {isExcelImported ? `Đã tải lên: ${excelFileName}` : 'Nhấp chuột vào đây để chọn file Excel đã chỉnh sửa giá'}
                    </Typography>
                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
                      {isExcelImported 
                        ? `Ghi đè giá thành công cho ${excelUpdatedCount} gói cước (Phiên bản mới: ${nextVersion}). Hãy nhấn nút Xác nhận Excel ở trên.` 
                        : 'Chỉ chấp nhận các file Excel định dạng .xlsx, .xls'}
                    </Typography>
                  </Box>
                </Stack>
              )}
              {activeStep === 3 && (
                <Alert 
                  severity='warning' 
                  icon={<i className='tabler-circle-check text-[22px]' />}
                  action={
                    <Button size='small' variant='contained' color='warning' onClick={handleApplyPricing}>
                      Áp dụng giá mới 🚀
                    </Button>
                  }
                >
                  <strong>Bước 4 (Xác nhận giá từ Excel):</strong> Kiểm tra lại biểu giá tinh chỉnh ở bảng bên dưới. 
                  Nhấn nút <strong>"Áp dụng biểu giá Excel ({nextVersion}) 🚀"</strong> ở phía trên hoặc nút bên phải để hoàn tất quy trình và lưu Nhật ký.
                </Alert>
              )}
            </Box>

            {/* PREVIEW TABLE WITH SORTABLE HEADERS */}
            <Box className='flex-1 overflow-auto p-4 bg-background' sx={{ maxHeight: 600 }}>
              <TableContainer>
                <Table size='medium' stickyHeader sx={{ minWidth: 1180 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'id'}
                          direction={orderBy === 'id' ? order : 'asc'}
                          onClick={() => handleSortRequest('id')}
                        >
                          Mã gói
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Vùng/Quốc gia</TableCell>
                      <TableCell>Loại SIM</TableCell>
                      <TableCell>Loại gói</TableCell>
                      <TableCell align='right'>
                        <TableSortLabel
                          active={orderBy === 'data'}
                          direction={orderBy === 'data' ? order : 'asc'}
                          onClick={() => handleSortRequest('data')}
                        >
                          Dung lượng
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align='right'>
                        <TableSortLabel
                          active={orderBy === 'duration'}
                          direction={orderBy === 'duration' ? order : 'asc'}
                          onClick={() => handleSortRequest('duration')}
                        >
                          Số ngày
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align='right'>
                        <TableSortLabel
                          active={orderBy === 'cost'}
                          direction={orderBy === 'cost' ? order : 'asc'}
                          onClick={() => handleSortRequest('cost')}
                        >
                          Giá nhập
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align='right'>
                        <TableSortLabel
                          active={orderBy === 'price'}
                          direction={orderBy === 'price' ? order : 'asc'}
                          onClick={() => handleSortRequest('price')}
                        >
                          Giá bán lẻ (Hiển thị lên app)
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align='right'>
                        <TableSortLabel
                          active={orderBy === 'margin'}
                          direction={orderBy === 'margin' ? order : 'asc'}
                          onClick={() => handleSortRequest('margin')}
                        >
                          Tỉ lệ lợi nhuận
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {countryGroupedPaginatedResults.map(group => (
                      <Fragment key={group.key}>
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            sx={{
                              py: 1.25,
                              backgroundColor: 'action.hover',
                              borderTop: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            <Box className='flex items-center gap-2'>
                              <Typography fontSize={18}>{group.flag}</Typography>
                              <Typography sx={{ fontWeight: 700 }}>
                                {group.country}
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                {group.region} · {countryPackageCountByCode.get(group.key) ?? group.items.length} gói
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>

                        {group.items.map(item => (
                          <TableRow key={item.pkg.id} hover>
                            <TableCell sx={{ py: 2.5, whiteSpace: 'nowrap' }}>
                              <Typography sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                                {item.pkg.id}
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                {item.pkg.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box className='flex items-center gap-2'>
                                <Typography fontSize={18}>{item.pkg.flag}</Typography>
                                <Box>
                                  <Typography variant='body2' sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                    {item.pkg.country}
                                  </Typography>
                                  <Typography variant='caption' color='text.secondary'>
                                    {item.pkg.region}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size='small'
                                variant='tonal'
                                color={item.pkg.simType === 'esim' ? 'primary' : 'warning'}
                                label={simTypeLabel(item.pkg)}
                                icon={<i className={`${item.pkg.simType === 'esim' ? 'tabler-device-mobile' : 'tabler-device-sd-card'} text-[14px]`} />}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                size='small'
                                variant='tonal'
                                color={item.pkg.quotaType === 'daily' ? 'info' : 'secondary'}
                                label={quotaTypeLabel(item.pkg)}
                              />
                            </TableCell>
                            <TableCell align='right'>
                              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                {formatPackageData(item.pkg)}
                              </Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Typography variant='body2'>{item.pkg.durationDays} ngày</Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                {item.simulatedCostVND.toLocaleString('vi-VN')}đ
                              </Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'primary.main' }}>
                                {item.simulatedPrice.toLocaleString('vi-VN')}đ
                              </Typography>
                            </TableCell>
                            <TableCell align='right'>
                              <Chip
                                size='small'
                                variant='tonal'
                                color={item.simulatedMargin >= 30 ? 'success' : item.simulatedMargin >= 10 ? 'warning' : 'error'}
                                label={`${item.simulatedMargin > 0 ? '+' : ''}${item.simulatedMargin}%`}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}

                    {filteredResults.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align='center' sx={{ py: 8 }}>
                          <Typography color='text.secondary'>Không tìm thấy gói cước nào phù hợp.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* PERFORMANCE PAGINATION BAR */}
            <TablePagination
              rowsPerPageOptions={[50, 100, 200]}
              component='div'
              count={filteredResults.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage='Dòng mỗi trang:'
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
              sx={{ borderTop: '1px solid', borderColor: 'divider', bg: 'background.paper' }}
            />
          </Card>
        </Grid2>
      </Grid2>

    </Box>
  )
}

export default AgentSmartPricingView
