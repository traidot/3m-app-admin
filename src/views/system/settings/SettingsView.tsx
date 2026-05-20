'use client'

import { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'

import PageHeader from '@/components/layout/shared/PageHeader'

const SettingsView = () => {
  return (
    <>
      <PageHeader
        title='3M App Config'
        description='Manage procurement business rules, approval workflows, and bidding preferences'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'System Engine' }, { label: 'System Config', href: '/system/settings' }]}
        actions={<Button variant='contained' color='primary' startIcon={<i className='tabler-device-floppy' />}>Save Configuration</Button>}
      />

      <Grid2 container spacing={6} className='mt-6'>
        {/* General Business Info */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Strategic Entity Profile' />
            <CardContent>
              <Stack spacing={5}>
                <Box className='flex flex-col gap-1.5'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Procurement Entity Name</Typography>
                  <TextField fullWidth defaultValue='3M App Global' size='small' />
                </Box>
                <Box className='flex flex-col gap-1.5'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Corporate Tax ID</Typography>
                  <TextField fullWidth defaultValue='NP-CORE-2026' size='small' />
                </Box>
                <Box className='flex flex-col gap-1.5'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Default Trading Currency</Typography>
                  <TextField fullWidth select defaultValue='USD' size='small'>
                    <MenuItem value='USD'>USD ($)</MenuItem>
                    <MenuItem value='EUR'>EUR (€)</MenuItem>
                    <MenuItem value='VND'>VND (₫)</MenuItem>
                  </TextField>
                </Box>
                <Box className='flex flex-col gap-1.5'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Headquarters Address</Typography>
                  <TextField fullWidth multiline rows={2} defaultValue='3M App HQ, Digital Commerce Zone' size='small' />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Procurement Controls */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Sourcing & Approval Controls' />
            <CardContent>
              <Stack spacing={5}>
                <FormControlLabel control={<Switch defaultChecked />} label='Mandatory RFQ for POs > $5,000' />
                <FormControlLabel control={<Switch defaultChecked />} label='Enable 3-Way Matching (PO, GR, Invoice)' />
                <FormControlLabel control={<Switch />} label='Allow Auto-Approval for Verified Vendors' />
                <Divider />
                <Box className='flex flex-col gap-1.5'>
                  <Typography variant='caption' className='uppercase font-bold text-slate-500'>Standard Payment Terms</Typography>
                  <TextField fullWidth select defaultValue='Net30' size='small'>
                    <MenuItem value='Net30'>Net 30 Days</MenuItem>
                    <MenuItem value='Net60'>Net 60 Days</MenuItem>
                    <MenuItem value='COD'>Cash on Delivery</MenuItem>
                    <MenuItem value='Advance'>Upfront Payment</MenuItem>
                  </TextField>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>

        {/* Data Management */}
        <Grid2 size={{ xs: 12 }}>
          <Card sx={{ border: '1px dashed primary.main', bgcolor: 'primary.lighter' }}>
            <CardContent className='flex items-center justify-between'>
              <Box>
                <Typography variant='h6' color='primary'>Material Master Integrity</Typography>
                <Typography variant='body2' color='text.secondary'>Run a consistency check across material records or synchronize source lists with master vendor data.</Typography>
              </Box>
              <Stack direction='row' spacing={2}>
                <Button variant='outlined' color='primary' startIcon={<i className='tabler-refresh' />}>Re-sync Master Data</Button>
                <Button variant='contained' color='primary' startIcon={<i className='tabler-archive' />}>Archive Obsolete Materials</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </>
  )
}

export default SettingsView
