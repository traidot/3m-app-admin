'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

import AppConfirmDialog from '@/components/common/AppConfirmDialog'

import {
  AGENTS,
  tierColor,
  statusColor as agentStatusColor,
  statusLabel as agentStatusLabel,
  type Agent
} from './data'

type AgentUser = {
  id: string
  name: string
  email: string
  role: 'Chủ' | 'Nhân viên' | 'Kế toán'
  phone: string
  lastActive: string
  status: 'active' | 'blocked'
}

const MOCK_AGENT_USERS: Record<string, AgentUser[]> = {
  'AGT-0001': [
    { id: 'USR-101', name: 'Nguyễn Văn An', email: 'an.nguyen@travelconnect.sg', role: 'Chủ', phone: '0901 234 567', lastActive: '2026-05-26 16:45', status: 'active' },
    { id: 'USR-102', name: 'Lê Thu Thủy', email: 'thuy.le@travelconnect.sg', role: 'Nhân viên', phone: '0902 345 678', lastActive: '2026-05-26 15:30', status: 'active' },
    { id: 'USR-103', name: 'Phạm Minh Hùng', email: 'hung.pham@travelconnect.sg', role: 'Nhân viên', phone: '0903 456 789', lastActive: '2026-05-25 10:12', status: 'active' }
  ],
  'AGT-0002': [
    { id: 'USR-201', name: 'Trần Minh Tuấn', email: 'tuan.tran@globalroam.jp', role: 'Chủ', phone: '0912 345 678', lastActive: '2026-05-26 14:20', status: 'active' },
    { id: 'USR-202', name: 'Nguyễn Hải Đăng', email: 'dang.nguyen@globalroam.jp', role: 'Nhân viên', phone: '0913 456 789', lastActive: '2026-05-26 09:15', status: 'active' }
  ],
  'AGT-0003': [
    { id: 'USR-301', name: 'Phan Thị Quỳnh', email: 'quynh.phan@eurosim.vn', role: 'Chủ', phone: '0987 654 321', lastActive: '2026-05-26 17:02', status: 'active' },
    { id: 'USR-302', name: 'Đỗ Kiều Trang', email: 'trang.do@eurosim.vn', role: 'Kế toán', phone: '0988 765 432', lastActive: '2026-05-26 11:40', status: 'active' },
    { id: 'USR-303', name: 'Bùi Tiến Đạt', email: 'dat.bui@eurosim.vn', role: 'Nhân viên', phone: '0989 876 543', lastActive: '2026-05-24 16:50', status: 'active' }
  ],
  'AGT-0004': [
    { id: 'USR-401', name: 'Lê Hoàng Long', email: 'long.le@indoconnect.com', role: 'Chủ', phone: '0933 444 555', lastActive: '2026-05-25 15:45', status: 'active' },
    { id: 'USR-402', name: 'Trịnh Quốc Bảo', email: 'bao.trinh@indoconnect.com', role: 'Nhân viên', phone: '0934 555 666', lastActive: '2026-05-23 13:00', status: 'active' }
  ],
  'AGT-0005': [
    { id: 'USR-501', name: 'Hoàng Minh Đức', email: 'duc.hoang@vietsimgo.vn', role: 'Chủ', phone: '0977 888 999', lastActive: '2026-05-20 10:30', status: 'active' }
  ]
}

type Props = { agentId: string }

