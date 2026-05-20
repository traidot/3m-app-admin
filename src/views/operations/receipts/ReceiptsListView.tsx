'use client'

import { useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
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
import { inboundData } from '@/data/operationsData'
import AddReceiptDialog from './AddReceiptDialog'
import { fuzzyFilter } from '@/utils/tableUtils'

const columnHelper = createColumnHelper<any>()

const GoodsReceivingListView = () => {
  const [data] = useState(() => [...inboundData])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'GR ID',
        cell: info => (
          <Typography 
            color='primary' 
            className='font-bold' 
            component={Link} 
            href={`/3m/operations/inbound/${info.getValue()}`}
            
          >
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('supplier', {
        header: 'Vendor',
        cell: info => <Typography color='text.primary'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('expectedDate', {
        header: 'ETA',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('totalItems', {
        header: 'Items Qty',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('warehouse', {
        header: 'Destination',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const val = info.getValue()
          let color: any = 'primary'
          if (val === 'Scheduled') color = 'secondary'
          if (val === 'In Transit') color = 'warning'
          if (val === 'Received') color = 'success'
          return <Chip label={val} color={color} size='small' variant='tonal' />
        }
      }),
      columnHelper.accessor('id', {
        id: 'actions',
        header: 'Inspect',
        cell: info => (
          <IconButton
            size='small'
            color='primary'
            component={Link}
            href={`/3m/warehouse/qc?grn=${info.row.original.id}`}
          >
            <i className='tabler-clipboard-check text-[22px]' />
          </IconButton>
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
        title='Goods Receiving (GR)'
        description='Register and inspect deliveries against Purchase Orders'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Logistics' }, { label: 'Receiving' }]}
      />

      <Card className='mt-6'>
        <CardContent className='flex items-center justify-between'>
          <TextField
            size='small'
            placeholder='Search Receipts...'
            sx={{ width: 250 }}
          />
          <Button variant='contained' startIcon={<i className='tabler-package-import' />} onClick={() => setIsDialogOpen(true)}>
            Create Receipt
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

      <AddReceiptDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default GoodsReceivingListView
