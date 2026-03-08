import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';

const mockConversations = [
  // Customers
  { id: 1, name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?u=1', status: 'Đang hoạt động', lastMsg: 'Bác sĩ cho em hỏi về lịch khám...', time: '10:30 AM', online: true, type: 'customer' },
  { id: 2, name: 'Lê Văn C', avatar: 'https://i.pravatar.cc/150?u=2', status: 'Ngoại tuyến', lastMsg: 'Cảm ơn bác sĩ nhiều ạ!', time: 'THỨ 3', online: false, type: 'customer' },
  { id: 3, name: 'Hoàng Thị D', avatar: 'https://i.pravatar.cc/150?u=3', status: 'Ngoại tuyến', lastMsg: 'Tôi muốn đổi lịch hẹn sang chiều.', time: 'THỨ 2', online: false, type: 'customer' },
  { id: 4, name: 'Nguyễn Văn E', avatar: 'https://i.pravatar.cc/150?u=4', status: 'Đang hoạt động', lastMsg: 'Liệu trình này kéo dài bao lâu?', time: '20:15 PM', online: true, type: 'customer' },
  { id: 5, name: 'Phạm Thị F', avatar: 'https://i.pravatar.cc/150?u=5', status: 'Ngoại tuyến', lastMsg: 'Em đã gửi kết quả xét nghiệm.', time: 'HÔM QUA', online: false, type: 'customer' },

  // Doctors
  { id: 101, name: 'BS. Nguyễn Minh Tuấn', avatar: 'https://i.pravatar.cc/150?u=101', status: 'Đang hoạt động', lastMsg: 'Chào đồng nghiệp, ca trực tối nay thế nào?', time: '09:00 AM', online: true, type: 'doctor' },
  { id: 102, name: 'BS. Trần Thu Hà', avatar: 'https://i.pravatar.cc/150?u=102', status: 'Trong cuộc họp', lastMsg: 'Gửi tôi bệnh án của bệnh nhân An nhé.', time: 'HÔM QUA', online: false, type: 'doctor' },
  { id: 103, name: 'BS. Lê Thị Mai', avatar: 'https://i.pravatar.cc/150?u=103', status: 'Ngoại tuyến', lastMsg: 'Ok, cảm ơn bác sĩ.', time: 'THỨ 6', online: false, type: 'doctor' },
];

const mockMessagesByConversation: Record<number, any[]> = {
  1: [
    { id: 1, content: 'Chào bác sĩ, em có thể hỏi về liệu trình sắp tới không ạ? Em thấy trong ứng dụng hiện lịch vào thứ 5 tuần này.', time: '10:28 AM', isMine: false, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, content: 'Chào B, đúng rồi em nhé. Buổi khám tiếp theo của em là 14:30 chiều thứ 5. Em có cần hỗ trợ gì đặc biệt không?', time: '10:30 AM', isMine: true, avatar: 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png' },
    { id: 3, content: 'Bác sĩ cho em hỏi về lịch khám, nếu em đổi sang 16:00 thì có được không ạ?', time: '10:30 AM', isMine: false, avatar: 'https://i.pravatar.cc/150?u=1' },
  ],
  2: [
    { id: 1, content: 'Chào bác sĩ, thuốc hôm trước em uống thấy rất hiệu quả.', time: 'THỨ 3', isMine: false, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 2, content: 'Rất tốt, anh C cứ duy trì liều lượng đó nhé.', time: 'THỨ 3', isMine: true, avatar: 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png' },
    { id: 3, content: 'Vâng, cảm ơn bác sĩ nhiều ạ!', time: 'THỨ 3', isMine: false, avatar: 'https://i.pravatar.cc/150?u=2' },
  ],
  101: [
    { id: 1, content: 'Chào đồng nghiệp, ca trực tối nay thế nào? Có ca nào đặc biệt không?', time: '08:55 AM', isMine: false, avatar: 'https://i.pravatar.cc/150?u=101' },
    { id: 2, content: 'Chào bác sĩ Tuấn, hiện tại mọi thứ vẫn ổn định ạ.', time: '09:00 AM', isMine: true, avatar: 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png' },
  ],
  3: [
    { id: 1, content: 'Tôi muốn đổi lịch hẹn sang chiều thứ 2, bác sĩ xem giúp có trống không?', time: 'THỨ 2', isMine: false, avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 2, content: 'Chào chị D, bác sĩ check lịch thì chiều thứ 2 lúc 15h còn trống ạ.', time: 'THỨ 2', isMine: true, avatar: 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png' },
  ],
  102: [
    { id: 1, content: 'Gửi tôi bệnh án của bệnh nhân An nhé. Tôi cần xem lại chẩn đoán hình ảnh.', time: 'HÔM QUA', isMine: false, avatar: 'https://i.pravatar.cc/150?u=102' },
    { id: 2, content: 'Dạ vâng bác sĩ Hà, em đang chuẩn bị hồ sơ và gửi chị ngay ạ.', time: 'HÔM QUA', isMine: true, avatar: 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png' },
  ]
};

const Chat: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [activeChat, setActiveChat] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');

  const filteredConversations = mockConversations.filter(c =>
    tab === 0 ? c.type === 'customer' : c.type === 'doctor'
  );

  const currentMessages = mockMessagesByConversation[activeChat.id] || [];


  return (
    <Box sx={{ display: 'flex', height: '100vh', background: '#fff', overflow: 'hidden' }}>
      <Sidebar />

      {/* Conversation List */}
      <Box sx={{
        width: 360,
        borderRight: '1px solid #F1F5F9',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff'
      }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', mb: 2 }}>
            Tin nhắn
          </Typography>
          <TextField
            fullWidth
            placeholder="Tìm kiếm cuộc trò chuyện..."
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: '#F1F5F9',
                borderRadius: '12px',
                border: 'none',
                '& fieldset': { border: 'none' }
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }
            }}
          />
        </Box>

        <Box sx={{ px: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => {
              setTab(v);
              const newFiltered = mockConversations.filter(c =>
                v === 0 ? c.type === 'customer' : c.type === 'doctor'
              );
              if (newFiltered.length > 0) setActiveChat(newFiltered[0]);
            }}
            variant="fullWidth"
            sx={{
              minHeight: 40,
              borderBottom: '1px solid #F1F5F9',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: 14, minHeight: 40, color: '#64748B' },
              '& .Mui-selected': { color: '#00A3FF !important' },
              '& .MuiTabs-indicator': { background: '#00A3FF' }
            }}
          >
            <Tab label="Khách hàng" />
            <Tab label="Bác sĩ" />
          </Tabs>
        </Box>

        <List sx={{ flex: 1, overflowY: 'auto', py: 0 }}>
          {filteredConversations.map((conv) => (
            <React.Fragment key={conv.id}>
              <ListItem
                component="div"
                onClick={() => setActiveChat(conv)}
                sx={{
                  cursor: 'pointer',
                  py: 2,
                  px: 3,
                  background: activeChat.id === conv.id ? '#F0F9FF' : 'transparent',
                  borderLeft: activeChat.id === conv.id ? '4px solid #00A3FF' : '4px solid transparent',
                  '&:hover': { background: '#F8FAFC' },
                  transition: '0.2s'
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: conv.online ? '#22C55E' : '#94A3B8',
                        color: conv.online ? '#22C55E' : '#94A3B8',
                        boxShadow: `0 0 0 2px #fff`,
                        width: 10,
                        height: 10,
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <Avatar src={conv.avatar} sx={{ width: 48, height: 48 }} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: 15 }}>{conv.name}</Typography>
                      <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>{conv.time}</Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: activeChat.id === conv.id ? '#475569' : '#64748B',
                        mt: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {conv.lastMsg}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider sx={{ mx: 2, opacity: 0.5 }} />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Chat Window */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
        {/* Chat Header */}
        <Box sx={{
          p: '14px 24px',
          background: '#fff',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={activeChat.avatar} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: 16 }}>{activeChat.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: activeChat.online ? '#22C55E' : '#94A3B8' }} />
                <Typography sx={{ fontSize: 12, color: '#64748B' }}>{activeChat.status}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ color: '#64748B' }}><PhoneIcon fontSize="small" /></IconButton>
            <IconButton sx={{ color: '#64748B' }}><VideocamIcon fontSize="small" /></IconButton>
            <IconButton sx={{ color: '#64748B' }}><MoreVertIcon fontSize="small" /></IconButton>
          </Box>
        </Box>

        {/* Message History */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', background: '#F1F5F9', px: 1.5, py: 0.5, borderRadius: '6px', textTransform: 'uppercase' }}>
              Hôm nay
            </Typography>
          </Box>

          {currentMessages.map((msg: any) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.isMine ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, maxWidth: '70%', alignItems: 'flex-start', flexDirection: msg.isMine ? 'row-reverse' : 'row' }}>
                <Avatar src={msg.avatar} sx={{ width: 32, height: 32, mt: 0.5 }} />
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: '12px 16px',
                      borderRadius: msg.isMine ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      background: msg.isMine ? '#00A3FF' : '#fff',
                      color: msg.isMine ? '#fff' : '#1E293B',
                      boxShadow: msg.isMine ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography sx={{ fontSize: 14, lineHeight: 1.5 }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                  <Typography sx={{ fontSize: 10, color: '#94A3B8', mt: 0.5, textAlign: msg.isMine ? 'right' : 'left' }}>
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Message Input */}
        <Box sx={{ p: 3, pt: 0 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            background: '#F1F5F9',
            p: '8px 12px',
            borderRadius: '16px'
          }}>
            <IconButton size="small" sx={{ color: '#64748B' }}><AddCircleIcon /></IconButton>
            <IconButton size="small" sx={{ color: '#64748B' }}><ImageIcon /></IconButton>
            <TextField
              fullWidth
              placeholder="Nhập tin nhắn..."
              variant="standard"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                mx: 1,
                '& .MuiInput-root': { fontSize: 14, color: '#1E293B' },
                '& .MuiInput-underline:before': { borderBottom: 'none !important' },
                '& .MuiInput-underline:after': { borderBottom: 'none !important' }
              }}
            />
            <IconButton
              sx={{
                background: '#00A3FF',
                color: '#fff',
                borderRadius: '10px',
                '&:hover': { background: '#008BD9' }
              }}
              size="small"
            >
              <SendIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
