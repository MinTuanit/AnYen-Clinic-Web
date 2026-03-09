import React from 'react';
import {
  Box, Paper, Typography, Button, Select, MenuItem,
  InputBase, Badge, Chip, Avatar
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import Grid from '@mui/material/Grid';
import StatCard from '../components/StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const pieData = [
  { name: 'Nội tổng quát', value: 40, color: '#2D9CDB' },
  { name: 'Nhi khoa', value: 25, color: '#27AE60' },
  { name: 'Sản phụ khoa', value: 20, color: '#F2994A' },
  { name: 'Khác', value: 15, color: '#BDBDBD' },
];

const barData = [
  { month: 'Tháng 1', revenue: 420 },
  { month: 'Tháng 2', revenue: 380 },
  { month: 'Tháng 3', revenue: 510 },
  { month: 'Tháng 4', revenue: 460 },
  { month: 'Tháng 5', revenue: 720 },
  { month: 'Tháng 6', revenue: 590 },
];

const stats = [
  { label: 'Tổng doanh thu', subLabel: 'VND', value: '1.250.000.000', change: '+12.5%', icon: <DashboardIcon />, iconBg: '#EBF5FF' },
  { label: 'Số lượng Bác sĩ', subLabel: 'người', value: '45', change: '+2%', icon: <LocalHospitalIcon />, iconBg: '#E8F8F1' },
  { label: 'Tổng số Bệnh nhân', subLabel: 'người', value: '1.200', change: '+5.2%', icon: <PeopleIcon />, iconBg: '#F5EEF8' },
  { label: 'Lịch khám mới', subLabel: '', value: '28', change: '-15%', icon: <CalendarTodayIcon />, iconBg: '#FEF5E7' },
];

const transactions = [
  { name: 'Nguyễn Văn Hùng', initials: 'NH', service: 'Khám tổng quát', doctor: 'Dr. Lê Minh Tâm', time: '09:30', date: '24/05/2024', amount: '500.000đ', status: 'Hoàn tất', statusColor: 'success', avatarBg: '#2D9CDB' },
  { name: 'Trần Thị Lan', initials: 'TL', service: 'Siêu âm thai', doctor: 'Dr. Hoàng Mỹ Linh', time: '10:15', date: '24/05/2024', amount: '850.000đ', status: 'Đang chờ', statusColor: 'warning', avatarBg: '#9B59B6' },
  { name: 'Phạm Tuấn Anh', initials: 'PA', service: 'Xét nghiệm máu', doctor: 'Dr. Trần Đức Anh', time: '08:45', date: '24/05/2024', amount: '1.200.000đ', status: 'Hoàn tất', statusColor: 'success', avatarBg: '#E67E22' },
];


const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} ry={6} />;
};

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F4F6F9' }}>
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} fontSize={20}>Bảng điều khiển</Typography>
            <Typography color="text.secondary" fontSize={13}>Chào mừng trở lại, hôm nay là Thứ Hai, 24 Tháng 5.</Typography>
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
        <Grid container spacing={3} mb={4}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={2} mb={3}>
          {/* Bar Chart */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none', background: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography fontWeight={700} fontSize={15}>Biểu đồ doanh thu theo tháng</Typography>
                <Select size="small" defaultValue="6" sx={{ fontSize: 13, height: 32 }}>
                  <MenuItem value="6">6 tháng qua</MenuItem>
                  <MenuItem value="12">12 tháng qua</MenuItem>
                </Select>
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} barCategoryGap="35%" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8A9BB2' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8A9BB2' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13 }}

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

          {/* Pie Chart */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none', background: '#fff', height: '100%' }}>
              <Typography fontWeight={700} fontSize={15} mb={1}>Phân bổ chuyên khoa</Typography>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={45} paddingAngle={2}>
                      {pieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <Typography fontWeight={700} fontSize={18} lineHeight={1}>1,2k</Typography>
                  <Typography fontSize={10} color="text.secondary">TỔNG CỘNG</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 1 }}>
                {pieData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: item.color, borderRadius: '50%', flexShrink: 0 }} />
                      <Typography fontSize={12}>{item.name}</Typography>
                    </Box>
                    <Typography fontSize={12} fontWeight={600}>{item.value}%</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Transactions Table */}
        <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none', background: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography fontWeight={700} fontSize={15}>Giao dịch & Hoạt động mới</Typography>
            <Button size="small" sx={{ color: '#2D9CDB', fontWeight: 600, fontSize: 13 }}>Xem tất cả</Button>
          </Box>
          {/* Table Header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.8fr 1.5fr 1.2fr 1fr', gap: 2, px: 1.5, pb: 1, borderBottom: '1px solid #F0F0F0' }}>
            {['BỆNH NHÂN', 'DỊCH VỤ', 'BÁC SĨ PHỤ TRÁCH', 'NGÀY THỰC HIỆN', 'SỐ TIỀN', 'TRẠNG THÁI'].map((h) => (
              <Typography key={h} fontSize={11} fontWeight={600} color="text.secondary">{h}</Typography>
            ))}
          </Box>
          {/* Table Rows */}
          {transactions.map((row) => (
            <Box
              key={row.name}
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1.8fr 1.5fr 1.2fr 1fr',
                gap: 2, px: 1.5, py: 1.5, alignItems: 'center',
                borderBottom: '1px solid #F8FAFB',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: row.avatarBg, fontSize: 11, fontWeight: 700 }}>{row.initials}</Avatar>
                <Typography fontSize={13} fontWeight={600}>{row.name}</Typography>
              </Box>
              <Typography fontSize={13} color="text.secondary">{row.service}</Typography>
              <Box>
                <Typography fontSize={13}>{row.doctor}</Typography>
                <Typography fontSize={11} color="text.secondary">{row.time}</Typography>
              </Box>
              <Typography fontSize={13} color="text.secondary">{row.date}</Typography>
              <Typography fontSize={13} fontWeight={600}>{row.amount}</Typography>
              <Chip
                label={row.status}
                size="small"
                sx={{
                  fontSize: 11, fontWeight: 600,
                  bgcolor: row.statusColor === 'success' ? '#E8F8F1' : '#FEF5E7',
                  color: row.statusColor === 'success' ? '#27AE60' : '#E67E22',
                  height: 24,
                }}
              />
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
