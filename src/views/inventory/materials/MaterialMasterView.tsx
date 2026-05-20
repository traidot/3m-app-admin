'use client'

import { useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Grid2 from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'

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
import { inventoryData } from '@/data/inventoryData'
import AddMaterialDialog from './AddMaterialDialog'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import { fuzzyFilter } from '@/utils/tableUtils'

const columnHelper = createColumnHelper<any>()

const MaterialMasterView = () => {
  const [data, setData] = useState(() => [...inventoryData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingId) {
      setData(prev => prev.filter(item => item.id !== deletingId))
    }
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Material ID',
        cell: info => <Typography color='text.primary' className='font-medium'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'Item Description',
        cell: info => (
          <div className='flex flex-col'>
            <Typography 
              variant='body1' 
              className='font-bold' 
              color='primary' 
              component={Link} 
              href={`/3m/inventory/materials/${info.row.original.id}`}
              
            >
              {info.getValue()}
            </Typography>
            <Typography variant='caption' className='text-slate-500 font-medium'>{info.row.original.sku}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: info => <Chip label={info.getValue()} size='small' variant='tonal' color='info' className='font-medium' />
      }),
      columnHelper.accessor('quantity', {
        header: 'On Hand',
        cell: info => (
          <Typography variant='body2' className='font-bold' color='text.primary'>
            {info.getValue()} {info.row.original.unit}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Supply Alert',
        cell: info => {
          const val = info.getValue()
          let color: any = 'success'
          if (val === 'Low Stock') color = 'warning'
          if (val === 'Out of Stock') color = 'error'
          return <Chip label={val} color={color} size='small' variant='tonal' className='font-medium' />
        }
      }),
      columnHelper.accessor('location', {
        header: 'Primary Source',
        cell: info => <Typography variant='body2' className='text-slate-600'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('id', {
         id: 'actions',
         header: 'Actions',
         cell: info => (
           <div className='flex items-center'>
             <IconButton size='small' color='primary' onClick={() => handleEdit(info.row.original)}>
               <i className='tabler-edit text-[22px]' />
             </IconButton>
             <IconButton size='small' color='error' onClick={() => handleDeleteClick(info.row.original.id)}>
               <i className='tabler-trash text-[22px]' />
             </IconButton>
           </div>
         )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  })

  return (
    <>
      <PageHeader
        title='Material Master'
        description='Comprehensive directory of materials, services, and inventory items for procurement'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Master Data & Assets' }, { label: 'Material Master', href: '/inventory/materials' }]}
      />

      <Card className='mt-6'>
        <CardContent className='flex flex-wrap gap-6 items-end justify-between p-6'>
          <div className='flex items-center gap-6'>
            <Box className='flex flex-col gap-1.5'>
               <Typography variant='caption' className='uppercase font-bold text-slate-500'>Search Master</Typography>
               <TextField
                size='small'
                placeholder='Material name, ID, SKU...'
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                sx={{ width: 280 }}
              />
            </Box>
            <Box className='flex flex-col gap-1.5'>
               <Typography variant='caption' className='uppercase font-bold text-slate-500'>Filter Category</Typography>
               <TextField
                select
                size='small'
                defaultValue='all'
                sx={{ width: 180 }}
              >
                <MenuItem value='all'>All Materials</MenuItem>
                <MenuItem value='Electronics'>Electronics</MenuItem>
                <MenuItem value='Furniture'>Furniture</MenuItem>
                <MenuItem value='Consumables'>Consumables</MenuItem>
              </TextField>
            </Box>
          </div>
          <Button variant='contained' startIcon={<i className='tabler-package-plus' />} onClick={handleAddNew} sx={{ height: 40 }}>
            Register Material
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
          {data.length === 0 && (
            <div className='p-10 text-center text-slate-500 italic'>
              <Typography>No materials found matching your criteria</Typography>
            </div>
          )}
        </div>
        <CardContent className='py-4'>
           <TablePaginationComponent table={table} />
        </CardContent>
      </Card>

      <AddMaterialDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        data={editingItem} 
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to retire this material from the master catalogue?"
      />
    </>
  )
}

export default MaterialMasterView

