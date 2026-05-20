'use client'

import { useState } from 'react'
import Link from 'next/link'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'

import PageHeader from '@/components/layout/shared/PageHeader'

const AgentPricing = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState(0)

  const agentName = id.toUpperCase() === 'A001' ? 'TravelConnect Solutions' : 'Global eSIM Hub'
  const agentTier = id.toUpperCase() === 'A001' ? 'PLATINUM' : 'GOLD'
  const tierMarkup = agentTier === 'PLATINUM' ? 5 : 10

  const [inheritTier, setInheritTier] = useState(true)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const countries = [
    { code: 'JP', name: 'Nhật Bản', defaultMarkup: `${tierMarkup}%`, customMarkup: '10.5', status: 'Custom' },
    { code: 'US', name: 'Hoa Kỳ', defaultMarkup: `${tierMarkup}%`, customMarkup: '-2.5', status: 'Custom' },
    { code: 'TH', name: 'Thái Lan', defaultMarkup: `${tierMarkup}%`, customMarkup: '12', status: 'Custom' },
    { code: 'EU', name: 'Châu Âu', defaultMarkup: `${tierMarkup}%`, customMarkup: '', status: 'Default' }
  ]

  const priceHistory = [
    { id: 'HIS-001', country: 'Hoa Kỳ', oldValue: '+5%', newValue: '-2.5%', actor: 'Admin', time: '2026-05-08 14:20' },
    { id: 'HIS-002', country: 'Nhật Bản', oldValue: '+8%', newValue: '+10.5%', actor: 'Admin', time: '2026-05-07 09:15' },
    { id: 'HIS-003', country: 'Thái Lan', oldValue: 'Theo Tier', newValue: '+12%', actor: 'System', time: '2026-05-05 16:45' }
  ]

  return (
    <>
      <PageHeader
        title={`Cấu hình Giá đặc thù: ${agentName}`}
        description="Thiết lập các quy tắc Ghi đè (Override) dành riêng cho đại lý này. Lưu ý: Cấu hình tại đây sẽ có độ ưu tiên cao nhất, vượt qua Bảng giá chuẩn hệ thống."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' }, 
          { label: 'Đại lý', href: '/3m/downstream/agents' }, 
          { label: agentName, href: `/3m/downstream/agents/${id}` },
          { label: 'Cấu hình Giá' }
        ]}
        actions={
          <Stack direction='row' spacing={2}>
            <Button variant='tonal' color='secondary' component={Link} href={`/3m/downstream/agents/${id}`}>Quay lại</Button>
            <Button variant='contained' startIcon={<i className='tabler-device-floppy' />}>Lưu Cấu hình</Button>
          </Stack>
        }
        className='mbe-6'
      />

      <Card className='border-none shadow-sm mbe-6'>
        <Tabs value={activeTab} onChange={handleTabChange} className='border-be'>
          <Tab label="1. Toàn hệ thống (Global)" />
          <Tab label="2. Theo Quốc gia (Country)" />
        </Tabs>

        {activeTab === 0 && (
          <CardContent className='p-8'>
            <Box className='flex items-center gap-2 mbe-2'>
              <Typography variant='h5' className='font-black'>Cấu hình giá cho toàn bộ eSIM</Typography>
              <Chip label="Ưu tiên: Cao" color="primary" size="small" variant="tonal" className="h-5" />
            </Box>
            <Typography variant='body2' className='text-slate-500 mbe-6'>
              Mức Markup này sẽ được áp dụng cho toàn bộ eSIM của đại lý này, **ghi đè hoàn toàn** cấu hình mặc định theo Cấp bậc (Tier).
            </Typography>
            
            <Grid2 container spacing={8}>
              <Grid2 size={{ xs: 12, md: 7 }}>
                <Stack spacing={6}>
                  <Box className='flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200'>
                    <FormControlLabel
                      control={<Switch checked={inheritTier} onChange={(e) => setInheritTier(e.target.checked)} color='primary' />}
                      label={
                        <Box>
                          <Typography className='font-black'>Kế thừa cấu hình từ Cấp bậc (Tier)</Typography>
                          <Typography variant='caption' className='text-slate-400'>Cấp bậc hiện tại: {agentTier} (Markup +{tierMarkup}%)</Typography>
                        </Box>
                      }
                    />
                    {inheritTier && (
                      <Chip label={`Đang áp dụng: +${tierMarkup}%`} color='success' variant='tonal' size='small' className='font-black' />
                    )}
                  </Box>

                  {!inheritTier && (
                    <Box>
                      <Typography variant='subtitle2' className='font-black mbe-2 uppercase text-[11px] text-slate-500 text-primary'>Tỉ lệ nâng giá riêng (%)</Typography>
                      <TextField 
                        fullWidth 
                        placeholder='Ví dụ: -2.5 hoặc 8.5'
                        defaultValue={tierMarkup} 
                        inputProps={{ inputMode: 'decimal', pattern: '-?[0-9]*[.]?[0-9]*' }}
                        InputProps={{ 
                          endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                          className: 'font-black text-lg'
                        }}
                        helperText={`Ghi đè mức +${tierMarkup}% của cấp bậc ${agentTier}`}
                      />
                    </Box>
                  )}
                </Stack>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 5 }}>
                <Card className='bg-indigo-50/50 border-indigo-100 border border-solid shadow-none'>
                  <CardContent className='p-6'>
                    <Typography variant='subtitle2' className='font-black mbe-4 uppercase text-[11px] text-indigo-600 flex items-center gap-2'>
                      <i className='tabler-calculator' />
                      Bảng tính giá minh họa
                    </Typography>
                    
                    <Stack spacing={3}>
                      <Box className='flex justify-between'>
                        <Typography variant='body2' className='text-slate-500'>Giá gốc (Upstream Cost):</Typography>
                        <Typography variant='body2' className='font-bold'>$10.00</Typography>
                      </Box>
                      <Box className='flex justify-between'>
                        <Typography variant='body2' className='text-slate-500'>Tỉ lệ nâng giá:</Typography>
                        <Typography variant='body2' className='font-black text-indigo-600'>+{inheritTier ? tierMarkup : 8}%</Typography>
                      </Box>
                      <Divider className='border-indigo-100 border-dashed' />
                      <Box className='flex justify-between items-center'>
                        <Typography variant='body1' className='font-black'>Giá bán cho Đại lý:</Typography>
                        <Typography variant='h5' className='font-black text-primary'>
                          ${(10 * (1 + (inheritTier ? tierMarkup : 8) / 100)).toFixed(2)}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Box className='mt-4 p-3 bg-white rounded border border-indigo-100'>
                      <Typography variant='caption' className='text-slate-400 italic block'>
                        * Giá trên chỉ mang tính chất minh họa dựa trên ví dụ $10.00 giá gốc. Giá thực tế sẽ thay đổi theo từng gói cước.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>
          </CardContent>
        )}

        {activeTab === 1 && (
          <CardContent className='p-8'>
            <Box className='flex flex-col gap-2 mbe-6'>
              <Typography variant='h5' className='font-black'>Cấu hình giá eSIM theo quốc gia</Typography>
              <Typography variant='body2' className='text-slate-500'>
                Nhập tỉ lệ riêng cho từng quốc gia, hỗ trợ giá trị âm và thập phân. Cấu hình quốc gia sẽ ghi đè cấu hình toàn bộ eSIM.
              </Typography>
            </Box>

            <Grid2 container spacing={6} className='mbe-6'>
              <Grid2 size={{ xs: 12, md: 5 }}>
                <Card className='shadow-none border border-slate-200'>
                  <CardContent className='p-5'>
                    <Typography variant='subtitle1' className='font-black mbe-4'>Thêm cấu hình quốc gia</Typography>
                    <Stack spacing={4}>
                      <TextField select fullWidth size='small' label='Quốc gia' defaultValue='US'>
                        <MenuItem value='JP'>Nhật Bản</MenuItem>
                        <MenuItem value='US'>Hoa Kỳ</MenuItem>
                        <MenuItem value='TH'>Thái Lan</MenuItem>
                        <MenuItem value='EU'>Châu Âu</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        size='small'
                        label='Cấu hình riêng (%)'
                        placeholder='Ví dụ: -2.5 hoặc 10.5'
                        defaultValue='-2.5'
                        inputProps={{ inputMode: 'decimal', pattern: '-?[0-9]*[.]?[0-9]*' }}
                        InputProps={{ endAdornment: <InputAdornment position='end'>%</InputAdornment> }}
                        helperText='Âm = giảm giá, dương = tăng giá. Có thể nhập số thập phân.'
                      />
                      <Button variant='contained' startIcon={<i className='tabler-plus' />}>Áp dụng cấu hình</Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 7 }}>
                <Card className='shadow-none border border-primary/20 bg-primary/5 h-full'>
                  <CardContent className='p-5'>
                    <Typography variant='subtitle1' className='font-black mbe-4'>Tóm tắt cấu hình đang áp dụng</Typography>
                    <Grid2 container spacing={4}>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='font-bold text-slate-500 uppercase'>Theo Tier</Typography>
                        <Typography variant='h5' className='font-black text-slate-700'>+{tierMarkup}%</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 6 }}>
                        <Typography variant='caption' className='font-bold text-slate-500 uppercase'>Quốc gia ghi đè</Typography>
                        <Typography variant='h5' className='font-black text-primary'>3</Typography>
                      </Grid2>
                      <Grid2 size={{ xs: 12 }}>
                        <Box className='p-3 bg-white rounded border border-primary/10'>
                          <Typography variant='caption' className='text-slate-500'>
                            Ví dụ Hoa Kỳ: giá gốc $10.00 với cấu hình -2.5% sẽ còn <strong>$9.75</strong> cho đại lý.
                          </Typography>
                        </Box>
                      </Grid2>
                    </Grid2>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>

            <Card className='shadow-none border border-slate-200 mbe-6'>
              <Box className='p-5 border-be flex justify-between items-center'>
                <Typography variant='h6' className='font-black'>Bảng cấu hình hiện tại</Typography>
                <Button variant='outlined' size='small' startIcon={<i className='tabler-plus' />}>Thêm Quốc gia</Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className='font-black uppercase text-[11px]'>Quốc gia</TableCell>
                      <TableCell className='font-black uppercase text-[11px]'>Cấu hình gốc (Tier)</TableCell>
                      <TableCell className='font-black uppercase text-[11px]'>Cấu hình riêng (Đại lý)</TableCell>
                      <TableCell className='font-black uppercase text-[11px] text-center'>Trạng thái</TableCell>
                      <TableCell className='font-black uppercase text-[11px] text-right'>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {countries.map(country => (
                      <TableRow key={country.code}>
                        <TableCell>
                          <Box className='flex items-center gap-2'>
                            <i className={`fis fi fi-${country.code.toLowerCase()} rounded-full text-xl`} />
                            <Typography className='font-bold'>{country.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell className='text-slate-500'>Markup {country.defaultMarkup}</TableCell>
                        <TableCell>
                          {country.status === 'Custom' ? (
                            <TextField
                              size='small'
                              defaultValue={country.customMarkup}
                              placeholder='-2.5'
                              inputProps={{ inputMode: 'decimal', pattern: '-?[0-9]*[.]?[0-9]*' }}
                              InputProps={{ endAdornment: <InputAdornment position='end'>%</InputAdornment> }}
                              className='w-28'
                            />
                          ) : (
                            <Typography className='text-slate-400 italic'>Theo Tier</Typography>
                          )}
                        </TableCell>
                        <TableCell className='text-center'>
                          <Chip label={country.status === 'Custom' ? 'Riêng' : 'Theo Tier'} size='small' color={country.status === 'Custom' ? 'primary' : 'default'} variant='tonal' />
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button size='small' color='error'>Xóa</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            <Card className='shadow-none border border-slate-200'>
              <Box className='p-5 border-be'>
                <Typography variant='h6' className='font-black'>Lịch sử thay đổi bảng giá</Typography>
                <Typography variant='body2' className='text-slate-500'>Theo dõi các lần cập nhật cấu hình giá eSIM theo quốc gia.</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className='font-black uppercase text-[11px]'>Thời gian</TableCell>
                      <TableCell className='font-black uppercase text-[11px]'>Quốc gia</TableCell>
                      <TableCell className='font-black uppercase text-[11px]'>Giá trị cũ</TableCell>
                      <TableCell className='font-black uppercase text-[11px]'>Giá trị mới</TableCell>
                      <TableCell className='font-black uppercase text-[11px] text-right'>Người cập nhật</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {priceHistory.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant='caption' className='font-bold text-slate-500'>{item.time}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' className='font-black'>{item.country}</Typography>
                        </TableCell>
                        <TableCell>{item.oldValue}</TableCell>
                        <TableCell>
                          <Chip label={item.newValue} size='small' color='primary' variant='tonal' className='font-black' />
                        </TableCell>
                        <TableCell className='text-right'>{item.actor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </CardContent>
        )}

      </Card>
    </>
  )
}

export default AgentPricing
