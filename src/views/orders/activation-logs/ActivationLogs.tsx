'use client'

import React, { useState, useEffect, useRef } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import PageHeader from '@/components/layout/shared/PageHeader'

const initialLogs = [
  { id: 'log-1', timestamp: '2026-05-04T14:20:05.123Z', level: 'INFO', service: 'ORDER_GATEWAY', message: 'Received new order request [ORD-8241] from Agent [TravelConnect]' },
  { id: 'log-2', timestamp: '2026-05-04T14:20:05.145Z', level: 'DEBUG', service: 'INVENTORY_SVC', message: 'Checking allocation for product [Japan 10GB]...' },
  { id: 'log-3', timestamp: '2026-05-04T14:20:05.150Z', level: 'INFO', service: 'INVENTORY_SVC', message: 'Allocation successful. Proceeding to fulfillment.' },
  { id: 'log-4', timestamp: '2026-05-04T14:20:05.155Z', level: 'API', service: 'SUPPLIER_CLIENT', message: 'POST https://api.airalo.com/v2/orders payload: {"package":"jp_10gb_7d", "qty": 1}' },
  { id: 'log-5', timestamp: '2026-05-04T14:20:06.820Z', level: 'API_SUCCESS', service: 'SUPPLIER_CLIENT', message: '200 OK - {"order_id": "AIR-9921", "iccid": "898412345678901234"}' },
  { id: 'log-6', timestamp: '2026-05-04T14:20:06.830Z', level: 'INFO', service: 'ORDER_WORKER', message: 'eSIM profile generated successfully. ICCID: 898412345678901234' },
  { id: 'log-7', timestamp: '2026-05-04T14:20:06.850Z', level: 'WEBHOOK', service: 'WEBHOOK_DISPATCH', message: 'Dispatching payload to https://api.travelconnect.com/webhooks/esim' },
  { id: 'log-8', timestamp: '2026-05-04T14:20:07.120Z', level: 'WEBHOOK_OK', service: 'WEBHOOK_DISPATCH', message: 'Agent acknowledged Webhook (200 OK)' },
  { id: 'log-9', timestamp: '2026-05-04T14:20:07.125Z', level: 'SUCCESS', service: 'ORDER_GATEWAY', message: 'Order [ORD-8241] completed in 2.002s' }
]

const getLevelColor = (level: string) => {
  switch (level) {
    case 'INFO': return 'text-blue-400'
    case 'DEBUG': return 'text-slate-500'
    case 'API': return 'text-purple-400'
    case 'API_SUCCESS': return 'text-emerald-400'
    case 'WEBHOOK': return 'text-amber-400'
    case 'WEBHOOK_OK': return 'text-emerald-400'
    case 'SUCCESS': return 'text-emerald-500 font-bold'
    case 'ERROR': return 'text-red-500 font-bold'
    default: return 'text-slate-300'
  }
}

const ActivationLogs = () => {
  const [logs, setLogs] = useState(initialLogs)
  const [isLive, setIsLive] = useState(true)
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLive) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, isLive])

  return (
    <>
      <PageHeader
        title="Nhật ký Kích hoạt (Technical Logs)"
        description="Giám sát luồng dữ liệu (API, Webhook, Database) theo thời gian thực (Real-time) cho các lệnh xử lý eSIM."
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Đơn hàng' }, { label: 'Nhật ký kỹ thuật' }]}
        className='mbe-6'
      />

      <Card className='border-none shadow-sm bg-slate-900 text-slate-300 font-mono'>
        {/* Terminal Header */}
        <Box className='border-b border-slate-700/50 p-4 flex justify-between items-center bg-slate-800/50 rounded-t-xl'>
          <Box className='flex items-center gap-4'>
            <Box className='flex gap-2'>
              <Box className='w-3 h-3 rounded-full bg-red-500' />
              <Box className='w-3 h-3 rounded-full bg-yellow-500' />
              <Box className='w-3 h-3 rounded-full bg-green-500' />
            </Box>
            <Typography variant='body2' className='font-mono font-bold text-slate-300 ml-2'>
              root@esim-market-core:~/logs/production/order-gateway.log
            </Typography>
          </Box>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Box className='flex items-center gap-2 mr-4'>
              <span className={`relative flex h-3 w-3`}>
                {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
              </span>
              <Typography variant='caption' className={isLive ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {isLive ? 'LIVE' : 'PAUSED'}
              </Typography>
            </Box>
            <Button 
              size='small' 
              variant='outlined' 
              color={isLive ? 'warning' : 'success'}
              onClick={() => setIsLive(!isLive)}
              className='font-mono text-xs border-slate-600 text-slate-300 hover:border-slate-500'
            >
              {isLive ? 'PAUSE' : 'RESUME'}
            </Button>
            <Tooltip title="Clear Terminal">
              <IconButton size='small' className='text-slate-400 hover:text-white' onClick={() => setLogs([])}>
                <i className='tabler-trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download Logs">
              <IconButton size='small' className='text-slate-400 hover:text-white'>
                <i className='tabler-download' />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Terminal Body */}
        <CardContent className='p-6 min-h-[500px] max-h-[700px] overflow-y-auto bg-[#0d1117] relative'>
          {logs.map((log) => (
            <Box key={log.id} className='flex gap-4 mb-2 text-[13px] hover:bg-white/5 p-1 rounded transition-colors'>
              <Box className='text-slate-500 whitespace-nowrap'>[{log.timestamp.split('T')[1].replace('Z', '')}]</Box>
              <Box className={`w-24 font-bold ${getLevelColor(log.level)}`}>{log.level.padEnd(10, ' ')}</Box>
              <Box className='text-purple-300/70 w-40 truncate'>[{log.service}]</Box>
              <Box className={`flex-1 break-all ${log.level === 'ERROR' ? 'text-red-400' : 'text-slate-300'}`}>
                {log.message}
              </Box>
            </Box>
          ))}
          {isLive && (
            <Box className='flex gap-4 mt-2 text-[13px] p-1'>
              <Box className='text-emerald-500 font-bold'>&gt;</Box>
              <Box className='w-2 h-4 bg-slate-400 animate-pulse'></Box>
            </Box>
          )}
          <div ref={logsEndRef} />
        </CardContent>
      </Card>
    </>
  )
}

export default ActivationLogs
