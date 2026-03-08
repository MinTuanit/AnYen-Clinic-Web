import React, { useState } from 'react';
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
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Sidebar from '../components/Sidebar';

// Dữ liệu mẫu
const mockDoctors = [
  { id: '1', name: 'TS. Lê Minh', specialization: 'Tâm lý học Lâm sàng', year_experience: 15, status: 'Sẵn sàng' },
  { id: '2', name: 'ThS. Nguyễn An', specialization: 'Tâm lý học Trẻ em', year_experience: 8, status: 'Sẵn sàng' },
  { id: '3', name: 'BS. Phạm Hòa', specialization: 'Tham vấn Tâm thần', year_experience: 12, status: 'Nghỉ phép' },
  { id: '4', name: 'TS. Lê Minh', specialization: 'Tâm lý học Lâm sàng', year_experience: 15, status: 'Sẵn sàng' },
  { id: '5', name: 'ThS. Nguyễn An', specialization: 'Tâm lý học Trẻ em', year_experience: 8, status: 'Sẵn sàng' },
  { id: '6', name: 'BS. Phạm Hòa', specialization: 'Tham vấn Tâm thần', year_experience: 12, status: 'Nghỉ phép' },
];

const Doctors: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const total = mockDoctors.length;
  const pageCount = Math.ceil(total / pageSize);
  const pagedDoctors = mockDoctors.slice((page - 1) * pageSize, page * pageSize);

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
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
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
              {pagedDoctors.map((doctor) => (
                <TableRow key={doctor.id} sx={{ '&:hover': { background: '#F1F5F9' }, transition: '0.2s' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{doctor.name}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{doctor.specialization}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{doctor.year_experience} năm</TableCell>
                  <TableCell>
                    <Chip
                      label={doctor.status}
                      size="small"
                      sx={{
                        background: doctor.status === 'Sẵn sàng' ? '#E6F6FF' : '#FFF1F2',
                        color: doctor.status === 'Sẵn sàng' ? '#00A3FF' : '#E11D48',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton size="small" sx={{ color: '#00A3FF' }}><DescriptionIcon fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: '#EF4444' }}><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
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
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Doctors;
