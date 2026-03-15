import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Container,
  Select,
  MenuItem,
  Link
} from '@mui/material';
import {
  Phone,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const countries = [
  { code: '+84', flag: 'https://flagcdn.com/w20/vn.png', name: 'VN' },
  { code: '+1', flag: 'https://flagcdn.com/w20/us.png', name: 'US' },
  { code: '+44', flag: 'https://flagcdn.com/w20/gb.png', name: 'UK' },
  { code: '+33', flag: 'https://flagcdn.com/w20/fr.png', name: 'FR' },
  { code: '+49', flag: 'https://flagcdn.com/w20/de.png', name: 'DE' },
];

const Login: React.FC = () => {
  const [phoneInput, setPhoneInput] = useState('');
  const [countryCode, setCountryCode] = useState('+84');
  const phoneNumber = countryCode + phoneInput;
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
        justifyContent: 'center',
        bgcolor: '#fff',
      }}
    >
      <Container maxWidth="xs" sx={{ px: 2 }}>
        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: 4,
            boxShadow: '0 4px 24px 0 rgba(60,72,100,0.10)',
            px: { xs: 2, sm: 4 },
            py: { xs: 3, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 420,
            mx: 'auto',
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: '#2DA0E8', mb: 5, textAlign: 'center' }}
          >
            Đăng nhập
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {/* Phone Input */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #B0BEC5',
                borderRadius: '4px',
                height: 52,
                mb: 2.5,
                px: 1.5,
              }}
            >
              <Phone sx={{ color: '#90CAF9', mr: 1, fontSize: 26 }} />

              <Select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                variant="standard"
                disableUnderline
                renderValue={(value) => {
                  const country = countries.find(c => c.code === value) || countries[0];
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <img src={country.flag} alt={country.name} style={{ width: 22, height: 15, borderRadius: 2 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{country.code}</Typography>
                    </Box>
                  );
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 1.5,
                  '.MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    paddingRight: '22px !important',
                    gap: 0.5,
                  },
                }}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code} sx={{ display: 'flex', gap: 1.5 }}>
                    <img src={country.flag} alt={country.name} style={{ width: 22, height: 15, borderRadius: 2 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{country.code}</Typography>
                  </MenuItem>
                ))}
              </Select>

              <TextField
                fullWidth
                placeholder="Nhập số điện thoại"
                value={phoneInput}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPhoneInput(value);
                }}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '1rem', color: '#475569', '&::placeholder': { color: '#90CAF9' } }
                }}
              />
            </Box>

            {/* Password Input */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #B0BEC5',
                borderRadius: '4px',
                height: 52,
                mb: 1.5,
                px: 1.5,
              }}
            >
              <Lock sx={{ color: '#9E9E9E', mr: 1.5, fontSize: 26 }} />
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '1rem', color: '#475569' }
                }}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="small"
                sx={{ color: '#9E9E9E' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>

            {/* Forgot Password */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
              <Link
                href="#"
                underline="none"
                onClick={(e) => e.preventDefault()}
                sx={{
                  color: '#2CA0E6',
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  fontStyle: 'italic'
                }}
              >
                Quên mật khẩu
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: '4px',
                bgcolor: '#2CA0E6',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                mb: 2,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#228ED0',
                  boxShadow: 'none',
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Đăng nhập'
              )}
            </Button>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body1" sx={{ color: '#9E9E9E', fontStyle: 'italic' }}>
                Chưa có tài khoản?{' '}
                <Link
                  href="#"
                  underline="none"
                  onClick={(e) => e.preventDefault()}
                  sx={{ color: '#2CA0E6', fontWeight: 400, fontStyle: 'italic' }}
                >
                  Đăng ký
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
