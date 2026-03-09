import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ActionButton from '../components/ActionButton';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Mock data based on Order model and UI requirements
const mockOrders = [
  { id: 'ORD-9421', customer: { name: 'Nguyễn Văn An', initials: 'NA' }, date: '14/03/2024', total: 1250000, paymentStatus: 'Paid', orderStatus: 'Delivering' },
  { id: 'ORD-9422', customer: { name: 'Trần Thị Hoa', initials: 'TH' }, date: '13/03/2024', total: 850000, paymentStatus: 'Pending', orderStatus: 'Processing' },
  { id: 'ORD-9423', customer: { name: 'Lê Minh', initials: 'LM' }, date: '12/03/2024', total: 2100000, paymentStatus: 'Paid', orderStatus: 'Completed' },
  { id: 'ORD-9424', customer: { name: 'Phạm Tú', initials: 'PT' }, date: '11/03/2024', total: 450000, paymentStatus: 'Refunded', orderStatus: 'Cancelled' },
  { id: 'ORD-9425', customer: { name: 'Lê Thị Mai', initials: 'LM' }, date: '15/03/2024', total: 550000, paymentStatus: 'Paid', orderStatus: 'Completed' },
  { id: 'ORD-9426', customer: { name: 'Trần Văn B', initials: 'VB' }, date: '10/03/2024', total: 320000, paymentStatus: 'Paid', orderStatus: 'Delivering' },
  { id: 'ORD-9427', customer: { name: 'Phạm Thị C', initials: 'PC' }, date: '05/03/2024', total: 980000, paymentStatus: 'Pending', orderStatus: 'Processing' },
  { id: 'ORD-9428', customer: { name: 'Vũ Văn D', initials: 'VD' }, date: '01/03/2024', total: 1100000, paymentStatus: 'Paid', orderStatus: 'Completed' },
  { id: 'ORD-9420', customer: { name: 'Bùi Thị E', initials: 'BE' }, date: '28/02/2024', total: 750000, paymentStatus: 'Paid', orderStatus: 'Completed' },
];

const paymentStatusStyles: Record<string, { bg: string, color: string, label: string }> = {
  Paid: { bg: '#E8F8F1', color: '#27AE60', label: 'Đã thanh toán' },
  Pending: { bg: '#FFF7ED', color: '#F97316', label: 'Chờ thanh toán' },
  Refunded: { bg: '#F1F5F9', color: '#64748B', label: 'Hoàn tiền' },
};

