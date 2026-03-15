import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Pagination,
  Paper,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientDialog from '../components/patients/PatientDialog';
import DeleteConfirmDialog from '../components/doctors/DeleteConfirmDialog';
import { patientService } from '../services/patientService';

const Patients: React.FC = () => {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data); // Không format ở đây!
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setDialogOpen(true);
  };

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };

  const handleDeleteClick = (patient: any) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const handleSavePatient = (data: any) => {
    console.log('Saving patient:', data);
    // API call logic
  };

  const handleConfirmDelete = () => {
    console.log('Deleting patient:', selectedPatient?.id);
    // Delete logic
    setDeleteDialogOpen(false);
  };
  const pageSize = 5;

  const filteredPatients = patients.filter(p => {
    const name = p.user?.name || p.anonymous_name || '';
    const id = p.patient_id || '';
    const phone = p.user?.phone_number || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });

  const total = filteredPatients.length;
  const pageCount = Math.ceil(total / pageSize);
  const pagedPatients = filteredPatients.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>
            Quản lý Bệnh nhân
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPatient}
            sx={{
              background: '#00A3FF',
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              fontWeight: 600,
              '&:hover': { background: '#008BD9' }
            }}
          >
            Thêm bệnh nhân mới
          </Button>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm bệnh nhân theo tên, ID hoặc số điện thoại..."
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
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

        {/* Patient Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ background: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Họ tên</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Ngày sinh</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Giới tính</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Số điện thoại</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Lần khám cuối</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : pagedPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">Không tìm thấy bệnh nhân nào</Typography>
                  </TableCell>
                </TableRow>
              ) : pagedPatients.map((row) => (
                <TableRow key={row.patient_id}>
                  <TableCell>{row.patient_id}</TableCell>
                  <TableCell>{row.user?.name || row.anonymous_name || 'Chưa cập nhật'}</TableCell>
                  <TableCell>{row.date_of_birth ? new Date(row.date_of_birth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</TableCell>
                  <TableCell>{row.gender === 'Male' ? 'Nam' : row.gender === 'Female' ? 'Nữ' : 'Khác'}</TableCell>
                  <TableCell>{row.user?.phone_number || 'Chưa cập nhật'}</TableCell>
                  <TableCell>
                    {row.appointments?.length
                      ? new Date(Math.max(...row.appointments.map((a: any) => new Date(a.appointment_date).getTime()))).toLocaleDateString('vi-VN')
                      : 'Chưa khám'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.user?.active_status ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        background: row.user?.active_status ? '#E6F6FF' : '#F1F5F9',
                        color: row.user?.active_status ? '#00A3FF' : '#64748B',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton size="small" sx={{ color: '#00A3FF' }} onClick={() => handleEditPatient(row)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDeleteClick(row)}>
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
              Hiển thị {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, total)} trong số {total} bệnh nhân
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
        <PatientDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSavePatient}
          patient={selectedPatient}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={`Bệnh nhân ${selectedPatient?.name}`}
        />
      </Box>
    </Box>
  );
};

export default Patients;
