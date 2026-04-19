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
import { orderService } from '../services/orderService';

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
    newAppointments: '0',
    revenueChange: '',
    patientChange: '',
    doctorChange: '',
    appointmentChange: ''
  });
  const [monthRange, setMonthRange] = useState(6);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [monthRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [doctors, patients, appointments, orders] = await Promise.all([
        doctorService.getAllDoctors(),
        patientService.getAllPatients(),
        appointmentService.getAllAppointmentAdmin(),
        orderService.getAllOrders()
      ]);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const lastMonth = lastMonthDate.getMonth();
      const lastMonthYear = lastMonthDate.getFullYear();

      // Helper to calculate monthly totals
      const getMonthlyStats = (month: number, year: number) => {
        const monthlyAppointments = appointments.filter((app: any) => {
          const d = new Date(app.appointment_date || app.createdAt);
          return d.getMonth() === month && d.getFullYear() === year;
        });
        const monthlyOrders = orders.filter((order: any) => {
          const d = new Date(order.createdAt);
          return d.getMonth() === month && d.getFullYear() === year;
        });
        
        const revenue = 
          monthlyAppointments.reduce((sum: number, app: any) => sum + Number(app.payment?.total_paid || 0), 0) +
          monthlyOrders.reduce((sum: number, order: any) => sum + Number(order.payment?.total_paid || 0), 0);

        return { revenue, appointmentsCount: monthlyAppointments.length };
      };

      const currentMonthStats = getMonthlyStats(currentMonth, currentYear);
      const lastMonthStats = getMonthlyStats(lastMonth, lastMonthYear);

      // Revenue Change
      const revChange = lastMonthStats.revenue > 0 
        ? ((currentMonthStats.revenue - lastMonthStats.revenue) / lastMonthStats.revenue * 100).toFixed(1)
        : '+0';
      
      // Patient Growth (total patients)
      const patientsThisMonth = patients.filter((p: any) => {
        const d = new Date(p.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length;
      const patientChange = patients.length > 0
        ? ((patientsThisMonth / (patients.length - patientsThisMonth || 1)) * 100).toFixed(1)
        : '+0';

      setStatsData({
        totalRevenue: new Intl.NumberFormat('vi-VN').format(currentMonthStats.revenue), // Show current month revenue
        doctorCount: doctors.length.toString(),
        patientCount: patients.length.toString(),
        newAppointments: appointments.filter((app: any) => app.status === 'Pending').length.toString(),
        revenueChange: `${Number(revChange) >= 0 ? '+' : ''}${revChange}%`,
        patientChange: `+${patientChange}%`,
        doctorChange: '+0%', // Doctors don't change much
        appointmentChange: ''
      });

      // Generate chart data
      const chartRows: any[] = [];
      for (let i = monthRange - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const stats = getMonthlyStats(d.getMonth(), d.getFullYear());
        
        chartRows.push({
          month: `Tháng ${d.getMonth() + 1}`,
          revenue: stats.revenue / 1000,
          actualRevenue: stats.revenue
        });
      }
      setChartData(chartRows);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Doanh thu tháng này', subLabel: 'VND', value: statsData.totalRevenue, change: statsData.revenueChange, icon: <DashboardIcon />, iconBg: '#EBF5FF' },
    { label: 'Số lượng Bác sĩ', subLabel: 'người', value: statsData.doctorCount, change: statsData.doctorChange, icon: <LocalHospitalIcon />, iconBg: '#E8F8F1' },
    { label: 'Tổng số Bệnh nhân', subLabel: 'người', value: statsData.patientCount, change: statsData.patientChange, icon: <PeopleIcon />, iconBg: '#F5EEF8' },
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
                <Select 
                  size="small" 
                  value={monthRange.toString()} 
                  onChange={(e) => setMonthRange(Number(e.target.value))}
                  sx={{ fontSize: 13, height: 32 }}
                >
                  <MenuItem value="6">6 tháng qua</MenuItem>
                  <MenuItem value="12">12 tháng qua</MenuItem>
                </Select>
              </Box>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barCategoryGap="30%" barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#8A9BB2' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 13, fill: '#8A9BB2' }} axisLine={false} tickLine={false} width={45} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 14 }}
                    formatter={(value: any) => [new Intl.NumberFormat('vi-VN').format(Number(value) * 1000) + ' đ', 'Doanh thu']}
                  />
                  <Bar dataKey="revenue" shape={<CustomBar />}>
                    {chartData.map((_, idx) => (
                      <Cell key={`bar-${idx}`} fill={idx === chartData.length - 1 ? '#2D9CDB' : '#D6EEFF'} />
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
