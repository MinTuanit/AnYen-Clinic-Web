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
import LogoutIcon from '@mui/icons-material/Logout';

const navItems = [
  { label: 'Tổng quan', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
  { label: 'Lịch hẹn', icon: <CalendarTodayIcon fontSize="small" />, path: '/appointments' },
  { label: 'Bệnh nhân', icon: <PeopleIcon fontSize="small" />, path: '/patients' },
  { label: 'Bác sĩ', icon: <LocalHospitalIcon fontSize="small" />, path: '/doctors' },
  { label: 'Thuốc', icon: <MedicationIcon fontSize="small" />, path: '/medicines' },
  { label: 'Voucher', icon: <ConfirmationNumberIcon fontSize="small" />, path: '/vouchers' },
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
        width: 220, background: '#fff', p: '16px 8px',
        borderRight: '1px solid #F0F0F0', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0,
      }}
    >
      <Box>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: '#2D9CDB', width: 32, height: 32, fontSize: 16 }}>A</Avatar>
          <Box>
            <Typography fontWeight={700} fontSize={15} lineHeight={1.1}>AnYen</Typography>
            <Typography fontSize={11} color="text.secondary">Clinic · Admin</Typography>
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
                  borderRadius: 2, mb: 0.5, px: 2,
                  '&.Mui-selected': { background: '#EBF5FF', color: '#2D9CDB' },
                  '&.Mui-selected .MuiListItemIcon-root': { color: '#2D9CDB' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: '#8A9BB2' }}>{nav.icon}</ListItemIcon>
                <ListItemText primary={nav.label} primaryTypographyProps={{ fontSize: 13, fontWeight: currentPath === nav.path ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {/* User */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, pt: 2, borderTop: '1px solid #F0F0F0' }}>
        <Avatar sx={{ bgcolor: '#8A9BB2', width: 32, height: 32, fontSize: 13 }}>NV</Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={600} fontSize={13} noWrap>Nguyễn Văn A</Typography>
          <Typography fontSize={11} color="text.secondary">Quản trị viên</Typography>
        </Box>
        <Button sx={{ minWidth: 0, p: 0.5 }}><LogoutIcon fontSize="small" color="action" /></Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
