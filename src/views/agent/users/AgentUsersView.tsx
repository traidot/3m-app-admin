'use client'

import { useMemo, useState } from 'react'
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
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

import {
  INTERNAL_USERS,
  ROLE_PRESETS,
  SCREENS,
  type InternalUser,
  type RolePreset
} from './data'
import AppConfirmDialog from '@/components/common/AppConfirmDialog'

import UserDrawer, { type DrawerMode } from './UserDrawer'
import { useRolePermissions, type ManagedRole } from './permissionsStore'

const KPI_CONFIG = [
  { key: 'total', label: 'Tổng người dùng', icon: 'tabler-users', color: 'primary' as const },
  { key: 'active', label: 'Đang hoạt động', icon: 'tabler-user-check', color: 'success' as const },
  { key: 'owner', label: 'Chủ tài khoản', icon: 'tabler-crown', color: 'warning' as const },
  { key: 'staff', label: 'Nhân viên', icon: 'tabler-user', color: 'info' as const }
]

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

const daysAgo = (iso: string | null) => {
  if (!iso) return 'Chưa đăng nhập'
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (diff === 0) return 'hôm nay'
  if (diff === 1) return 'hôm qua'
  if (diff < 30) return `${diff} ngày trước`
  if (diff < 365) return `${Math.floor(diff / 30)} tháng trước`
  return `${Math.floor(diff / 365)} năm trước`
}

