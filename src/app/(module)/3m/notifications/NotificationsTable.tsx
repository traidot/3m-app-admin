'use client'

// React Imports
import { useEffect, useState, useMemo, useCallback } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import TablePagination from '@mui/material/TablePagination'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import Autocomplete from '@mui/material/Autocomplete'

// Third-party Imports
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'
import type { ColumnDef, Column } from '@tanstack/react-table'

// Component Imports
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

// Format Utils Imports
import { useSystemSettings } from '@/hooks/useSystemSettings'
import { formatDateTimeBySettings } from '@/utils/formatUtils'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// API Imports
import { API_ENDPOINTS } from '@/config/api.config'
import { axiosGet, axiosPatch } from '@/lib/axios-client'

interface NotificationItem {
  id: string
  user_id?: string | null
  recipient_id?: string | null
  type: string
  title: string
  message: string
  entity?: string | null
  entity_id?: string | null
  data?: any
  is_read: boolean
  read_at?: string | null
  created_at: string | null
  user?: {
    id: string
    email: string
    name: string
  } | null
}

type NotificationWithAction = NotificationItem & {
  action?: string
}

const TABLE_PAGE_SIZES = [10, 25, 50] as const
const columnHelper = createColumnHelper<NotificationWithAction>()
const COLUMN_VISIBILITY_STORAGE_KEY = 'notificationsColumnVisibility'
const ESSENTIAL_COLUMNS = new Set(['select', 'title', 'message', 'created_at', 'actions'])

