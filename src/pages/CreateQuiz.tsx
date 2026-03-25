import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  Stack,
  MenuItem,
  Select,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Types
import { ScoreRange, Scale, Question } from '../types/QuizTypes';

// Components
import QuizQuestion from '../components/QuizQuestion';
import QuizResultRanges from '../components/QuizResultRanges';
import { quizService } from '../services/quizService';

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const isEditMode = !!testId;

  const [testName, setTestName] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('Mọi đối tượng');
  const [status, setStatus] = useState('Hoạt động');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [scales, setScales] = useState<Scale[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const fetchQuiz = useCallback(async () => {
    if (!testId) return;
    try {
      setFetching(true);
      const response = await quizService.getQuestionSetsByTestId(testId);
      if (response.err === 0) {
        // If response.data is the full test object
        const quizData = Array.isArray(response.data) ? null : response.data;
        // If response.data is just the questions array (as in the provided snippet)
        const questionsArray = Array.isArray(response.data) ? response.data : response.data.questions || [];

        let currentScales: Scale[] = [];

        if (quizData) {
          setTestName(quizData.test_name || '');
          setDescription(quizData.description || '');
          setTarget(quizData.target || 'Mọi đối tượng');
          setStatus(quizData.status || 'Hoạt động');

          currentScales = (quizData.scales || []).map((s: any) => ({
            name: s.scale_name,
            ranges: (s.ranges || []).map((r: any, rIdx: number) => ({
              id: rIdx + 1,
              label: r.label,
              minScore: r.min_score,
              maxScore: r.max_score,
              feedbackText: r.feedback_text
            }))
          }));

          if (currentScales.length === 0) {
            currentScales = [{ name: 'Tiêu chí mặc định', ranges: [] }];
          }
          setScales(currentScales);
        }

        const transformedQuestions: Question[] = (questionsArray || []).map((q: any, idx: number) => ({
          id: idx + 1,
          text: q.question_text || '',
          scale: q.scale?.scale_name || q.scale_name || (currentScales[0]?.name || ''),
          options: (q.answers || []).map((a: any) => ({
            text: a.answer_text || '',
            score: a.score || 0
          }))
        }));
        setQuestions(transformedQuestions);
      }
    } catch (error) {
      console.error('Failed to fetch quiz details:', error);
    } finally {
      setFetching(false);
    }
  }, [testId]);

  useEffect(() => {
    if (isEditMode) {
      fetchQuiz();
    } else {
      // Default empty quiz template
      setScales([{ name: 'Tiêu chí mặc định', ranges: [] }]);
      setQuestions([]);
    }
  }, [isEditMode, fetchQuiz]);

  const addScale = () => {
    setScales([...scales, { name: `Tiêu chí ${scales.length + 1}`, ranges: [] }]);
  };

  const removeScale = (index: number) => {
    const newScales = scales.filter((_, i) => i !== index);
    setScales(newScales);
  };

  const handleScaleNameChange = (index: number, value: string) => {
    const oldName = scales[index].name;
    const newScales = [...scales];
    newScales[index] = { ...newScales[index], name: value };
    setScales(newScales);

    // Update questions using this scale
    setQuestions(questions.map(q => q.scale === oldName ? { ...q, scale: value } : q));
  };

  const addRange = (scaleName: string) => {
    setScales(scales.map(s => {
      if (s.name === scaleName) {
        const newId = s.ranges.length > 0 ? Math.max(...s.ranges.map(r => r.id)) + 1 : 1;
        return {
          ...s,
          ranges: [...s.ranges, { id: newId, label: 'Mức độ mới', minScore: '', maxScore: '', feedbackText: '' }]
        };
      }
      return s;
    }));
  };

  const removeRange = (scaleName: string, rangeId: number) => {
    setScales(scales.map(s => {
      if (s.name === scaleName) {
        return { ...s, ranges: s.ranges.filter(r => r.id !== rangeId) };
      }
      return s;
    }));
  };

  const updateRange = (scaleName: string, rangeId: number, field: keyof ScoreRange, value: any) => {
    setScales(scales.map(s => {
      if (s.name === scaleName) {
        return {
          ...s,
          ranges: s.ranges.map(r => r.id === rangeId ? { ...r, [field]: value } : r)
        };
      }
      return s;
    }));
  };

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, {
      id: newId,
      text: '',
      scale: scales[0]?.name || '',
      options: [
        { text: '', score: '' },
        { text: '', score: '' },
        { text: '', score: '' },
        { text: '', score: '' }
      ]
    }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionTextChange = (id: number, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const handleQuestionScaleChange = (id: number, scale: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, scale } : q));
  };

  const addOption = (qId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: [...q.options, { text: '', score: '' }]
        };
      }
      return q;
    }));
  };

  const removeOption = (qId: number, optIdx: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.filter((_, i) => i !== optIdx)
        };
      }
      return q;
    }));
  };

  const handleOptionTextChange = (qId: number, optIdx: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIdx] = { ...newOptions[optIdx], text };
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleOptionScoreChange = (qId: number, optIdx: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        // Handle empty string and strip leading zeros for positive numbers
        let score: string | number = value;
        if (value !== '' && !isNaN(parseInt(value))) {
          score = parseInt(value);
        }
        newOptions[optIdx] = { ...newOptions[optIdx], score };
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSave = async () => {
    if (!testName.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập tên trắc nghiệm',
        severity: 'error'
      });
      return;
    }

    const quizPayload = {
      test_name: testName,
      description,
      target,
      status,
      scales: scales.map(s => ({
        scale_name: s.name,
        ranges: s.ranges.map(r => ({
          label: r.label,
          min_score: Number(r.minScore),
          max_score: Number(r.maxScore),
          feedback_text: r.feedbackText
        }))
      })),
      questions: questions.map(q => ({
        question_text: q.text,
        scale_name: q.scale,
        answers: q.options.map(o => ({
          answer_text: o.text,
          score: Number(o.score)
        }))
      }))
    };

    try {
      setLoading(true);
      let response;
      if (isEditMode && testId) {
        response = await quizService.updateTest(testId, quizPayload as any);
      } else {
        response = await quizService.createTest(quizPayload as any);
      }

      if (response.err === 0) {
        setSnackbar({
          open: true,
          message: isEditMode ? 'Cập nhật trắc nghiệm thành công!' : 'Tạo trắc nghiệm mới thành công!',
          severity: 'success'
        });
        setTimeout(() => navigate('/quiz'), 1500);
      } else {
        setSnackbar({
          open: true,
          message: response.mes || 'Thao tác thất bại',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Failed to save quiz:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi hệ thống khi lưu trắc nghiệm',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
        <Sidebar />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{
          p: '20px 32px',
          background: '#fff',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/quiz')} sx={{ background: '#F1F5F9', borderRadius: '12px' }}>
              <ArrowBackIcon sx={{ color: '#1E293B' }} />
            </IconButton>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                {isEditMode ? 'Chỉnh sửa trắc nghiệm' : 'Tạo trắc nghiệm tâm lý'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isEditMode ? 'Cập nhật lại thông tin bộ câu hỏi' : 'Thiết lập bộ câu hỏi mới cho bệnh nhân'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content Area */}
        <Box sx={{ p: 4, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* General Info */}
          <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <InfoOutlinedIcon sx={{ color: '#00A3FF' }} />
              <Typography sx={{ fontWeight: 700, color: '#00A3FF' }}>Thông tin chung</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}>Tên trắc nghiệm</Typography>
                <TextField
                  fullWidth
                  placeholder="VD: Đánh giá mức độ trầm cảm (PHQ-9)"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#F8FAFC' } }}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}>Mô tả trắc nghiệm</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Nhập hướng dẫn hoặc mô tả chi tiết bài kiểm tra..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#F8FAFC' } }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}>Đối tượng</Typography>
                  <Select
                    fullWidth
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    sx={{ borderRadius: '12px', background: '#F8FAFC' }}
                  >
                    <MenuItem value="Mọi đối tượng">Mọi đối tượng</MenuItem>
                    <MenuItem value="Người trưởng thành">Người trưởng thành</MenuItem>
                    <MenuItem value="Trẻ em">Trẻ em</MenuItem>
                    <MenuItem value="Phụ nữ sau sinh">Phụ nữ sau sinh</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}>Trạng thái</Typography>
                  <Select
                    fullWidth
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{ borderRadius: '12px', background: '#F8FAFC' }}
                  >
                    <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                    <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
                  </Select>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>Các tiêu chí đánh giá (Thang đo)</Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={addScale} sx={{ textTransform: 'none', fontWeight: 600 }}>Thêm tiêu chí</Button>
                </Box>
                <Stack spacing={1}>
                  {scales.map((scale, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={scale.name}
                        onChange={(e) => handleScaleNameChange(index, e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', background: '#F8FAFC' } }}
                      />
                      <IconButton size="small" color="error" onClick={() => removeScale(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Paper>

          {/* Result Ranges Section */}
          <QuizResultRanges
            scales={scales}
            onAddRange={addRange}
            onRemoveRange={removeRange}
            onUpdateRange={updateRange}
          />

          {/* Question List */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ListAltIcon sx={{ color: '#00A3FF' }} />
                <Typography sx={{ fontWeight: 700, color: '#00A3FF' }}>Danh sách câu hỏi</Typography>
              </Box>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={addQuestion}
                sx={{ textTransform: 'none', fontWeight: 600, color: '#00A3FF' }}
              >
                Thêm câu hỏi mới
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {questions.map((q, qIndex) => (
                <QuizQuestion
                  key={qIndex}
                  question={q}
                  index={qIndex}
                  scales={scales}
                  onRemove={removeQuestion}
                  onTextChange={handleQuestionTextChange}
                  onScaleChange={handleQuestionScaleChange}
                  onOptionTextChange={handleOptionTextChange}
                  onOptionScoreChange={handleOptionScoreChange}
                  onAddOption={addOption}
                  onRemoveOption={removeOption}
                />
              ))}

              {/* Add Suggestion area */}
              <Box
                onClick={addQuestion}
                sx={{
                  border: '2px dashed #E2E8F0',
                  borderRadius: '20px',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  '&:hover': { background: '#F8FAFC', borderColor: '#CBD5E1' }
                }}
              >
                <Avatar sx={{ bgcolor: '#94A3B8', width: 32, height: 32 }}>
                  <AddCircleOutlineIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2" color="#64748B" fontWeight={500}>Nhấn để thêm câu hỏi mới</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{
          p: '16px 32px',
          background: '#fff',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 3
        }}>
          <Button onClick={() => navigate('/quiz')} sx={{ textTransform: 'none', color: '#64748B', fontWeight: 600 }}>Hủy bỏ</Button>
          <Button
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            onClick={handleSave}
            sx={{
              textTransform: 'none',
              borderRadius: '12px',
              background: '#00A3FF',
              boxShadow: 'none',
              fontWeight: 700,
              px: 4,
              height: 48,
              '&:hover': { background: '#008BD9', boxShadow: 'none' }
            }}
          >
            {isEditMode ? 'Lưu thay đổi' : 'Hoàn tất & Xuất bản'}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateQuiz;
