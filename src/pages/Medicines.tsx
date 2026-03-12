import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import ActionButton from '../components/ActionButton';
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  LinearProgress,
  Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import MedicineDialog from '../components/medicines/MedicineDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MedicationIcon from '@mui/icons-material/Medication';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data based on Drug model and image requirements
const mockMedicines = [
  { id: 'T001', name: 'Paracetamol 500mg', subtext: 'Hộp 10 vỉ x 10 viện', category: 'Giảm đau', unit: 'Viên', stock: 850, maxStock: 1000, price: 2000 },
  { id: 'T002', name: 'Sertraline 50mg', subtext: 'Vỉ 14 viên', category: 'Trầm cảm', unit: 'Viên', stock: 15, maxStock: 100, price: 15000 },
  { id: 'T003', name: 'Diazepam 5mg', subtext: 'Ống tiêm', category: 'An thần', unit: 'Ống', stock: 5, maxStock: 100, price: 45000 },
  { id: 'T004', name: 'Nước cất pha tiêm', subtext: 'Ống 5ml', category: 'Vật tư', unit: 'Ống', stock: 120, maxStock: 500, price: 5000 },
  { id: 'T005', name: 'Fluoxetine 20mg', subtext: 'Viên nang', category: 'Trầm cảm', unit: 'Viên', stock: 200, maxStock: 1000, price: 8000 },
  { id: 'T006', name: 'Amoxicillin 500mg', subtext: 'Viên nén', category: 'Kháng sinh', unit: 'Viên', stock: 450, maxStock: 1000, price: 3000 },
  { id: 'T007', name: 'Vitamin C 1000mg', subtext: 'Viên sủi', category: 'Bổ sung', unit: 'Viên', stock: 50, maxStock: 500, price: 12000 },
];

const categoryStyles: Record<string, { bg: string, color: string }> = {
  'Giảm đau': { bg: '#F1F5F9', color: '#475569' },
  'Trầm cảm': { bg: '#F1F5F9', color: '#475569' },
  'An thần': { bg: '#F1F5F9', color: '#475569' },
  'Vật tư': { bg: '#F1F5F9', color: '#475569' },
  'Kháng sinh': { bg: '#F1F5F9', color: '#475569' },
  'Bổ sung': { bg: '#F1F5F9', color: '#475569' },
};

const Medicines: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isMedicineDialogOpen, setIsMedicineDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);

  const pageSize = 5;
  const total = mockMedicines.length;
  const pageCount = Math.ceil(total / pageSize);
  const pagedMedicines = mockMedicines.slice((page - 1) * pageSize, page * pageSize);

  // Dynamic Statistics Calculations
  const totalTypes = mockMedicines.length;
  const lowStockThreshold = 0.3;
  const lowStockCount = mockMedicines.filter(m => (m.stock / m.maxStock) < lowStockThreshold).length;
  const totalValue = mockMedicines.reduce((sum, m) => sum + (m.stock * m.price), 0);

  const formatTotalValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    }
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  const getStockColor = (stock: number, max: number) => {
    const ratio = stock / max;
    if (ratio < 0.1) return '#EF4444';
    if (ratio < 0.3) return '#F97316';
    return '#10B981';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const handleAddMedicine = () => {
    setSelectedMedicine(null);
    setIsMedicineDialogOpen(true);
  };

  const handleEditMedicine = (medicine: any) => {
    setSelectedMedicine(medicine);
    setIsMedicineDialogOpen(true);
  };

  const handleDeleteClick = (medicine: any) => {
    setSelectedMedicine(medicine);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveMedicine = (data: any) => {
    console.log('Saving medicine:', data);
    // Logic to update state or call API would go here
  };

  const handleConfirmDelete = () => {
    console.log('Deleting medicine:', selectedMedicine?.id);
    // Logic to update state or call API would go here
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>
              Quản lý Thuốc & Vật tư
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Tìm kiếm mã thuốc, tên thuốc hoặc danh mục..."
              size="small"
              sx={{
                width: 350,
                '& .MuiOutlinedInput-root': {
                  background: '#fff',
                  borderRadius: '12px',
                  '& fieldset': { borderColor: '#E2E8F0' },
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94A3B8' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <ActionButton
              label="Thêm thuốc"
              onClick={handleAddMedicine}
            />
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Tổng loại thuốc"
              value={totalTypes}
              subLabel="sản phẩm"
              icon={<MedicationIcon sx={{ color: '#00A3FF' }} />}
              iconBg="#EBF5FF"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Sắp hết hàng"
              value={lowStockCount}
              subLabel="sản phẩm"
              icon={<WarningAmberIcon sx={{ color: '#F97316' }} />}
              iconBg="#FFF7ED"
              valueColor="#F97316"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Giá trị kho"
              value={formatTotalValue(totalValue)}
              subLabel="VND"
              icon={<AccountBalanceWalletIcon sx={{ color: '#27AE60' }} />}
              iconBg="#E8F8F1"
            />
          </Grid>
        </Grid>

        {/* Medicines Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
          <Table>
            <TableHead sx={{ background: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>Mã thuốc</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Tên thuốc</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Danh mục</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Đơn vị</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Tồn kho</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Đơn giá</TableCell>
                <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', pr: 3 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedMedicines.map((med) => (
                <TableRow key={med.id} sx={{ '&:hover': { background: '#F8FAFC' }, transition: '0.2s', '& td': { py: 2.5, borderBottom: '1px solid #F1F5F9' } }}>
                  <TableCell sx={{ color: '#00A3FF', fontWeight: 700 }}>{med.id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color="#1E293B">{med.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{med.subtext}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={med.category}
                      size="small"
                      sx={{
                        background: categoryStyles[med.category]?.bg || '#F1F5F9',
                        color: categoryStyles[med.category]?.color || '#475569',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{med.unit}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 140 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(med.stock / med.maxStock) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: '#F1F5F9',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getStockColor(med.stock, med.maxStock),
                              borderRadius: 3,
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" fontWeight={700} color={getStockColor(med.stock, med.maxStock)}>
                        {med.stock}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 600 }}>{formatCurrency(med.price)}</TableCell>
                  <TableCell align="right" sx={{ pr: 2 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton size="small" sx={{ color: '#00A3FF' }} onClick={() => handleEditMedicine(med)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDeleteClick(med)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Tooltip title="Actions">
                        <IconButton size="small" sx={{ color: '#94A3B8' }}>
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Hiển thị {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} trong số {total} thuốc
            </Typography>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    background: '#00A3FF',
                    color: '#fff',
                    '&:hover': { background: '#008BD9' }
                  }
                }
              }}
            />
          </Box>
        </TableContainer>

        {/* Dialogs */}
        <MedicineDialog
          open={isMedicineDialogOpen}
          onClose={() => setIsMedicineDialogOpen(false)}
          onSave={handleSaveMedicine}
          medicine={selectedMedicine}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xóa Thuốc"
          message="Bạn có chắc chắn muốn xóa thông tin thuốc này? Hành động này không thể hoàn tác."
          itemName={selectedMedicine?.name}
        />
      </Box>
    </Box>
  );
};

export default Medicines;
