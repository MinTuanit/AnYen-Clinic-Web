import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.",
  itemName
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: '16px', maxWidth: '400px' }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
        <Box sx={{
          bgcolor: '#FFF1F2',
          color: '#E11D48',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <WarningAmberIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="#1E293B" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message} {itemName && <b>{itemName}</b>}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, px: 3, pb: 4, pt: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: '#64748B',
            fontWeight: 600,
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            px: 3
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          sx={{
            background: '#EF4444',
            textTransform: 'none',
            borderRadius: '10px',
            px: 3,
            fontWeight: 600,
            '&:hover': { background: '#DC2626' }
          }}
        >
          Xóa ngay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
