'use client'

import { useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid2 from '@mui/material/Grid2'
import Link from 'next/link'
import Avatar from '@mui/material/Avatar'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'

import PageHeader from '@/components/layout/shared/PageHeader'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import Box from '@mui/material/Box'
import AddVendorDialog from './AddVendorDialog'
import { partnersData } from '@/data/partnersData'
import { fuzzyFilter } from '@/utils/tableUtils'

const columnHelper = createColumnHelper<any>()

const VendorListView = () => {
  const [data] = useState(() => [...partnersData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Supplier / ID',
        cell: info => (
          <div className='flex items-center gap-3'>
            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', fontWeight: 'bold' }}>
              {info.getValue().charAt(0)}
            </Avatar>
            <div className='flex flex-col'>
              <Typography 
                color='primary' 
                className='font-bold' 
                component={Link} 
                href={`/3m/partners/${info.row.original.id}`}
                
              >
                {info.getValue()}
              </Typography>
              <Typography variant='caption' className='text-slate-500 font-medium'>{info.row.original.email}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('type', {
        header: 'Category',
        cell: info => <Chip label={info.getValue()} size='small' variant='tonal' color='info' className='font-medium' />
      }),
      columnHelper.accessor('contact', {
        header: 'Account Manager',
        cell: info => <Typography variant='body2' className='font-medium text-slate-700'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const val = info.getValue()
          return <Chip label={val} color={val === 'Active' ? 'success' : 'secondary'} size='small' variant='tonal' className='font-medium' />
        }
      }),
      columnHelper.accessor('id', {
         id: 'actions',
         header: 'Operations',
         cell: info => (
           <Button 
             component={Link}
             href={`/3m/partners/performance?vendor=${info.row.original.id}`}
             variant='text' 
             size='small' 
             startIcon={<i className='tabler-file-certificate' />} 
             className='font-medium'
           >
             Verify
           </Button>
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
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <>
      <PageHeader
        title='Vendor & Supplier Directory'
        description='Centralized hub for managing verified procurement partners and material suppliers'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Supplier Hub' }, { label: 'Vendor Directory' }]}
      />

      <Card className='mt-6'>
        <CardContent className='flex flex-wrap gap-6 items-end justify-between p-6'>
          <Box className='flex flex-col gap-1.5'>
            <Typography variant='caption' className='uppercase font-bold text-slate-500'>Quick Search</Typography>
            <TextField
              size='small'
              placeholder='Search by company, email...'
              sx={{ width: 320 }}
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
            />
          </Box>
          <Button variant='contained' color='secondary' startIcon={<i className='tabler-user-plus' />} onClick={() => setIsDialogOpen(true)} sx={{ height: 40 }}>
            Onboard New Vendor
          </Button>
        </CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-be'>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className='text-start p-4 bg-slate-50 uppercase text-[11px] font-bold text-slate-600'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className='border-be hover:bg-slate-50 transition-colors'>
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
        <CardContent className='py-4'>
           <TablePaginationComponent table={table} />
        </CardContent>
      </Card>

      <AddVendorDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default VendorListView
