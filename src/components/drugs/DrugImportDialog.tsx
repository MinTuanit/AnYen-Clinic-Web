import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Grid,
  Autocomplete
} from '@mui/material';
import {
  Medication,
  AttachMoney,
  Numbers,
  CalendarMonth,
  Inventory,
} from '@mui/icons-material';
import { drugService } from '../../services/drugService';
import { Drug } from '../../types/drug';
import { DrugImport } from '../../types/drugImport';

interface DrugImportDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  drugImport?: DrugImport | null;
}

const formatToLocalDateTime = (dateInput?: string | Date) => {
  const date = dateInput ? new Date(dateInput) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const DrugImportDialog: React.FC<DrugImportDialogProps> = ({ open, onClose, onSave, drugImport }) => {
  const [formData, setFormData] = useState({
    drug_id: '',
    batch_number: '',
    import_price: 0,
    quantity: 0,
    import_date: formatToLocalDateTime(),
  });
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const data = await drugService.getAllDrugs();
        setDrugs(data);
      } catch (error) {
        console.error('Error fetching drugs:', error);
      }
    };
    if (open) {
      fetchDrugs();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (drugImport) {
        setFormData({
          drug_id: drugImport.drug_id,
          batch_number: drugImport.batch_number,
          import_price: Number(drugImport.import_price),
          quantity: drugImport.quantity,
          import_date: formatToLocalDateTime(drugImport.import_date),
        });
        const drug = drugs.find(d => d.id === drugImport.drug_id);
        if (drug) setSelectedDrug(drug);
      } else {
        setFormData({
          drug_id: '',
          batch_number: '',
          import_price: 0,
          quantity: 0,
          import_date: formatToLocalDateTime(),
        });
        setSelectedDrug(null);
      }
    }
  }, [drugImport, open, drugs]);

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
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#1E293B', pb: 1 }}>
        {drugImport ? 'Chỉnh sửa Nhập thuốc' : 'Thêm Nhập thuốc mới'}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Chọn Thuốc
            </Typography>
            <Autocomplete
              options={drugs}
              getOptionLabel={(option) => option.name}
              value={selectedDrug}
              onChange={(_, newValue) => {
                setSelectedDrug(newValue);
                setFormData(prev => ({ ...prev, drug_id: newValue?.id || '' }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Tìm và chọn thuốc"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <Medication sx={{ color: '#94A3B8' }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Số lô (Batch Number)
            </Typography>
            <TextField
              fullWidth
              name="batch_number"
              value={formData.batch_number}
              onChange={handleChange}
              placeholder="VD: BATCH-2023-001"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Numbers sx={{ color: '#94A3B8' }} /></InputAdornment> } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Giá nhập (VNĐ)
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="import_price"
              value={formData.import_price}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: '#94A3B8' }} /></InputAdornment> },
                htmlInput: { min: 0 }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Số lượng nhập
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              onFocus={(e) => e.target.select()}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><Inventory sx={{ color: '#94A3B8' }} /></InputAdornment> },
                htmlInput: { min: 0 }
              }}
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', mb: 1, display: 'block' }}>
              Thời gian nhập
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              name="import_date"
              value={formData.import_date}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth sx={{ color: '#94A3B8' }} />
                    </InputAdornment>
                  ),
                }
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

export default DrugImportDialog;