const NotificationsTable = () => {
  const { t } = useI18n()
  const { settings } = useSystemSettings()

  // States
  const [data, setData] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
    { id: 'created_at', desc: true } // Default sort
  ])

  // Filter states (single selection)
  const [filterType, setFilterType] = useState<string>('')
  const [filterIsRead, setFilterIsRead] = useState<string>('')
  const [filterEntity, setFilterEntity] = useState<string>('')

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null)

  // Type options
  const typeOptions = [
    { value: '', label: t('notifications.all') },
    { value: 'info', label: t('notifications.typeInfo') },
    { value: 'success', label: t('notifications.typeSuccess') },
    { value: 'warning', label: t('notifications.typeWarning') },
    { value: 'error', label: t('notifications.typeError') }
  ]

  // Read status options
  const readStatusOptions = [
    { value: '', label: t('notifications.all') },
    { value: 'false', label: t('notifications.unread') },
    { value: 'true', label: t('notifications.read') }
  ]

  // Entity options
  const entityOptions = [
    { value: '', label: t('notifications.all') },
    { value: 'Tenant', label: t('notifications.entityTenant') },
    { value: 'SystemUser', label: t('notifications.entitySystemUser') },
    { value: 'SystemRole', label: t('notifications.entitySystemRole') },
    { value: 'SystemPermission', label: t('notifications.entitySystemPermission') }
  ]

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
      console.warn('[NotificationsTable] Failed to parse column visibility storage:', error)
    }
    return {}
  })
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: pageSize.toString()
      })

      // Append filters (single values)
      if (filterType) {
        params.append('type', filterType)
      }

      if (filterIsRead) {
        params.append('isRead', filterIsRead)
      }

      if (filterEntity) {
        params.append('entity', filterEntity)
      }

      // Append sort params (từ sorting state)
      if (sorting && sorting.length > 0) {
        const sort = sorting[0] // Lấy sort đầu tiên
        params.append('sortBy', sort.id)
        params.append('sortOrder', sort.desc ? 'desc' : 'asc')
      }

      const response = await axiosGet(`${API_ENDPOINTS.SYSTEM.NOTIFICATIONS}?${params.toString()}`)

      if (response.success && response.data) {
        // Backend trả về: { success: true, data: [...], pagination: {...} }
        const dataArray = Array.isArray(response.data) ? response.data : []

        // Map data từ backend (snake_case) sang interface
        const mappedData = dataArray.map((item: any) => {
          // Không dùng fallback value - nếu created_at là null thì để null
          let createdAt: string | null = null;
          if (item.created_at) {
            createdAt = typeof item.created_at === 'string'
              ? item.created_at
              : new Date(item.created_at).toISOString();
          }

          const readAt = item.read_at
            ? (typeof item.read_at === 'string' ? item.read_at : new Date(item.read_at).toISOString())
            : null;

          /**
           * Map data từ backend - không dùng fallback values
           * Check đàng hoàng từng field trước khi assign
           */
          // Check các optional fields - không dùng fallback, check đàng hoàng
          const userId = item.user_id ? item.user_id : null;
          const recipientId = item.recipient_id ? item.recipient_id : null;
          const entity = item.entity ? item.entity : null;
          const entityId = item.entity_id ? item.entity_id : null;
          const data = item.data ? item.data : null;
          const user = item.user ? item.user : null;

          return {
            id: item.id,
            user_id: userId,
            recipient_id: recipientId,
            type: item.type,
            title: item.title,
            message: item.message,
            entity: entity,
            entity_id: entityId,
            data: data,
            is_read: item.is_read,
            read_at: readAt,
            created_at: createdAt,
            user: user,
          }
        })

        setData(mappedData)
        if (response.pagination?.total !== undefined) {
          setTotal(response.pagination.total)
        }
      }
    } catch (error: any) {
      // Parse error để xử lý đúng cách
      const errorMessage = error.message;
      const isNetworkError = error.isNetworkError || error.statusCode === 0 ||
        (errorMessage && (
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('ERR_CONNECTION_REFUSED') ||
          errorMessage.includes('ERR_CONNECTION_RESET') ||
          errorMessage.includes('ERR_INTERNET_DISCONNECTED') ||
          errorMessage.includes('Cannot GET') ||
          errorMessage.includes('Cannot POST') ||
          errorMessage.includes('Cannot PATCH') ||
          errorMessage.includes('Cannot DELETE')
        ));

      // Xử lý network errors - hiển thị message rõ ràng cho user
      if (isNetworkError) {
        // Network error đã được xử lý bởi NetworkStatusContext và NetworkErrorBanner
      } else {
        // Các lỗi khác - đã được xử lý bởi error handler
      }
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, filterType, filterIsRead, filterEntity, sorting])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(COLUMN_VISIBILITY_STORAGE_KEY, JSON.stringify(columnVisibility))
    } catch (error) {
      console.warn('[NotificationsTable] Failed to save column visibility:', error)
    }
  }, [columnVisibility])

  // Handle toggle read/unread
  const handleToggleRead = useCallback(
    async (notification: NotificationItem) => {
      try {
        // Optimistic update: update local state immediately
        setData(prevData =>
          prevData.map(item =>
            item.id === notification.id
              ? {
                ...item,
                is_read: !item.is_read,
                read_at: !item.is_read ? new Date().toISOString() : null,
              }
              : item
          )
        )

        // Update selected notification if it's the same one
        if (selectedNotification?.id === notification.id) {
          setSelectedNotification(prev =>
            prev
              ? {
                ...prev,
                is_read: !prev.is_read,
                read_at: !prev.is_read ? new Date().toISOString() : null,
              }
              : null
          )
        }

        // Call API
        let response
        if (notification.is_read) {
          // Mark as unread
          // response = await axiosPatch(API_ENDPOINTS.SYSTEM.NOTIFICATION_MARK_UNREAD(notification.id), {})
        } else {
          // Mark as read
          // response = await axiosPatch(API_ENDPOINTS.SYSTEM.NOTIFICATION_MARK_READ(notification.id), {})
        }

        // // If API fails, revert the optimistic update
        // if (!response.success) {
        //   setData(prevData =>
        //     prevData.map(item =>
        //       item.id === notification.id
        //         ? {
        //           ...item,
        //           is_read: notification.is_read,
        //           read_at: notification.read_at,
        //         }
        //         : item
        //     )
        //   )
        //   if (selectedNotification?.id === notification.id) {
        //     setSelectedNotification(notification)
        //   }
        // }
      } catch (error) {
        // Revert optimistic update on error
        setData(prevData =>
          prevData.map(item =>
            item.id === notification.id
              ? {
                ...item,
                is_read: notification.is_read,
                read_at: notification.read_at,
              }
              : item
          )
        )
        if (selectedNotification?.id === notification.id) {
          setSelectedNotification(notification)
        }
      }
    },
    [selectedNotification]
  )

  // Handle dismiss
  const handleDismiss = useCallback(
    async (notification: NotificationItem) => {
      try {
        // const response = await axiosPatch(
        //   API_ENDPOINTS.SYSTEM.NOTIFICATION_DISMISS(notification.id),
        //   {}
        // )

        // if (response.success) {
        //   // Refresh list
        //   fetchNotifications()
        // }
      } catch (error) {
        // Silent fail
      }
    },
    [fetchNotifications]
  )

  // Handle view
  const handleView = useCallback(
    async (notification: NotificationItem) => {
      setSelectedNotification(notification)
      setViewDialogOpen(true)

      // Mark as read when viewing (only if not already read)
      if (!notification.is_read) {
        try {
          // Optimistic update
          setData(prevData =>
            prevData.map(item =>
              item.id === notification.id
                ? {
                  ...item,
                  is_read: true,
                  read_at: new Date().toISOString(),
                }
                : item
            )
          )
          setSelectedNotification(prev =>
            prev
              ? {
                ...prev,
                is_read: true,
                read_at: new Date().toISOString(),
              }
              : null
          )

          // Call API
          // const response = await axiosPatch(API_ENDPOINTS.SYSTEM.NOTIFICATION_MARK_READ(notification.id), {})

          // Revert on error
          // if (!response.success) {
          //   setData(prevData =>
          //     prevData.map(item =>
          //       item.id === notification.id
          //         ? {
          //           ...item,
          //           is_read: false,
          //           read_at: null,
          //         }
          //         : item
          //     )
          //   )
          //   setSelectedNotification(notification)
          // }
        } catch (error) {
          // Revert on error
          setData(prevData =>
            prevData.map(item =>
              item.id === notification.id
                ? {
                  ...item,
                  is_read: false,
                  read_at: null,
                }
                : item
            )
          )
          setSelectedNotification(notification)
        }
      }
    },
    []
  )

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} ${t('notifications.daysAgo')}`
    if (hours > 0) return `${hours} ${t('notifications.hoursAgo')}`
    if (minutes > 0) return `${minutes} ${t('notifications.minutesAgo')}`
    return t('notifications.justNow')
  }

  // Get type color
  const getTypeColor = (type: string): 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' => {
    switch (type) {
      case 'success':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
        return 'error'
      case 'info':
        return 'info'
      default:
        return 'default'
    }
  }

  const getColumnLabel = (column: Column<NotificationWithAction, unknown>) => {
    const metaLabel = (column.columnDef.meta as { label?: string } | undefined)?.label
    if (metaLabel) {
      return metaLabel
    }
    if (typeof column.columnDef.header === 'string') {
      return column.columnDef.header
    }
    return column.id ?? ''
  }

  // Table columns
  const columns = useMemo<ColumnDef<NotificationWithAction, any>[]>(
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
        meta: { label: t('notifications.select') }
      },
      columnHelper.accessor('title', {
        header: t('notifications.titleColumn'),
        meta: { label: t('notifications.titleColumn') },
        cell: ({ row }) => (
          <Typography
            variant='body2'
            color='text.primary'
            className={classnames({ 'font-bold': !row.original.is_read })}
            sx={{ fontWeight: !row.original.is_read ? 'bold' : 'normal' }}
          >
            {row.original.title}
          </Typography>
        )
      }),
      columnHelper.accessor('message', {
        header: t('notifications.content'),
        meta: { label: t('notifications.content') },
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary' className='line-clamp-1' style={{ maxWidth: '300px' }}>
            {row.original.message}
          </Typography>
        )
      }),
      columnHelper.accessor('type', {
        header: t('notifications.type'),
        meta: { label: t('notifications.type') },
        cell: ({ row }) => {
          // Check và lấy label từ typeOptions - không dùng fallback
          const typeOption = typeOptions.find(t => t.value === row.original.type);
          const label = typeOption ? typeOption.label : row.original.type;

          return (
            <Chip
              label={label}
              size='small'
              color={getTypeColor(row.original.type)}
              variant='tonal'
            />
          );
        }
      }),
      columnHelper.accessor('entity', {
        header: t('notifications.entity'),
        meta: { label: t('notifications.entity') },
        cell: ({ row }) => {
          // Check entity - không dùng fallback, hiển thị — nếu null
          const entity = row.original.entity;

          return (
            <Typography variant='body2' color='text.secondary'>
              {entity || '—'}
            </Typography>
          );
        }
      }),
      columnHelper.accessor('user', {
        header: t('notifications.createdBy'),
        meta: { label: t('notifications.createdBy') },
        cell: ({ row }) => {
          const user = row.original.user
          if (!user)
            return (
              <Typography variant='body2' color='text.secondary'>
                -
              </Typography>
            )

          if (user.name) {
            return (
              <Typography variant='body2' color='text.secondary'>
                {user.name}
              </Typography>
            )
          }

          if (user.email) {
            return (
              <Typography variant='body2' color='text.secondary'>
                {user.email}
              </Typography>
            )
          }

          return (
            <Typography variant='body2' color='text.secondary'>
              —
            </Typography>
          )
        }
      }),
      columnHelper.accessor('created_at', {
        header: t('notifications.time'),
        meta: { label: t('notifications.time') },
        enableSorting: true,
        cell: ({ row }) => {
          if (!row.original.created_at) {
            return (
              <Typography variant='body2' color='text.disabled'>
                —
              </Typography>
            )
          }

          const { settings } = useSystemSettings()
          return (
            <Box>
              <Typography variant='body2' color='text.secondary'>
                {formatRelativeTime(row.original.created_at)}
              </Typography>
              <Typography variant='caption' color='text.disabled'>
                {formatDateTimeBySettings(row.original.created_at, settings)}
              </Typography>
            </Box>
          )
        }
      }),
      columnHelper.accessor('action', {
        id: 'actions',
        header: t('notifications.actions'),
        enableHiding: false,
        meta: { label: t('notifications.actions') },
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <IconButton
              title={row.original.is_read ? t('notifications.markAsUnread') : t('notifications.markAsRead')}
              onClick={() => handleToggleRead(row.original)}
              size='small'
              color={row.original.is_read ? 'default' : 'primary'}
            >
              {row.original.is_read ? (
                <i className='tabler-mail text-textSecondary' />
              ) : (
                <i className='tabler-mail-opened text-primary' />
              )}
            </IconButton>
            <IconButton title={t('notifications.viewDetails')} onClick={() => handleView(row.original)} size='small'>
              <i className='tabler-info-circle text-textSecondary' />
            </IconButton>
            <IconButton title={t('notifications.delete')} onClick={() => handleDismiss(row.original)} size='small'>
              <i className='tabler-x text-textSecondary' />
            </IconButton>
          </Box>
        ),
        enableSorting: false
      })
    ],
    [handleView, handleDismiss, handleToggleRead]
  )

  const table = useReactTable<NotificationWithAction>({
    data: data as NotificationWithAction[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true, // Backend đã sort, không sort lại trên frontend
    initialState: {
      sorting: [
        {
          id: 'created_at',
          desc: true // Sắp xếp giảm dần theo created_at (default)
        }
      ]
    },
    state: {
      pagination: {
        pageIndex: page, // Sync với page state
        pageSize
      },
      sorting, // Sync với sorting state
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility,
    pageCount: Math.ceil(total / pageSize),
    onSortingChange: (updater: { id: string; desc: boolean }[] | ((prev: { id: string; desc: boolean }[]) => { id: string; desc: boolean }[])) => {
      // Handle sort change từ table
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      setPage(0) // Reset về trang 1 khi sort
    }
  } as any)

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

  return (
    <>
      <Card>
        {/* Filters */}
        <div className='p-6 border-b border-divider'>
          <Grid container spacing={4} justifyContent='flex-end'>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                fullWidth
                options={typeOptions}
                value={typeOptions.find(opt => opt.value === filterType) || null}
                onChange={(_, newValue) => {
                  if (newValue?.value) {
                    setFilterType(newValue.value)
                  } else {
                    setFilterType('')
                  }
                  setPage(0)
                }}
                getOptionLabel={option => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={params => <CustomTextField {...params} label={t('notifications.filterType')} />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                fullWidth
                options={readStatusOptions}
                value={readStatusOptions.find(opt => opt.value === filterIsRead) || null}
                onChange={(_, newValue) => {
                  if (newValue?.value) {
                    setFilterIsRead(newValue.value)
                  } else {
                    setFilterIsRead('')
                  }
                  setPage(0)
                }}
                getOptionLabel={option => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={params => <CustomTextField {...params} label={t('notifications.filterReadStatus')} />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                fullWidth
                options={entityOptions}
                value={entityOptions.find(opt => opt.value === filterEntity) || null}
                onChange={(_, newValue) => {
                  if (newValue?.value) {
                    setFilterEntity(newValue.value)
                  } else {
                    setFilterEntity('')
                  }
                  setPage(0)
                }}
                getOptionLabel={option => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderInput={params => <CustomTextField {...params} label={t('notifications.filterEntity')} />}
              />
            </Grid>
          </Grid>
        </div>

        {/* Table Controls */}
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 gap-4'>
          <CustomTextField
            select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
              setPage(0)
            }}
            className='max-sm:is-full sm:is-[70px]'
          >
            {TABLE_PAGE_SIZES.map(size => (
              <MenuItem key={size} value={size.toString()}>
                {size}
              </MenuItem>
            ))}
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
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
              aria-label={t('notifications.columnVisibility')}
            >
              <i className='tabler-columns-3 text-[18px]' />
            </Button>
          </div>
        </div>

        {/* Table */}
        <Box
          className='overflow-x-auto'
          sx={{
            '& .table': {
              borderBlockEnd: 'none !important',
              borderBottom: 'none !important'
            },
            '& table': {
              borderBlockEnd: 'none !important',
              borderBottom: 'none !important'
            },
            '& tbody tr:last-child': {
              borderBottom: 'none !important',
              borderBlockEnd: 'none !important'
            }
          }}
        >
          <table
            className={tableStyles.table}
            style={{ borderBlockEnd: 'none !important', borderBottom: 'none !important' } as any}
          >
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    const headerId = header.column.id
                    const isActionsColumn = headerId === 'actions'

                    return (
                      <th
                        key={header.id}
                        style={{
                          padding: '8px 12px',
                          textAlign: isActionsColumn ? 'center' : 'left'
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort(),
                              'justify-center': isActionsColumn
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
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    <CircularProgress size={24} />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {t('form.noDataAvailable')}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <Box
                    key={row.id}
                    component='tr'
                    className={classnames({ selected: row.getIsSelected() })}
                    sx={{
                      bgcolor: row.original.is_read ? 'transparent' : 'rgb(var(--mui-palette-primary-mainChannel) / 0.1)',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: row.original.is_read ? 'action.hover' : 'rgb(var(--mui-palette-primary-mainChannel) / 0.15)'
                      }
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} style={{ padding: '8px 12px' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </Box>
                ))
              )}
            </tbody>
          </table>
        </Box>

        {/* Pagination */}
        <TablePagination
          component={() => <TablePaginationComponent table={table as any} total={total} onPageChange={(newPage) => {
            setPage(newPage)
            table.setPageIndex(newPage)
          }} />}
          count={total}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(event, newPage) => {
            setPage(newPage)
            table.setPageIndex(newPage)
          }}
          onRowsPerPageChange={e => {
            setPageSize(Number(e.target.value))
            setPage(0)
            table.setPageIndex(0)
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
          <ListItemText primary={t('notifications.showEssentialColumns')} />
        </MenuItem>
        <MenuItem sx={{ gap: 1 }} onClick={showAllColumns}>
          <i className='tabler-layout-grid text-[18px]' />
          <ListItemText primary={t('notifications.showAllColumns')} />
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
                checked={column.getIsVisible()}
                onChange={() => column.toggleVisibility()}
                onClick={event => event.stopPropagation()}
              />
              <ListItemText primary={getColumnLabel(column)} />
            </MenuItem>
          ))}
      </Menu>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>{t('notifications.detailTitle')}</DialogTitle>
        <Divider />
        <DialogContent>
          {selectedNotification && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <Box>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  {t('notifications.titleColumn')}
                </Typography>
                <Typography variant='body1'>{selectedNotification.title}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  {t('notifications.detailContent')}
                </Typography>
                <Typography variant='body1'>{selectedNotification.message}</Typography>
              </Box>

              <Box>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  {t('notifications.detailType')}
                </Typography>
                <Chip
                  label={(() => {
                    const typeOption = typeOptions.find(t => t.value === selectedNotification.type);
                    return typeOption ? typeOption.label : selectedNotification.type;
                  })()}
                  size='small'
                  color={getTypeColor(selectedNotification.type)}
                  variant='tonal'
                />
              </Box>

              {selectedNotification.entity && (
                <Box>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    {t('notifications.detailEntity')}
                  </Typography>
                  <Typography variant='body1'>{selectedNotification.entity}</Typography>
                </Box>
              )}

              {selectedNotification.entity_id && (
                <Box>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    {t('notifications.detailEntityId')}
                  </Typography>
                  <Typography variant='body1'>{selectedNotification.entity_id}</Typography>
                </Box>
              )}

              {selectedNotification.user && (
                <Box>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    {t('notifications.detailCreatedBy')}
                  </Typography>
                  <Typography variant='body1'>
                    {selectedNotification.user.name
                      ? selectedNotification.user.name
                      : selectedNotification.user.email
                        ? selectedNotification.user.email
                        : '—'}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  {t('notifications.detailTime')}
                </Typography>
                <Typography variant='body1'>
                  {formatDateTimeBySettings(selectedNotification.created_at, settings)}
                </Typography>
              </Box>

              <Box>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  {t('notifications.detailStatus')}
                </Typography>
                <Chip
                  label={selectedNotification.is_read ? t('notifications.read') : t('notifications.unread')}
                  size='small'
                  color={selectedNotification.is_read ? 'success' : 'primary'}
                  variant='tonal'
                />
              </Box>

              {selectedNotification.data && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                      {t('notifications.detailData')}
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        maxHeight: '200px',
                        overflow: 'auto'
                      }}
                    >
                      <Typography
                        variant='body2'
                        component='pre'
                        sx={{ fontFamily: 'monospace', fontSize: '0.75rem', margin: 0 }}
                      >
                        {JSON.stringify(selectedNotification.data, null, 2)}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions>
          {selectedNotification && (
            <Button
              variant='outlined'
              color={selectedNotification.is_read ? 'primary' : 'success'}
              onClick={() => {
                if (selectedNotification) {
                  handleToggleRead(selectedNotification)
                }
              }}
            >
              {selectedNotification.is_read ? t('notifications.markAsUnread') : t('notifications.markAsRead')}
            </Button>
          )}
          <Button variant='contained' color='primary' onClick={() => setViewDialogOpen(false)}>{t('form.close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NotificationsTable

