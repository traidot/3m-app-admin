'use client'

import { useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Grid2 from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import type { ChipProps } from '@mui/material/Chip'

import PageHeader from '@/components/layout/shared/PageHeader'

type AuditStatus = 'Thành công' | 'Thất bại' | 'Cảnh báo'

type AuditLog = {
  id: string
  time: string
  actor: string
  role: string
  action: string
  module: string
  target: string
  ip: string
  status: AuditStatus
  before: string
  after: string
}

const auditLogs: AuditLog[] = [
  {
    id: 'AUD-20260508-001',
    time: '08/05/2026 14:28:12',
    actor: 'Nguyễn Văn A',
    role: 'Super Admin',
    action: 'Cập nhật cấu hình giá eSIM theo quốc gia',
    module: 'Cấu hình giá',
    target: 'Quốc gia: Nhật Bản',
    ip: '103.21.150.44',
    status: 'Thành công',
    before: 'Markup: 8%',
    after: 'Markup: 10.5%'
  },
  {
    id: 'AUD-20260508-002',
    time: '08/05/2026 14:21:03',
    actor: 'Trần Thị B',
    role: 'Finance',
    action: 'Thêm tỉ giá quy đổi mới',
    module: 'Tỉ giá',
    target: 'USD/VND',
    ip: '10.20.4.18',
    status: 'Thành công',
    before: '25,430 - Đang sử dụng',
    after: '25,540 - Đang sử dụng'
  },
  {
    id: 'AUD-20260508-003',
    time: '08/05/2026 14:21:03',
    actor: 'Hệ thống',
    role: 'System',
    action: 'Tự động ngưng tỉ giá cũ',
    module: 'Tỉ giá',
    target: 'USD/VND',
    ip: 'localhost',
    status: 'Cảnh báo',
    before: '25,430 - Đang sử dụng',
    after: '25,430 - Tạm dừng'
  },
  {
    id: 'AUD-20260508-004',
    time: '08/05/2026 11:52:45',
    actor: 'Lê Văn C',
    role: 'Operation',
    action: 'Tạo đại lý mới',
    module: 'Đại lý',
    target: 'Đại lý: Asia Travel Hub',
    ip: '118.69.32.10',
    status: 'Thành công',
    before: 'Chưa tồn tại',
    after: 'Hình thức thanh toán: Công nợ'
  },
  {
    id: 'AUD-20260507-005',
    time: '07/05/2026 17:36:19',
    actor: 'Phạm Thị D',
    role: 'Support',
    action: 'Khóa tài khoản nhân viên',
    module: 'Người dùng',
    target: 'support-old@esim.market',
    ip: '27.72.101.9',
    status: 'Thành công',
    before: 'Hoạt động',
    after: 'Tạm dừng'
  },
  {
    id: 'AUD-20260507-006',
    time: '07/05/2026 09:18:54',
    actor: 'Đặng Văn E',
    role: 'Admin',
    action: 'Xuất danh sách eSIM',
    module: 'Danh mục eSIM',
    target: 'Bộ lọc: tất cả quốc gia',
    ip: '14.161.28.77',
    status: 'Thất bại',
    before: 'Không có file',
    after: 'Lỗi quyền truy cập'
  }
]

const statusColorMap: Record<AuditStatus, ChipProps['color']> = {
  'Thành công': 'success',
  'Thất bại': 'error',
  'Cảnh báo': 'warning'
}

const modules = ['Tất cả', ...Array.from(new Set(auditLogs.map(log => log.module)))]
const statuses: Array<'Tất cả' | AuditStatus> = ['Tất cả', 'Thành công', 'Thất bại', 'Cảnh báo']

const AuditLogsView = () => {
  const [keyword, setKeyword] = useState('')
  const [module, setModule] = useState('Tất cả')
  const [status, setStatus] = useState<'Tất cả' | AuditStatus>('Tất cả')

  const filteredLogs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return auditLogs.filter(log => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        [log.id, log.actor, log.role, log.action, log.module, log.target, log.ip]
          .join(' ')
          .toLowerCase()
          .includes(normalizedKeyword)
      const matchesModule = module === 'Tất cả' || log.module === module
      const matchesStatus = status === 'Tất cả' || log.status === status

      return matchesKeyword && matchesModule && matchesStatus
    })
  }, [keyword, module, status])

  return (
    <>
      <PageHeader
        title='Quản lý log'
        description='Theo dõi audit log thao tác quản trị, cấu hình, đơn hàng và phân quyền trong hệ thống'
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Hệ thống' }, { label: 'Quản lý log' }]}
        actions={
          <Button variant='outlined' startIcon={<i className='tabler-download' />}>
            Xuất log
          </Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6} className='mbe-6'>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent>
              <Typography variant='caption' className='text-slate-500 font-bold uppercase'>
                Tổng log
              </Typography>
              <Typography variant='h4' className='font-black mbs-2'>
                {auditLogs.length}
              </Typography>
              <Typography variant='body2' className='text-slate-500'>
                Bản ghi audit mockup
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent>
              <Typography variant='caption' className='text-slate-500 font-bold uppercase'>
                Thành công
              </Typography>
              <Typography variant='h4' className='font-black text-success mbs-2'>
                {auditLogs.filter(log => log.status === 'Thành công').length}
              </Typography>
              <Typography variant='body2' className='text-slate-500'>
                Ghi nhận thao tác hợp lệ
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent>
              <Typography variant='caption' className='text-slate-500 font-bold uppercase'>
                Cảnh báo
              </Typography>
              <Typography variant='h4' className='font-black text-warning mbs-2'>
                {auditLogs.filter(log => log.status === 'Cảnh báo').length}
              </Typography>
              <Typography variant='body2' className='text-slate-500'>
                Tự động thay đổi liên quan
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card className='border-none shadow-sm h-full'>
            <CardContent>
              <Typography variant='caption' className='text-slate-500 font-bold uppercase'>
                Thất bại
              </Typography>
              <Typography variant='h4' className='font-black text-error mbs-2'>
                {auditLogs.filter(log => log.status === 'Thất bại').length}
              </Typography>
              <Typography variant='body2' className='text-slate-500'>
                Cần kiểm tra quyền hoặc cấu hình
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Card className='border-none shadow-sm'>
        <CardContent className='flex flex-wrap items-end gap-4'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='text-slate-500 font-bold uppercase'>
              Tìm kiếm
            </Typography>
            <TextField
              size='small'
              value={keyword}
              placeholder='Người thao tác, hành động, IP...'
              onChange={event => setKeyword(event.target.value)}
              sx={{ width: 280 }}
            />
          </Box>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='text-slate-500 font-bold uppercase'>
              Phân hệ
            </Typography>
            <TextField select size='small' value={module} onChange={event => setModule(event.target.value)} sx={{ width: 180 }}>
              {modules.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='text-slate-500 font-bold uppercase'>
              Trạng thái
            </Typography>
            <TextField
              select
              size='small'
              value={status}
              onChange={event => setStatus(event.target.value as 'Tất cả' | AuditStatus)}
              sx={{ width: 150 }}
            >
              {statuses.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </CardContent>

        <Box className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50 border-be'>
                <th className='p-4 text-xs font-black text-slate-500 uppercase'>Thời gian</th>
                <th className='p-4 text-xs font-black text-slate-500 uppercase'>Người thao tác</th>
                <th className='p-4 text-xs font-black text-slate-500 uppercase'>Hành động</th>
                <th className='p-4 text-xs font-black text-slate-500 uppercase'>Đối tượng</th>
                <th className='p-4 text-xs font-black text-slate-500 uppercase'>IP</th>
                <th className='p-4 text-xs font-black text-slate-500 uppercase'>Trạng thái</th>
                <th className='p-4 text-xs font-black text-slate-500 uppercase'>Thay đổi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} className='border-be last:border-0 hover:bg-slate-50/50 transition-colors'>
                  <td className='p-4 align-top'>
                    <Typography variant='body2' className='font-bold'>
                      {log.time}
                    </Typography>
                    <Typography variant='caption' className='text-slate-400'>
                      {log.id}
                    </Typography>
                  </td>
                  <td className='p-4 align-top'>
                    <Typography variant='body2' className='font-black'>
                      {log.actor}
                    </Typography>
                    <Typography variant='caption' className='text-slate-500'>
                      {log.role}
                    </Typography>
                  </td>
                  <td className='p-4 align-top'>
                    <Stack spacing={1}>
                      <Typography variant='body2' className='font-bold'>
                        {log.action}
                      </Typography>
                      <Chip label={log.module} size='small' variant='tonal' color='info' className='font-bold w-fit' />
                    </Stack>
                  </td>
                  <td className='p-4 align-top text-sm'>{log.target}</td>
                  <td className='p-4 align-top text-xs font-mono text-slate-500'>{log.ip}</td>
                  <td className='p-4 align-top'>
                    <Chip label={log.status} size='small' color={statusColorMap[log.status]} variant='outlined' className='font-bold' />
                  </td>
                  <td className='p-4 align-top'>
                    <Box className='rounded border border-slate-200 bg-slate-50 p-3 min-w-[240px]'>
                      <Typography variant='caption' className='block text-slate-500'>
                        Trước: {log.before}
                      </Typography>
                      <Typography variant='caption' className='block text-slate-700 font-bold'>
                        Sau: {log.after}
                      </Typography>
                    </Box>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className='p-8 text-center text-slate-500'>
                    Không có log phù hợp bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Card>
    </>
  )
}

export default AuditLogsView
