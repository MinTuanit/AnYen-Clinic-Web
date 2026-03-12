import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Sidebar from '../components/Sidebar';
import AppointmentForm, { AppointmentFormData } from '../components/appointments/AppointmentForm';
import { useParams } from 'react-router-dom';

const EditAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetching appointment data
    setTimeout(() => {
      setAppointment({
        id: id,
        patient_id: 'p1',
        doctor_id: 'd2',
        appointment_date: '2023-10-24',
        appointment_time: '08:30',
        question: 'Tư vấn tâm lý học đường',
        status: 'Confirmed',
        description: 'Bệnh nhân có biểu hiện lo âu...',
        note_for_admin: 'Ưu tiên xếp lịch sáng',
        commission_rate: 0.2,
        doctor_payment_status: 'Unpaid'
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSave = (data: AppointmentFormData) => {
    console.log('Editing appointment:', id, data);
    // Add API call here
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
        <Sidebar />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#00A3FF' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <AppointmentForm 
          initialData={appointment}
          title={`Chỉnh sửa Lịch hẹn #${id}`} 
          submitLabel="Lưu thay đổi" 
          onSubmit={handleSave} 
        />
      </Box>
    </Box>
  );
};

export default EditAppointment;