const orderStatusStyles: Record<string, { bg: string, color: string, label: string, icon: React.ReactElement }> = {
  Delivering: { bg: '#EEF2FF', color: '#4F46E5', label: 'Đang giao', icon: <LocalShippingIcon sx={{ fontSize: 16 }} /> },
  Processing: { bg: '#F1F5F9', color: '#475569', label: 'Đang xử lý', icon: <AutorenewIcon sx={{ fontSize: 16 }} /> },
  Completed: { bg: '#E8F8F1', color: '#27AE60', label: 'Hoàn thành', icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
  Cancelled: { bg: '#FEF2F2', color: '#EF4444', label: 'Đã hủy', icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
};

const Orders: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [month, setMonth] = useState('03');
  const [year, setYear] = useState('2024');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const filteredOrders = mockOrders.filter(order => {
    // Status filter
    const statusMatch = tab === 0 ||
      (tab === 1 && order.orderStatus === 'Processing') ||
      (tab === 2 && order.orderStatus === 'Delivering') ||
      (tab === 3 && order.orderStatus === 'Completed') ||
      (tab === 4 && order.orderStatus === 'Cancelled');

    // Search filter
    const searchMatch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Date filter (mock data format is DD/MM/YYYY)
    const [d, m, y] = order.date.split('/');
    const dateMatch = m === month && y === year;

    return statusMatch && searchMatch && dateMatch;
  }).sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
    const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const totalFiltered = filteredOrders.length;
  const pageCount = Math.ceil(totalFiltered / pageSize);
  const pagedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  const handleTabChange = (_: any, val: number) => {
    setTab(val);
    setPage(1);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
              Quản lý Đơn hàng Thuốc
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Theo dõi và quản lý các đơn thuốc điều trị của bệnh nhân
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              sx={{
                borderRadius: '12px',
                borderColor: '#E2E8F0',
                color: '#1E293B',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                bgcolor: '#fff',
                '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' }
              }}
            >
              Xuất báo cáo
            </Button>
            <ActionButton
              label="Tạo đơn mới"
              onClick={() => { }}
            />
          </Box>
        </Box>

        {/* Status Tabs */}
        <Box sx={{ borderBottom: '1px solid #E2E8F0', mb: 1 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: 14, minWidth: 'auto', px: 2, pb: 1.5 }
            }}
          >
            <Tab label="Tất cả đơn hàng" />
            <Tab label="Đang xử lý" />
            <Tab label="Đang giao" />
            <Tab label="Hoàn thành" />
            <Tab label="Đã hủy" />
          </Tabs>
        </Box>

        {/* Filter Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, mt: 1 }}>
          <TextField
            placeholder="Tìm kiếm mã đơn, tên khách hàng..."
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            sx={{
              width: 380,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#fff',
                borderRadius: '12px',
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>Sắp xếp:</Typography>
              <Select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                size="small"
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  bgcolor: '#fff',
                  borderRadius: '12px',
                  fontSize: 14,
                  fontWeight: 600,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                  minWidth: 120
                }}
              >
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="oldest">Cũ nhất</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>Tháng:</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Select
                  value={month}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setPage(1);
                  }}
                  size="small"
                  sx={{ bgcolor: '#fff', borderRadius: '12px', minWidth: 80, fontSize: 14 }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      Tháng {i + 1}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setPage(1);
                  }}
                  size="small"
                  sx={{ bgcolor: '#fff', borderRadius: '12px', minWidth: 100, fontSize: 14 }}
                >
                  {['2023', '2024', '2025'].map(y => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Table Section */}
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Mã đơn hàng</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Khách hàng</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Ngày đặt</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Tổng tiền</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Thanh toán</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Trạng thái đơn</TableCell>
                <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedOrders.map((order) => (
                <TableRow key={order.id} sx={{ '&:hover': { bgcolor: '#F1F5F9' }, transition: '0.2s' }}>
                  <TableCell sx={{ color: '#00A3FF', fontWeight: 600 }}>#{order.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#F1F5F9', color: '#64748B', fontSize: 12, fontWeight: 700 }}>
                        {order.customer.initials}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>{order.customer.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#64748B', fontSize: 14 }}>{order.date}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Chip
                      label={paymentStatusStyles[order.paymentStatus].label}
                      size="small"
                      sx={{
                        bgcolor: paymentStatusStyles[order.paymentStatus].bg,
                        color: paymentStatusStyles[order.paymentStatus].color,
                        fontWeight: 600,
                        fontSize: 12,
                        borderRadius: '12px',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={orderStatusStyles[order.orderStatus].icon}
                      label={orderStatusStyles[order.orderStatus].label}
                      size="small"
                      sx={{
                        bgcolor: orderStatusStyles[order.orderStatus].bg,
                        color: orderStatusStyles[order.orderStatus].color,
                        fontWeight: 600,
                        fontSize: 12,
                        borderRadius: '12px',
                        px: 0.5,
                        '& .MuiChip-icon': { color: 'inherit', ml: 0.5 }
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton size="small" sx={{ color: '#64748B' }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#EF4444' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0' }}>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Hiển thị {totalFiltered > 0 ? (page - 1) * pageSize + 1 : 0} - {Math.min(page * pageSize, totalFiltered)} trong tổng số {totalFiltered} đơn hàng
            </Typography>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
              size="small"
              sx={{
                '& .Mui-selected': { bgcolor: '#00A3FF !important', color: '#fff' }
              }}
            />
          </Box>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Orders;