const AgentDetailView = ({ agentId }: Props) => {
  // Find agent in list
  const initialAgent = useMemo(() => {
    return AGENTS.find(a => a.id === agentId) || AGENTS[0]
  }, [agentId])

  const [agent, setAgent] = useState<Agent>(initialAgent)
  const [users, setUsers] = useState<AgentUser[]>(MOCK_AGENT_USERS[agent.id] || [])

  // Modals & Snackbars
  const [confirmLockOpen, setConfirmLockOpen] = useState(false)
  const [resetTargetUser, setResetTargetUser] = useState<AgentUser | null>(null)
  const [toast, setToast] = useState<{ severity: 'success' | 'warning' | 'info'; message: string } | null>(null)

  // KPI configurations
  const profit = agent.totalSalesVND - agent.totalCostVND
  const profitPct = agent.totalCostVND > 0 ? (profit / agent.totalCostVND) * 100 : 0

  const handleToggleLock = () => {
    setAgent(prev => {
      const nextStatus = prev.status === 'blocked' ? 'active' : 'blocked'
      setToast({
        severity: nextStatus === 'blocked' ? 'warning' : 'success',
        message: nextStatus === 'blocked' ? `Đã khóa thành công tài khoản đại lý ${prev.name}!` : `Đã mở khóa hoạt động lại cho đại lý ${prev.name}!`
      })
      return { ...prev, status: nextStatus }
    })
    setConfirmLockOpen(false)
  }



  const handleResetPassword = () => {
    if (!resetTargetUser) return

    setToast({
      severity: 'success',
      message: resetTargetUser.role === 'Chủ'
        ? `Đã Reset mật khẩu cho Chủ ${resetTargetUser.name} thành công! Mật khẩu mặc định mới là: 3mMarket@2026. Một email thông báo đã được gửi đi.`
        : `Reset mật khẩu thành công tài khoản ${resetTargetUser.name}! Mật khẩu tạm thời: AgentStaff@2026`
    })

    setResetTargetUser(null)
  }

  const initials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map(w => w[0])
      .join('')
      .toUpperCase()

  return (
    <Box>
      {/* Back link & Header */}
      <Box className='mbe-6'>
        <Button
          component={Link}
          href='/3m/agents'
          startIcon={<i className='tabler-arrow-left text-[18px]' />}
          sx={{ mb: 3 }}
          color='secondary'
        >
          Quay lại danh sách đại lý
        </Button>

        <Box className='flex justify-between items-start flex-wrap gap-4'>
          <Box className='flex items-center gap-3.5'>
            <Avatar
              sx={{
                width: 54,
                height: 54,
                bgcolor: `rgba(var(--mui-palette-${tierColor[agent.tier]}-mainChannel) / 0.15)`,
                color: `${tierColor[agent.tier]}.main`,
                fontWeight: 700,
                fontSize: 18
              }}
            >
              {initials(agent.name)}
            </Avatar>
            <Box>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Typography variant='h4' className='font-bold'>
                  {agent.name}
                </Typography>
                <Chip
                  size='small'
                  variant='tonal'
                  color={tierColor[agent.tier]}
                  label={`${agent.tier} Tier`}
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
              <Typography variant='body2' color='text.secondary'>
                Mã đại lý: <strong>{agent.id}</strong> · Ngày tham gia sàn: {agent.joinedAt}
              </Typography>
            </Box>
          </Box>
          <Stack direction='row' spacing={2}>
            <Button
              variant='contained'
              color={agent.status === 'blocked' ? 'success' : 'error'}
              startIcon={<i className={agent.status === 'blocked' ? 'tabler-lock-open' : 'tabler-lock'} />}
              onClick={() => setConfirmLockOpen(true)}
            >
              {agent.status === 'blocked' ? 'Mở khóa hoạt động' : 'Khóa tài khoản đại lý'}
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Dynamic KPI Cards */}
      <Grid2 container spacing={4} className='mbe-6'>
        {/* Total Cost */}
        <Grid2 size={{ xs: 6, md: 3 }}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 500 }}>
                Tổng giá vốn (VND)
              </Typography>
              <Typography variant='h4' className='font-bold mbs-1'>
                {agent.totalCostVND.toLocaleString('vi-VN')}đ
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        {/* Total Revenue */}
        <Grid2 size={{ xs: 6, md: 3 }}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 500 }}>
                Tổng doanh thu (VND)
              </Typography>
              <Typography variant='h4' className='font-bold color-primary mbs-1'>
                {agent.totalSalesVND.toLocaleString('vi-VN')}đ
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        {/* Profit */}
        <Grid2 size={{ xs: 6, md: 3 }}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 500 }}>
                Lợi nhuận gộp ròng
              </Typography>
              <Typography variant='h4' className='font-bold mbs-1' color='success.main'>
                +{profit.toLocaleString('vi-VN')}đ
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        {/* Orders Count */}
        <Grid2 size={{ xs: 6, md: 3 }}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 500 }}>
                Tổng số đơn hàng đã bán
              </Typography>
              <Typography variant='h4' className='font-bold mbs-1'>
                {agent.ordersCount} đơn
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Profile & Users Layout */}
      <Grid2 container spacing={6}>
        {/* Left Column: Profile details */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card variant='outlined' sx={{ height: '100%' }}>
            <Box className='p-4' sx={{ borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'action.hover' }}>
              <Typography variant='subtitle2' className='font-bold flex items-center gap-1.5'>
                <i className='tabler-info-circle text-[18px] text-primary' /> Thông tin tổng quan
              </Typography>
            </Box>
            <CardContent sx={{ p: 5 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>Tên thương hiệu</Typography>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>{agent.name}</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>Chủ sở hữu (Chủ)</Typography>
                  <Typography variant='body1' sx={{ fontWeight: 600 }}>{agent.owner}</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>Điện thoại</Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>{agent.phone}</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>Hộp thư điện tử (Email)</Typography>
                  <Typography variant='body1' sx={{ fontWeight: 500 }}>{agent.email}</Typography>
                </Box>
                
                <Divider />

                <Box>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>Trạng thái tài khoản</Typography>
                  <Chip
                    size='small'
                    color={agentStatusColor[agent.status]}
                    label={agentStatusLabel[agent.status]}
                    variant='tonal'
                    sx={{ fontWeight: 600 }}
                  />
                </Box>


              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Right Column: User / Employee List */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card variant='outlined' sx={{ height: '100%' }}>
            <Box className='p-4 flex justify-between items-center' sx={{ borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'action.hover' }}>
              <Typography variant='subtitle2' className='font-bold flex items-center gap-1.5'>
                <i className='tabler-users text-[18px] text-primary' /> Tài khoản hoạt động của cửa hàng ({users.length})
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                Thành viên nội bộ thuộc đại lý quản trị
              </Typography>
            </Box>
            
            <TableContainer sx={{ minHeight: 320 }}>
              <Table size='medium'>
                <TableHead>
                  <TableRow>
                    <TableCell>Họ tên & Email</TableCell>
                    <TableCell>Vai trò</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Lần hoạt động cuối</TableCell>
                    <TableCell align='right'>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.id} hover>
                      <TableCell>
                        <Box className='flex items-center gap-3'>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: u.role === 'Chủ' ? 'rgba(var(--mui-palette-warning-mainChannel) / 0.15)' : 'action.selected',
                              color: u.role === 'Chủ' ? 'warning.main' : 'text.primary',
                              fontWeight: 600,
                              fontSize: 12
                            }}
                          >
                            {initials(u.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '13.5px' }}>{u.name}</Typography>
                            <Typography variant='caption' color='text.secondary'>{u.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          size='small'
                          variant='tonal'
                          color={u.role === 'Chủ' ? 'warning' : u.role === 'Kế toán' ? 'info' : 'secondary'}
                          icon={u.role === 'Chủ' ? <i className='tabler-crown text-[13px] mri-0.5' /> : undefined}
                          label={u.role}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant='body2'>{u.phone}</Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant='caption' color='text.secondary'>{u.lastActive}</Typography>
                      </TableCell>
                      
                      <TableCell align='right'>
                        {u.role === 'Chủ' && (
                          <Tooltip title='Reset mật khẩu của Chủ đại lý'>
                            <Button
                              size='small'
                              variant='outlined'
                              color='warning'
                              startIcon={<i className='tabler-key text-[15px]' />}
                              onClick={() => setResetTargetUser(u)}
                              sx={{ fontWeight: 600 }}
                            >
                              Reset pass
                            </Button>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align='center' sx={{ py: 6 }}>
                        <Typography color='text.secondary'>Chưa có tài khoản nào trực thuộc đại lý này.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid2>
      </Grid2>

      {/* CONFIRM LOCK AGENT DIALOG */}
      <AppConfirmDialog
        open={confirmLockOpen}
        onClose={() => setConfirmLockOpen(false)}
        onConfirm={handleToggleLock}
        severity={agent.status === 'blocked' ? 'primary' : 'warning'}
        icon={agent.status === 'blocked' ? 'tabler-lock-open' : 'tabler-lock'}
        title={agent.status === 'blocked' ? 'Kích hoạt lại đại lý' : 'Khóa tài khoản đại lý'}
        description={
          agent.status === 'blocked' ? (
            <>
              Bạn chắc chắn muốn mở lại đại lý <strong>{agent.name}</strong>? Hệ thống cửa hàng và API Gateway của đại lý sẽ được phục hồi quyền mua bán eSIM bình thường.
            </>
          ) : (
            <>
              Bạn chắc chắn muốn khóa tài khoản đại lý <strong>{agent.name}</strong>? Mọi giao dịch eSIM cũng như quyền truy cập hệ thống của đại lý này sẽ lập tức bị tạm ngừng.
            </>
          )
        }
        confirmLabel={agent.status === 'blocked' ? 'Mở khóa' : 'Khóa đại lý'}
      />

      {/* CONFIRM RESET PASSWORD DIALOG */}
      <AppConfirmDialog
        open={!!resetTargetUser}
        onClose={() => setResetTargetUser(null)}
        onConfirm={handleResetPassword}
        severity={resetTargetUser?.role === 'Chủ' ? 'warning' : 'primary'}
        icon='tabler-key'
        title={resetTargetUser?.role === 'Chủ' ? 'Reset mật khẩu của Chủ đại lý' : 'Reset mật khẩu tài khoản'}
        description={
          resetTargetUser?.role === 'Chủ' ? (
            <>
              Hệ thống sẽ thực hiện cài đặt lại mật khẩu cho <strong>Chủ {resetTargetUser?.name}</strong>. Mật khẩu mặc định mới sẽ được đặt thành <strong>3mMarket@2026</strong>.
              <br /><br />
              Bạn có chắc chắn muốn tiến hành reset không?
            </>
          ) : (
            <>
              Bạn chắc chắn muốn reset mật khẩu cho tài khoản nhân viên <strong>{resetTargetUser?.name}</strong>? Mật khẩu tạm thời sẽ được đặt thành <strong>AgentStaff@2026</strong>.
            </>
          )
        }
        confirmLabel='Đồng ý Reset'
      />

      {/* TOAST SNACKBAR */}
      <Snackbar
        open={!!toast}
        autoHideDuration={6000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast?.severity ?? 'success'} onClose={() => setToast(null)}>
          {toast?.message ?? ''}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AgentDetailView
