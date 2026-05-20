'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import PageHeader from '@/components/layout/shared/PageHeader'

const APIKeyManager = () => {
  const keys = [
    { id: 'K001', agent: 'TravelConnect', key: 'sk_live_51M...', created: '2026-04-01', lastUsed: '1 giờ trước', status: 'Active' },
    { id: 'K002', agent: 'Global eSIM Hub', key: 'sk_live_92A...', created: '2026-03-15', lastUsed: '5 phút trước', status: 'Active' },
    { id: 'K003', agent: 'Nomad Partner', key: 'sk_test_11B...', created: '2026-04-20', lastUsed: 'N/A', status: 'Sandbox' }
  ]

  return (
    <>
      <PageHeader
        title="Quản lý API Keys"
        description="Cấp phát và giám sát quyền truy cập API cho các đại lý tích hợp hệ thống"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Phân phối' }, { label: 'API Keys' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-key' />}>Tạo Key mới</Button>
        }
        className='mbe-6'
      />

      <Card className='border-none shadow-sm'>
        <CardContent className='p-0'>
          <Box className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-slate-50 border-be'>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Đại lý</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>API Key (Secret)</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Ngày tạo</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Sử dụng lần cuối</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase'>Trạng thái</th>
                  <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} className='border-be last:border-0 hover:bg-slate-50/50 transition-colors'>
                    <td className='p-4'><Typography variant='body2' className='font-bold'>{k.agent}</Typography></td>
                    <td className='p-4'>
                      <Box className='flex items-center gap-2'>
                        <Typography variant='body2' className='font-mono bg-slate-100 px-2 py-1 rounded text-slate-600'>{k.key}</Typography>
                        <IconButton size='small'><i className='tabler-copy text-sm' /></IconButton>
                      </Box>
                    </td>
                    <td className='p-4'><Typography variant='caption'>{k.created}</Typography></td>
                    <td className='p-4'><Typography variant='caption'>{k.lastUsed}</Typography></td>
                    <td className='p-4'>
                      <Chip 
                        label={k.status} 
                        size='small' 
                        color={k.status === 'Active' ? 'success' : 'info'} 
                        variant='tonal'
                        className='font-bold'
                      />
                    </td>
                    <td className='p-4 text-right'>
                      <Box className='flex justify-end gap-1'>
                        <Tooltip title="Thu hồi (Revoke)">
                          <IconButton size='small' color='error'><i className='tabler-trash' /></IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default APIKeyManager
