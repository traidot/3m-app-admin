'use client'

// React Imports
import { useState, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import Grid from '@mui/material/Grid2'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Autocomplete from '@mui/material/Autocomplete'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn, Column } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import { WarningDialog, ConfirmDialog, SuccessDialog } from '@/components/common/StatusDialogs'
import UsersDrawer from './UsersDrawer'

// Utils Imports
import { getTableRowSx } from '@/utils'
import { useSystemSettings } from '@/hooks/useSystemSettings'
import { formatDateTimeBySettings } from '@/utils/formatUtils'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

// API Client Imports
import { axiosGet, axiosDelete, axiosPost, axiosPut, axiosPatch } from '@/lib/axios-client'
import { API_ENDPOINTS } from '@/config/api.config'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Hook Imports
import { useUser } from '@/hooks/useUser'

// Toast Imports
import { toast } from 'react-toastify'

// Module augmentation for @tanstack/react-table v8
declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

interface Role {
  id: string
  name: string
  description?: string | null
  role_type: string
  is_active: boolean
  order_by?: number
}

// Component để hiển thị roles với Popover
const UserRolesCell = ({ roles, oldRole, t }: { roles: Role[], oldRole?: string, t: any }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Backward compatibility: nếu không có roles nhưng có role cũ
  if (roles.length === 0 && oldRole) {
    const roleLabels: Record<string, string> = {
      sadmin: t('screens.system.users.roleLabels.sadmin'),
      admin: t('screens.system.users.roleLabels.admin'),
      user: t('screens.system.users.roleLabels.user'),
    }
    const roleColors: Record<string, 'error' | 'warning' | 'info'> = {
      sadmin: 'error',
      admin: 'warning',
      user: 'info',
    }
    return (
      <Chip
        label={roleLabels[oldRole] || oldRole}
        size='small'
        color={roleColors[oldRole] || 'default'}
        variant='tonal'
      />
    )
  }

  // Hiển thị nhiều roles
  if (roles.length === 0) {
    return <Typography variant='body2' color='text.secondary'>-</Typography>
  }

  // Sắp xếp roles theo order_by (tăng dần)
  const sortedRoles = [...roles].sort((a, b) => {
    const orderA = a.order_by ?? 0
    const orderB = b.order_by ?? 0
    return orderA - orderB
  })

  // Hiển thị 2 roles trên 1 dòng, nếu có role thứ 3 trở đi thì hiển thị "+"
  const visibleRoles = sortedRoles.slice(0, 2)
  const remainingCount = sortedRoles.length - 2
  const remainingRoles = sortedRoles.slice(2)

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
        {/* 2 roles đầu */}
        {visibleRoles.map((role: Role) => (
          <Chip
            key={role.id}
            label={role.name}
            size='small'
            color={role.role_type === 'system' ? 'primary' : 'default'}
            variant='tonal'
          />
        ))}
        {/* Hiển thị "+" nếu có role thứ 3 trở đi */}
        {remainingCount > 0 && (
          <Chip
            label='+'
            size='small'
            color='default'
            variant='outlined'
            onClick={handleClick}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Box>
      {/* Popover hiển thị roles còn lại */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Card variant='outlined' sx={{ p: 1, minWidth: 200 }}>
          <Typography variant='subtitle2' sx={{ px: 1.5, py: 1, fontWeight: 600 }}>
            {(t('screens.system.users.remainingRoles')).replace('{count}', remainingCount.toString())}
          </Typography>
          <Divider />
          <List dense>
            {remainingRoles.map((role: Role) => (
              <ListItem key={role.id} sx={{ py: 1.5 }}>
                <ListItemText
                  primary={role.name}
                  secondary={role.description}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Popover>
    </>
  )
}

interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  avatar?: string | null
  is_active: boolean // true = active, false = inactive
  roles?: Role[] // Mới: mảng các roles
  role?: 'sadmin' | 'admin' | 'user'
  last_login_at?: string | null
  created_by?: string | null
  created_at: string
  updated_by?: string | null
  updated_at: string
  deleted_by?: string | null
  deleted_at?: string | null
  version: number
}

type UserWithAction = User & {
  action?: string
}

interface UsersListTableProps {
  onDataChange?: () => void
}

type FormData = {
  email: string
  password: string
  name: string
  phone: string
  avatar: string
  is_active: boolean // true = active, false = inactive
  roleIds: string[] // Mảng các ID của roles
  version?: number // Dùng cho optimistic locking
}

type FormErrors = {
  email: string
  password: string
  name: string
  status?: string
  role?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const TABLE_PAGE_SIZES = [10, 25, 50] as const
const DRAWER_WIDTH = 400
const columnHelper = createColumnHelper<UserWithAction>()
const COLUMN_VISIBILITY_STORAGE_KEY = 'usersColumnVisibility'
const ESSENTIAL_COLUMNS = new Set(['select', 'name', 'role', 'is_active', 'action'])
const STICKY_RIGHT_COLUMNS = new Set<string>()

// Component cho Status Switch trong bảng
const StatusSwitch = ({
  user,
  currentUserId,
  onToggle
}: {
  user: User
  currentUserId?: string
  onToggle: (userId: string, newStatus: boolean) => Promise<void>
}) => {
  const [toggling, setToggling] = useState(false)
  const isActive = user.is_active === true
  const isCurrentUser = currentUserId && user.id === currentUserId
  const disabled = isCurrentUser || toggling

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation() // Ngăn chặn click vào row

    if (disabled) {
      return // Không cho phép toggle nếu là current user hoặc đang toggling
    }

    const newStatus = e.target.checked
    setToggling(true)

    try {
      await onToggle(user.id, newStatus)
    } catch (error) {
      // Hoàn nguyên switch khi có lỗi
      e.target.checked = !e.target.checked
    } finally {
      setToggling(false)
    }
  }

  return (
    <Switch
      checked={isActive}
      onChange={handleToggle}
      disabled={disabled}
      color='primary'
      size='small'
      title={isCurrentUser ? 'Bạn không thể cập nhật trạng thái của chính tài khoản của mình' : undefined}
    />
  )
}

const UsersListTable = forwardRef<{ handleAdd: () => void }, UsersListTableProps>((props, ref) => {
  const { settings } = useSystemSettings()
  const { onDataChange } = props
  const { t } = useI18n()
  const router = useRouter()
  const { user: currentUser } = useUser()

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<User[]>([])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModifierKeyPressed, setIsModifierKeyPressed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [resetPasswordResultDialogOpen, setResetPasswordResultDialogOpen] = useState(false)
  const [userToReset, setUserToReset] = useState<User | null>(null)
  const [resetPasswordResult, setResetPasswordResult] = useState<{ newPassword: string; user: any } | null>(null)
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false)
  const [optimisticLockDialogOpen, setOptimisticLockDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') {
      return {}
    }
    try {
      const stored = window.localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('[UsersListTable] Không thể parse cấu hình hiển thị cột:', error)
    }
    return {}
  })
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    avatar: '',
    is_active: false,
    roleIds: [],
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    password: '',
    name: '',
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    try {
      const response = await axiosGet(API_ENDPOINTS.SYSTEM.ROLES)
      if (response?.success && response.data) {
        const rolesData = response.data.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          role_type: r.role_type,
          is_active: r.is_active,
        }))
        setRoles(rolesData.filter((r: Role) => r.is_active))
      }
    } catch (error: any) {
      console.error('[UsersListTable] Lỗi khi lấy danh sách roles:', error)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const handleAdd = () => {
    setSelectedUser(null)
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      avatar: '',
      is_active: false,
      roleIds: [],
    })
    setFormErrors({
      email: '',
      password: '',
      name: '',
      status: '',
      role: '',
    })
    setErrorMessage(null)
    setDrawerOpen(true)
  }

  useImperativeHandle(ref, () => ({
    handleAdd
  }))

  // Track Ctrl/Cmd key để hiển thị cursor pointer và cho phép selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        setIsModifierKeyPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        setIsModifierKeyPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(COLUMN_VISIBILITY_STORAGE_KEY, JSON.stringify(columnVisibility))
    } catch (error) {
      console.warn('[UsersListTable] Không thể lưu cấu hình hiển thị cột:', error)
    }
  }, [columnVisibility])

  // Lấy danh sách users - lấy tất cả để filter đúng (giống tenants và roles)
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)

      // Tạo query params - lấy tất cả
      const params = new URLSearchParams()
      params.append('limit', '1000') // Lấy tất cả để filter đúng

      if (globalFilter) {
        params.append('search', globalFilter)
      }

      console.log('[UsersListTable] Đang lấy danh sách users từ:', `${API_ENDPOINTS.SYSTEM.USERS}?${params.toString()}`)
      const response = await axiosGet(`${API_ENDPOINTS.SYSTEM.USERS}?${params.toString()}`)
      console.log('[UsersListTable] Phản hồi users:', {
        success: response.success,
        hasData: !!response.data,
        dataLength: response.data?.length || 0,
      })

      if (response.success && response.data) {
        // Backend trả về user với mảng roles
        const users = response.data.map((u: any) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          phone: u.phone ?? null,
          avatar: u.avatar ?? null,
          is_active: u.is_active ?? false,
          role: u.role ?? 'user', // Đã deprecated, giữ lại để tương thích ngược
          roles: u.roles || [], // Mới: mảng các roles
          last_login_at: u.last_login_at ? new Date(u.last_login_at).toISOString() : null,
          created_by: u.created_by ?? null,
          created_at: u.created_at ? new Date(u.created_at).toISOString() : new Date().toISOString(),
          updated_by: u.updated_by ?? null,
          updated_at: u.updated_at ? new Date(u.updated_at).toISOString() : new Date().toISOString(),
          deleted_by: u.deleted_by ?? null,
          deleted_at: u.deleted_at ? new Date(u.deleted_at).toISOString() : null,
          version: u.version ?? 1,
        }))

        setData(users)
        setFilteredData(users)
      } else {
        console.warn('API response không hợp lệ:', response)
        setData([])
        setFilteredData([])
      }
    } catch (error: any) {
      console.error('[UsersListTable] Lỗi khi lấy danh sách users:', {
        message: error?.message,
        statusCode: error?.statusCode,
        response: error?.response?.data,
        stack: error?.stack,
      })

      // Đặt dữ liệu rỗng khi có lỗi
      setData([])
      setFilteredData([])
    } finally {
      setLoading(false)
    }
  }, [globalFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const getLatestUserVersion = useCallback(async (userId: string) => {
    try {
      const response = await axiosGet(API_ENDPOINTS.SYSTEM.USER_BY_ID(userId))
      if (response?.success && response.data) {
        const userData = response.data as any
        return {
          version: typeof userData.version === 'number' ? userData.version : null,
          deleted: false
        }
      }
      return { version: null, deleted: false }
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 404) {
        return { version: null, deleted: true }
      }
      throw error
    }
  }, [])

  const handleEdit = async (user: User) => {
    setErrorMessage(null)
    setDrawerOpen(true)

    try {
      // Lấy chi tiết user từ API để đảm bảo có dữ liệu mới nhất
      const response = await axiosGet(API_ENDPOINTS.SYSTEM.USER_BY_ID(user.id))

      let latest = user
      if (response && response.success && response.data) {
        const userData = response.data as any
        latest = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone ?? null,
          avatar: userData.avatar ?? null,
          is_active: userData.is_active ?? false,
          role: userData.role ?? 'user', // Đã deprecated
          roles: userData.roles || [], // Mới
          last_login_at: userData.last_login_at ? new Date(userData.last_login_at).toISOString() : null,
          created_by: userData.created_by ?? null,
          created_at: userData.created_at ? new Date(userData.created_at).toISOString() : new Date().toISOString(),
          updated_by: userData.updated_by ?? null,
          updated_at: userData.updated_at ? new Date(userData.updated_at).toISOString() : new Date().toISOString(),
          deleted_by: userData.deleted_by ?? null,
          deleted_at: userData.deleted_at ? new Date(userData.deleted_at).toISOString() : null,
          version: userData.version ?? 1,
        } as User
      }

      // Đặt user được chọn và dữ liệu form
      setSelectedUser(latest)
      setFormData({
        email: latest.email,
        password: '', // Không hiển thị password khi edit - dùng công cụ reset password riêng
        name: latest.name,
        phone: latest.phone ?? '',
        avatar: latest.avatar ?? '',
        is_active: latest.is_active,
        roleIds: latest.roles?.map((r: Role) => r.id) || [],
        version: latest.version ?? 1,
      })

      // Xóa lỗi form
      setFormErrors({
        email: '',
        password: '',
        name: '',
        status: '',
        role: '',
      })
    } catch (e: any) {
      const errorMessage = e?.message ?? e?.response?.data?.message ?? 'Không thể tải thông tin user'
      setErrorMessage(errorMessage)
    }
  }

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const handleResetPasswordClick = useCallback((user: User) => {
    setUserToReset(user)
    setResetPasswordResult(null)
    setResetPasswordDialogOpen(true)
    setErrorMessage(null)
  }, [])

  const handleResetPasswordConfirm = useCallback(async () => {
    if (!userToReset) return

    try {
      setResetPasswordLoading(true)
      setErrorMessage(null)

      // const response = await axiosPatch(API_ENDPOINTS.SYSTEM.USER_RESET_PASSWORD(userToReset.id))

      // if (response.success && response.data) {
      //   setResetPasswordResult(response.data)
      //   setResetPasswordDialogOpen(false)
      //   setResetPasswordResultDialogOpen(true)
      // } else {
      //   const errorMessage = response.message ?? 'Reset password thất bại'
      //   setErrorMessage(errorMessage)
      // }
    } catch (err: any) {
      const errorMessage = err.message ?? err?.response?.data?.message ?? 'Reset password thất bại'
      setErrorMessage(errorMessage)
    } finally {
      setResetPasswordLoading(false)
    }
  }, [userToReset])

  const handleDelete = useCallback(async () => {
    if (!userToDelete) return

    try {
      setSaving(true)
      setErrorMessage(null)

      // Tìm user để lấy version cho optimistic locking
      const user = data.find(u => u.id === userToDelete)
      if (!user) {
        setErrorMessage('Không tìm thấy user để xóa')
        return
      }

      // Luôn kiểm tra version mới nhất trước khi xóa
      const { version: latestVersion, deleted } = await getLatestUserVersion(userToDelete)

      if (deleted) {
        await fetchUsers()
        setOptimisticLockDialogOpen(true)
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        return
      }

      if (
        typeof user.version === 'number' &&
        typeof latestVersion === 'number' &&
        user.version !== latestVersion
      ) {
        await fetchUsers()
        setOptimisticLockDialogOpen(true)
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        return
      }

      const versionForDelete = typeof latestVersion === 'number' ? latestVersion : user.version

      // Endpoint xóa của backend (soft delete) với kiểm tra version
      const deleteUrl = typeof versionForDelete === 'number'
        ? `${API_ENDPOINTS.SYSTEM.USER_BY_ID(userToDelete)}?version=${versionForDelete}`
        : API_ENDPOINTS.SYSTEM.USER_BY_ID(userToDelete)

      await axiosDelete(deleteUrl)

      // 204 No Content không có body, nên response có thể là undefined hoặc empty
      // Nếu không có lỗi thì coi như thành công
      setData(prev => prev.filter(u => u.id !== userToDelete))
      setFilteredData(prev => prev.filter(u => u.id !== userToDelete))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      toast.success(t('message.success.userDeleted'))
      onDataChange?.()
    } catch (err: any) {

      // Kiểm tra optimistic locking (ResourceConflictException)
      const errorMessage = err?.response?.data?.message ?? err?.message
      const errorCode = err?.response?.data?.errorCode
      const category = err?.response?.data?.category

      if (
        errorCode === 'RESOURCE_CONFLICT' ||
        category === 'check' ||
        (typeof errorMessage === 'string' && (errorMessage.includes('version') || errorMessage.includes('đã bị thay đổi')))
      ) {
        await fetchUsers()
        setOptimisticLockDialogOpen(true)
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        return
      }

      // Phân tích lỗi từ phản hồi backend
      const errorData = err?.response?.data || err
      const finalErrorMessage = errorData?.message ?? err?.message ?? t('message.error.deleteError')
      setErrorMessage(finalErrorMessage)
    } finally {
      setSaving(false)
    }
  }, [userToDelete, data, onDataChange, fetchUsers, getLatestUserVersion])

  const handleBulkDelete = useCallback(async (tableInstance: any) => {
    const selectedRows = tableInstance.getRowModel().rows.filter((row: any) => (rowSelection as Record<string, boolean>)[row.id])
    const selectedIds = selectedRows.map((row: any) => row.original.id)

    if (selectedIds.length === 0) {
      toast.warning('Không có mục nào được chọn')
      return
    }

    try {
      setBulkDeleting(true)
      setErrorMessage(null)

      let successCount = 0
      let failCount = 0
      const failedItems: Array<{ id: string; name: string; error: string }> = []

      let versionConflictsDetected = false
      let skipResultToast = false

      // Xóa từng mục với xử lý lỗi và kiểm tra version
      for (const id of selectedIds) {
        try {
          const user = data.find(u => u.id === id)
          if (!user) {
            failCount++
            failedItems.push({ id, name: id, error: 'Không tìm thấy user' })
            continue
          }

          // Kiểm tra version mới nhất trước khi xóa
          let versionForDelete = user.version
          try {
            const { version: latestVersion, deleted } = await getLatestUserVersion(id)

            if (deleted) {
              failCount++
              versionConflictsDetected = true
              skipResultToast = true
              failedItems.push({
                id,
                name: user.name || user.email || id,
                error: 'Dữ liệu đã bị xóa hoặc thay đổi (version conflict)'
              })
              continue
            }

            if (
              typeof user.version === 'number' &&
              typeof latestVersion === 'number' &&
              user.version !== latestVersion
            ) {
              failCount++
              versionConflictsDetected = true
              skipResultToast = true
              failedItems.push({
                id,
                name: user.name || user.email || id,
                error: 'Dữ liệu đã bị thay đổi (version conflict)'
              })
              continue
            }

            versionForDelete = typeof latestVersion === 'number' ? latestVersion : versionForDelete
          } catch (versionError: any) {
            failCount++
            versionConflictsDetected = true
            skipResultToast = true
            const status = versionError?.response?.status
            const message = status === 404
              ? 'Dữ liệu đã bị xóa hoặc thay đổi (version conflict)'
              : (versionError?.message ?? 'Không thể kiểm tra version')

            failedItems.push({
              id,
              name: user.name || user.email || id,
              error: message
            })
            continue
          }

          // Luôn gửi version nếu có để kiểm tra optimistic locking
          // Backend sẽ validate version và throw error nếu không khớp
          const deleteUrl = typeof versionForDelete === 'number'
            ? `${API_ENDPOINTS.SYSTEM.USER_BY_ID(id)}?version=${versionForDelete}`
            : API_ENDPOINTS.SYSTEM.USER_BY_ID(id)

          await axiosDelete(deleteUrl)
          successCount++
        } catch (err: any) {
          failCount++

          // Kiểm tra lỗi optimistic locking
          const errorMessage = err?.response?.data?.message ?? err?.message ?? 'Lỗi không xác định'
          const errorCode = err?.response?.data?.errorCode
          const category = err?.response?.data?.category

          const isOptimisticLockError =
            errorCode === 'RESOURCE_CONFLICT' ||
            category === 'check' ||
            (typeof errorMessage === 'string' && (errorMessage.includes('version') || errorMessage.includes('đã bị thay đổi')))

          const user = data.find(u => u.id === id)
          failedItems.push({
            id,
            name: user?.name || user?.email || id,
            error: isOptimisticLockError ? 'Dữ liệu đã bị thay đổi (version conflict)' : errorMessage,
          })
        }
      }

      // Nếu có lỗi optimistic locking, tải lại dữ liệu để lấy version mới
      const hasOptimisticLockErrors = failedItems.some(item =>
        item.error.includes('version conflict') || item.error.includes('đã bị thay đổi')
      )
      if (versionConflictsDetected || hasOptimisticLockErrors) {
        await fetchUsers()
        setOptimisticLockDialogOpen(true)
      }

      // Cập nhật dữ liệu sau khi xóa
      if (successCount > 0) {
        const remainingIds = new Set(selectedIds.filter((id: string) => !failedItems.find(f => f.id === id)))
        setData(prev => prev.filter(u => !remainingIds.has(u.id)))
        setFilteredData(prev => prev.filter(u => !remainingIds.has(u.id)))
        setRowSelection({})
      }

      // Hiển thị kết quả
      if (!skipResultToast) {
        if (successCount > 0 && failCount === 0) {
          toast.success(`Đã xóa thành công ${successCount} mục`)
        } else if (successCount > 0 && failCount > 0) {
          toast.warning(`Đã xóa ${successCount} mục, ${failCount} mục thất bại`)
          console.warn('Các mục thất bại:', failedItems)
        } else {
          toast.error(`Không thể xóa bất kỳ mục nào. ${failCount} mục thất bại`)
          console.warn('Các mục thất bại:', failedItems)
        }
      } else if (failedItems.length > 0) {
        console.warn('Failed items:', failedItems)
      }

      setBulkDeleteDialogOpen(false)
      onDataChange?.()
    } catch (err: any) {
      const errorMessage = err?.message ?? t('screens.system.users.deleteFailed')
      setErrorMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setBulkDeleting(false)
    }
  }, [rowSelection, data, onDataChange, getLatestUserVersion, fetchUsers])

  const validateField = useCallback((field: keyof FormData, value: any): string => {
    switch (field) {
      case 'email':
        if (!value || !value.trim()) {
          return t('screens.system.users.email') + ' ' + t('form.required').toLowerCase()
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return t('message.error.invalidEmail')
        }
        return ''

      case 'password':
        if (!selectedUser && (!value || !value.trim())) {
          return t('screens.system.users.password') + ' ' + t('form.required').toLowerCase()
        }
        if (value && value.trim().length > 0 && value.trim().length < 6) {
          return t('screens.system.users.passwordMinLength')
        }
        return ''

      case 'name':
        if (!value || !value.trim()) {
          return t('screens.system.users.userName') + ' ' + t('form.required').toLowerCase()
        }
        return ''

      default:
        return ''
    }
  }, [selectedUser])

  const validate = useCallback(() => {
    // Validate tất cả các trường
    const newErrors: FormErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      name: validateField('name', formData.name),
    }

    setFormErrors(newErrors)

    // Kiểm tra xem có lỗi nào không
    const isValid = !newErrors.email && !newErrors.password && !newErrors.name

    return isValid
  }, [formData, validateField])

  const handleSave = useCallback(async () => {
    // Bước 1: Validate ở frontend trước
    if (!validate()) {
      // Hiển thị lỗi validation ở frontend
      return
    }

    try {
      setSaving(true)
      setErrorMessage(null)

      if (selectedUser) {
        // Update
        const phoneValue = formData.phone.trim();
        const avatarValue = formData.avatar.trim();

        const updateData: any = {
          name: formData.name.trim(),
          phone: phoneValue ? phoneValue : null,
          avatar: avatarValue ? avatarValue : null,
          roleIds: formData.roleIds || [],
        }

        // Chỉ gửi status nếu thực sự thay đổi so với giá trị ban đầu
        // Và không phải là user đang edit chính mình
        const isCurrentUser = currentUser?.id && selectedUser.id === currentUser.id;
        const statusChanged = formData.is_active !== selectedUser.is_active;

        if (statusChanged && !isCurrentUser) {
          // Chỉ gửi status nếu thay đổi và không phải current user
          updateData.status = formData.is_active;
        } else if (statusChanged && isCurrentUser) {
          // Nếu là current user và cố gắng thay đổi status, hiển thị lỗi
          setErrorMessage(t('screens.system.users.cannotUpdateOwnStatus'));
          setSaving(false);
          return;
        }
        // Nếu status không thay đổi, không gửi status trong updateData

        // Không cập nhật password khi edit - dùng công cụ reset password riêng
        // Trường password đã bị ẩn khi edit, nên không cần xử lý

        // Bao gồm version cho optimistic locking
        if (formData.version) {
          updateData.version = formData.version
        }

        // Lưu page index hiện tại để giữ nguyên sau khi update
        const currentPageIndex = table.getState().pagination.pageIndex

        const response = await axiosPut(
          API_ENDPOINTS.SYSTEM.USER_BY_ID(selectedUser.id),
          updateData
        )

        if (response.success && response.data) {
          const updated = response.data as any
          const updatedUser: User = {
            id: updated.id,
            email: updated.email,
            name: updated.name,
            phone: updated.phone ?? null,
            avatar: updated.avatar ?? null,
            is_active: updated.is_active ?? false,
            roles: updated.roles || [], // Mới
            last_login_at: updated.last_login_at ? new Date(updated.last_login_at).toISOString() : null,
            created_by: updated.created_by ?? null,
            created_at: updated.created_at ? new Date(updated.created_at).toISOString() : new Date().toISOString(),
            updated_by: updated.updated_by ?? null,
            updated_at: updated.updated_at ? new Date(updated.updated_at).toISOString() : new Date().toISOString(),
            deleted_by: updated.deleted_by ?? null,
            deleted_at: updated.deleted_at ? new Date(updated.deleted_at).toISOString() : null,
            version: updated.version ?? 1,
          }
          setData(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)))
          setFilteredData(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)))

          // Giữ nguyên page index sau khi update
          table.setPageIndex(currentPageIndex)

          setFormErrors({
            email: '',
            password: '',
            name: '',
            status: '',
          })
          setDrawerOpen(false)
          toast.success(t('message.success.userUpdated'))
          onDataChange?.()
        } else {
          // Response không thành công - lỗi sẽ được xử lý trong catch block
          const errorMessage = response.message ?? t('message.error.updateStatusError');
          setErrorMessage(errorMessage)
        }
      } else {
        // Tạo mới - không gửi avatar khi tạo mới
        const createPayload = {
          email: formData.email.trim(),
          password: formData.password.trim(),
          name: formData.name.trim(),
          phone: formData.phone.trim() || null,
          // Không gửi avatar khi tạo mới
          status: formData.is_active, // Backend mong đợi 'status' không phải 'is_active'
          roleIds: formData.roleIds || [],
        }

        const response = await axiosPost(
          API_ENDPOINTS.SYSTEM.USERS,
          createPayload
        )

        if (response && response.success && response.data) {
          const created = response.data as any
          const newUser: User = {
            id: created.id,
            email: created.email,
            name: created.name,
            phone: created.phone ?? null,
            avatar: created.avatar ?? null,
            is_active: created.is_active ?? false,
            roles: created.roles || [],
            last_login_at: created.last_login_at ? new Date(created.last_login_at).toISOString() : null,
            created_by: created.created_by ?? null,
            created_at: created.created_at ? new Date(created.created_at).toISOString() : new Date().toISOString(),
            updated_by: created.updated_by ?? null,
            updated_at: created.updated_at ? new Date(created.updated_at).toISOString() : new Date().toISOString(),
            deleted_by: created.deleted_by ?? null,
            deleted_at: created.deleted_at ? new Date(created.deleted_at).toISOString() : null,
            version: created.version ?? 1,
          }
          setData(prev => [...prev, newUser])
          setFilteredData(prev => [...prev, newUser])
          setFormErrors({
            email: '',
            password: '',
            name: '',
            status: '',
          })
          setDrawerOpen(false)
          toast.success(t('message.success.userCreated'))
          onDataChange?.()
        } else {
          // Response không thành công - lỗi sẽ được xử lý trong catch block
          const errorMessage = response.message ?? t('message.error.saveError');
          setErrorMessage(errorMessage)
        }
      }
    } catch (e: any) {
      // Phân tích lỗi từ axios interceptor (ApiError) hoặc phản hồi axios
      let errorMessage = 'Lưu user thất bại';
      let validationErrors: Record<string, string> = {};

      // Trường hợp 1: Lỗi từ axios interceptor (đối tượng ApiError) - có message, statusCode, errors
      if (e?.message && e?.statusCode !== undefined) {
        errorMessage = e.message;

        // Ánh xạ lỗi validation vào formErrors để hiển thị ở các trường input
        if (e.errors && typeof e.errors === 'object') {
          Object.entries(e.errors).forEach(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(', ') : String(messages);
            validationErrors[field] = msg;

            // Ánh xạ vào formErrors nếu là trường được validate
            if (field === 'email' || field === 'password' || field === 'name' || field === 'status') {
              setFormErrors(prev => ({ ...prev, [field]: msg }))
            }
          });
        }
      }
      // Trường hợp 2: Lỗi từ phản hồi axios (AxiosError)
      else if (e?.response?.data) {
        const errorData = e.response.data;
        errorMessage = errorData.message ?? errorData.error ?? errorMessage;

        // Ánh xạ lỗi validation vào formErrors
        if (errorData.errors && typeof errorData.errors === 'object') {
          Object.entries(errorData.errors).forEach(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(', ') : String(messages);
            validationErrors[field] = msg;

            // Ánh xạ vào formErrors nếu là trường được validate
            if (field === 'email' || field === 'password' || field === 'name' || field === 'status') {
              setFormErrors(prev => ({ ...prev, [field]: msg }))
            }
          });
        }
      }
      // Trường hợp 3: Thông báo lỗi trực tiếp
      else if (e?.message) {
        errorMessage = e.message;
      }

      // Hiển thị thông báo lỗi - nếu có lỗi validation, chỉ hiển thị thông báo chính
      // Lỗi validation đã được ánh xạ vào formErrors để hiển thị ở các trường input
      setErrorMessage(errorMessage)
    } finally {
      setSaving(false)
    }
  }, [validate, formData, selectedUser, onDataChange])

  const handleChange = useCallback(
    (field: keyof FormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))

      // Validate trường theo thời gian thực và xóa lỗi nếu hợp lệ
      const error = validateField(field, value)
      setFormErrors(prev => ({ ...prev, [field]: error }))
    },
    [validateField]
  )

  const getAvatar = (user: User) => {
    if (user.avatar) {
      return <CustomAvatar src={user.avatar} size={34} />
    }
    const displayName = user.name || user.email;
    return <CustomAvatar size={34}>{getInitials(displayName)}</CustomAvatar>
  }

  const getColumnLabel = (column: Column<UserWithAction, unknown>) => {
    const metaLabel = (column.columnDef.meta as { label?: string } | undefined)?.label
    if (metaLabel) {
      return metaLabel
    }
    if (typeof column.columnDef.header === 'string') {
      return column.columnDef.header
    }
    return column.id
  }

  const columns = useMemo<ColumnDef<UserWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 51,
        meta: { label: t('form.selectAll') }
      },
      columnHelper.accessor('name', {
        header: `${t('screens.system.users.userName')} / ${t('screens.system.users.email')}`,
        size: 220,
        minSize: 200,
        maxSize: 280,
        meta: { label: `${t('screens.system.users.userName')} / ${t('screens.system.users.email')}` },
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar(row.original)}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.name || '-'}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {row.original.email}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor(row => row.roles || (row.role ? [{ name: row.role }] : []), {
        id: 'roles',
        header: t('screens.system.users.userRole'),
        size: 200,
        minSize: 180,
        maxSize: 250,
        meta: { label: t('screens.system.users.userRole') },
        cell: ({ row }) => {
          const userRoles = row.original.roles || []
          return <UserRolesCell roles={userRoles} oldRole={row.original.role} t={t} />
        }
      }),
      columnHelper.accessor('last_login_at', {
        header: t('screens.system.users.lastLogin'),
        size: 180,
        minSize: 150,
        maxSize: 220,
        meta: { label: t('screens.system.users.lastLogin') },
        cell: ({ row }) => (
          <Typography variant='body2' color='text.primary'>
            <span className="flex items-center">
              <i className="tabler-calendar-event text-textPrimary mr-1 size-4" />
              {formatDateTimeBySettings(row.original.last_login_at, settings)}
            </span>
          </Typography>
        )
      }),
      columnHelper.accessor('created_at', {
        header: `${t('screens.system.users.createdAt')} / ${t('screens.system.users.updatedAt')}`,
        size: 200,
        minSize: 180,
        maxSize: 250,
        enableSorting: false,
        meta: { label: `${t('screens.system.users.createdAt')} / ${t('screens.system.users.updatedAt')}` },
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='body2' color='text.primary'>
              <span className="flex items-center">
                {formatDateTimeBySettings(row.original.created_at, settings)}
              </span>
            </Typography>
            <Typography variant='body2' color='text.primary'>
              <span className="flex items-center">
                {formatDateTimeBySettings(row.original.updated_at, settings)}
              </span>
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('is_active', {
        header: () => (
          <div className="flex justify-center items-center w-full">
            {t('form.status')}
          </div>
        ),
        size: 120,
        meta: { label: t('form.status') },
        cell: ({ row }) => {
          /**
           * Chuyển đổi trạng thái active của user và xử lý optimistic concurrency.
           * @param userId string
           * @param newStatus boolean
           */
          const handleToggleStatus = async (userId: string, newStatus: boolean) => {
            const user = row.original;
            const updateData = {
              status: newStatus,
              version: user.version,
            };

            // Lưu chỉ số trang hiện tại để giữ nguyên sau khi cập nhật
            const currentPageIndex = table.getState().pagination.pageIndex

            try {
              const response = await axiosPut(
                API_ENDPOINTS.SYSTEM.USER_BY_ID(userId),
                updateData
              );

              if (response && response.success && response.data) {
                const updated = response.data as any;
                const updatedUser: User = {
                  ...user,
                  is_active: updated.is_active ?? newStatus,
                  version: updated.version ?? user.version,
                  updated_at: updated.updated_at ? new Date(updated.updated_at).toISOString() : new Date().toISOString(),
                };

                // Update local state for <UsersListTable/>
                setData(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
                setFilteredData(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));

                // Hiển thị toast thành công
                toast.success(t('message.success.userUpdated'))

                // Giữ nguyên chỉ số trang sau khi cập nhật
                table.setPageIndex(currentPageIndex)

                onDataChange?.();
              } else {
                throw new Error(response?.message);
              }
            } catch (error: any) {
              // Kiểm tra optimistic locking (ResourceConflictException)
              const errorMessage = error?.response?.data?.message ?? error?.message;
              const errorCode = error?.response?.data?.errorCode;
              const category = error?.response?.data?.category;

              if (
                errorCode === 'RESOURCE_CONFLICT' ||
                category === 'check' ||
                (typeof errorMessage === 'string' && (errorMessage.includes('version') || errorMessage.includes('đã bị thay đổi')))
              ) {
                await fetchUsers();
                setOptimisticLockDialogOpen(true);
                throw new Error('Dữ liệu đã bị thay đổi. Vui lòng thử lại.');
              }

              throw error;
            }
          };

          return (
            <div className="flex justify-center items-center w-full">
              <StatusSwitch user={row.original} currentUserId={currentUser?.id} onToggle={handleToggleStatus} />
            </div>
          );
        }
      }),
      columnHelper.accessor('action', {
        header: () => (
          <div className="flex justify-center items-center w-full">
            {t('form.actions')}
          </div>
        ),
        size: 140,
        enableHiding: false,
        meta: { label: t('form.actions') },
        cell: ({ row }) => (
          <div className="flex justify-center items-center gap-1 w-full">
            <IconButton onClick={() => handleResetPasswordClick(row.original)} title={t('screens.system.users.resetPassword')}>
              <i className="tabler-key text-textSecondary" />
            </IconButton>
            <IconButton onClick={() => handleEdit(row.original)} title={t('form.edit')}>
              <i className="tabler-edit text-textSecondary" />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(row.original.id)} title={t('form.delete')}>
              <i className="tabler-trash text-textSecondary" />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [handleEdit, handleResetPasswordClick, handleDeleteClick, setData, setFilteredData, onDataChange]
  )

  const table = useReactTable({
    data: filteredData as User[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter,
      columnVisibility
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    // Tắt tự động reset pagination khi dữ liệu thay đổi (để giữ nguyên trang khi toggle status)
    autoResetPageIndex: false
  })


  const showEssentialColumns = () => {
    const visibility: Record<string, boolean> = {}
    table.getAllLeafColumns().forEach(column => {
      if (!column.getCanHide()) {
        visibility[column.id] = true
        return
      }
      visibility[column.id] = ESSENTIAL_COLUMNS.has(column.id)
    })
    setColumnVisibility(visibility)
  }

  const showAllColumns = () => {
    const visibility: Record<string, boolean> = {}
    table.getAllLeafColumns().forEach(column => {
      visibility[column.id] = true
    })
    setColumnVisibility(visibility)
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Card style={{ position: 'relative' }}>
        {/* Thanh công cụ hiển thị số mục đã chọn và các hành động - đè lên vùng header */}
        {Object.keys(rowSelection).length > 0 && (
          <div
            className='flex items-center justify-between border-b border-divider'
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: 'rgb(var(--mui-palette-primary-mainChannel) / 0.12)',
              transition: 'background-color 0.2s',
              minHeight: '86px',
              paddingInline: '1.5rem',
              paddingBlock: '24px'
            }}
          >
            <Typography variant='body2' color='text.primary'>
              {t('form.selected')}: {Object.keys(rowSelection).length} {t('form.items')}
            </Typography>
            <div className='flex gap-2 items-center'>
              <Button
                variant='outlined'
                color='error'
                size='small'
                startIcon={<i className='tabler-trash' />}
                onClick={() => setBulkDeleteDialogOpen(true)}
                disabled={bulkDeleting}
              >
                {t('screens.system.users.bulkDelete').replace('{count}', Object.keys(rowSelection).length.toString())}
              </Button>
              <div style={{ marginLeft: '16px' }} />
              <Button
                variant='outlined'
                size='small'
                onClick={() => setRowSelection({})}
              >
                {t('form.deselect')}
              </Button>
            </div>
          </div>
        )}
        <div
          className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 gap-4'
          style={{
            opacity: Object.keys(rowSelection).length > 0 ? 0 : 1,
            transition: 'opacity 0.2s'
          }}
        >
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='max-sm:is-full sm:is-[70px]'
          >
            {TABLE_PAGE_SIZES.map(size => (
              <MenuItem key={size} value={size.toString()}>
                {size}
              </MenuItem>
            ))}
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder={t('form.search')}
              className='max-sm:is-full'
            />
            <Button
              variant='outlined'
              onClick={event => setColumnMenuAnchor(event.currentTarget)}
              className='max-sm:is-full'
              sx={{
                minWidth: 38,
                width: 38,
                height: 38,
                p: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label='Cột hiển thị'
            >
              <i className='tabler-columns-3 text-[18px]' />
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={classnames(tableStyles.table, tableStyles.tableStt)}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      data-column-id={header.column.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                        maxWidth: header.getSize()
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {t('form.noDataAvailable')}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    const baseRowSx = (getTableRowSx(
                      row.getIsSelected(),
                      isModifierKeyPressed ? 'pointer' : 'default'
                    ) || {}) as Record<string, any>
                    const hoverStyles = (baseRowSx['&:hover'] as Record<string, any>) || {}
                    const isRowInactive = row.original.is_active === false

                    const inactiveBg = 'rgb(var(--mui-palette-secondary-mainChannel) / 0.15)'
                    const inactiveHoverBg = 'rgb(var(--mui-palette-secondary-mainChannel) / 0.2)'

                    return (
                      <Box
                        key={row.id}
                        component='tr'
                        className={classnames({ selected: row.getIsSelected() })}
                        onClick={(e) => {
                          // Không kích hoạt selection nếu click vào button/link/input
                          const target = e.target as HTMLElement
                          if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('[role="button"]')) {
                            return
                          }

                          // Chỉ chọn khi Ctrl/Cmd + Click
                          if (e.ctrlKey || e.metaKey) {
                            row.toggleSelected()
                          }
                          // Click thường: không làm gì
                        }}
                        sx={{
                          ...baseRowSx,
                          bgcolor: isRowInactive ? inactiveBg : baseRowSx?.bgcolor,
                          '&:hover': {
                            ...hoverStyles,
                            bgcolor: isRowInactive ? inactiveHoverBg : hoverStyles?.bgcolor || 'action.hover'
                          }
                        }}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td
                            key={cell.id}
                            data-column-id={cell.column.id}
                            style={{
                              width: cell.column.getSize(),
                              minWidth: cell.column.getSize(),
                              maxWidth: cell.column.getSize(),
                              backgroundColor: isRowInactive ? inactiveBg : undefined
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </Box>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>

      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={() => setColumnMenuAnchor(null)}
        keepMounted
      >
        <MenuItem sx={{ gap: 1 }} onClick={showEssentialColumns}>
          <i className='tabler-star text-[18px]' />
          <ListItemText
            primary={t('notifications.showEssentialColumns')}
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </MenuItem>
        <MenuItem sx={{ gap: 1 }} onClick={showAllColumns}>
          <i className='tabler-layout-grid text-[18px]' />
          <ListItemText
            primary={t('notifications.showAllColumns')}
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </MenuItem>
        <MenuItem disabled divider />
        {table
          .getAllLeafColumns()
          .filter(column => column.getCanHide())
          .map(column => (
            <MenuItem
              key={column.id}
              onClick={() => column.toggleVisibility()}
            >
              <Checkbox
                size='small'
                checked={column.getIsVisible()}
                onChange={() => column.toggleVisibility()}
                onClick={event => event.stopPropagation()}
              />
              <ListItemText
                primary={getColumnLabel(column)}
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </MenuItem>
          ))}
      </Menu>

      {/* Add/Edit Drawer */}
      <UsersDrawer
        open={drawerOpen}
        roles={roles}
        onClose={() => {
          setDrawerOpen(false)
          setErrorMessage(null)
          setFormErrors({
            email: '',
            password: '',
            name: '',
            status: '',
            role: '',
          })
          setSelectedUser(null)
        }}
        selectedUser={selectedUser}
        formData={formData}
        formErrors={formErrors}
        errorMessage={errorMessage}
        saving={saving}
        currentUserId={currentUser?.id || null}
        onFormChange={handleChange}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={t('dialog.confirmDelete') ?? 'Xác nhận xóa'}
        description={t('screens.system.users.confirmDeleteUser')}
        confirmText={t('form.delete') ?? 'Xóa'}
        cancelText={t('form.cancel') ?? 'Hủy'}
        confirmColor='error'
        loading={saving}
      />

      {/* Reset Password Confirmation Dialog */}
      <ConfirmDialog
        open={resetPasswordDialogOpen}
        onClose={() => {
          if (!resetPasswordLoading) {
            setResetPasswordDialogOpen(false)
            setUserToReset(null)
            setErrorMessage(null)
          }
        }}
        onConfirm={handleResetPasswordConfirm}
        title={t('screens.system.users.resetPassword')}
        description={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='body1'>
              {t('screens.system.users.resetPasswordConfirm')}
            </Typography>
            {userToReset && (
              <Box
                sx={{
                  bgcolor: 'action.hover',
                  p: 2,
                  borderRadius: 1
                }}
              >
                <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
                  {t('screens.system.users.userName')}:
                </Typography>
                <Typography variant='body1'>
                  {userToReset.name || userToReset.email}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {userToReset.email}
                </Typography>
              </Box>
            )}
            {errorMessage && (
              <Typography variant='body2' color='error'>
                {errorMessage}
              </Typography>
            )}
          </Box>
        }
        confirmText={t('screens.system.users.resetPassword')}
        cancelText={t('form.cancel')}
        confirmColor='primary'
        loading={resetPasswordLoading}
        maxWidth='sm'
      />

      {/* Reset Password Result Dialog */}
      {resetPasswordResult && (
        <SuccessDialog
          open={resetPasswordResultDialogOpen}
          onClose={() => {
            setResetPasswordResultDialogOpen(false)
            setResetPasswordResult(null)
            setUserToReset(null)
            onDataChange?.()
          }}
          title={t('screens.system.users.resetPasswordSuccess')}
          description={t('screens.system.users.resetPasswordSuccessMessage')}
          detail={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box
                sx={{
                  bgcolor: 'action.hover',
                  p: 2,
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  {t('screens.system.users.userName')}: {resetPasswordResult.user.name || resetPasswordResult.user.email}
                </Typography>
              </Box>

              <Box>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  {t('screens.system.users.newPassword')}:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CustomTextField
                    fullWidth
                    value={resetPasswordResult.newPassword}
                    InputProps={{ readOnly: true }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        fontWeight: 500
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(resetPasswordResult.newPassword)
                      toast.success(t('screens.system.users.passwordCopied'))
                    }}
                    title={t('form.copy')}
                    sx={{ bgcolor: 'action.hover' }}
                  >
                    <i className='tabler-copy' />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  bgcolor: 'warning.light',
                  color: 'warning.contrastText',
                  p: 2,
                  borderRadius: 1,
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-start'
                }}
              >
                <i className='tabler-alert-circle text-xl' />
                <Typography variant='body2'>
                  <strong>{t('form.note')}:</strong> {t('screens.system.users.resetPasswordWarning')}
                </Typography>
              </Box>
            </Box>
          }
          maxWidth='sm'
        />
      )}

      {/* Optimistic Locking Dialog */}
      <WarningDialog
        open={optimisticLockDialogOpen}
        onClose={() => setOptimisticLockDialogOpen(false)}
        title={t('screens.system.users.dataChanged')}
        description={t('screens.system.users.dataChangedDescription')}
        actions={
          <Button
            variant='contained'
            onClick={() => {
              window.location.reload()
            }}
          >
            {t('form.understood')}
          </Button>
        }
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        open={bulkDeleteDialogOpen}
        onClose={() => !bulkDeleting && setBulkDeleteDialogOpen(false)}
        onConfirm={() => {
          const tableInstance = table
          handleBulkDelete(tableInstance)
        }}
        title={t('screens.system.users.confirmBulkDelete')}
        description={
          <>
            <Typography variant='body1' sx={{ mb: 1 }}>
              {t('screens.system.users.confirmBulkDeleteDescription').replace('{count}', Object.keys(rowSelection).length.toString())}
            </Typography>
            <Typography variant='body2' color='error'>
              {t('screens.system.users.actionCannotUndone')}
            </Typography>
          </>
        }
        confirmText={t('form.delete')}
        cancelText={t('form.cancel')}
        confirmColor='error'
        loading={bulkDeleting}
      />
    </>
  )
})

UsersListTable.displayName = 'UsersListTable'

export default UsersListTable

