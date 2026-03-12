import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  Grid
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  Psychology,
  Assignment,
  Notes,
  AttachMoney,
  Badge
} from '@mui/icons-material';

interface AppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AppointmentFormData) => void;
  appointment?: any; // If provided, we are in Edit mode
}

export interface AppointmentFormData {
  id?: string;
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

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({ open, onClose, onSave, appointment }) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
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

  useEffect(() => {
    if (open) {
      if (appointment) {
        setFormData({
          id: appointment.id,
          patient_id: appointment.patient_id || '',
          doctor_id: appointment.doctor_id || '',
          appointment_date: appointment.appointment_date || '',
          appointment_time: appointment.appointment_time || '',
          question: appointment.question || '',
          status: appointment.status || 'Pending',
          description: appointment.description || '',
          note_for_admin: appointment.note_for_admin || '',
          commission_rate: appointment.commission_rate || 0.2,
          doctor_payment_status: appointment.doctor_payment_status || 'Unpaid'
        });
      } else {
        setFormData({
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
      }
    }
  }, [appointment, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#1E293B', pb: 1 }}>
        {appointment ? 'Chỉnh sửa Lịch hẹn' : 'Thêm Lịch hẹn mới'}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Patient Selection */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Bệnh nhân
            </Typography>
            <TextField
              select
              fullWidth
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            >
              {mockPatients.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Doctor Selection */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Bác sĩ
            </Typography>
            <TextField
              select
              fullWidth
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Psychology sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            >
              {mockDoctors.map((d) => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Date & Time */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Ngày khám
            </Typography>
            <TextField
              fullWidth
              type="date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><CalendarToday sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Giờ khám
            </Typography>
            <TextField
              fullWidth
              type="time"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><AccessTime sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          {/* Question & Short Description */}
          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Vấn đề/Câu hỏi của bệnh nhân
            </Typography>
            <TextField
              fullWidth
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="VD: Tư vấn tâm lý trẻ em..."
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Assignment sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          {/* Status & Commission */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Trạng thái lịch hẹn
            </Typography>
            <TextField
              select
              fullWidth
              name="status"
              value={formData.status}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Badge sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            >
              <MenuItem value="Unpaid">Chưa thanh toán (Unpaid)</MenuItem>
              <MenuItem value="Pending">Chờ xác nhận (Pending)</MenuItem>
              <MenuItem value="Confirmed">Đã xác nhận (Confirmed)</MenuItem>
              <MenuItem value="Completed">Đã hoàn thành (Completed)</MenuItem>
              <MenuItem value="Canceled">Đã hủy (Canceled)</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Tỉ lệ hoa hồng (0 - 1.0)
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="commission_rate"
              value={formData.commission_rate}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              inputProps={{ step: 0.1, min: 0, max: 1 }}
            />
          </Grid>

          {/* Payment Status for Doctor */}
          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Trạng thái thanh toán cho bác sĩ
            </Typography>
            <TextField
              select
              fullWidth
              name="doctor_payment_status"
              value={formData.doctor_payment_status}
              onChange={handleChange}
            >
              <MenuItem value="Unpaid">Chưa trả (Unpaid)</MenuItem>
              <MenuItem value="Paid">Đã trả (Paid)</MenuItem>
            </TextField>
          </Grid>

          {/* Descriptions */}
          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Mô tả chi tiết
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ghi chú thêm về cuộc hẹn..."
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Ghi chú cho Admin
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              name="note_for_admin"
              value={formData.note_for_admin}
              onChange={handleChange}
              placeholder="Thông tin nội bộ..."
              slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><Notes sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: '#64748B', fontWeight: 600 }}>
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: '#00A3FF',
            textTransform: 'none',
            borderRadius: '10px',
            px: 4,
            fontWeight: 600,
            '&:hover': { background: '#008BD9' }
          }}
        >
          Lưu lịch hẹn
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDialog;
