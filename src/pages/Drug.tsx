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
  Tooltip,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DrugDialog from '../components/drugs/DrugDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MedicationIcon from '@mui/icons-material/Medication';
import DeleteIcon from '@mui/icons-material/Delete';

import { drugService } from '../services/drugService';
import { Drug } from '../types/drug';

const categoryStyles: Record<string, { bg: string, color: string }> = {
  'Giảm đau': { bg: '#F1F5F9', color: '#475569' },
  'Trầm cảm': { bg: '#F1F5F9', color: '#475569' },
  'An thần': { bg: '#F1F5F9', color: '#475569' },
  'Vật tư': { bg: '#F1F5F9', color: '#475569' },
  'Kháng sinh': { bg: '#F1F5F9', color: '#475569' },
  'Bổ sung': { bg: '#F1F5F9', color: '#475569' },
};

const Drugs: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isDrugDialogOpen, setIsDrugDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pageSize = 5;

  const fetchDrugs = async () => {
    setLoading(true);
    try {
      const data = await drugService.getAllDrugs({ search: searchQuery });
      setDrugs(data);
    } catch (error) {
      console.error('Error fetching drugs:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDrugs();
  }, [searchQuery]);

  const total = Array.isArray(drugs) ? drugs.length : 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pagedDrugs = Array.isArray(drugs)
    ? drugs.slice((page - 1) * pageSize, page * pageSize)
    : [];

  // Dynamic Statistics Calculations
  const totalTypes = Array.isArray(drugs) ? drugs.length : 0;
  const lowStockThreshold = 20; // Simple threshold for now
  const lowStockCount = Array.isArray(drugs) ? drugs.filter(m => m.stock < lowStockThreshold).length : 0;
  const totalValue = Array.isArray(drugs) ? drugs.reduce((sum, d) => sum + (d.stock * Number(d.price)), 0) : 0;

  const formatTotalValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    }
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  const getStockColor = (stock: number) => {
    if (stock < 5) return '#EF4444';
    if (stock < 20) return '#F97316';
    return '#10B981';
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
  };

  const handleAddDrug = () => {
    setSelectedDrug(null);
    setIsDrugDialogOpen(true);
  };

  const handleEditDrug = (drug: Drug) => {
    setSelectedDrug(drug);
    setIsDrugDialogOpen(true);
  };

  const handleDeleteClick = (drug: Drug) => {
    setSelectedDrug(drug);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveDrug = async (data: any) => {
    try {
      // Clean payload for backend validation
      const cleanData = {
        name: data.name,
        price: Number(data.price),
        description: data.description || data.subtext || '',
        stock: Number(data.stock)
      };

      if (selectedDrug && selectedDrug.id) {
        await drugService.updateDrug(selectedDrug.id, cleanData);
      } else {
        await drugService.createDrug(cleanData);
      }
      fetchDrugs();
      setIsDrugDialogOpen(false);
    } catch (error) {
      console.error('Error saving drug:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedDrug && selectedDrug.id) {
        await drugService.deleteDrug(selectedDrug.id);
        fetchDrugs();
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting drug:', error);
    }
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={handleAddDrug}
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
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
                {pagedDrugs.map((d) => (
                  <TableRow key={d.id} sx={{ '&:hover': { background: '#F8FAFC' }, transition: '0.2s', '& td': { py: 2.5, borderBottom: '1px solid #F1F5F9' } }}>
                    <TableCell sx={{ color: '#00A3FF', fontWeight: 700 }}>{d.medicine_id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#1E293B">{d.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{d.description}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={d.category || 'Chưa phân loại'}
                        size="small"
                        sx={{
                          background: categoryStyles[d.category || 'Giảm đau']?.bg || '#F1F5F9',
                          color: categoryStyles[d.category || 'Giảm đau']?.color || '#475569',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          borderRadius: '6px'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{d.unit || ''}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 140 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, (d.stock / 100) * 100)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: '#F1F5F9',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getStockColor(d.stock),
                                borderRadius: 3,
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight={700} color={getStockColor(d.stock)}>
                          {d.stock}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#1E293B', fontWeight: 600 }}>{formatCurrency(d.price)}</TableCell>
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton size="small" sx={{ color: '#00A3FF' }} onClick={() => handleEditDrug(d)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDeleteClick(d)}>
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
        )}

        {/* Dialogs */}
        <DrugDialog
          open={isDrugDialogOpen}
          onClose={() => setIsDrugDialogOpen(false)}
          onSave={handleSaveDrug}
          drug={selectedDrug}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xóa Thuốc"
          message="Bạn có chắc chắn muốn xóa thông tin thuốc này? Hành động này không thể hoàn tác."
          itemName={selectedDrug?.name}
        />
      </Box>
    </Box>
  );
};

export default Drugs;
