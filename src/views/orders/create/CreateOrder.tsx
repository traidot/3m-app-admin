'use client'
 
import React, { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid2 from '@mui/material/Grid2'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import PageHeader from '@/components/layout/shared/PageHeader'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const CreateOrder = () => {
  const router = useRouter()
  // Dev toggle to demonstrate different agent types
  const [agentType, setAgentType] = React.useState<'prepaid' | 'postpaid'>('postpaid')

  const handleCreateOrder = () => {
    toast.success('Tạo đơn hàng thành công!')
    router.push('/orders/list')
  }

  return (
    <>
      <PageHeader
        title="New Order"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Đơn hàng', href: '/orders/list' }, { label: 'New Order' }]}
        className='mbe-6'
        actions={
          <ToggleButtonGroup
            color="primary"
            value={agentType}
            exclusive
            onChange={(_, val) => val && setAgentType(val)}
            size="small"
          >
            <ToggleButton value="postpaid">Đại lý Công nợ</ToggleButton>
            <ToggleButton value="prepaid">Đại lý Ví</ToggleButton>
          </ToggleButtonGroup>
        }
      />

      <Card className='border-none shadow-sm'>
        <CardContent className='p-8'>
          <Box component='form' noValidate autoComplete='off' className='flex flex-col gap-6 max-w-4xl mx-auto'>
            <Grid2 container spacing={4} alignItems="center">
              
              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography variant='body1' className='font-medium md:text-right text-slate-500'>Country/ Region:</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                <TextField select fullWidth size='small' defaultValue="" sx={{ '& .MuiSelect-select': { color: 'text.secondary' } }}>
                  <MenuItem value="" disabled><em>Please select (only support keyword queries for country names...)</em></MenuItem>
                  <MenuItem value="JP">Nhật Bản</MenuItem>
                  <MenuItem value="TH">Thái Lan</MenuItem>
                  <MenuItem value="KR">Hàn Quốc</MenuItem>
                  <MenuItem value="US">Hoa Kỳ</MenuItem>
                </TextField>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography variant='body1' className='font-medium md:text-right text-slate-500'>Day(s):</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                <TextField select fullWidth size='small' defaultValue="" sx={{ '& .MuiSelect-select': { color: 'text.secondary' } }}>
                  <MenuItem value="" disabled><em>Select Days</em></MenuItem>
                  <MenuItem value="7">7 Ngày</MenuItem>
                  <MenuItem value="15">15 Ngày</MenuItem>
                  <MenuItem value="30">30 Ngày</MenuItem>
                </TextField>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography variant='body1' className='font-medium md:text-right text-slate-500'>Specification(s):</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                <TextField select fullWidth size='small' defaultValue="" sx={{ '& .MuiSelect-select': { color: 'text.secondary' } }}>
                  <MenuItem value="" disabled><em>Select Specifications</em></MenuItem>
                  <MenuItem value="Daily">Daily Plan</MenuItem>
                  <MenuItem value="Total">Total Plan</MenuItem>
                </TextField>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography variant='body1' className='font-medium md:text-right text-slate-500'>
                  <span className='text-error'>*</span> Data Plan:
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                <TextField select fullWidth size='small' defaultValue="" sx={{ '& .MuiSelect-select': { color: 'text.secondary' } }}>
                  <MenuItem value="" disabled><em>Enter Data plan(Support keyword searching)</em></MenuItem>
                  <MenuItem value="unlimited">Unlimited Data</MenuItem>
                  <MenuItem value="10gb">10GB</MenuItem>
                  <MenuItem value="50gb">50GB</MenuItem>
                </TextField>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography variant='body1' className='font-medium md:text-right text-slate-500'>
                  <span className='text-error'>*</span> Quantity:
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                <TextField type='number' fullWidth size='small' defaultValue="1" />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 3 }}>
                <Typography variant='body1' className='font-medium md:text-right text-slate-500'>Customer Remarks Order:</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                <TextField fullWidth size='small' placeholder="Enter order number" />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 3 }} className='self-start mt-2'>
                <Typography variant='body1' className='font-medium md:text-right text-slate-500'>Remarks:</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                <TextField fullWidth multiline rows={4} placeholder="Enter Remarks" />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 3 }} className='self-start mt-2'>
                <Typography variant='body1' className='font-medium md:text-right text-slate-500'>
                  <span className='text-error'>*</span> Payment Method:
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                {agentType === 'postpaid' ? (
                  <Box className='flex items-center justify-between p-3 border border-primary bg-primary/5 rounded-lg'>
                    <Box>
                      <Typography className='font-bold'>Ghi nhận công nợ</Typography>
                      <Typography variant='caption' className='text-slate-500'>Đơn hàng sẽ được đối soát và thanh toán vào cuối kỳ (15 tháng sau).</Typography>
                    </Box>
                    <i className='tabler-file-invoice text-2xl text-primary' />
                  </Box>
                ) : (
                  <Box className='flex items-center justify-between p-3 border border-success bg-success/5 rounded-lg'>
                    <Box>
                      <Typography className='font-bold'>Trừ tiền ví</Typography>
                      <Typography variant='caption' className='text-slate-500'>
                        Số dư hiện tại: <strong className='text-success'>$1,500.00</strong>
                      </Typography>
                    </Box>
                    <i className='tabler-wallet text-2xl text-success' />
                  </Box>
                )}
              </Grid2>
            </Grid2>

            <Box className='flex justify-end m-t-8'>
              <Button 
                variant='contained' 
                color='warning' 
                size='large' 
                className='min-is-[120px] font-bold'
                onClick={handleCreateOrder}
                sx={{ bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' } }}
              >
                OK
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default CreateOrder
