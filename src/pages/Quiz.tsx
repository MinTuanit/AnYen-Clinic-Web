import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { quizService } from '../services/quizService';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';

const statusStyles: Record<string, { bg: string, color: string, dot: string }> = {
  'Hoạt động': { bg: '#F0FDF4', color: '#16A34A', dot: '#22C55E' },
  'Ngừng hoạt động': { bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' },
};

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

  const pageSize = 5;

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await quizService.getAllTests();
      if (response.err === 0) {
        setQuizzes(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleDeleteClick = (quiz: any) => {
    setSelectedQuiz(quiz);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedQuiz) {
      try {
        const response = await quizService.deleteTest(selectedQuiz.test_id);
        if (response.err === 0) {
          await fetchQuizzes();
        }
      } catch (error) {
        console.error('Failed to delete quiz:', error);
      }
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    // Search filter
    const searchMatch = (quiz.test_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (quiz.test_id?.toLowerCase() || '').includes(searchQuery.toLowerCase());

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
    if (sortBy === 'newest') return (b.test_id || '').localeCompare(a.test_id || '');
    if (sortBy === 'oldest') return (a.test_id || '').localeCompare(b.test_id || '');
    if (sortBy === 'questions-desc') return (b.questions?.length || 0) - (a.questions?.length || 0);
    if (sortBy === 'questions-asc') return (a.questions?.length || 0) - (b.questions?.length || 0);
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
            <MenuItem value="all">Mọi Đối tượng</MenuItem>
            <MenuItem value="adult">Người trưởng thành</MenuItem>
            <MenuItem value="child">Trẻ em</MenuItem>
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
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Tác giả</TableCell>
                <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Trạng thái</TableCell>
                <TableCell align="center" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && pagedQuizzes.map((quiz) => (
                <TableRow key={quiz.test_id} sx={{ '&:hover': { background: '#F1F5F9' }, transition: '0.2s' }}>
                  <TableCell sx={{ py: 2 }}>
                    <Typography fontWeight={600} color="#1E293B" fontSize={14}>{quiz.test_name}</Typography>
                    <Typography color="#64748B" fontSize={12}>Mã test: {quiz.test_id?.slice(0, 8)}...</Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#475569', fontSize: 14 }}>{(quiz.questions || []).length} câu</TableCell>
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
                  <TableCell sx={{ color: '#475569', fontSize: 14 }}>{quiz.creator?.name || 'Hệ thống'}</TableCell>
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        onClick={() => navigate(`/quiz/edit/${quiz.test_id}`)}
                        size="small"
                        sx={{ color: '#00A3FF' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(quiz)}
                        size="small"
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && totalFiltered === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">Không tìm thấy bài kiểm tra nào phù hợp</Typography>
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
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

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedQuiz?.test_name}
        title="Xóa bài kiểm tra"
        message="Bạn có chắc chắn muốn xóa bài kiểm tra này? Hành động này sẽ xóa vĩnh viễn tất cả câu hỏi và kết quả liên quan."
      />
    </Box>
  );
};

export default Quiz;
