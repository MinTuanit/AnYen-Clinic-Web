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
  Category,
  Scale,
  Inventory,
  AttachMoney,
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
  category: string;
  unit: string;
  stock: number;
  price: number;
}

const DrugDialog: React.FC<DrugDialogProps> = ({ open, onClose, onSave, drug }) => {
  const [formData, setFormData] = useState<DrugFormData>({
    name: '',
    subtext: '',
    category: 'Giảm đau',
    unit: 'Viên',
    stock: 0,
    price: 0
  });

  useEffect(() => {
    if (open) {
      if (drug) {
        setFormData({
          id: drug.id,
          name: drug.name || '',
          subtext: drug.description || '',
          category: drug.category || 'Giảm đau',
          unit: drug.unit || 'Viên',
          stock: drug.stock || 0,
          price: drug.price || 0
        });
      } else {
        setFormData({
          name: '',
          subtext: '',
          category: 'Giảm đau',
          unit: 'Viên',
          stock: 0,
          price: 0
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
              onFocus={(e) => e.target.select()}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: '#94A3B8' }} /></InputAdornment> },
                htmlInput: { min: 0 }
              }}
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
              onFocus={(e) => e.target.select()}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><Inventory sx={{ color: '#94A3B8' }} /></InputAdornment> },
                htmlInput: { min: 0 }
              }}
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
