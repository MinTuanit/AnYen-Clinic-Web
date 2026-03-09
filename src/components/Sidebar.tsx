import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Avatar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';
import ChatIcon from '@mui/icons-material/Chat';
import QuizIcon from '@mui/icons-material/Quiz';
import SettingsIcon from '@mui/icons-material/Settings';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';

const navItems = [
  { label: 'Tổng quan', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
  { label: 'Lịch hẹn', icon: <CalendarTodayIcon fontSize="small" />, path: '/appointments' },
  { label: 'Bệnh nhân', icon: <PeopleIcon fontSize="small" />, path: '/patients' },
  { label: 'Bác sĩ', icon: <LocalHospitalIcon fontSize="small" />, path: '/doctors' },
  { label: 'Thuốc', icon: <MedicationIcon fontSize="small" />, path: '/medicines' },
  { label: 'Voucher', icon: <ConfirmationNumberIcon fontSize="small" />, path: '/vouchers' },
  { label: 'Đơn hàng', icon: <ReceiptLongIcon fontSize="small" />, path: '/orders' },
  { label: 'Chat', icon: <ChatIcon fontSize="small" />, path: '/chat' },
  { label: 'Tạo trắc nghiệm', icon: <QuizIcon fontSize="small" />, path: '/quiz' },
  { label: 'Cài đặt', icon: <SettingsIcon fontSize="small" />, path: '/settings' },
];


const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  return (
    <Box
      sx={{
        width: 240, background: '#fff', p: '24px 12px',
        borderRight: '1px solid #EEF2F6', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0,
      }}
    >
      <Box>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, mb: 4 }}>
          <Avatar sx={{ bgcolor: '#00A3FF', width: 36, height: 36, borderRadius: '8px' }}>
            <Typography fontWeight={900} fontSize={20} color="#fff">A</Typography>
          </Avatar>
          <Box>
            <Typography fontWeight={700} fontSize={16} lineHeight={1.2}>AnYen</Typography>
            <Typography fontSize={12} color="text.secondary">Clinic - Admin</Typography>
          </Box>
        </Box>
        {/* Nav */}
        <List dense disablePadding>
          {navItems.map((nav) => (
            <ListItem key={nav.label} disablePadding>
              <ListItemButton
                selected={currentPath === nav.path}
                onClick={() => navigate(nav.path)}
                sx={{
                  borderRadius: '12px', mb: 0.5, px: 2, py: 1.2,
                  '&.Mui-selected': {
                    background: '#E6F6FF',
                    color: '#00A3FF',
                    '&:hover': { background: '#D6EFFF' }
                  },
                  '&:hover': { background: '#F8F9FA' },
                  '&.Mui-selected .MuiListItemIcon-root': { color: '#00A3FF' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: currentPath === nav.path ? '#00A3FF' : '#64748B' }}>
                  <Box sx={{ display: 'flex', '& svg': { fontSize: 20 } }}>
                    {nav.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={nav.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: currentPath === nav.path ? 600 : 500,
                    color: currentPath === nav.path ? '#00A3FF' : '#64748B'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* User Area */}
      <Box sx={{
        background: '#F8F9FA',
        p: 1.5,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Avatar src="https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png" sx={{ width: 36, height: 36 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={600} fontSize={13} noWrap>Nguyễn Văn A</Typography>
          <Typography fontSize={11} color="text.secondary">Quản trị viên</Typography>
        </Box>
        <Button sx={{ minWidth: 0, p: 0.5, color: '#64748B' }} onClick={() => navigate('/login')}>
          <LogoutIcon sx={{ fontSize: 18 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
