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
  LocalOffer,
  Description,
  DateRange,
  ConfirmationNumber,
  AttachMoney,
  Percent,
  ShoppingCart
} from '@mui/icons-material';

interface VoucherDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: VoucherFormData) => void;
  voucher?: any; // If provided, we are in Edit mode
}

export interface VoucherFormData {
  id?: string;
  code: string;
  description: string;
  discount_type: 'Percent' | 'Fixed';
  discount_value: number;
  max_discount?: number;
  min_order_value: number;
  usage_limit: number;
  expires_at: string;
  applicable_to: 'Appointment' | 'Order';
  discount_scope: 'Appointment' | 'Drug' | 'Shipping';
}

const VoucherDialog: React.FC<VoucherDialogProps> = ({ open, onClose, onSave, voucher }) => {
  const [formData, setFormData] = useState<VoucherFormData>({
    code: '',
    description: '',
    discount_type: 'Percent',
    discount_value: 0,
    max_discount: 0,
    min_order_value: 0,
    usage_limit: 0,
    expires_at: '',
    applicable_to: 'Order',
    discount_scope: 'Drug'
  });
  const [errors, setErrors] = useState<{ min_order_value?: string }>({});

  useEffect(() => {
    if (open) {
      if (voucher) {
        setFormData({
          id: voucher.id,
          code: voucher.code || '',
          description: voucher.description || '',
          discount_type: voucher.discount_type || 'Percent',
          discount_value: voucher.discount_value || 0,
          max_discount: voucher.max_discount || 0,
          min_order_value: voucher.min_order_value || 0,
          usage_limit: voucher.usage_limit || 0,
          expires_at: voucher.expires_at ? new Date(voucher.expires_at).toISOString().split('T')[0] : '',
          applicable_to: voucher.applicable_to || 'Order',
          discount_scope: voucher.discount_scope || 'Drug'
        });
      } else {
        setFormData({
          code: '',
          description: '',
          discount_type: 'Percent',
          discount_value: 0,
          max_discount: 0,
          min_order_value: 0,
          usage_limit: 0,
          expires_at: '',
          applicable_to: 'Order',
          discount_scope: 'Drug'
        });
      }
    }
  }, [voucher, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      // Strip leading zeros for better UX, except if the value is just "0"
      const cleanedValue = value.replace(/^0+/, '');
      const numValue = cleanedValue === '' ? 0 : Number(cleanedValue);
      setFormData(prev => ({
        ...prev,
        [name]: numValue < 0 ? 0 : numValue
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when typing
    if (name === 'min_order_value' || name === 'discount_value' || name === 'discount_type') {
      setErrors((prev: any) => ({ ...prev, min_order_value: undefined }));
    }
  };

  const handleSubmit = () => {
    const isFixed = formData.discount_type === 'Fixed';
    const isPercent = formData.discount_type === 'Percent';

    if (isFixed && formData.min_order_value < formData.discount_value) {
      setErrors({ min_order_value: 'Đơn hàng tối thiểu phải lớn hơn hoặc bằng số tiền giảm' });
      return;
    }

    if (isPercent && (formData.max_discount || 0) > 0 && formData.min_order_value < (formData.max_discount || 0)) {
      setErrors({ min_order_value: 'Đơn hàng tối thiểu phải lớn hơn hoặc bằng mức giảm tối đa' });
      return;
    }

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
        {voucher ? 'Chỉnh sửa Voucher' : 'Thêm Voucher mới'}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Code and Name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Mã Voucher
            </Typography>
            <TextField
              fullWidth
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: GIAM20"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><ConfirmationNumber sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Tên chương trình / Mô tả
            </Typography>
            <TextField
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="VD: Ưu đãi hè 2024"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Description sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Áp dụng cho
            </Typography>
            <TextField
              select
              fullWidth
              name="applicable_to"
              value={formData.applicable_to}
              onChange={handleChange}
            >
              <MenuItem value="Order">Đơn hàng (Order)</MenuItem>
              <MenuItem value="Appointment">Lịch hẹn (Appointment)</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Phạm vi giảm giá
            </Typography>
            <TextField
              select
              fullWidth
              name="discount_scope"
              value={formData.discount_scope}
              onChange={handleChange}
            >
              <MenuItem value="Drug">Thuốc (Drug)</MenuItem>
              <MenuItem value="Appointment">Phí khám (Appointment)</MenuItem>
              <MenuItem value="Shipping">Phí vận chuyển (Shipping)</MenuItem>
            </TextField>
          </Grid>

          {/* Discount Settings */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Loại giảm giá
            </Typography>
            <TextField
              select
              fullWidth
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><LocalOffer sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            >
              <MenuItem value="Percent">Phần trăm (%)</MenuItem>
              <MenuItem value="Fixed">Số tiền cố định (VNĐ)</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Giá trị giảm giá
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="discount_value"
              value={formData.discount_value}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {formData.discount_type === 'Percent' ? <Percent sx={{ color: '#94A3B8' }} /> : <AttachMoney sx={{ color: '#94A3B8' }} />}
                    </InputAdornment>
                  )
                },
                htmlInput: { min: 0 }
              }}
            />
          </Grid>

          {/* Limits */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Giảm tối đa (VNĐ)
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="max_discount"
              value={formData.max_discount}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              disabled={formData.discount_type === 'Fixed'}
              placeholder="0 = Không giới hạn"
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: '#94A3B8' }} /></InputAdornment> },
                htmlInput: { min: 0 }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Đơn hàng tối thiểu
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="min_order_value"
              value={formData.min_order_value}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              error={!!errors.min_order_value}
              helperText={errors.min_order_value}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><ShoppingCart sx={{ color: '#94A3B8' }} /></InputAdornment> },
                htmlInput: { min: 0 }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Lượt sử dụng tối đa
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="usage_limit"
              value={formData.usage_limit}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              placeholder="0 = Không giới hạn"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><ConfirmationNumber sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          {/* Expiry */}
          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Ngày hết hạn
            </Typography>
            <TextField
              fullWidth
              type="date"
              name="expires_at"
              value={formData.expires_at}
              onChange={handleChange}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><DateRange sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
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
          Lưu Voucher
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherDialog;
