'use client'

import { Modal, Card, CardHeader, CardContent, Grid2, TextField, Button, Box, Typography, Divider, MenuItem } from '@mui/material'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddSupplierModal = ({ open, handleClose }: Props) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      className='flex items-center justify-center'
    >
      <Card className='max-w-[600px] w-full mx-4 shadow-2xl'>
        <CardHeader 
          title="Thêm Nhà cung cấp Mới" 
          subheader="Cấu hình kết nối API Upstream"
          action={
            <IconButton onClick={handleClose} size='small'>
              <i className='tabler-x' />
            </IconButton>
          }
        />
        <Divider />
        <CardContent>
          <Grid2 container spacing={4}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Tên Nhà cung cấp" placeholder="vd: Airalo" variant='outlined' />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth select label="Loại Adapter" defaultValue="rest">
                <MenuItem value="rest">REST API (Standard)</MenuItem>
                <MenuItem value="soap">SOAP API</MenuItem>
                <MenuItem value="custom">Custom Implementation</MenuItem>
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField fullWidth label="Base API Endpoint" placeholder="https://api.provider.com/v1" />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="API Key / Client ID" type='password' />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="API Secret" type='password' />
            </Grid2>
            
            <Grid2 size={{ xs: 12 }}>
              <Box className='p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300'>
                <Typography variant='caption' className='text-slate-500'>
                  Lưu ý: Mọi thông tin API sẽ được mã hóa trước khi lưu vào cơ sở dữ liệu để đảm bảo an toàn.
                </Typography>
              </Box>
            </Grid2>
          </Grid2>

          <Box className='flex justify-end gap-3 mt-8'>
            <Button variant='tonal' color='secondary' onClick={handleClose}>Hủy</Button>
            <Button variant='contained' color='primary' onClick={handleClose}>Lưu & Kết nối</Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  )
}

import IconButton from '@mui/material/IconButton'

export default AddSupplierModal
