import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ActionButton from '../components/ActionButton';
import {
  Box,
  Typography,
  Chip,
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
  Pagination,
  Link
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

const mockQuizzes = [
  { id: 'PSY-001', name: 'Đánh giá mức độ trầm cảm PHQ-9', questions: 9, target: 'Người trưởng thành', createdAt: '12/10/2023', status: 'Hoạt động' },
  { id: 'PSY-002', name: 'Kiểm tra lo âu GAD-7', questions: 7, target: 'Mọi đối tượng', createdAt: '15/10/2023', status: 'Hoạt động' },
  { id: 'PSY-003', name: 'Sàng lọc tự kỷ trẻ em M-CHAT-R', questions: 20, target: 'Trẻ em', createdAt: '05/11/2023', status: 'Hoạt động' },
  { id: 'PSY-004', name: 'Đánh giá stress PSS-10', questions: 10, target: 'Học sinh/Sinh viên', createdAt: '20/11/2023', status: 'Ngừng hoạt động' },
  { id: 'PSY-005', name: 'Thang đo trầm cảm sau sinh EPDS', questions: 10, target: 'Phụ nữ sau sinh', createdAt: '01/12/2023', status: 'Hoạt động' },
  { id: 'PSY-006', name: 'Kiểm tra sức khỏe tâm thần tổng quát', questions: 15, target: 'Người trưởng thành', createdAt: '10/12/2023', status: 'Hoạt động' },
];

const statusStyles: Record<string, { bg: string, color: string, dot: string }> = {
  'Hoạt động': { bg: '#F0FDF4', color: '#16A34A', dot: '#22C55E' },
  'Ngừng hoạt động': { bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' },
};

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredQuizzes = mockQuizzes.filter(quiz => {
    // Search filter
    const searchMatch = quiz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const statusMatch = statusFilter === 'all' ||
      (statusFilter === 'active' && quiz.status === 'Hoạt động') ||
      (statusFilter === 'inactive' && quiz.status === 'Ngừng hoạt động');

    // Target filter
    const targetMatch = targetFilter === 'all' ||
      (targetFilter === 'adult' && quiz.target === 'Người trưởng thành') ||
      (targetFilter === 'child' && quiz.target === 'Trẻ em') ||
      (targetFilter === 'all-targets' && quiz.target === 'Mọi đối tượng') ||
      (targetFilter === 'student' && quiz.target === 'Học sinh/Sinh viên') ||
      (targetFilter === 'postpartum' && quiz.target === 'Phụ nữ sau sinh');

    return searchMatch && statusMatch && targetMatch;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt.split('/').reverse().join('-')).getTime() - new Date(a.createdAt.split('/').reverse().join('-')).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt.split('/').reverse().join('-')).getTime() - new Date(b.createdAt.split('/').reverse().join('-')).getTime();
    if (sortBy === 'questions-desc') return b.questions - a.questions;
    if (sortBy === 'questions-asc') return a.questions - b.questions;
    return 0;
  });

  const totalFiltered = filteredQuizzes.length;
  const pageCount = Math.ceil(totalFiltered / pageSize);
  const pagedQuizzes = filteredQuizzes.slice((page - 1) * pageSize, page * pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: any) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleTargetChange = (e: any) => {
    setTargetFilter(e.target.value);
    setPage(1);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B' }}>
            Quản lý bài kiểm tra tâm lý
          </Typography>
          <ActionButton
            label="Thêm bài kiểm tra mới"
            onClick={() => navigate('/quiz/create')}
          />
        </Box>

        {/* Filters & Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="Tìm kiếm tên bài kiểm tra..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: 400,
              '& .MuiOutlinedInput-root': {
                background: '#fff',
                borderRadius: '10px'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94A3B8' }} />
                </InputAdornment>
              ),
            }}
          />

          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            size="small"
            sx={{
              minWidth: 160,
              background: '#fff',
              borderRadius: '10px',
              '& .MuiSelect-select': { py: '8.5px' }
            }}
          >
            <MenuItem value="all">Tất cả trạng thái</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
          </Select>

          <Select
            value={targetFilter}
            onChange={handleTargetChange}
            size="small"
            sx={{
              minWidth: 130,
              background: '#fff',
              borderRadius: '10px',
              '& .MuiSelect-select': { py: '8.5px' }
            }}
          >
            <MenuItem value="all">Đối tượng</MenuItem>
            <MenuItem value="all-targets">Mọi đối tượng</MenuItem>
            <MenuItem value="adult">Người trưởng thành</MenuItem>
            <MenuItem value="child">Trẻ em</MenuItem>
            <MenuItem value="student">Học sinh/Sinh viên</MenuItem>
            <MenuItem value="postpartum">Phụ nữ sau sinh</MenuItem>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            IconComponent={SortIcon}
            sx={{
              minWidth: 140,
              background: '#fff',
              borderRadius: '10px',
              fontWeight: 600,
              color: '#1E293B',
              '& .MuiSelect-select': { py: '8.5px', display: 'flex', alignItems: 'center' },
              '& .MuiSvgIcon-root': { color: '#64748B', right: '12px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
            }}
          >
            <MenuItem value="newest">Mới nhất</MenuItem>
            <MenuItem value="oldest">Cũ nhất</MenuItem>
            <MenuItem value="questions-desc">Nhiều câu hỏi nhất</MenuItem>
            <MenuItem value="questions-asc">Ít câu hỏi nhất</MenuItem>
          </Select>
        </Box>

        {/* Quizzes Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ background: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Tên bài kiểm tra</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Số câu hỏi</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Đối tượng</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Ngày tạo</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Trạng thái</TableCell>
                <TableCell align="center" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedQuizzes.map((quiz) => (
                <TableRow key={quiz.id} sx={{ '&:hover': { background: '#F1F5F9' }, transition: '0.2s' }}>
                  <TableCell sx={{ py: 2 }}>
                    <Typography fontWeight={600} color="#1E293B" fontSize={14}>{quiz.name}</Typography>
                    <Typography color="#64748B" fontSize={12}>Mã test: {quiz.id}</Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#475569', fontSize: 14 }}>{quiz.questions} câu</TableCell>
                  <TableCell>
                    <Chip
                      label={quiz.target}
                      size="small"
                      sx={{
                        background: '#F1F5F9',
                        color: '#475569',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        borderRadius: '4px'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#475569', fontSize: 14 }}>{quiz.createdAt}</TableCell>
                  <TableCell>
                    <Chip
                      icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', background: statusStyles[quiz.status]?.dot, ml: 1 }} />}
                      label={quiz.status}
                      size="small"
                      sx={{
                        background: statusStyles[quiz.status]?.bg,
                        color: statusStyles[quiz.status]?.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '20px',
                        '& .MuiChip-icon': { ml: 1, mr: -0.5 }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Link
                      href="#"
                      underline="none"
                      sx={{
                        color: '#00A3FF',
                        fontWeight: 600,
                        fontSize: 14,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Chỉnh sửa
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {totalFiltered === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">Không tìm thấy bài kiểm tra nào phù hợp</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', background: '#fff' }}>
            <Typography variant="body2" color="#64748B">
              Hiển thị {totalFiltered > 0 ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, totalFiltered)} của {totalFiltered} bài kiểm tra
            </Typography>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
              size="small"
              sx={{
                '& .Mui-selected': { background: '#00A3FF !important' },
                '& .MuiPaginationItem-root': { fontWeight: 600 }
              }}
            />
          </Box>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Quiz;
