import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Question, Scale } from '../types/QuizTypes';

interface QuizQuestionProps {
  question: Question;
  index: number;
  scales: Scale[];
  onRemove: (id: number) => void;
  onTextChange: (id: number, text: string) => void;
  onScaleChange: (id: number, scale: string) => void;
  onOptionTextChange: (qId: number, optIdx: number, text: string) => void;
  onOptionScoreChange: (qId: number, optIdx: number, value: string) => void;
  onAddOption: (qId: number) => void;
  onRemoveOption: (qId: number, optIdx: number) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  index,
  scales,
  onRemove,
  onTextChange,
  onScaleChange,
  onOptionTextChange,
  onOptionScoreChange,
  onAddOption,
  onRemoveOption,
}) => {
  return (
    <Paper sx={{
      p: 3,
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: 'none',
      borderLeft: index === 0 ? '4px solid #00A3FF' : '1px solid #E2E8F0'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Chip label={`Câu hỏi ${index + 1}`} sx={{ background: '#E0F2FE', color: '#00A3FF', fontWeight: 600, borderRadius: '8px', height: 28 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Tiêu chí đánh giá</InputLabel>
            <Select
              label="Tiêu chí đánh giá"
              value={question.scale}
              onChange={(e) => onScaleChange(question.id, e.target.value)}
              sx={{ borderRadius: '10px' }}
            >
              {scales.map((s, i) => (
                <MenuItem key={i} value={s.name}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={() => onRemove(question.id)} sx={{ color: '#64748B' }}>
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}>Nội dung câu hỏi</Typography>
          <TextField
            fullWidth
            placeholder="Nhập câu hỏi tại đây..."
            value={question.text}
            onChange={(e) => onTextChange(question.id, e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#F8FAFC' } }}
          />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {question.options.map((opt, optIdx) => (
            <Box key={optIdx} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#F1F5F9', color: '#64748B' }}>
                  {String.fromCharCode(65 + optIdx)}
                </Avatar>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={`Lựa chọn ${String.fromCharCode(65 + optIdx)}`}
                  value={opt.text}
                  onChange={(e) => onOptionTextChange(question.id, optIdx, e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', background: '#F8FAFC' } }}
                />
                <TextField
                  size="small"
                  type="number"
                  label="Điểm"
                  value={opt.score}
                  onChange={(e) => onOptionScoreChange(question.id, optIdx, e.target.value)}
                  inputProps={{ min: 0 }}
                  sx={{ width: 70, '& .MuiOutlinedInput-root': { borderRadius: '10px', background: '#F8FAFC' } }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemoveOption(question.id, optIdx)}
                  disabled={question.options.length <= 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}

          {/* Add Option Button */}
          <Box
            onClick={() => onAddOption(question.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              borderRadius: '10px',
              border: '1px dashed #E2E8F0',
              cursor: 'pointer',
              '&:hover': { background: '#F8FAFC' }
            }}
          >
            <AddIcon fontSize="small" sx={{ color: '#00A3FF' }} />
            <Typography variant="caption" sx={{ color: '#00A3FF', fontWeight: 600 }}>Thêm lựa chọn</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

const Chip = ({ label, sx }: { label: string, sx: any }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.5, ...sx }}>
    <Typography variant="caption" sx={{ fontWeight: 600 }}>{label}</Typography>
  </Box>
);

export default QuizQuestion;
