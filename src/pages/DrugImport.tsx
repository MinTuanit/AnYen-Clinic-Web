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
  CircularProgress,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DrugImportDialog from '../components/drugs/DrugImportDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';

import { drugImportService } from '../services/drugImportService';
import { DrugImport } from '../types/drugImport';

const DrugImports: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState<DrugImport | null>(null);
  const [imports, setImports] = useState<DrugImport[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const pageSize = 10;

  const fetchImports = async () => {
    setLoading(true);
    try {
      const data = await drugImportService.getAllDrugImports({
        month: selectedMonth,
        year: selectedYear
      });
      setImports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching imports:', error);
      setImports([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchImports();
  }, [selectedMonth, selectedYear]);

  const filteredImports = imports.filter(item =>
    item.drug?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.batch_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = filteredImports.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pagedImports = filteredImports.slice((page - 1) * pageSize, page * pageSize);

  // Dynamic Statistics
  const totalValue = filteredImports.reduce((sum, item) => sum + (Number(item.import_price) * item.quantity), 0);
  const totalQuantity = filteredImports.reduce((sum, item) => sum + item.quantity, 0);
  const totalRemaining = filteredImports.reduce((sum, item) => sum + item.remaining_quantity, 0);

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddImport = () => {
    setSelectedImport(null);
    setIsImportDialogOpen(true);
  };

  const handleEditImport = (item: DrugImport) => {
    setSelectedImport(item);
    setIsImportDialogOpen(true);
  };

  const handleDeleteClick = (item: DrugImport) => {
    setSelectedImport(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveImport = async (data: any) => {
    try {
      if (selectedImport && selectedImport.id) {
        await drugImportService.updateDrugImport(selectedImport.id, data);
      } else {
        await drugImportService.createDrugImport(data);
      }
      fetchImports();
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error('Error saving import:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedImport && selectedImport.id) {
        await drugImportService.deleteDrugImport(selectedImport.id);
        fetchImports();
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting import:', error);
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
              Quản lý Nhập kho Thuốc
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Tìm kiếm thuốc hoặc số lô..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: 280,
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
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  sx={{ 
                    borderRadius: '12px', 
                    background: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>Tháng {i + 1}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  sx={{ 
                    borderRadius: '12px', 
                    background: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }
                  }}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <MenuItem key={year} value={year}>Năm {year}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>

            <ActionButton
              label="Nhập thuốc"
              onClick={handleAddImport}
            />
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Tổng vốn nhập"
              value={new Intl.NumberFormat('vi-VN').format(totalValue)}
              subLabel="VND"
              icon={<AccountBalanceWalletIcon sx={{ color: '#00A3FF' }} />}
              iconBg="#EBF5FF"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Số lượng nhập"
              value={totalQuantity}
              subLabel="đơn vị"
              icon={<ReceiptLongIcon sx={{ color: '#F97316' }} />}
              iconBg="#FFF7ED"
              valueColor="#F97316"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Tồn kho thực tế"
              value={totalRemaining}
              subLabel="đơn vị"
              icon={<InventoryIcon sx={{ color: '#27AE60' }} />}
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
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>Số lô</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Tên thuốc</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Giá nhập</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Số lượng</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Còn lại</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Thời gian nhập</TableCell>
                  <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', pr: 3 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedImports.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { background: '#F8FAFC' }, transition: '0.2s', '& td': { py: 2.5, borderBottom: '1px solid #F1F5F9' } }}>
                    <TableCell sx={{ color: '#00A3FF', fontWeight: 700 }}>{item.batch_number}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#1E293B">{item.drug?.name || 'N/A'}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.drug?.medicine_id}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#1E293B', fontWeight: 600 }}>{formatCurrency(item.import_price)}</TableCell>
                    <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{item.quantity}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 100 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(item.remaining_quantity / item.quantity) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: '#F1F5F9',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: item.remaining_quantity < 10 ? '#EF4444' : '#10B981',
                                borderRadius: 3,
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight={700} color={item.remaining_quantity < 10 ? '#EF4444' : '#10B981'}>
                          {item.remaining_quantity}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#64748B' }}>{formatDate(item.import_date)}</TableCell>
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton size="small" sx={{ color: '#00A3FF' }} onClick={() => handleEditImport(item)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDeleteClick(item)}>
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
                {pagedImports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Không tìm thấy dữ liệu nhập kho</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Hiển thị {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} trong số {total} bản ghi
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
        <DrugImportDialog
          open={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
          onSave={handleSaveImport}
          drugImport={selectedImport}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xóa bản ghi nhập kho"
          message="Bạn có chắc chắn muốn xóa bản ghi này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến tồn kho."
          itemName={selectedImport?.batch_number}
        />
      </Box>
    </Box>
  );
};

export default DrugImports;
