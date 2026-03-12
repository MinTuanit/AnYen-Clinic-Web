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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VoucherDialog from '../components/vouchers/VoucherDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';

const mockVouchers = [
  { id: 'PSYCH20', name: 'Ưu đãi hè 2024', discount: '20%', expiry: '31/08/2024', usage: '50/100', status: 'Active' },
  { id: 'WELCOME10', name: 'Chào mừng bạn mới', discount: '10%', expiry: '31/12/2024', usage: '∞', status: 'Active' },
  { id: 'THANKYOU5', name: 'Tri ân khách hàng', discount: '5%', expiry: '15/07/2024', usage: '100/100', status: 'Inactive' },
  { id: 'SPECIAL15', name: 'Tuần lễ tâm lý', discount: '15%', expiry: '20/06/2024', usage: '30/30', status: 'Inactive' },
  { id: 'HEAL25', name: 'Gói trị liệu nhóm', discount: '25%', expiry: '01/10/2024', usage: '12/20', status: 'Active' },
  { id: 'SUMMER25', name: 'Khuyến mãi mùa hè', discount: '25%', expiry: '30/09/2024', usage: '45/200', status: 'Active' },
  { id: 'NEWYEAR10', name: 'Lễ tết 2024', discount: '10%', expiry: '05/01/2024', usage: '50/50', status: 'Inactive' },
  { id: 'KIDS20', name: 'Ưu đãi nhi khoa', discount: '20%', expiry: '15/11/2024', usage: '10/50', status: 'Active' },
  { id: 'DENTAL15', name: 'Chăm sóc răng miệng', discount: '15%', expiry: '20/12/2024', usage: '5/100', status: 'Active' },
  { id: 'OLDUSER5', name: 'Khách hàng thân thiết', discount: '5%', expiry: '10/08/2024', usage: '200/200', status: 'Inactive' },
  { id: 'MEMBER20', name: 'Thành viên VIP', discount: '20%', expiry: '31/12/2025', usage: '∞', status: 'Active' },
  { id: 'FLASH40', name: 'Flash Sale 40%', discount: '40%', expiry: '01/03/2024', usage: '100/100', status: 'Inactive' },
  { id: 'BIRTHDAY30', name: 'Mừng sinh nhật', discount: '30%', expiry: '15/05/2024', usage: '0/1', status: 'Inactive' },
  { id: 'WOMAN20', name: 'Quốc tế phụ nữ', discount: '20%', expiry: '08/03/2024', usage: '48/50', status: 'Inactive' },
  { id: 'HEALTHY10', name: 'Sống khỏe mỗi ngày', discount: '10%', expiry: '10/10/2024', usage: '80/300', status: 'Active' },
  { id: 'PROMO15', name: 'Khuyến mãi tháng 10', discount: '15%', expiry: '31/10/2024', usage: '12/100', status: 'Active' },
  { id: 'VOUCH50', name: 'Siêu giảm giá', discount: '50%', expiry: '25/09/2024', usage: '50/50', status: 'Inactive' },
  { id: 'GIFT100', name: 'Quà tặng khai trương', discount: '100k', expiry: '30/06/2024', usage: '20/20', status: 'Inactive' },
  { id: 'CHECKUP20', name: 'Khám tổng quát', discount: '20%', expiry: '20/11/2024', usage: '35/150', status: 'Active' },
  { id: 'EYECARE15', name: 'Chăm sóc mắt', discount: '15%', expiry: '15/12/2024', usage: '8/60', status: 'Active' },
];

const Vouchers: React.FC = () => {
  const [tab, setTab] = useState(0); // 0: Tất cả, 1: Đang chạy (Active), 2: Hết hạn (Inactive)
  const [page, setPage] = useState(1);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  
  const pageSize = 5;

  // Derived data
  const totalVouchersCount = mockVouchers.length;
  const activeVouchersCount = mockVouchers.filter(v => v.status === 'Active').length;
  const inactiveVouchersCount = mockVouchers.filter(v => v.status === 'Inactive').length;

  const filteredVouchers = mockVouchers.filter(v => {
    if (tab === 0) return true;
    if (tab === 1) return v.status === 'Active';
    if (tab === 2) return v.status === 'Inactive';
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

  const handleEditVoucher = (voucher: any) => {
    setSelectedVoucher(voucher);
    setIsVoucherDialogOpen(true);
  };

  const handleDeleteClick = (voucher: any) => {
    setSelectedVoucher(voucher);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveVoucher = (data: any) => {
    console.log('Saving voucher:', data);
    // Logic to update state or call API would go here
  };

  const handleConfirmDelete = () => {
    console.log('Deleting voucher:', selectedVoucher?.id);
    // Logic to update state or call API would go here
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

        {/* Content Table Container */}
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
                  <TableCell sx={{ color: '#00A3FF', fontWeight: 700, fontSize: 13 }}>{voucher.id}</TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 500, fontSize: 13 }}>{voucher.name}</TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 500, fontSize: 13 }}>{voucher.discount}</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 500, fontSize: 13 }}>{voucher.expiry}</TableCell>
                  <TableCell sx={{ color: '#1E293B', fontWeight: 500, fontSize: 13 }}>{voucher.usage}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: voucher.status === 'Active' ? '#22C55E' : '#94A3B8' }} />
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: voucher.status === 'Active' ? '#22C55E' : '#64748B',
                          background: voucher.status === 'Active' ? '#F0FDF4' : '#F1F5F9',
                          px: 1,
                          py: 0.25,
                          borderRadius: '12px'
                        }}
                      >
                        {voucher.status}
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
          itemName={selectedVoucher?.name}
        />
      </Box>
    </Box>
  );
};

export default Vouchers;

