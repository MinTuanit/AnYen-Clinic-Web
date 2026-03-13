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
  Typography,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  InputAdornment,
  Grid
} from '@mui/material';
import {
  PhotoCamera,
  Person,
  Work,
  Phone,
  Lock as LockIcon,
  HistoryEdu,
  AttachMoney,
  LocationOn,
  Verified,
  CloudUpload,
  DeleteOutline
} from '@mui/icons-material';

interface DoctorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DoctorFormData) => void;
  doctor?: DoctorFormData; // If provided, we are in Edit mode
}

interface DoctorFormData {
  name: string;
  phone_number: string;
  password: string;
  role_value: string;
  active_status: boolean;
  specialization: string;
  workplace: string;
  year_experience: number;
  price: string | number;
  gender: string;
  approval_status: string;
  work_experience: string;
  education_history: string;
  avatar_url: string;
  certification_urls: string[];
  street?: string;
  province_code?: string;
  ward_code?: string;
}

const DoctorDialog: React.FC<DoctorDialogProps> = ({ open, onClose, onSave, doctor }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState<DoctorFormData>({
    name: '',
    phone_number: '',
    password: '',
    role_value: 'doctor',
    active_status: true,
    specialization: '',
    workplace: '',
    year_experience: 0,
    price: '',
    gender: 'Male',
    approval_status: 'Pending',
    work_experience: '',
    education_history: '',
    avatar_url: 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png',
    certification_urls: [],
    street: '',
    province_code: '',
    ward_code: ''
  });

  useEffect(() => {
    if (open) {
      if (doctor) {
        const doc = doctor as any;
        setFormData({
          name: doc.user?.name || doc.name || '',
          phone_number: doc.user?.phone_number || doc.phone_number || doc.phone || '',
          password: '', // Don't populate password
          role_value: doc.role_value || 'doctor',
          active_status: doc.user?.active_status ?? doc.active_status ?? true,
          specialization: doc.specialization || '',
          workplace: doc.workplace || '',
          year_experience: doc.year_experience || doc.yearExperience || 0,
          price: doc.price || 0,
          gender: doc.gender || 'Male',
          approval_status: doc.approval_status || doc.approvalStatus || 'Pending',
          work_experience: doc.work_experience || doc.workExperience || '',
          education_history: doc.education_history || doc.educationHistory || '',
          avatar_url: doc.user?.avatar_url || doc.avatar_url || doc.avatarUrl || 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png',
          certification_urls: doc.certification_urls || [],
          street: doc.address?.street || '',
          province_code: doc.address?.province_code || doc.address?.provinceCode || '',
          ward_code: doc.address?.ward_code || doc.address?.wardCode || ''
        });
      } else {
        setFormData({
          name: '',
          phone_number: '',
          password: '',
          role_value: 'doctor',
          active_status: true,
          specialization: '',
          workplace: '',
          year_experience: 0,
          price: 0,
          gender: 'Male',
          approval_status: 'Pending',
          work_experience: '',
          education_history: '',
          avatar_url: 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png',
          certification_urls: [],
          street: '',
          province_code: '',
          ward_code: ''
        });
      }
      setTabIndex(0); // Reset tab to first one when opening
    }
  }, [doctor, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
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
        {doctor ? 'Chỉnh sửa thông tin Bác sĩ' : 'Thêm Bác sĩ mới'}
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
          <Tab icon={<Person sx={{ fontSize: 20 }} />} iconPosition="start" label="Thông tin tài khoản" />
          <Tab icon={<Work sx={{ fontSize: 20 }} />} iconPosition="start" label="Thông tin chuyên môn" />
          <Tab icon={<Verified sx={{ fontSize: 20 }} />} iconPosition="start" label="Chứng chỉ" />
        </Tabs>
      </Box>

      <DialogContent sx={{ mt: 2 }}>
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
                        // In a real app, you'd upload this file
                        // For now, we'll just show it locally
                        const url = URL.createObjectURL(file);
                        setFormData(prev => ({ ...prev, avatar_url: url }));
                      }
                    }}
                  />
                </IconButton>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Ảnh đại diện bác sĩ
              </Typography>
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
                placeholder="VD: TS. Lê Minh"
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Số điện thoại
              </Typography>
              <TextField
                fullWidth
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Dùng làm tên đăng nhập"
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
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
                placeholder={doctor ? 'Để trống nếu không đổi' : 'Nhập mật khẩu'}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Trạng thái tài khoản
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

        {tabIndex === 1 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Chuyên ngành
              </Typography>
              <TextField
                fullWidth
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="VD: Tâm lý học Lâm sàng"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Nơi làm việc
              </Typography>
              <TextField
                fullWidth
                name="workplace"
                value={formData.workplace}
                onChange={handleChange}
                placeholder="VD: Bệnh viện Tâm thần TW"
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><LocationOn sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Số năm kinh nghiệm
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="year_experience"
                value={formData.year_experience}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Giá khám (VNĐ)
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Giới tính
              </Typography>
              <TextField
                select
                fullWidth
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="Male">Nam</MenuItem>
                <MenuItem value="Female">Nữ</MenuItem>
                <MenuItem value="Other">Khác</MenuItem>
              </TextField>
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Trạng thái phê duyệt
              </Typography>
              <TextField
                select
                fullWidth
                name="approval_status"
                value={formData.approval_status}
                onChange={handleChange}
                helperText="Trạng thái hiển thị bác sĩ trên ứng dụng"
              >
                <MenuItem value="Pending">Đang chờ (Pending)</MenuItem>
                <MenuItem value="Approved">Đã duyệt (Approved)</MenuItem>
                <MenuItem value="Hidden">Ẩn (Hidden)</MenuItem>
              </TextField>
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Kinh nghiệm làm việc
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="work_experience"
                value={formData.work_experience}
                onChange={handleChange}
                placeholder="Mô tả tóm tắt quá trình công tác..."
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Lịch sử học vấn
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="education_history"
                value={formData.education_history}
                onChange={handleChange}
                placeholder="VD: Đại học Y Dược TP.HCM (2010 - 2016)..."
                slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><HistoryEdu sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Địa chỉ (Đường/Số nhà)
              </Typography>
              <TextField
                fullWidth
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="VD: 23 Ngô Tất Tố"
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><LocationOn sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Mã Tỉnh/Thành phố
              </Typography>
              <TextField
                fullWidth
                name="province_code"
                value={formData.province_code}
                onChange={handleChange}
                placeholder="VD: 79"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Mã Phường/Xã
              </Typography>
              <TextField
                fullWidth
                name="ward_code"
                value={formData.ward_code}
                onChange={handleChange}
                placeholder="VD: 25760"
              />
            </Grid>
          </Grid>
        )}
        {tabIndex === 2 && (
          <Box sx={{ minHeight: '300px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', display: 'block' }}>
                Danh sách chứng chỉ & bằng cấp ({formData.certification_urls.length})
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  borderColor: '#00A3FF',
                  color: '#00A3FF',
                  '&:hover': {
                    borderColor: '#008BD9',
                    bgcolor: '#E6F6FF'
                  }
                }}
              >
                Tải lên mới
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const newUrls = files.map(file => URL.createObjectURL(file));
                    setFormData(prev => ({
                      ...prev,
                      certification_urls: [...prev.certification_urls, ...newUrls]
                    }));
                  }}
                />
              </Button>
            </Box>

            <Grid container spacing={2}>
              {/* Upload Placeholder Card */}
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  component="label"
                  sx={{
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #E2E8F0',
                    borderRadius: '12px',
                    bgcolor: '#F8FAFC',
                    cursor: 'pointer',
                    transition: '0.2s',
                    '&:hover': {
                      borderColor: '#00A3FF',
                      bgcolor: '#E6F6FF',
                      '& .MuiSvgIcon-root': { color: '#00A3FF' }
                    }
                  }}
                >
                  <CloudUpload sx={{ fontSize: 32, color: '#94A3B8', mb: 1 }} />
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>Thêm chứng chỉ</Typography>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const newUrls = files.map(file => URL.createObjectURL(file));
                      setFormData(prev => ({
                        ...prev,
                        certification_urls: [...prev.certification_urls, ...newUrls]
                      }));
                    }}
                  />
                </Box>
              </Grid>

              {formData.certification_urls.map((url, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Box sx={{ position: 'relative', width: '100%', height: '200px', group: 'true' }}>
                    <Box
                      component="img"
                      src={url}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '2px solid #F1F5F9',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        transition: '0.2s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                      onClick={() => window.open(url, '_blank')}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        color: '#EF4444',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: 'white' }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({
                          ...prev,
                          certification_urls: prev.certification_urls.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: 'none', color: '#64748B', fontWeight: 600 }}
        >
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
          Lưu thông tin
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorDialog;
