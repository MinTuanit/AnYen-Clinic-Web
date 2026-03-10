import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  Button,
  Avatar,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { Scale, ScoreRange } from '../types/QuizTypes';

interface QuizResultRangesProps {
  scales: Scale[];
  onAddRange: (scaleName: string) => void;
  onRemoveRange: (scaleName: string, rangeId: number) => void;
  onUpdateRange: (scaleName: string, rangeId: number, field: keyof ScoreRange, value: any) => void;
}

const QuizResultRanges: React.FC<QuizResultRangesProps> = ({
  scales,
  onAddRange,
  onRemoveRange,
  onUpdateRange,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ color: '#00A3FF' }} />
          <Typography sx={{ fontWeight: 700, color: '#00A3FF' }}>Phân loại kết quả đánh giá (Feedback Ranges)</Typography>
        </Box>
      </Box>

      <Stack spacing={4}>
        {scales.map((scale, sIdx) => (
          <Box key={sIdx}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#00A3FF' }}>{sIdx + 1}</Avatar>
                Thang đo: {scale.name}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => onAddRange(scale.name)}
                sx={{ textTransform: 'none', borderRadius: '10px' }}
              >
                Thêm mức điểm
              </Button>
            </Box>

            <Stack spacing={2}>
              {scale.ranges.map((range) => (
                <Paper key={range.id} sx={{ p: 3, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <TextField
                      placeholder="TÊN MỨC ĐỘ (VD: NGUY CƠ CAO)"
                      size="small"
                      value={range.label}
                      onChange={(e) => onUpdateRange(scale.name, range.id, 'label', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          background: '#F0F9FF',
                          '& input': { color: '#00A3FF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        type="number"
                        size="small"
                        value={range.minScore}
                        onChange={(e) => onUpdateRange(scale.name, range.id, 'minScore', parseInt(e.target.value) || 0)}
                        sx={{ width: 80, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                      <Typography variant="body2" color="text.secondary">đến</Typography>
                      <TextField
                        type="number"
                        size="small"
                        value={range.maxScore}
                        onChange={(e) => onUpdateRange(scale.name, range.id, 'maxScore', parseInt(e.target.value) || 0)}
                        sx={{ width: 80, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                      <Typography variant="body2" color="text.secondary">điểm</Typography>
                      <IconButton color="error" onClick={() => onRemoveRange(scale.name, range.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748B', display: 'block', mb: 1, textTransform: 'uppercase' }}>
                    Nội dung đánh giá hiển thị (Evaluation Text)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Nhập nội dung tư vấn/đánh giá cho mức điểm này..."
                    value={range.feedbackText}
                    onChange={(e) => onUpdateRange(scale.name, range.id, 'feedbackText', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: '#F8FAFC' } }}
                  />
                </Paper>
              ))}
              {scale.ranges.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 3, background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #E2E8F0' }}>
                  <Typography variant="body2" color="text.secondary">Chưa có mức điểm nào cho tiêu chí này. Hãy thêm mức điểm để hiển thị kết quả.</Typography>
                </Box>
              )}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default QuizResultRanges;
