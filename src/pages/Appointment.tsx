import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

const pageSizeOptions: number[] = [5, 10, 20, 50];

const appointments = [
  {
    id: 'LH-2041',
    patient: { name: 'Nguyễn Văn An', initials: 'NA' },
    doctor: 'BS. Trần Thu Hà',
    date: '24/10/2023',
    time: '08:30',
    status: 'Wait',
  },
  {
    id: 'LH-2042',
    patient: { name: 'Lê Thị Bình', initials: 'LB' },
    doctor: 'BS. Nguyễn Minh Tuấn',
    date: '24/10/2023',
    time: '09:00',
    status: 'Confirmed',
  },
  {
    id: 'LH-2039',
    patient: { name: 'Phạm Hồng Cường', initials: 'PC' },
    doctor: 'BS. Trần Thu Hà',
    date: '23/10/2023',
    time: '15:00',
    status: 'Completed',
  },
  {
    id: 'LH-2040',
    patient: { name: 'Hoàng Văn Dũng', initials: 'HD' },
    doctor: 'BS. Lê Thị Mai',
    date: '23/10/2023',
    time: '15:30',
    status: 'Cancelled',
  },
  {
    id: 'LH-2041',
    patient: { name: 'Nguyễn Văn An', initials: 'NA' },
    doctor: 'BS. Trần Thu Hà',
    date: '24/10/2023',
    time: '08:30',
    status: 'Wait',
  },
  {
    id: 'LH-2042',
    patient: { name: 'Lê Thị Bình', initials: 'LB' },
    doctor: 'BS. Nguyễn Minh Tuấn',
    date: '24/10/2023',
    time: '09:00',
    status: 'Confirmed',
  },
  {
    id: 'LH-2039',
    patient: { name: 'Phạm Hồng Cường', initials: 'PC' },
    doctor: 'BS. Trần Thu Hà',
    date: '23/10/2023',
    time: '15:00',
    status: 'Completed',
  },
  {
    id: 'LH-2040',
    patient: { name: 'Hoàng Văn Dũng', initials: 'HD' },
    doctor: 'BS. Lê Thị Mai',
    date: '23/10/2023',
    time: '15:30',
    status: 'Cancelled',
  },
];


const statusColor: Record<string, "success" | "warning" | "default" | "primary" | "secondary" | "error" | "info"> = {
  Wait: 'warning',
  Confirmed: 'info',
  Completed: 'success',
  Cancelled: 'error',
};

type AppointmentRow = typeof appointments[number];

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 110,
    renderCell: (params: GridRenderCellParams) => (
      <Typography sx={{ color: '#2D9CDB', fontWeight: 600 }}>{`#${params.value}`}</Typography>
    ),
  },
  {
    field: 'patient',
    headerName: 'BỆNH NHÂN',
    width: 200,
    renderCell: (params: GridRenderCellParams<AppointmentRow>) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: '#F2F6FA', color: '#2D9CDB' }}>{params.value.initials}</Avatar>
        <Typography fontSize={14}>{params.value.name}</Typography>
      </Box>
    ),
  },
  { field: 'doctor', headerName: 'BÁC SĨ', width: 180 },
  { field: 'date', headerName: 'NGÀY KHÁM', width: 120 },
  { field: 'time', headerName: 'GIỜ KHÁM', width: 100 },
  {
    field: 'status',
    headerName: 'TRẠNG THÁI',
    width: 130,
    renderCell: (params: GridRenderCellParams<AppointmentRow>) => (
      <Chip label={params.value} color={statusColor[params.value as keyof typeof statusColor]} size="small" />
    ),
  },
  {
    field: 'actions',
    headerName: 'THAO TÁC',
    width: 110,
    sortable: false,
    filterable: false,
    renderCell: () => (
      <Stack direction="row" spacing={1} justifyContent="center">
        <IconButton color="primary" size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton color="error" size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    ),
  },
];


const Appointment: React.FC = () => {
  const [tab, setTab] = React.useState(0);

  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 5 });

  const totalRows = appointments.length;

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F7F9FB' }}>
        <Sidebar />
        <Box sx={{ flex: 1, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
              Quản lý Lịch hẹn
            </Typography>
            <TextField
              size="small"
              placeholder="Tìm bệnh nhân, bác sĩ..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 260, mr: 2 }}
            />
            <Button variant="contained" sx={{ borderRadius: 2, minWidth: 180 }}>
              + Thêm Lịch hẹn mới
            </Button>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="Hôm nay" />
              <Tab label="Tuần này" />
              <Tab label="Tháng này" />
              <Tab label="Tùy chỉnh" />
            </Tabs>
          </Box>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip label="Wait: 12" color="warning" />
            <Chip label="Confirmed: 24" color="info" />
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          </Box>
          <Box sx={{ background: '#fff', borderRadius: 3, p: 2 }}>
            <DataGrid
              autoHeight
              rows={appointments}
              columns={columns}
              pageSizeOptions={pageSizeOptions}
              pagination
              paginationMode="client"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={totalRows}
            />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Appointment;
