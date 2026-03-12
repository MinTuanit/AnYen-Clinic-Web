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
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person,
  Home,
  Update,
  AttachMoney,
  LocalOffer,
  Medication,
  ShoppingCart,
  ContentPaste
} from '@mui/icons-material';

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  order?: any; // If provided, we are in Edit mode
}

const OrderDialog: React.FC<OrderDialogProps> = ({ open, onClose, onSave, order }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    status: 'Pending',
    delivery_address: '',
    patient_id: '',
    medicines: [] as any[],
    voucher: null as any
  });

  useEffect(() => {
    if (open) {
      if (order) {
        setFormData({
          status: order.orderStatus || 'Pending',
          delivery_address: order.delivery_address || '',
          patient_id: order.patient_id || '',
          medicines: order.medicines || [],
          voucher: order.voucher || null
        });
      } else {
        setFormData({
          status: 'Pending',
          delivery_address: '',
          patient_id: '',
          medicines: [],
          voucher: null
        });
      }
      setTabIndex(0);
    }
  }, [order, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (_: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const calculateSubtotal = () => {
    return formData.medicines.reduce((sum, med) => sum + (med.price * med.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!formData.voucher) return 0;
    const subtotal = calculateSubtotal();
    let discount = 0;
    if (formData.voucher.discount_type === 'Percent') {
      discount = subtotal * (formData.voucher.discount_value / 100);
      if (formData.voucher.max_discount && discount > formData.voucher.max_discount) {
        discount = formData.voucher.max_discount;
      }
    } else {
      discount = formData.voucher.discount_value;
    }
    return discount;
  };

  const calculateTotal = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
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
        {order ? `Chi tiết Đơn hàng #${order.id}` : 'Tạo Đơn hàng mới'}
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
          <Tab icon={<ContentPaste sx={{ fontSize: 20 }} />} iconPosition="start" label="Thông tin chung" />
          <Tab icon={<Medication sx={{ fontSize: 20 }} />} iconPosition="start" label="Danh mục thuốc" />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ mt: 2 }}>
        {tabIndex === 0 && (
          <Grid container spacing={3}>
            {/* Customer Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Khách hàng
              </Typography>
              <TextField
                fullWidth
                disabled={!!order}
                value={order?.customer?.name || ''}
                placeholder="Tên khách hàng..."
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Mã khách hàng (Patient ID)
              </Typography>
              <TextField
                fullWidth
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                placeholder="Nhập mã bệnh nhân..."
                disabled={!!order}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Trạng thái đơn hàng
              </Typography>
              <TextField
                select
                fullWidth
                name="status"
                value={formData.status}
                onChange={handleChange}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Update sx={{ color: '#00A3FF' }} /></InputAdornment> } }}
              >
                <MenuItem value="Pending">Chờ xử lý (Pending)</MenuItem>
                <MenuItem value="Processing">Đang chuẩn bị (Processing)</MenuItem>
                <MenuItem value="Delivering">Đang giao hàng (Delivering)</MenuItem>
                <MenuItem value="Completed">Đã hoàn thành (Completed)</MenuItem>
                <MenuItem value="Cancelled">Đã hủy (Cancelled)</MenuItem>
              </TextField>
            </Grid>

            {/* Voucher Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Voucher áp dụng
              </Typography>
              <TextField
                fullWidth
                value={formData.voucher?.code || 'Không có voucher'}
                disabled
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><LocalOffer sx={{ color: formData.voucher ? '#F59E0B' : '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
                Địa chỉ giao hàng
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="delivery_address"
                value={formData.delivery_address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ nhận hàng..."
                slotProps={{ input: { startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><Home sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '12px', mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="#64748B">Tạm tính:</Typography>
                  <Typography variant="body2" fontWeight={600} color="#1E293B">{formatCurrency(calculateSubtotal())}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="#64748B">Giảm giá {formData.voucher && `(${formData.voucher.code})`}:</Typography>
                  <Typography variant="body2" fontWeight={600} color="#EF4444">-{formatCurrency(calculateDiscount())}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={700} color="#1E293B">Tổng tiền:</Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="#00A3FF">{formatCurrency(calculateTotal())}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

        {tabIndex === 1 && (
          <Box>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px', mb: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#64748B' }}>Tên thuốc</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#64748B' }}>SL</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#64748B' }}>Đơn giá</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#64748B' }}>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.medicines.length > 0 ? formData.medicines.map((med: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{med.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{med.dosage}</Typography>
                      </TableCell>
                      <TableCell align="center">{med.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(med.price)}</TableCell>
                      <TableCell align="right">{formatCurrency(med.price * med.quantity)}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#94A3B8' }}>
                         Chưa có thuốc trong đơn hàng này
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
               <Button 
                 variant="outlined" 
                 startIcon={<ShoppingCart sx={{ fontSize: 18 }} />}
                 sx={{ textTransform: 'none', borderRadius: '8px' }}
                 size="small"
                 disabled 
               >
                 Tùy chỉnh giỏ hàng (Prescription)
               </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: '#64748B', fontWeight: 600 }}>
          Hủy bỏ
        </Button>
        <Button 
          onClick={() => onSave(formData)} 
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
          {order ? 'Cập nhật đơn hàng' : 'Tạo đơn hàng'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDialog;
