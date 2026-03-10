import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Types
import { Answer, ScoreRange, Scale, Question } from '../types/QuizTypes';

// Components
import QuizQuestion from '../components/QuizQuestion';
import QuizResultRanges from '../components/QuizResultRanges';

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [scales, setScales] = useState<Scale[]>([
    {
      name: 'Mức độ lo âu',
      ranges: [
        { id: 1, label: 'Bình thường', minScore: 0, maxScore: 15, feedbackText: 'Kết quả cho thấy các triệu chứng của bạn đang ở mức bình thường...' },
        { id: 2, label: 'Nguy cơ trung bình', minScore: 16, maxScore: 35, feedbackText: 'Cho thấy bạn đang có các triệu chứng lo âu ở mức độ vừa phải...' }
      ]
    },
    { name: 'Trạng thái cảm xúc', ranges: [] }
  ]);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: '',
      scale: 'Mức độ lo âu',
      options: [
        { text: '', score: 0 },
        { text: '', score: 0 },
        { text: '', score: 0 },
        { text: '', score: 0 }
      ]
    },
    {
      id: 2,
      text: '',
      scale: 'Trạng thái cảm xúc',
      options: [
        { text: '', score: 0 },
        { text: '', score: 0 },
        { text: '', score: 0 },
        { text: '', score: 0 }
      ]
    }
  ]);

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
          ranges: [...s.ranges, { id: newId, label: 'Mức độ mới', minScore: 0, maxScore: 0, feedbackText: '' }]
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
        { text: '', score: 0 },
        { text: '', score: 0 },
        { text: '', score: 0 },
        { text: '', score: 0 }
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
          options: [...q.options, { text: '', score: 0 }]
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
    // allow empty string for typing
    if (value === '') {
      setQuestions(questions.map(q => {
        if (q.id === qId) {
          const newOptions = [...q.options];
          newOptions[optIdx] = { ...newOptions[optIdx], score: '' as any };
          return { ...q, options: newOptions };
        }
        return q;
      }));
      return;
    }

    const score = parseInt(value);
    if (isNaN(score) || score < 0) return;

    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIdx] = { ...newOptions[optIdx], score };
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

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
                Tạo trắc nghiệm tâm lý
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Thiết lập bộ câu hỏi mới cho bệnh nhân
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content Area */}
        <Box sx={{ p: 4, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* General Info */}
          <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
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
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#F8FAFC' } }}
                />
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
                  key={q.id}
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
          background: '#F8FAFC',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 3
        }}>
          <Button onClick={() => navigate('/quiz')} sx={{ textTransform: 'none', color: '#1E293B', fontWeight: 600 }}>Hủy bỏ</Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '12px',
              background: '#00A3FF',
              boxShadow: 'none',
              fontWeight: 600,
              px: 4,
              height: 48,
              '&:hover': { background: '#008BD9', boxShadow: 'none' }
            }}
          >
            Hoàn tất & Xuất bản
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateQuiz;
