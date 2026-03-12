import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  InputAdornment,
  Paper,
  Divider
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  Psychology,
  Assignment,
  Notes,
  AttachMoney,
  Badge,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface AppointmentFormData {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  question: string;
  status: 'Unpaid' | 'Pending' | 'Confirmed' | 'Completed' | 'Canceled';
  description: string;
  note_for_admin: string;
  commission_rate: number;
  doctor_payment_status: 'Unpaid' | 'Paid';
}

interface AppointmentFormProps {
  initialData?: AppointmentFormData;
  onSubmit: (data: AppointmentFormData) => void;
  title: string;
  submitLabel: string;
}

const mockPatients = [
  { id: 'p1', name: 'Nguyễn Văn An' },
  { id: 'p2', name: 'Lê Thị Bình' },
  { id: 'p3', name: 'Phạm Hồng Cường' },
];

const mockDoctors = [
  { id: 'd1', name: 'BS. Trần Thu Hà' },
  { id: 'd2', name: 'BS. Nguyễn Minh Tuấn' },
  { id: 'd3', name: 'BS. Lê Thị Mai' },
];

const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialData, onSubmit, title, submitLabel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AppointmentFormData>(initialData || {
    patient_id: '',
    doctor_id: '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '08:00',
    question: '',
    status: 'Pending',
    description: '',
    note_for_admin: '',
    commission_rate: 0.2,
    doctor_payment_status: 'Unpaid'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1000px', mx: 'auto' }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Button
          onClick={() => navigate('/appointments')}
          sx={{ minWidth: 40, color: '#64748B' }}
        >
          <ArrowBack />
        </Button>
        <Typography variant="h5" fontWeight={700} color="#1E293B">
          {title}
        </Typography>
      </Box>

      <Paper component="form" onSubmit={handleFormSubmit} sx={{ borderRadius: '16px', p: 4, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Grid container spacing={4}>
          <Grid size={12}>
            <Typography variant="subtitle1" fontWeight={700} color="#1E293B" mb={1}>
              Thông tin chung
            </Typography>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Bệnh nhân"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            >
              {mockPatients.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Bác sĩ"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              required
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Psychology sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            >
              {mockDoctors.map((d) => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Ngày khám"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><CalendarToday sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="time"
              label="Giờ khám"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
              required
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><AccessTime sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Vấn đề/Câu hỏi của bệnh nhân"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="VD: Tư vấn tâm lý trẻ em..."
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Assignment sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} color="#1E293B" mb={1}>
              Trạng thái & Tài chính
            </Typography>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Trạng thái lịch hẹn"
              name="status"
              value={formData.status}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Badge sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            >
              <MenuItem value="Unpaid">Chưa thanh toán</MenuItem>
              <MenuItem value="Pending">Chờ xác nhận</MenuItem>
              <MenuItem value="Confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="Completed">Đã hoàn thành</MenuItem>
              <MenuItem value="Canceled">Đã hủy</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Tỉ lệ hoa hồng"
              name="commission_rate"
              value={formData.commission_rate}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              inputProps={{ step: 0.1, min: 0, max: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Thanh toán cho bác sĩ"
              name="doctor_payment_status"
              value={formData.doctor_payment_status}
              onChange={handleChange}
            >
              <MenuItem value="Unpaid">Chưa thanh toán</MenuItem>
              <MenuItem value="Paid">Đã thanh toán</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} color="#1E293B" mb={1}>
              Ghi chú thêm
            </Typography>
            <Divider />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả chi tiết"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiết lịch hẹn..."
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Ghi chú nội bộ (cho Admin)"
              name="note_for_admin"
              value={formData.note_for_admin}
              onChange={handleChange}
              placeholder="Thông tin chỉ dành cho quản trị viên..."
              slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><Notes sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={12} display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/appointments')}
              sx={{ px: 4, borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: '#64748B', borderColor: '#E2E8F0' }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ px: 4, borderRadius: '10px', textTransform: 'none', fontWeight: 600, background: '#00A3FF', '&:hover': { background: '#008BD9' } }}
            >
              {submitLabel}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AppointmentForm;
