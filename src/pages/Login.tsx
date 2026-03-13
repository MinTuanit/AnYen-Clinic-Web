import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  HealthAndSafety
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !password) {
      showNotification('Vui lòng nhập đầy đủ thông tin', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(phoneNumber, password);
      showNotification('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.mes || 'Số điện thoại hoặc mật khẩu không chính xác';
      showNotification(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 163, 255, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 163, 255, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
        }
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: '24px',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Logo / Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '20px',
              bgcolor: '#00A3FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 10px 15px -3px rgba(0, 163, 255, 0.3)'
            }}
          >
            <HealthAndSafety sx={{ fontSize: 48, color: 'white' }} />
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: '#1E293B', mb: 1, textAlign: 'center' }}
          >
            Chào mừng trở lại
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#64748B', mb: 4, textAlign: 'center' }}
          >
            Hệ thống quản lý phòng khám An Yên
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', mb: 1 }}>
                Số điện thoại
              </Typography>
              <TextField
                fullWidth
                placeholder="Nhập số điện thoại của bạn"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '12px', bgcolor: '#fff' }
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', mb: 1 }}>
                Mật khẩu
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '12px', bgcolor: '#fff' }
                  }
                }}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                bgcolor: '#00A3FF',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 163, 255, 0.4)',
                '&:hover': {
                  bgcolor: '#008BD9',
                  boxShadow: '0 10px 15px -3px rgba(0, 163, 255, 0.4)',
                },
                '&.Mui-disabled': {
                  bgcolor: '#93C5FD',
                  color: '#fff'
                }
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Đăng nhập ngay'
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Bản quyền © 2026 An Yên Clinic.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
