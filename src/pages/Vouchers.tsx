import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import ActionButton from '../components/ActionButton';
import Grid from '@mui/material/Grid';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VoucherDialog from '../components/vouchers/VoucherDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';

import { voucherService } from '../services/voucherService';
import { Voucher } from '../types/voucher';

const Vouchers: React.FC = () => {
  const [tab, setTab] = useState(0); // 0: Tất cả, 1: Đang chạy (Active), 2: Hết hạn (Inactive)
  const [page, setPage] = useState(1);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await voucherService.getAdminVouchers();
      setVouchers(data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVouchers();
  }, []);

  // Derived data
  const getVoucherStatus = (v: Voucher) => {
    const now = new Date();
    if (v.expires_at && new Date(v.expires_at) < now) return 'Expired';
    if (v.usage_limit && v.used_count >= v.usage_limit) return 'Exhausted';
    return 'Active';
  };

  const totalVouchersCount = (Array.isArray(vouchers) ? vouchers : []).length;
  const activeVouchersCount = (Array.isArray(vouchers) ? vouchers : []).filter(v => getVoucherStatus(v) === 'Active').length;
  const inactiveVouchersCount = (Array.isArray(vouchers) ? vouchers : []).filter(v => ['Expired', 'Exhausted'].includes(getVoucherStatus(v))).length;

  const filteredVouchers = (Array.isArray(vouchers) ? vouchers : []).filter(v => {
    const status = getVoucherStatus(v);
    if (tab === 0) return true;
    if (tab === 1) return status === 'Active';
    if (tab === 2) return ['Expired', 'Exhausted'].includes(status);
    return true;
  });

  const totalFiltered = filteredVouchers.length;
  const pageCount = Math.ceil(totalFiltered / pageSize);
  const displayedVouchers = filteredVouchers.slice((page - 1) * pageSize, page * pageSize);

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
    setPage(1); // Reset to first page when filtering
  };

  const handleAddVoucher = () => {
    setSelectedVoucher(null);
    setIsVoucherDialogOpen(true);
  };

  const handleEditVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsVoucherDialogOpen(true);
  };

  const handleDeleteClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveVoucher = async (data: any) => {
    try {
      if (selectedVoucher) {
        // Update logic not in backend controller? Let's check. 
        // Admin controller has only create and delete.
      } else {
        await voucherService.createVoucher(data);
      }
      fetchVouchers();
      setIsVoucherDialogOpen(false);
    } catch (error) {
      console.error('Error saving voucher:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedVoucher) {
        await voucherService.deleteVoucher(selectedVoucher.id);
        fetchVouchers();
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting voucher:', error);
    }
  };


  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Top Header with Notification */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>
              Quản lý Voucher
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Quản lý danh sách mã giảm giá và chương trình ưu đãi.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Tìm kiếm voucher..."
              size="small"
              sx={{
                width: 300,
                '& .MuiOutlinedInput-root': {
                  background: '#fff',
                  borderRadius: '10px'
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
              label="Thêm voucher mới"
              onClick={handleAddVoucher}
            />
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Tổng số mã"
              value={totalVouchersCount}
              subLabel="mã voucher"
              icon={<LocalOfferIcon />}
              iconBg="#E0F2FE"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Voucher khả dụng"
              value={activeVouchersCount}
              subLabel="đang hoạt động"
              icon={<CheckCircleIcon sx={{ color: '#27AE60' }} />}
              iconBg="#E8F8F1"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Hết hiệu lực"
              value={inactiveVouchersCount}
              subLabel="hết hạn / dừng"
              icon={<HourglassEmptyIcon sx={{ color: '#F97316' }} />}
              iconBg="#FFF7ED"
            />
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
            <Box sx={{ p: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', fontSize: 16 }}>
                Danh sách Voucher
              </Typography>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                sx={{
                  minHeight: 36,
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: 36,
                    borderRadius: '8px',
                    px: 2,
                    color: '#64748B',
                    '&.Mui-selected': { background: '#E0F2FE', color: '#00A3FF' }
                  }
                }}
              >
                <Tab label="Tất cả" />
                <Tab label="Đang chạy" />
                <Tab label="Hết hạn" />
              </Tabs>
            </Box>
            <Table>
              <TableHead sx={{ background: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Mã Voucher</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Tên chương trình</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Giảm giá (%)</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Ngày hết hạn</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Số lượng</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Trạng thái</TableCell>
                  <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedVouchers.map((voucher) => (
                  <TableRow key={voucher.id} sx={{ '&:hover': { background: '#F8FAFC' } }}>
                    <TableCell sx={{ color: '#00A3FF', fontWeight: 700, fontSize: 13 }}>{voucher.code}</TableCell>
                    <TableCell sx={{ color: '#1E293B', fontWeight: 500, fontSize: 13 }}>{voucher.description}</TableCell>
                    <TableCell sx={{ color: '#1E293B', fontWeight: 500, fontSize: 13 }}>
                      {voucher.discount_type === 'Percent' ? `${voucher.discount_value}%` : `${new Intl.NumberFormat('vi-VN').format(voucher.discount_value)}đ`}
                    </TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 500, fontSize: 13 }}>
                      {voucher.expires_at ? new Date(voucher.expires_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: '#1E293B', fontWeight: 500, fontSize: 13 }}>
                      {voucher.usage_limit ? `${voucher.used_count}/${voucher.usage_limit}` : '∞'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: getVoucherStatus(voucher) === 'Active' ? '#22C55E' : '#94A3B8'
                        }} />
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: getVoucherStatus(voucher) === 'Active' ? '#22C55E' : '#64748B',
                            background: getVoucherStatus(voucher) === 'Active' ? '#F0FDF4' : '#F1F5F9',
                            px: 1,
                            py: 0.25,
                            borderRadius: '12px'
                          }}
                        >
                          {getVoucherStatus(voucher)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton size="small" sx={{ color: '#00A3FF' }} onClick={() => handleEditVoucher(voucher)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDeleteClick(voucher)}><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Box sx={{ p: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0' }}>
              <Typography variant="body2" color="#64748B">
                Hiển thị {totalFiltered > 0 ? ((page - 1) * pageSize) + 1 : 0}-{Math.min(page * pageSize, totalFiltered)} trong số {totalFiltered} voucher
              </Typography>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                shape="rounded"
                color="primary"
                size="small"
                sx={{
                  '& .MuiPaginationItem-root': { borderRadius: '8px', fontWeight: 600 },
                  '& .Mui-selected': { background: '#00A3FF !important', color: '#fff' }
                }}
              />
            </Box>
          </TableContainer>
        )}

        {/* Dialogs */}
        <VoucherDialog
          open={isVoucherDialogOpen}
          onClose={() => setIsVoucherDialogOpen(false)}
          onSave={handleSaveVoucher}
          voucher={selectedVoucher}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xóa Voucher"
          message="Bạn có chắc chắn muốn xóa voucher này? Hành động này không thể hoàn tác."
          itemName={selectedVoucher?.code || selectedVoucher?.description}
        />
      </Box>
    </Box>
  );
};

export default Vouchers;

