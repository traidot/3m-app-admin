'use client'

import { useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

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
import AddTransferDialog from './AddTransferDialog'
import { fuzzyFilter } from '@/utils/tableUtils'

const columnHelper = createColumnHelper<any>()

const transferData = [
  { id: 'TRF-001', from: 'Main Warehouse', to: 'North Branch', date: '2026-04-10', items: 15, status: 'Completed' },
  { id: 'TRF-002', from: 'Main Warehouse', to: 'East Storage', date: '2026-04-14', items: 5, status: 'In Transit' },
  { id: 'TRF-003', from: 'North Branch', to: 'Main Warehouse', date: '2026-04-16', items: 20, status: 'Draft' },
]

const TransferListView = () => {
  const [data] = useState(() => [...transferData])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Transfer Ref',
        cell: info => (
          <Typography 
            color='primary' 
            className='font-bold' 
            component={Link} 
            href={`/3m/inventory/transfer/${info.getValue()}`}
            
          >
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('from', {
        header: 'Source',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('to', {
        header: 'Destination',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const val = info.getValue()
          let color: any = 'primary'
          if (val === 'Draft') color = 'secondary'
          if (val === 'In Transit') color = 'warning'
          if (val === 'Completed') color = 'success'
          return <Chip label={val} color={color} size='small' variant='tonal' />
        }
      }),
      columnHelper.accessor('id', {
         id: 'actions',
         header: 'Actions',
         cell: info => (
           <Button 
             component={Link}
             href={`/3m/inventory/transfer/${info.row.original.id}`}
             variant='text' 
             size='small'
           >
             Track
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <PageHeader
        title='Inventory Transfer'
        description='Move stock between different warehouses or locations'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Inventory' }, { label: 'Transfer' }]}
      />

      <Card className='mt-6'>
        <CardContent className='flex items-center justify-between'>
          <TextField
            size='small'
            placeholder='Search Transfers...'
            sx={{ width: 250 }}
          />
          <Button variant='contained' color='info' startIcon={<i className='tabler-arrows-left-right' />} onClick={() => setIsDialogOpen(true)}>
            New Transfer Request
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

      <AddTransferDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default TransferListView
