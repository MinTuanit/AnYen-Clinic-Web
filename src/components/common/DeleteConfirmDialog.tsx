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
  message = "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác. Xóa ",
  itemName
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: '16px', p: 1, maxWidth: '400px' }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
        <Box sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: '#FEF2F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2
        }}>
          <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', px: 2 }}>
          {message}
          {itemName && (
            <Box component="span" sx={{ display: 'block', fontWeight: 700, color: '#1E293B', mt: 1 }}>
              "{itemName}"
            </Box>
          )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          fullWidth
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: '#64748B',
            bgcolor: '#F1F5F9',
            borderRadius: '10px',
            '&:hover': { bgcolor: '#E2E8F0' }
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#EF4444',
            borderRadius: '10px',
            '&:hover': { bgcolor: '#DC2626' }
          }}
        >
          Xóa bỏ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
