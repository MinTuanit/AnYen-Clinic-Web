import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
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
  Chip,
  IconButton,
  CircularProgress
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import OrderDialog from '../components/orders/OrderDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types/order';

const orderStatusStyles: Record<OrderStatus, { bg: string, color: string, label: string, icon: React.ReactElement }> = {
  [OrderStatus.Delivering]: { bg: '#EEF2FF', color: '#4F46E5', label: 'Đang giao', icon: <LocalShippingIcon sx={{ fontSize: 16 }} /> },
  [OrderStatus.Pending]: { bg: '#F1F5F9', color: '#475569', label: 'Chờ xử lý', icon: <AutorenewIcon sx={{ fontSize: 16 }} /> },
  [OrderStatus.Delivered]: { bg: '#E8F8F1', color: '#27AE60', label: 'Hoàn thành', icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
  [OrderStatus.Cancelled]: { bg: '#FEF2F2', color: '#EF4444', label: 'Đã hủy', icon: <CancelOutlinedIcon sx={{ fontSize: 16 }} /> },
  [OrderStatus.Returning]: { bg: '#FFF7ED', color: '#F97316', label: 'Đang trả hàng', icon: <AutorenewIcon sx={{ fontSize: 16 }} /> },
  [OrderStatus.Returned]: { bg: '#F1F5F9', color: '#64748B', label: 'Đã trả hàng', icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> },
};

const Orders: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statuses = tab === 0 ? '' :
        tab === 1 ? 'Pending' :
          tab === 2 ? 'Delivering' :
            tab === 3 ? 'Delivered' :
              tab === 4 ? 'Cancelled' :
                tab === 5 ? 'Returning' : 'Returned';

      const data = await orderService.getAllOrders({ statuses });
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(order => {
    // Search filter
    const searchMatch = order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery_address.toLowerCase().includes(searchQuery.toLowerCase());

    // Date filter
    const orderDate = new Date(order.createdAt);
    const dateMatch = (orderDate.getMonth() + 1) === parseInt(month) &&
      orderDate.getFullYear() === parseInt(year);

    return searchMatch && dateMatch;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const totalFiltered = filteredOrders.length;
  const pageCount = Math.ceil(totalFiltered / pageSize);
  const pagedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  const handleTabChange = (_: any, val: number) => {
    setTab(val);
    setPage(1);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveOrder = async (data: any) => {
    try {
      if (selectedOrder) {
        await orderService.updateOrderStatus(selectedOrder.order_id, data.status);
      }
      fetchOrders();
      setIsOrderDialogOpen(false);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedOrder) {
        await orderService.deleteOrder(selectedOrder.order_id);
        fetchOrders();
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleApproveDelivering = async (orderId: string) => {
    try {
      await orderService.approveOrderToDelivering(orderId);
      fetchOrders();
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderService.updateOrderStatus(orderId, OrderStatus.Cancelled);
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
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
            {/* <ActionButton
              label="Tạo đơn mới"
              onClick={handleCreateOrder}
            /> */}
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
            <Tab label="Chờ xử lý" />
            <Tab label="Đang giao" />
            <Tab label="Hoàn thành" />
            <Tab label="Đã hủy" />
            <Tab label="Đang trả hàng" />
            <Tab label="Đã trả hàng" />
          </Tabs>
        </Box>

        {/* Filter Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
          <TextField
            placeholder="Tìm kiếm mã đơn, địa chỉ..."
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
                  {['2023', '2024', '2025', '2026'].map(y => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Mã đơn hàng</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Địa chỉ</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Ngày đặt</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Tổng tiền</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>PTTT</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Trạng thái đơn</TableCell>
                  <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedOrders.map((order) => (
                  <TableRow key={order.order_id} sx={{ '&:hover': { bgcolor: '#F1F5F9' }, transition: '0.2s' }}>
                    <TableCell sx={{ color: '#00A3FF', fontWeight: 600 }}>#{order.order_id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#1E293B', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.delivery_address}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#64748B', fontSize: 14 }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>
                      {formatCurrency(Number(order.payment?.total_price ?? order.total_amount ?? 0))}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#64748B' }}>{order.payment_method}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={orderStatusStyles[order.status]?.icon}
                        label={orderStatusStyles[order.status]?.label || order.status}
                        size="small"
                        sx={{
                          bgcolor: orderStatusStyles[order.status]?.bg || '#F1F5F9',
                          color: orderStatusStyles[order.status]?.color || '#475569',
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
                        {order.status === 'Pending' && (
                          <>
                            <IconButton size="small" title="Duyệt giao hàng" sx={{ color: '#27AE60' }} onClick={() => handleApproveDelivering(order.order_id)}>
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" title="Hủy đơn" sx={{ color: '#EF4444' }} onClick={() => handleCancelOrder(order.order_id)}>
                              <CancelOutlinedIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                        <IconButton size="small" sx={{ color: '#00A3FF' }} onClick={() => handleViewOrder(order)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDeleteClick(order)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        )}

        {/* Dialogs */}
        <OrderDialog
          open={isOrderDialogOpen}
          onClose={() => setIsOrderDialogOpen(false)}
          onSave={handleSaveOrder}
          order={selectedOrder}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xóa Đơn hàng"
          message="Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác."
          itemName={selectedOrder ? `Đơn hàng #${(selectedOrder.order_id || selectedOrder.id || '').slice(0, 8)}` : ''}
        />
      </Box>
    </Box>
  );
};

export default Orders;
