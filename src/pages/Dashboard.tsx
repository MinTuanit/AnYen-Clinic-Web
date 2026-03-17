import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Select, MenuItem,
  InputBase, Badge, Avatar, CircularProgress
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import Grid from '@mui/material/Grid';
import StatCard from '../components/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { doctorService } from '../services/doctorService';
import { patientService } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';

const barData = [
  { month: 'Tháng 1', revenue: 420 },
  { month: 'Tháng 2', revenue: 380 },
  { month: 'Tháng 3', revenue: 510 },
  { month: 'Tháng 4', revenue: 460 },
  { month: 'Tháng 5', revenue: 720 },
  { month: 'Tháng 6', revenue: 590 },
];

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} ry={6} />;
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalRevenue: '0',
    doctorCount: '0',
    patientCount: '0',
    newAppointments: '0'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [doctors, patients, appointments] = await Promise.all([
        doctorService.getAllDoctors(),
        patientService.getAllPatients(),
        appointmentService.getAllAppointmentAdmin()
      ]);

      const totalRev = appointments.reduce((sum: number, app: any) => {
        // Simple calculation: sum of all paid payments
        return sum + (app.payment?.total_paid || 0);
      }, 0);

      setStatsData({
        totalRevenue: new Intl.NumberFormat('vi-VN').format(totalRev),
        doctorCount: doctors.length.toString(),
        patientCount: patients.length.toString(),
        newAppointments: appointments.filter((app: any) => app.status === 'Pending').length.toString()
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Tổng doanh thu', subLabel: 'VND', value: statsData.totalRevenue, change: '+12.5%', icon: <DashboardIcon />, iconBg: '#EBF5FF' },
    { label: 'Số lượng Bác sĩ', subLabel: 'người', value: statsData.doctorCount, change: '+2%', icon: <LocalHospitalIcon />, iconBg: '#E8F8F1' },
    { label: 'Tổng số Bệnh nhân', subLabel: 'người', value: statsData.patientCount, change: '+5.2%', icon: <PeopleIcon />, iconBg: '#F5EEF8' },
    { label: 'Lịch hẹn chờ duyệt', subLabel: '', value: statsData.newAppointments, change: '', icon: <CalendarTodayIcon />, iconBg: '#FEF5E7' },
  ];
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F4F6F9' }}>
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} fontSize={20}>Bảng điều khiển</Typography>
            <Typography color="text.secondary" fontSize={13}>
              {(() => {
                const today = new Date();
                const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
                const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
                const dayOfWeek = days[today.getDay()];
                const day = today.getDate();
                const month = months[today.getMonth()];
                return `Chào mừng trở lại, hôm nay là ${dayOfWeek}, ${day} ${month}, năm ${today.getFullYear()} `;
              })()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Paper sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: 2, boxShadow: 'none', border: '1px solid #E8ECF0', width: 200 }}>
              <SearchIcon sx={{ color: '#8A9BB2', mr: 1, fontSize: 18 }} />
              <InputBase placeholder="Tìm kiếm dữ liệu..." sx={{ fontSize: 13, flex: 1 }} />
            </Paper>
            <Badge badgeContent={3} color="error">
              <Avatar sx={{ bgcolor: '#EBF5FF', width: 36, height: 36 }}>
                <NotificationsNoneIcon sx={{ color: '#2D9CDB', fontSize: 20 }} />
              </Avatar>
            </Badge>
          </Box>
        </Box>

        {/* Stats Cards */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3} mb={4}>
            {statCards.map((stat) => (
              <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard {...stat} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Charts Row */}
        <Grid container spacing={3} mb={3}>
          {/* Bar Chart */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none', background: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography fontWeight={700} fontSize={15}>Biểu đồ doanh thu theo tháng</Typography>
                <Select size="small" defaultValue="6" sx={{ fontSize: 13, height: 32 }}>
                  <MenuItem value="6">6 tháng qua</MenuItem>
                  <MenuItem value="12">12 tháng qua</MenuItem>
                </Select>
              </Box>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barCategoryGap="30%" barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#8A9BB2' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 13, fill: '#8A9BB2' }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 14 }}
                  />
                  <Bar dataKey="revenue" shape={<CustomBar />}>
                    {barData.map((entry, idx) => (
                      <Cell key={`bar-${idx}`} fill={entry.month === 'Tháng 5' ? '#2D9CDB' : '#D6EEFF'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
