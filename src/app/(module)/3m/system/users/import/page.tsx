'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

// Component Imports
import PageHeader from '@/components/layout/shared/PageHeader'

const UsersImportPage = () => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    if (!file) {
      alert('Vui lòng chọn file để import')
      return
    }
    // Simulate import
    alert(`Đã import file: ${file.name}`)
  }

  return (
    <>
      <PageHeader
        title='Import người dùng'
        description='Import danh sách người dùng từ file Excel.'
        breadcrumbs={[
          { label: 'Trang chủ', href: '/dashboard' },
          { label: 'Hệ thống', href: '/system' },
          { label: 'Người dùng', href: '/system/users' },
          { label: 'Import' },
        ]}
        className='mbe-4'
        actions={
          <Box className='flex gap-2'>
            <Button
              variant='outlined'
              startIcon={<i className='tabler-arrow-left' />}
              component={Link}
              href='/system/users'
            >
              Quay lại
            </Button>
          </Box>
        }
      />

      <Card className='p-4 md:p-6'>
        <Typography variant='h6' className='mb-4'>
          Import người dùng
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <input
              type='file'
              accept='.xlsx,.xls,.csv'
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id='file-upload'
            />
            <label htmlFor='file-upload'>
              <Button
                variant='outlined'
                component='span'
                startIcon={<i className='tabler-upload' />}
              >
                Chọn file
              </Button>
            </label>
            {file && (
              <Typography variant='body2' sx={{ mt: 2 }}>
                File đã chọn: {file.name}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant='contained'
              onClick={handleImport}
              disabled={!file}
              startIcon={<i className='tabler-file-import' />}
            >
              Import
            </Button>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}

export default UsersImportPage
