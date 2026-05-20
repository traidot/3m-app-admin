'use client'

import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'

import PageHeader from '@/components/layout/shared/PageHeader'
import { useState } from 'react'

const PricingRules = () => {
  const [openOverride, setOpenOverride] = useState(false)
  const [overrideType, setOverrideType] = useState('package')

  const handleOpenOverride = () => setOpenOverride(true)
  const handleCloseOverride = () => setOpenOverride(false)

  return (
    <>
      <PageHeader
        title="Bảng giá chuẩn hệ thống (Global Markup Rules)"
        description="Thiết lập khung giá mặc định cho toàn bộ Chợ eSIM. Giá này sẽ tự động áp dụng cho tất cả Đại lý dựa trên Cấp bậc (Tier) của họ."
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Phân phối' }, { label: 'Bảng giá chuẩn' }]}
        actions={
          <Button variant='contained' startIcon={<i className='tabler-device-floppy' />}>Lưu Cấu hình</Button>
        }
        className='mbe-6'
      />

      <Grid2 container spacing={6}>
        {/* Global Markup Strategy */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='border-none shadow-sm'>
            <CardHeader 
              title='Quy tắc Markup mặc định theo Cấp bậc (Tier)' 
              subheader='Hệ thống lấy Giá Vốn NCC + % Markup để tạo ra Giá bán cho Đại lý. Nếu một đại lý không có cấu hình riêng, họ sẽ dùng bảng giá này.'
            />
            <Divider />
            <CardContent>
              <Stack spacing={6}>
                <Box className='flex items-center justify-between'>
                  <Box>
                    <Typography variant='body1' className='font-bold'>Markup Cơ sở (%)</Typography>
                    <Typography variant='caption' className='text-slate-400'>Phần trăm lợi nhuận tối thiểu trên giá vốn supplier</Typography>
                  </Box>
                  <TextField size='small' defaultValue="15" slotProps={{ input: { endAdornment: '%' } }} className='w-32' />
                </Box>
                
                <Box className='flex items-center justify-between'>
                  <Box>
                    <Typography variant='body1' className='font-bold'>Làm tròn giá</Typography>
                    <Typography variant='caption' className='text-slate-400'>Tự động làm tròn đến số thập phân gần nhất</Typography>
                  </Box>
                  <Select size='small' defaultValue="0.01" className='w-32'>
                    <MenuItem value="0.01">0.01</MenuItem>
                    <MenuItem value="0.5">0.5</MenuItem>
                    <MenuItem value="1.0">1.0</MenuItem>
                  </Select>
                </Box>

                <Divider />

                <Typography variant='h6' className='font-black'>Markup theo Cấp bậc Đại lý</Typography>
                
                <Grid2 container spacing={4}>
                  {[
                    { tier: 'PLATINUM', markup: '5%', color: 'primary' },
                    { tier: 'GOLD', markup: '10%', color: 'warning' },
                    { tier: 'SILVER', markup: '15%', color: 'secondary' }
                  ].map((t, i) => (
                    <Grid2 key={i} size={{ xs: 12, sm: 4 }}>
                      <Box className='p-4 bg-slate-50 rounded-xl border border-slate-100'>
                        <Typography variant='caption' className='font-black' color={t.color as any}>{t.tier}</Typography>
                        <TextField fullWidth size='small' defaultValue={t.markup} className='mt-2' />
                      </Box>
                    </Grid2>
                  ))}
                </Grid2>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>



        {/* Override Rules Table */}
        <Grid2 size={{ xs: 12 }}>
          <Card className='border-none shadow-sm'>
            <CardHeader 
              title='Danh sách Ghi đè (Override Rules)' 
              subheader='Cấu hình giá riêng cho các sản phẩm hoặc đại lý đặc biệt'
              action={<Button variant='tonal' size='small' startIcon={<i className='tabler-plus' />} onClick={handleOpenOverride}>Thêm Ghi đè</Button>}
            />
            <CardContent className='p-0'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-slate-50 border-be'>
                    <th className='p-4 text-xs font-black text-slate-500 uppercase'>Đối tượng</th>
                    <th className='p-4 text-xs font-black text-slate-500 uppercase'>Loại Markup</th>
                    <th className='p-4 text-xs font-black text-slate-500 uppercase'>Giá trị</th>
                    <th className='p-4 text-xs font-black text-slate-500 uppercase'>Trạng thái</th>
                    <th className='p-4 text-xs font-black text-slate-500 uppercase text-right'>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { target: 'Gói Nhật Bản 10GB', type: 'Cố định', value: '+$2.00', status: 'Đang áp dụng' },
                    { target: 'Đại lý TravelConnect', type: 'Phần trăm', value: '7%', status: 'Đang áp dụng' }
                  ].map((row, i) => (
                    <tr key={i} className='border-be last:border-0'>
                      <td className='p-4'><Typography variant='body2' className='font-bold'>{row.target}</Typography></td>
                      <td className='p-4'><Typography variant='body2'>{row.type}</Typography></td>
                      <td className='p-4'><Typography variant='body2' className='font-black text-primary'>{row.value}</Typography></td>
                      <td className='p-4'><Chip label={row.status} size='small' color='success' variant='tonal' /></td>
                      <td className='p-4 text-right'>
                        <IconButton size='small'><i className='tabler-trash text-error' /></IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Add Override Dialog */}
      <Dialog open={openOverride} onClose={handleCloseOverride} fullWidth maxWidth='sm'>
        <DialogTitle className='font-black'>Thêm Quy tắc Ghi đè mới</DialogTitle>
        <DialogContent>
          <Typography variant='body2' className='mbe-6'>
            Tạo quy tắc định giá riêng biệt để ghi đè lên bảng giá chuẩn của hệ thống.
          </Typography>
          
          <Stack spacing={6}>
            <TextField 
              select 
              fullWidth 
              label='Đối tượng áp dụng' 
              value={overrideType}
              onChange={(e) => setOverrideType(e.target.value)}
              size='small'
            >
              <MenuItem value='package'>Gói cước cụ thể</MenuItem>
              <MenuItem value='agent'>Đại lý cụ thể</MenuItem>
            </TextField>

            {overrideType === 'package' ? (
              <TextField select fullWidth label='Chọn Gói cước' defaultValue='' size='small'>
                <MenuItem value='jp-10gb'>Nhật Bản 10GB 7 Ngày</MenuItem>
                <MenuItem value='us-unl'>Mỹ Không Giới Hạn 15 Ngày</MenuItem>
                <MenuItem value='th-50gb'>Thái Lan 50GB</MenuItem>
              </TextField>
            ) : (
              <TextField select fullWidth label='Chọn Đại lý' defaultValue='' size='small'>
                <MenuItem value='a001'>TravelConnect Solutions</MenuItem>
                <MenuItem value='a002'>Global eSIM Hub</MenuItem>
              </TextField>
            )}

            <Grid2 container spacing={4}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField select fullWidth label='Loại Markup' defaultValue='percent' size='small'>
                  <MenuItem value='percent'>Phần trăm (%)</MenuItem>
                  <MenuItem value='fixed'>Cố định ($)</MenuItem>
                </TextField>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField 
                  fullWidth 
                  label='Giá trị' 
                  defaultValue='0' 
                  size='small'
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>%</InputAdornment>
                  }}
                />
              </Grid2>
            </Grid2>

            <Box className='p-4 bg-primary/5 rounded-lg border border-primary/20'>
              <Typography variant='caption' className='text-primary font-bold block mbe-1 uppercase'>Dự kiến hiển thị</Typography>
              <Typography variant='body2'>
                Giá vốn: <span className='font-bold'>$10.00</span> ➔ Giá bán riêng: <span className='font-black text-primary'>$11.50</span>
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions className='p-6 pt-0'>
          <Button onClick={handleCloseOverride} color='secondary' variant='tonal'>Hủy</Button>
          <Button onClick={handleCloseOverride} variant='contained' startIcon={<i className='tabler-check' />}>Xác nhận Thêm</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PricingRules
