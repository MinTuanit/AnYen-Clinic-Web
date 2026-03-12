import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientDialog from '../components/patients/PatientDialog';
import DeleteConfirmDialog from '../components/doctors/DeleteConfirmDialog';

const mockPatients = [
  { id: 'BN001', name: 'Nguyễn Văn A', dob: '12/05/1985', gender: 'Nam', phone: '0901 234 567', lastVisit: '20/10/2023', status: 'Active' },
  { id: 'BN002', name: 'Trần Thị B', dob: '22/08/1992', gender: 'Nữ', phone: '0912 345 678', lastVisit: '15/10/2023', status: 'Active' },
  { id: 'BN003', name: 'Lê Văn C', dob: '05/02/1978', gender: 'Nam', phone: '0987 654 321', lastVisit: '01/09/2023', status: 'Inactive' },
  { id: 'BN004', name: 'Phạm Minh D', dob: '30/11/2000', gender: 'Nam', phone: '0933 445 566', lastVisit: '18/10/2023', status: 'Active' },
  { id: 'BN005', name: 'Hoàng Thị E', dob: '14/07/1988', gender: 'Nữ', phone: '0944 556 677', lastVisit: '05/10/2023', status: 'Active' },
  { id: 'BN006', name: 'Nguyễn Văn A', dob: '12/05/1985', gender: 'Nam', phone: '0901 234 567', lastVisit: '20/10/2023', status: 'Active' },
  { id: 'BN007', name: 'Trần Thị B', dob: '22/08/1992', gender: 'Nữ', phone: '0912 345 678', lastVisit: '15/10/2023', status: 'Active' },
  { id: 'BN008', name: 'Lê Văn C', dob: '05/02/1978', gender: 'Nam', phone: '0987 654 321', lastVisit: '01/09/2023', status: 'Inactive' },
  { id: 'BN009', name: 'Phạm Minh D', dob: '30/11/2000', gender: 'Nam', phone: '0933 445 566', lastVisit: '18/10/2023', status: 'Active' },
  { id: 'BN010', name: 'Hoàng Thị E', dob: '14/07/1988', gender: 'Nữ', phone: '0944 556 677', lastVisit: '05/10/2023', status: 'Active' },
];

const Patients: React.FC = () => {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

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
  const total = mockPatients.length;
  const pageCount = Math.ceil(total / pageSize);
  const pagedPatients = mockPatients.slice((page - 1) * pageSize, page * pageSize);

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
              {pagedPatients.map((patient) => (
                <TableRow key={patient.id} sx={{ '&:hover': { background: '#F1F5F9' }, transition: '0.2s' }}>
                  <TableCell sx={{ color: '#00A3FF', fontWeight: 600 }}>{patient.id}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{patient.name}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{patient.dob}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{patient.gender}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{patient.phone}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{patient.lastVisit}</TableCell>
                  <TableCell>
                    <Chip
                      label={patient.status}
                      size="small"
                      sx={{
                        background: patient.status === 'Active' ? '#E6F6FF' : '#F1F5F9',
                        color: patient.status === 'Active' ? '#00A3FF' : '#64748B',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton size="small" sx={{ color: '#00A3FF' }} onClick={() => handleEditPatient(patient)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDeleteClick(patient)}>
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
