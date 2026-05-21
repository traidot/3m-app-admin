'use client'

import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import { useEffect, useState } from 'react'

import { cheapestSource, USD_TO_VND, type AgentPackage, type SupplierSource } from './data'

type Props = {
  open: boolean
  pkg: AgentPackage | null
  onClose: () => void
  onSave: (pkgId: string, pinnedSourceId: string | null) => void
}

const statusChip = (status: SupplierSource['status']) => {
  const map: Record<SupplierSource['status'], { label: string; color: 'success' | 'warning' | 'default' }> = {
    available: { label: 'Còn hàng', color: 'success' },
    out_of_stock: { label: 'Hết hàng', color: 'default' },
    paused: { label: 'Tạm dừng', color: 'warning' }
  }
  return <Chip size='small' variant='tonal' color={map[status].color} label={map[status].label} />
}

const SourcePoolDrawer = ({ open, pkg, onClose, onSave }: Props) => {
  const [selected, setSelected] = useState<string>('__auto__')

  useEffect(() => {
    if (pkg) setSelected(pkg.pinnedSourceId ?? '__auto__')
  }, [pkg])

  if (!pkg) return null

  const auto = cheapestSource({ ...pkg, pinnedSourceId: null })

  const handleSave = () => {
    onSave(pkg.id, selected === '__auto__' ? null : selected)
    onClose()
  }

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 520 } } }}
    >
      {/* Header */}
      <Box className='flex items-center justify-between p-6' sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box>
          <Typography variant='caption' color='text.secondary'>
            Rổ nguồn cung
          </Typography>
          <Typography variant='h5' className='font-bold'>
            {pkg.flag} {pkg.name}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <i className='tabler-x' />
        </IconButton>
      </Box>

      {/* Body */}
      <Box className='p-6 flex-1 overflow-auto'>
        <Alert severity='info' icon={<i className='tabler-info-circle' />} className='mbe-4'>
          Mặc định hệ thống tự chọn nguồn <strong>rẻ nhất</strong> trong rổ. Bạn có thể pin 1 nhà cung cấp
          cụ thể nếu muốn (override).
        </Alert>

        <Typography variant='subtitle2' className='mbe-3 uppercase' sx={{ letterSpacing: 0.8 }}>
          Chọn quy tắc giá vốn
        </Typography>

        <RadioGroup value={selected} onChange={e => setSelected(e.target.value)}>
          <Stack spacing={1.5}>
            {/* Auto cheapest option */}
            <Box
              onClick={() => setSelected('__auto__')}
              sx={{
                p: 2.5,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: selected === '__auto__' ? 'primary.main' : 'divider',
                backgroundColor: selected === '__auto__' ? 'action.selected' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <FormControlLabel
                value='__auto__'
                control={<Radio />}
                label={
                  <Box>
                    <Box className='flex items-center gap-2'>
                      <Typography sx={{ fontWeight: 600 }}>Tự động chọn rẻ nhất</Typography>
                      <Chip size='small' variant='tonal' color='primary' label='Khuyến nghị' />
                    </Box>
                    <Typography variant='caption' color='text.secondary'>
                      Hiện đang là: <strong>{auto?.supplier ?? '—'}</strong>
                      {auto ? ` · $${auto.costUSD.toFixed(2)}` : ''}
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { flex: 1 } }}
              />
            </Box>

            {/* Pin a specific supplier */}
            <Typography variant='caption' color='text.secondary' className='mbs-3 mbe-1 uppercase' sx={{ letterSpacing: 0.8 }}>
              Hoặc pin nhà cung cấp cụ thể
            </Typography>

            {pkg.sources.map(src => {
              const isCheapest = auto?.id === src.id
              const isSelected = selected === src.id
              return (
                <Box
                  key={src.id}
                  onClick={() => src.status !== 'out_of_stock' && setSelected(src.id)}
                  sx={{
                    p: 2.5,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    backgroundColor: isSelected ? 'action.selected' : 'transparent',
                    opacity: src.status === 'out_of_stock' ? 0.55 : 1,
                    cursor: src.status === 'out_of_stock' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <FormControlLabel
                    value={src.id}
                    disabled={src.status === 'out_of_stock'}
                    control={<Radio />}
                    label={
                      <Box className='flex items-center justify-between is-full'>
                        <Box>
                          <Box className='flex items-center gap-2'>
                            <Typography sx={{ fontWeight: 600 }}>{src.supplier}</Typography>
                            <Chip size='small' variant='outlined' label={src.supplierCode} />
                            {isCheapest && (
                              <Chip
                                size='small'
                                variant='tonal'
                                color='success'
                                label='Rẻ nhất'
                                icon={<i className='tabler-trending-down text-[14px]' />}
                              />
                            )}
                          </Box>
                          <Typography variant='caption' color='text.secondary'>
                            Đồng bộ lúc: {src.lastSync}
                          </Typography>
                        </Box>
                        <Box className='text-right'>
                          <Typography sx={{ fontWeight: 700 }}>${src.costUSD.toFixed(2)}</Typography>
                          <Typography variant='caption' color='text.secondary'>
                            ≈ {(src.costUSD * USD_TO_VND).toLocaleString('vi-VN')}đ
                          </Typography>
                          <Box className='mbs-1'>{statusChip(src.status)}</Box>
                        </Box>
                      </Box>
                    }
                    sx={{ m: 0, alignItems: 'flex-start', is: '100%', '& .MuiFormControlLabel-label': { flex: 1 } }}
                  />
                </Box>
              )
            })}
          </Stack>
        </RadioGroup>
      </Box>

      {/* Footer */}
      <Box className='p-4 flex gap-2 justify-end' sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant='tonal' color='secondary' onClick={onClose}>
          Huỷ
        </Button>
        <Button variant='contained' onClick={handleSave}>
          Lưu quy tắc
        </Button>
      </Box>
    </Drawer>
  )
}

export default SourcePoolDrawer
