import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ActionButton from '../components/ActionButton';
import {
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
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
import FilterListIcon from '@mui/icons-material/FilterList';
import AppointmentDialog from '../components/appointments/AppointmentDialog';
import DeleteConfirmDialog from '../components/doctors/DeleteConfirmDialog';

import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../types/appointment';

const statusStyles: Record<string, { bg: string, color: string }> = {
  Wait: { bg: '#FFF7ED', color: '#F97316' },
  Pending: { bg: '#FFF7ED', color: '#F97316' },
  Confirmed: { bg: '#E0F2FE', color: '#00A3FF' },
  Completed: { bg: '#F0FDF4', color: '#22C55E' },
  Cancelled: { bg: '#FEF2F2', color: '#EF4444' },
  Canceled: { bg: '#FEF2F2', color: '#EF4444' },
};

const AppointmentPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAllAppointmentAdmin();
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setDialogOpen(true);
  };

  const handleEditAppointment = (app: Appointment) => {
    setSelectedAppointment(app);
    setDialogOpen(true);
  };

  const handleDeleteClick = (app: Appointment) => {
    setSelectedAppointment(app);
    setDeleteDialogOpen(true);
  };

  const handleSaveAppointment = async (data: any) => {
    try {
      if (selectedAppointment) {
        await appointmentService.editAppointmentStatus(selectedAppointment.id, data.status);
      }
      fetchAppointments();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedAppointment) {
        // No delete in admin appointment service? 
        // Maybe cancel instead?
        await appointmentService.cancelAppointment(selectedAppointment);
        fetchAppointments();
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };
  const pageSize = 10;

  const filteredAppointments = appointments.filter(app => {
    const searchMatch = (app.patient?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.doctor?.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filtering (Today, Week, Month, Custom) - Skip for now as real data needs date logic
    return searchMatch;
  });

  const total = filteredAppointments.length;
  const pageCount = Math.ceil(total / pageSize);
  const pagedAppointments = filteredAppointments.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>
            Quản lý Lịch hẹn
          </Typography>
          <ActionButton
            label="Thêm lịch hẹn mới"
            onClick={handleAddAppointment}
          />
        </Box>

        {/* Tabs & Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 40, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 40 } }}>
            <Tab label="Hôm nay" />
            <Tab label="Tuần này" />
            <Tab label="Tháng này" />
            <Tab label="Tùy chỉnh" />
          </Tabs>
          <Box sx={{ flex: 1 }} />
          <TextField
            placeholder="Tìm bệnh nhân, bác sĩ..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              borderColor: '#E2E8F0',
              color: '#64748B',
              px: 2,
              '&:hover': { borderColor: '#CBD5E1', background: '#F8FAFC' }
            }}
          >
            Bộ lọc
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ background: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Bệnh nhân</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Bác sĩ</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Ngày khám</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Giờ khám</TableCell>
                  <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Trạng thái</TableCell>
                  <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedAppointments.map((app) => (
                  <TableRow key={app.id} sx={{ '&:hover': { background: '#F1F5F9' }, transition: '0.2s' }}>
                    <TableCell sx={{ color: '#00A3FF', fontWeight: 600 }}>#{app.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: '#E0F2FE', color: '#00A3FF', fontWeight: 700 }}>
                          {app.patient?.name ? app.patient.name.charAt(0) : 'P'}
                        </Avatar>
                        <Typography fontWeight={600} color="#1E293B" fontSize={14}>{app.patient?.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: 14 }}>{app.doctor?.user?.name}</TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: 14 }}>{app.appointmentDate ? new Date(app.appointmentDate).toLocaleDateString('vi-VN') : 'N/A'}</TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: 14 }}>{app.appointmentTime}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.status}
                        size="small"
                        sx={{
                          background: statusStyles[app.status || 'Wait']?.bg || '#F1F5F9',
                          color: statusStyles[app.status || 'Wait']?.color || '#64748B',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          borderRadius: '6px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton size="small" sx={{ color: '#00A3FF' }} onClick={() => handleEditAppointment(app)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDeleteClick(app)}>
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
              <Typography variant="body2" color="text.secondary">
                Hiển thị {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, total)} trong số {total} lịch hẹn
              </Typography>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                shape="rounded"
                color="primary"
                size="small"
                sx={{
                  '& .Mui-selected': { background: '#00A3FF !important' }
                }}
              />
            </Box>
          </TableContainer>
        )}

        {/* Dialogs */}
        <AppointmentDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveAppointment}
          appointment={selectedAppointment}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={`Lịch hẹn #${selectedAppointment?.id}`}
        />
      </Box>
    </Box>
  );
};

export default AppointmentPage;
