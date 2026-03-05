import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Sidebar from '../components/Sidebar';
import { Box, Typography } from '@mui/material';

const Doctors: React.FC = () => (
  <MainLayout>
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F7F9FB' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight={700}>Quản lý Bác sĩ</Typography>
      </Box>
    </Box>
  </MainLayout>
);

export default Doctors;
