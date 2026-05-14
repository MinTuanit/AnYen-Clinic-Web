import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Typography,
  InputAdornment,
  Grid
} from '@mui/material';
import {
  PhotoCamera,
  Person,
  Phone,
  Lock,
  Cake,
  Wc,
  Fingerprint,
  History,
  Warning,
  Email
} from '@mui/icons-material';
import { countryCodes, formatPhoneWithCountryCode, splitPhoneNumber } from '../../utils/phone';

interface PatientDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PatientFormData) => void;
  patient?: any; // If provided, we are in Edit mode
}

export interface PatientFormData {
  id?: string;
  name: string;
  country_code: string;
  phone_number: string;
  password?: string;
  active_status: boolean;
  avatar_url: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  anonymous_name: string;
  medical_history: string;
  allergies: string;
  emergency_contact: string;
  email: string;
}

const PatientDialog: React.FC<PatientDialogProps> = ({ open, onClose, onSave, patient }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    country_code: '+84',
    phone_number: '',
    password: '',
    active_status: true,
    avatar_url: 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png',
    date_of_birth: '',
    gender: 'Male',
    anonymous_name: '',
    medical_history: '',
    allergies: '',
    emergency_contact: '',
    email: ''
  });

  useEffect(() => {
    if (!open) return;
    if (!patient) {
      setFormData({
        name: '',
        country_code: '+84',
        phone_number: '',
        password: '',
        active_status: true,
        avatar_url: 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png',
        date_of_birth: '',
        gender: 'Male',
        anonymous_name: '',
        medical_history: '',
        allergies: '',
        emergency_contact: '',
        email: ''
      }); // default
      setTabIndex(0);
      return;
    }
    // Chỉ setFormData nếu patient.id khác với formData.id (hoặc so sánh sâu hơn nếu cần)
    if (patient.patient_id !== formData.id) {
      const phone = splitPhoneNumber(patient.user?.phone_number || patient.phone || '');
      setFormData({
        id: patient.id || patient.patient_id,
        name: patient.user?.name || patient.name || '',
        country_code: phone.countryCode,
        phone_number: phone.nationalNumber,
        active_status: patient.user?.active_status ?? true,
        avatar_url: patient.user?.avatar_url || patient.avatar_url || 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png',
        date_of_birth: patient.date_of_birth || patient.dob || '',
        gender: patient.gender || 'Male',
        anonymous_name: patient.anonymous_name || '',
        medical_history: patient.medical_history || '',
        allergies: patient.allergies || '',
        emergency_contact: patient.emergency_contact || '',
        email: patient.email || patient.user?.email || ''
      });
      setTabIndex(0);
    }
  }, [open, patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      phone_number: formatPhoneWithCountryCode(formData.country_code, formData.phone_number),
    });
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
        {patient ? 'Chỉnh sửa thông tin Bệnh nhân' : 'Thêm Bệnh nhân mới'}
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
          <Tab icon={<Person sx={{ fontSize: 20 }} />} iconPosition="start" label="Tài khoản" />
          <Tab icon={<Fingerprint sx={{ fontSize: 20 }} />} iconPosition="start" label="Hồ sơ cá nhân" />
          <Tab icon={<History sx={{ fontSize: 20 }} />} iconPosition="start" label="Y tế" />
        </Tabs>
      </Box>

      <DialogContent sx={{ mt: 2 }}>
        {/* Tab 0: Account Info */}
        {tabIndex === 0 && (
          <Grid container spacing={3}>
            <Grid size={12} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={formData.avatar_url}
                  sx={{ width: 100, height: 100, border: '4px solid #F1F5F9' }}
                />
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: '#00A3FF',
                    color: 'white',
                    '&:hover': { bgcolor: '#008BD9' }
                  }}
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setFormData(prev => ({ ...prev, avatar_url: url }));
                      }
                    }}
                  />
                </IconButton>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Họ và tên
              </Typography>
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Số điện thoại
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  select
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  sx={{ width: 130, flexShrink: 0 }}
                >
                  {countryCodes.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img src={country.flag} alt={country.name} style={{ width: 22, height: 15, borderRadius: 2 }} />
                        <Typography variant="body2">{country.code}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Mật khẩu
              </Typography>
              <TextField
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={patient ? 'Để trống nếu không đổi' : 'Nhập mật khẩu'}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Trạng thái
              </Typography>
              <TextField
                select
                fullWidth
                name="active_status"
                value={String(formData.active_status)}
                onChange={(e) => setFormData(prev => ({ ...prev, active_status: e.target.value === 'true' }))}
              >
                <MenuItem value="true">Hoạt động</MenuItem>
                <MenuItem value="false">Khóa tài khoản</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        )}

        {/* Tab 1: Personal Profile */}
        {tabIndex === 1 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Ngày sinh
              </Typography>
              <TextField
                fullWidth
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Cake sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Giới tính
              </Typography>
              <TextField
                select
                fullWidth
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Wc sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              >
                <MenuItem value="Male">Nam</MenuItem>
                <MenuItem value="Female">Nữ</MenuItem>
                <MenuItem value="Other">Khác</MenuItem>
              </TextField>
            </Grid>

            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Tên ẩn danh (Nickname)
              </Typography>
              <TextField
                fullWidth
                name="anonymous_name"
                value={formData.anonymous_name}
                onChange={handleChange}
                placeholder="VD: Patient_A"
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Fingerprint sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Email liên hệ
              </Typography>
              <TextField
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Email sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>
          </Grid>
        )}

        {/* Tab 2: Medical Info */}
        {tabIndex === 2 && (
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Tiền sử bệnh lý
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="medical_history"
                value={formData.medical_history}
                onChange={handleChange}
                slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><History sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Dị ứng
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><Warning sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>
          </Grid>
        )}
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
          Lưu bệnh nhân
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDialog;