const AgentUsersView = () => {
  const rolePerms = useRolePermissions()
  const [users, setUsers] = useState<InternalUser[]>(INTERNAL_USERS)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('view')
  const [activeUser, setActiveUser] = useState<InternalUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<InternalUser | null>(null)

  const handleDelete = () => {
    if (!deleteTarget) return
    setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const filtered = useMemo(() => {
    return users.filter(u => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      return (
        matchSearch &&
        (role === 'all' || u.rolePreset === role) &&
        (status === 'all' || u.status === status)
      )
    })
  }, [users, search, role, status])

  const kpis = useMemo(
    () => ({
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      owner: users.filter(u => u.rolePreset === 'owner').length,
      staff: users.filter(u => u.rolePreset === 'staff').length
    }),
    [users]
  )

  const openDrawer = (u: InternalUser | null, mode: DrawerMode) => {
    setActiveUser(u)
    setDrawerMode(mode)
    setDrawerOpen(true)
  }

  const handleSave = (next: InternalUser) => {
    setUsers(prev => {
      const exists = prev.some(u => u.id === next.id)
      return exists ? prev.map(u => (u.id === next.id ? next : u)) : [next, ...prev]
    })
    setActiveUser(next)
  }

  const activeFilterCount = [role, status].filter(v => v !== 'all').length

  return (
    <Box>
      {/* Header */}
      <Box className='flex items-start justify-between mbe-6 gap-4 flex-wrap'>
        <Box>
          <Typography variant='h4' className='font-bold mbe-1'>
            Người dùng nội bộ
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Quản lý user và phân quyền truy cập theo từng màn hình.
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<i className='tabler-plus' />}
          onClick={() => openDrawer(null, 'create')}
        >
          Thêm người dùng
        </Button>
      </Box>

      {/* KPI row */}
      <Grid2 container spacing={4} className='mbe-6'>
        {KPI_CONFIG.map(kpi => (
          <Grid2 key={kpi.key} size={{ xs: 6, md: 3 }}>
            <Card variant='outlined'>
              <CardContent>
                <Box className='flex items-center justify-between'>
                  <Box>
                    <Typography variant='caption' color='text.secondary'>
                      {kpi.label}
                    </Typography>
                    <Typography variant='h4' className='font-bold'>
                      {kpis[kpi.key as keyof typeof kpis]}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `rgba(var(--mui-palette-${kpi.color}-mainChannel) / 0.10)`,
                      color: `var(--mui-palette-${kpi.color}-main)`
                    }}
                  >
                    <i className={`${kpi.icon} text-[22px]`} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Filter + Table */}
      <Card variant='outlined'>
        <Box className='p-4' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box className='flex items-center gap-3 mbe-3'>
            <TextField
              size='small'
              placeholder='Tìm theo tên, email, SĐT, mã user...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ flex: 1, maxWidth: 380 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <i className='tabler-search text-[18px]' />
                  </InputAdornment>
                )
              }}
            />
            <Box className='flex-1' />
            {(activeFilterCount > 0 || search) && (
              <Button
                size='small'
                variant='text'
                color='secondary'
                startIcon={<i className='tabler-x text-[16px]' />}
                onClick={() => {
                  setSearch('')
                  setRole('all')
                  setStatus('all')
                }}
              >
                Xoá lọc{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Button>
            )}
            <Typography variant='caption' color='text.secondary'>
              Hiển thị <strong>{filtered.length}</strong> / {users.length} user
            </Typography>
          </Box>

          <Box
            className='grid gap-3'
            sx={{ gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' } }}
          >
            <TextField size='small' select label='Vai trò' value={role} onChange={e => setRole(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              {(Object.keys(ROLE_PRESETS) as RolePreset[]).map(r => (
                <MenuItem key={r} value={r}>
                  {ROLE_PRESETS[r].label}
                </MenuItem>
              ))}
            </TextField>
            <TextField size='small' select label='Trạng thái' value={status} onChange={e => setStatus(e.target.value)}>
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='active'>Hoạt động</MenuItem>
              <MenuItem value='inactive'>Vô hiệu hoá</MenuItem>
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Quyền</TableCell>
                <TableCell>Đăng nhập gần nhất</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align='right'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(u => {
                const preset = ROLE_PRESETS[u.rolePreset]
                const effectivePerms =
                  u.rolePreset === 'custom' ? u.permissions : rolePerms[u.rolePreset as ManagedRole]
                const grantedCount = Object.values(effectivePerms).filter(Boolean).length
                return (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Box className='flex items-center gap-3'>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: `rgba(var(--mui-palette-primary-mainChannel) / 0.12)`,
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: 14
                          }}
                        >
                          {initials(u.name)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{u.name}</Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {u.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                        {u.email}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {u.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size='small' variant='tonal' color={preset.color} label={preset.label} />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {grantedCount} / {SCREENS.length}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        màn hình
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {u.lastLoginAt ? (
                        <>
                          <Typography variant='body2'>{u.lastLoginAt.split(' ')[0]}</Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {daysAgo(u.lastLoginAt)}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant='caption' color='text.disabled'>
                          Chưa đăng nhập
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size='small'
                        variant='tonal'
                        color={u.status === 'active' ? 'success' : 'secondary'}
                        label={u.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
                        <Tooltip title='Xem chi tiết'>
                          <IconButton size='small' onClick={() => openDrawer(u, 'view')}>
                            <i className='tabler-eye text-[20px]' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Phân quyền'>
                          <IconButton size='small' onClick={() => openDrawer(u, 'edit')}>
                            <i className='tabler-pencil text-[20px]' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={u.rolePreset === 'owner' ? 'Không thể xoá Chủ tài khoản' : 'Xoá tài khoản'}>
                          <span>
                            <IconButton
                              size='small'
                              onClick={() => setDeleteTarget(u)}
                              disabled={u.rolePreset === 'owner'}
                            >
                              <i className='tabler-trash text-[20px]' />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                    <Typography color='text.secondary'>Không có user nào khớp bộ lọc.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <UserDrawer
        open={drawerOpen}
        mode={drawerMode}
        user={activeUser}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        onSwitchMode={setDrawerMode}
      />

      <AppConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        severity='error'
        icon='tabler-trash'
        title='Xoá tài khoản'
        description={
          <>
            Bạn chắc chắn muốn xoá <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email})? Hành
            động này không thể hoàn tác.
          </>
        }
        confirmLabel='Xoá tài khoản'
      />
    </Box>
  )
}

export default AgentUsersView
