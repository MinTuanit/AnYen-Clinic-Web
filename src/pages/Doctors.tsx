import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Pagination,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Sidebar from '../components/Sidebar';
import DoctorDialog from '../components/doctors/DoctorDialog';
import DeleteConfirmDialog from '../components/doctors/DeleteConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import { doctorService } from '../services/doctorService';
import { Doctor } from '../types/doctor';
import { useNotification } from '../contexts/NotificationContext';

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showNotification } = useNotification();

  const pageSize = 8;

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      showNotification('Không thể lấy danh sách bác sĩ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = filteredDoctors.length;
  const pageCount = Math.ceil(total / pageSize);
  const pagedDoctors = filteredDoctors.slice((page - 1) * pageSize, page * pageSize);

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setDialogOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDialogOpen(true);
  };

  const handleDeleteClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  const handleSaveDoctor = async (data: any) => {
    try {
      if (selectedDoctor) {
        // Edit mode
        await doctorService.editDoctor({
          ...selectedDoctor,
          ...data,
          doctor_id: selectedDoctor.doctor_id,
          gender: data.gender, // Service handles mapping
        });
        showNotification('Cập nhật thông tin bác sĩ thành công!');
      } else {
        // Create mode
        await doctorService.createDoctor({
          ...data,
          info_status: 'Active'
        });
        showNotification('Thêm bác sĩ thành công!');
      }
      fetchDoctors();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving doctor:', error);
      showNotification('Có lỗi xảy ra khi lưu thông tin bác sĩ', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoctor) return;
    try {
      console.log('Deleting doctor:', selectedDoctor.doctor_id);
      showNotification('Chức năng xóa sẽ được cập nhật sau. Hiện tại chưa có API xóa bác sĩ.', 'info');
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      showNotification('Có lỗi xảy ra khi xóa bác sĩ', 'error');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={700} color="#1E293B">Quản lý Bác sĩ</Typography>
            <Typography color="text.secondary" fontSize={14}>Danh sách đội ngũ chuyên gia tâm lý và bác sĩ của phòng khám.</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDoctor}
            sx={{
              background: '#00A3FF',
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              fontWeight: 600,
              '&:hover': { background: '#008BD9' }
            }}
          >
            Thêm Bác sĩ mới
          </Button>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên ngành..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: '#fff',
                borderRadius: '10px',
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
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
              borderColor: '#E2E8F0',
              color: '#64748B',
              px: 3,
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: '#CBD5E1', background: '#F8FAFC' }
            }}
          >
            Bộ lọc
          </Button>
        </Box>

        {/* Doctors Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden', position: 'relative', minHeight: '400px' }}>
          {loading && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
              <CircularProgress size={40} sx={{ color: '#00A3FF' }} />
            </Box>
          )}
          <Table>
            <TableHead sx={{ background: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Tên bác sĩ</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Chuyên ngành</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Kinh nghiệm</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedDoctors.length > 0 ? pagedDoctors.map((doctor) => (
                <TableRow key={doctor.doctor_id} sx={{ '&:hover': { background: '#F1F5F9' }, transition: '0.2s' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{doctor.user.name}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{doctor.specialization}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{doctor.year_experience} năm</TableCell>
                  <TableCell>
                    <Chip
                      label={doctor.approval_status || (doctor.user.active_status ? 'Hoạt động' : 'Bị khóa')}
                      size="small"
                      sx={{
                        background: (doctor.approval_status === 'Approved' || doctor.user.active_status === true) ? '#E6F6FF' : '#FFF1F2',
                        color: (doctor.approval_status === 'Approved' || doctor.user.active_status === true) ? '#00A3FF' : '#E11D48',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        sx={{ color: '#00A3FF' }}
                        onClick={() => handleEditDoctor(doctor)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: '#EF4444' }}
                        onClick={() => handleDeleteClick(doctor)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              )) : !loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8, color: '#64748B' }}>
                    Không tìm thấy bác sĩ nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {total > 0 && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0' }}>
              <Typography variant="body2" color="text.secondary">
                Hiển thị {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, total)} trong số {total} bác sĩ
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
          )}
        </TableContainer>

        {/* Dialogs */}
        <DoctorDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveDoctor}
          doctor={selectedDoctor as any}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={selectedDoctor?.user.name}
        />
      </Box>
    </Box>
  );
};

export default Doctors;
