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
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import AppointmentDialog from '../components/appointments/AppointmentDialog';
import DeleteConfirmDialog from '../components/doctors/DeleteConfirmDialog';

const mockAppointments = [
  { id: 'LH-2041', patient: { name: 'Nguyễn Văn An', initials: 'NA' }, doctor: 'BS. Trần Thu Hà', date: '24/10/2023', time: '08:30', status: 'Wait' },
  { id: 'LH-2042', patient: { name: 'Lê Thị Bình', initials: 'LB' }, doctor: 'BS. Nguyễn Minh Tuấn', date: '24/10/2023', time: '09:00', status: 'Confirmed' },
  { id: 'LH-2039', patient: { name: 'Phạm Hồng Cường', initials: 'PC' }, doctor: 'BS. Trần Thu Hà', date: '23/10/2023', time: '15:00', status: 'Completed' },
  { id: 'LH-2040', patient: { name: 'Hoàng Văn Dũng', initials: 'HD' }, doctor: 'BS. Lê Thị Mai', date: '23/10/2023', time: '15:30', status: 'Cancelled' },
  { id: 'LH-2041-B', patient: { name: 'Nguyễn Văn An', initials: 'NA' }, doctor: 'BS. Trần Thu Hà', date: '24/10/2023', time: '08:30', status: 'Wait' },
  { id: 'LH-2042-B', patient: { name: 'Lê Thị Bình', initials: 'LB' }, doctor: 'BS. Nguyễn Minh Tuấn', date: '24/10/2023', time: '09:00', status: 'Confirmed' },
  { id: 'LH-2039-B', patient: { name: 'Phạm Hồng Cường', initials: 'PC' }, doctor: 'BS. Trần Thu Hà', date: '23/10/2023', time: '15:00', status: 'Completed' },
  { id: 'LH-2040-B', patient: { name: 'Hoàng Văn Dũng', initials: 'HD' }, doctor: 'BS. Lê Thị Mai', date: '23/10/2023', time: '15:30', status: 'Cancelled' },
];

const statusStyles: Record<string, { bg: string, color: string }> = {
  Wait: { bg: '#FFF7ED', color: '#F97316' },
  Confirmed: { bg: '#E0F2FE', color: '#00A3FF' },
  Completed: { bg: '#F0FDF4', color: '#22C55E' },
  Cancelled: { bg: '#FEF2F2', color: '#EF4444' },
};

const Appointment: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setDialogOpen(true);
  };

  const handleEditAppointment = (app: any) => {
    setSelectedAppointment(app);
    setDialogOpen(true);
  };

  const handleDeleteClick = (app: any) => {
    setSelectedAppointment(app);
    setDeleteDialogOpen(true);
  };

  const handleSaveAppointment = (data: any) => {
    console.log('Saving appointment:', data);
    // Logic to update state or call API
  };

  const handleConfirmDelete = () => {
    console.log('Deleting appointment:', selectedAppointment?.id);
    // Logic to delete
    setDeleteDialogOpen(false);
  };
  const pageSize = 5;
  const total = mockAppointments.length;
  const pageCount = Math.ceil(total / pageSize);
  const pagedAppointments = mockAppointments.slice((page - 1) * pageSize, page * pageSize);

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

        {/* Status Chips Summary */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Chip label="Sắp đến: 12" sx={{ background: '#FFF7ED', color: '#F97316', fontWeight: 600, height: '32px' }} />
          <Chip label="Đã xác nhận: 24" sx={{ background: '#E0F2FE', color: '#00A3FF', fontWeight: 600, height: '32px' }} />
        </Box>

        {/* Appointments Table */}
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
                  <TableCell sx={{ color: '#00A3FF', fontWeight: 600 }}>#{app.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: '#E0F2FE', color: '#00A3FF', fontWeight: 700 }}>
                        {app.patient.initials}
                      </Avatar>
                      <Typography fontWeight={600} color="#1E293B" fontSize={14}>{app.patient.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#475569', fontSize: 14 }}>{app.doctor}</TableCell>
                  <TableCell sx={{ color: '#475569', fontSize: 14 }}>{app.date}</TableCell>
                  <TableCell sx={{ color: '#475569', fontSize: 14 }}>{app.time}</TableCell>
                  <TableCell>
                    <Chip
                      label={app.status}
                      size="small"
                      sx={{
                        background: statusStyles[app.status]?.bg || '#F1F5F9',
                        color: statusStyles[app.status]?.color || '#64748B',
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

export default Appointment;
