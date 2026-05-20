'use client'

import { useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table'

import PageHeader from '@/components/layout/shared/PageHeader'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import AddUserDialog from './AddUserDialog'
import { fuzzyFilter } from '@/utils/tableUtils'

const columnHelper = createColumnHelper<any>()

const userData = [
  { id: 1, name: 'Admin User', role: 'Administrator', email: 'admin@ims.com', status: 'Active' },
  { id: 2, name: 'Warehouse Mgr 1', role: 'Manager', email: 'mgr1@ims.com', status: 'Active' },
  { id: 3, name: 'Staff Operator', role: 'Operator', email: 'staff@ims.com', status: 'Locked' },
  { id: 4, name: 'Guest Viewer', role: 'Viewer', email: 'guest@ims.com', status: 'Active' },
]

const UserListView = () => {
  const [data] = useState(() => [...userData])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'User',
        cell: info => (
          <div className='flex items-center gap-3'>
            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}>
              {info.getValue().charAt(0)}
            </Avatar>
            <div className='flex flex-col'>
              <Typography 
                variant='body2' 
                className='font-bold' 
                color='primary' 
                component={Link} 
                href={`/3m/system/users/${info.row.original.id}`}
                
              >
                {info.getValue()}
              </Typography>
              <Typography variant='caption'>{info.row.original.email}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: info => {
          const val = info.getValue()
          let color: any = 'primary'
          if (val === 'Administrator') color = 'error'
          if (val === 'Manager') color = 'warning'
          return <Chip label={val} size='small' variant='tonal' color={color} />
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const val = info.getValue()
          return <Chip label={val} color={val === 'Active' ? 'success' : 'default'} size='small' />
        }
      }),
      columnHelper.accessor('id', {
         id: 'actions',
         header: 'Control',
         cell: () => (
           <div className='flex items-center gap-1'>
             <IconButton size='small'><i className='tabler-settings text-[18px]' /></IconButton>
             <IconButton size='small' color='info'><i className='tabler-lock-open text-[18px]' /></IconButton>
           </div>
         )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <PageHeader
        title='User & Access Control'
        description='Manage system users, roles, and security permissions'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'System Engine' }, { label: 'Users & Roles', href: '/3m/system/users' }]}
      />

      <Card className='mt-6'>
        <CardContent className='flex items-center justify-between'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Security Search</Typography>
            <TextField
              size='small'
              placeholder='Search Users...'
              sx={{ width: 300 }}
            />
          </Box>
          <Button variant='contained' startIcon={<i className='tabler-user-plus' />} onClick={() => setIsDialogOpen(true)}>
            Create User
          </Button>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-be'>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='text-start p-4 bg-slate-50 uppercase text-xs font-semibold'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className='border-be hover:bg-slate-50'>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className='p-4'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePaginationComponent table={table} />
      </Card>

      <AddUserDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default UserListView
