import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { chatService } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';
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

// Chat component
const Chat: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const fetchMessages = async (convId: string) => {
    try {
      const res = await chatService.getSupportConversationMessages(convId);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await chatService.getAllSupportConversations();
      if (res.err === 0) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeChat) {
          setActiveChat(res.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
    }
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;
    try {
      const res = await chatService.sendMessageText({
        conversation_id: activeChat.id,
        content: message
      });
      if (res.err === 0) {
        setMessage('');
        fetchMessages(activeChat.id);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const filteredConversations = conversations.filter((c: any) => {
    const role = c.user1Info?.role_value;
    if (tab === 0) return role === 'patient';
    return role === 'doctor' || role === 'admin'; // Admin might chat with admin for support too
  });

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
              const newFiltered = conversations.filter((c: any) => {
                const role = c.user1Info?.role_value;
                return v === 0 ? role === 'patient' : (role === 'doctor' || role === 'admin');
              });
              if (newFiltered.length > 0) setActiveChat(newFiltered[0]);
              else setActiveChat(null);
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
                  background: activeChat?.id === conv.id ? '#F0F9FF' : 'transparent',
                  borderLeft: activeChat?.id === conv.id ? '4px solid #00A3FF' : '4px solid transparent',
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
                        backgroundColor: conv.online || conv.user1Info?.active_status ? '#22C55E' : '#94A3B8',
                        color: conv.online || conv.user1Info?.active_status ? '#22C55E' : '#94A3B8',
                        boxShadow: `0 0 0 2px #fff`,
                        width: 10,
                        height: 10,
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <Avatar src={conv.avatar || conv.user1Info?.avatar_url} sx={{ width: 48, height: 48 }} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: 15 }}>
                        {conv.user1Info?.role_value === 'doctor' ? 'BS. ' : ''}
                        {conv.user1Info?.name || `User ${String(conv.user1).substring(0, 6)}`}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: '#94A3B8' }}>
                        {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (conv.time || '')}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: activeChat?.id === conv.id ? '#475569' : '#64748B',
                        mt: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {conv.lastMsg || (conv.unread_messages > 0 ? `${conv.unread_messages} tin nhắn mới` : 'Bắt đầu trò chuyện')}
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
        {activeChat ? (
          <>
            <Box sx={{
              p: '14px 24px',
              background: '#fff',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={activeChat.avatar || activeChat.user1Info?.avatar_url} sx={{ width: 40, height: 40 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: 16 }}>
                    {activeChat.user1Info?.role_value === 'doctor' ? 'BS. ' : ''}
                    {activeChat.user1Info?.name || `User ${String(activeChat.user1).substring(0, 6)}`}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: activeChat.online || activeChat.user1Info?.active_status ? '#22C55E' : '#94A3B8' }} />
                    <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                      {activeChat.status || (activeChat.user1Info?.active_status ? 'Đang hoạt động' : 'Ngoại tuyến')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ color: '#64748B' }}><PhoneIcon fontSize="small" /></IconButton>
                <IconButton sx={{ color: '#64748B' }}><VideocamIcon fontSize="small" /></IconButton>
                <IconButton sx={{ color: '#64748B' }}><MoreVertIcon fontSize="small" /></IconButton>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Chọn một cuộc trò chuyện để bắt đầu</Typography>
          </Box>
        )}

        {/* Message History */}
        {activeChat && (
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', background: '#F1F5F9', px: 1.5, py: 0.5, borderRadius: '6px', textTransform: 'uppercase' }}>
                Hôm nay
              </Typography>
            </Box>

            {messages.map((msg: any) => {
              const isMine = msg.sender === user?.id;
              return (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start',
                    width: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5, maxWidth: '70%', alignItems: 'flex-start', flexDirection: isMine ? 'row-reverse' : 'row' }}>
                    <Avatar src={isMine ? 'https://ngjrnpiopnjfcwyifslo.supabase.co/storage/v1/object/public/avatar/user.png' : activeChat.avatar || activeChat.user1Info?.avatar_url} sx={{ width: 32, height: 32, mt: 0.5 }} />
                    <Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: '12px 16px',
                          borderRadius: isMine ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                          background: isMine ? '#00A3FF' : '#fff',
                          color: isMine ? '#fff' : '#1E293B',
                          boxShadow: isMine ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      >
                        <Typography sx={{ fontSize: 14, lineHeight: 1.5 }}>
                          {msg.content}
                        </Typography>
                      </Paper>
                      <Typography sx={{ fontSize: 10, color: '#94A3B8', mt: 0.5, textAlign: isMine ? 'right' : 'left' }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

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
              onClick={handleSendMessage}
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
