import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import AppointmentForm, { AppointmentFormData } from '../components/appointments/AppointmentForm';

const CreateAppointment: React.FC = () => {
  const handleSave = (data: AppointmentFormData) => {
    console.log('Creating appointment:', data);
    // Add API call here
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <AppointmentForm 
          title="Thêm Lịch hẹn mới" 
          submitLabel="Tạo lịch hẹn" 
          onSubmit={handleSave} 
        />
      </Box>
    </Box>
  );
};

export default CreateAppointment;
