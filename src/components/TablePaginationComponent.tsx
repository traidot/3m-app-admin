// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'

// Translation Imports
import { useI18n } from '@/i18n/I18nProvider'

const TablePaginationComponent = ({ 
  table,
  total,
  onPageChange
}: { 
  table: ReturnType<typeof useReactTable>
  total?: number // Total từ backend (cho manualPagination)
  onPageChange?: (page: number) => void // Custom handler cho manualPagination
}) => {
  const { t } = useI18n()

  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  
  // Với manualPagination: dùng total từ backend
  // Không có manualPagination: dùng filtered rows length
  const isManualPagination = (table.options as any).manualPagination === true
  const totalRows = isManualPagination && total !== undefined 
    ? total 
    : table.getFilteredRowModel().rows.length
  
  const pageCount = isManualPagination && total !== undefined
    ? Math.ceil(total / pageSize)
    : Math.ceil(totalRows / pageSize)
  
  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const newPageIndex = page - 1
    if (onPageChange) {
      // Dùng custom handler nếu có (cho manualPagination)
      onPageChange(newPageIndex)
    } else {
      // Dùng default handler (cho client-side pagination)
      table.setPageIndex(newPageIndex)
    }
  }

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 bs-auto plb-[12.5px] gap-2 mt-1 mb-1'>
      <Typography color='text.disabled'>
        {t('form.showing')} {startRow} {t('form.to')} {endRow} {t('form.of')} {totalRows} {t('form.entries')}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={pageCount}
        page={pageIndex + 1}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
