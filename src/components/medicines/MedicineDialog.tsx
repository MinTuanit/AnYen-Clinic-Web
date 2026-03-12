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
  InputAdornment,
  Grid
} from '@mui/material';
import {
  Medication,
  Description,
  Category,
  Scale,
  Inventory,
  AttachMoney,
  AddShoppingCart
} from '@mui/icons-material';

interface MedicineDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MedicineFormData) => void;
  medicine?: any; // If provided, we are in Edit mode
}

export interface MedicineFormData {
  id?: string;
  name: string;
  subtext: string;
  category: string;
  unit: string;
  stock: number;
  maxStock: number;
  price: number;
}

const MedicineDialog: React.FC<MedicineDialogProps> = ({ open, onClose, onSave, medicine }) => {
  const [formData, setFormData] = useState<MedicineFormData>({
    name: '',
    subtext: '',
    category: 'Giảm đau',
    unit: 'Viên',
    stock: 0,
    maxStock: 100,
    price: 0
  });

  useEffect(() => {
    if (open) {
      if (medicine) {
        setFormData({
          id: medicine.id,
          name: medicine.name || '',
          subtext: medicine.subtext || '',
          category: medicine.category || 'Giảm đau',
          unit: medicine.unit || 'Viên',
          stock: medicine.stock || 0,
          maxStock: medicine.maxStock || 100,
          price: medicine.price || 0
        });
      } else {
        setFormData({
          name: '',
          subtext: '',
          category: 'Giảm đau',
          unit: 'Viên',
          stock: 0,
          maxStock: 100,
          price: 0
        });
      }
    }
  }, [medicine, open]);

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
        {medicine ? 'Chỉnh sửa Thuốc' : 'Thêm Thuốc mới'}
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
              fullWidth
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="VD: Viên, Ống, Chai"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Scale sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Quy cách đóng gói / Mô tả ngắn
            </Typography>
            <TextField
              fullWidth
              name="subtext"
              value={formData.subtext}
              onChange={handleChange}
              placeholder="VD: Hộp 10 vỉ x 10 viên"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Description sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          {/* Category and Price */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Danh mục
            </Typography>
            <TextField
              select
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Category sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            >
              <MenuItem value="Giảm đau">Giảm đau</MenuItem>
              <MenuItem value="Trầm cảm">Trầm cảm</MenuItem>
              <MenuItem value="An thần">An thần</MenuItem>
              <MenuItem value="Kháng sinh">Kháng sinh</MenuItem>
              <MenuItem value="Bổ sung">Bổ sung</MenuItem>
              <MenuItem value="Vật tư">Vật tư y tế</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Đơn giá (VNĐ)
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

          {/* Stock Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Số lượng tồn kho
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Inventory sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Định mức tồn tối đa
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="maxStock"
              value={formData.maxStock}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><AddShoppingCart sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
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

export default MedicineDialog;
