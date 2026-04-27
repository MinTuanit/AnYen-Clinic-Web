import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  Grid
} from '@mui/material';
import {
  Medication,
  Description,
  Scale,
} from '@mui/icons-material';

interface DrugDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DrugFormData) => void;
  drug?: any; // If provided, we are in Edit mode
}

export interface DrugFormData {
  id?: string;
  name: string;
  subtext: string;
  unit: 'tablet' | 'bottle' | 'tube' | 'box' | 'other';
}

const DrugDialog: React.FC<DrugDialogProps> = ({ open, onClose, onSave, drug }) => {
  const [formData, setFormData] = useState<DrugFormData>({
    name: '',
    subtext: '',
    unit: 'other'
  });

  useEffect(() => {
    if (open) {
      if (drug) {
        setFormData({
          id: drug.id,
          name: drug.name || '',
          subtext: drug.description || '',
          unit: drug.unit || 'other'
        });
      } else {
        setFormData({
          name: '',
          subtext: '',
          unit: 'other'
        });
      }
    }
  }, [drug, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      const cleanedValue = value.replace(/^0+/, '');
      const numValue = cleanedValue === '' ? 0 : Number(cleanedValue);
      setFormData(prev => ({
        ...prev,
        [name]: numValue < 0 ? 0 : numValue
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
        {drug ? 'Chỉnh sửa Thuốc' : 'Thêm Thuốc mới'}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Name and Subtext */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Tên thuốc
            </Typography>
            <TextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Paracetamol 500mg"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Medication sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Đơn vị tính
            </Typography>
            <TextField
              select
              fullWidth
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Scale sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            >
              <MenuItem value="tablet">Viên (Tablet)</MenuItem>
              <MenuItem value="bottle">Chai/Lọ (Bottle)</MenuItem>
              <MenuItem value="tube">Tuýp (Tube)</MenuItem>
              <MenuItem value="box">Hộp (Box)</MenuItem>
              <MenuItem value="other">Khác (Other)</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Mô tả chi tiết
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="subtext"
              value={formData.subtext}
              onChange={handleChange}
              placeholder="Nhập mô tả thuốc, thành phần, hướng dẫn sử dụng..."
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Description sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
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
          Lưu thông tin
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrugDialog;
