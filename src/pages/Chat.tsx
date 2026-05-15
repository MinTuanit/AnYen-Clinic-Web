import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import { chatService } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/config';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

type CallPhase = 'idle' | 'incoming' | 'outgoing' | 'active';

type CallMeta = {
  isVideoCall: boolean;
  callerId?: string;
  sender?: string;
  signal?: RTCSessionDescriptionInit;
  status?: string;
};

const peerConfiguration: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

const getChatPartner = (conversation: any, currentUserId?: string) => {
  if (!conversation) return null;
  if (conversation.user1 === currentUserId) {
    return conversation.user2Info || conversation.user1Info;
  }
  return conversation.user1Info || conversation.user2Info;
};

const Chat: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [callPhase, setCallPhase] = useState<CallPhase>('idle');
  const [callMeta, setCallMeta] = useState<CallMeta | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const activeChatRef = useRef<any>(null);
  const callMetaRef = useRef<CallMeta | null>(null);
  const callPhaseRef = useRef<CallPhase>('idle');
  const queuedCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescriptionSetRef = useRef(false);
  const outgoingTimeoutRef = useRef<number | null>(null);
  const callStartedAtRef = useRef<number | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await chatService.getSupportConversationMessages(convId);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await chatService.getAllSupportConversations();
      if (res.err === 0) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeChatRef.current) {
          setActiveChat(res.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  }, []);

  const appendSocketMessage = useCallback((msg: any) => {
    setMessages(prev => {
      if (msg?.id && prev.some((item: any) => item.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  const clearOutgoingTimeout = useCallback(() => {
    if (outgoingTimeoutRef.current !== null) {
      window.clearTimeout(outgoingTimeoutRef.current);
      outgoingTimeoutRef.current = null;
    }
  }, []);

  const releaseCallResources = useCallback(() => {
    clearOutgoingTimeout();
    queuedCandidatesRef.current = [];
    remoteDescriptionSetRef.current = false;
    callStartedAtRef.current = null;

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;

    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsCameraOff(false);
  }, [clearOutgoingTimeout]);

  const resetCall = useCallback(() => {
    releaseCallResources();
    setCallPhase('idle');
    setCallMeta(null);
  }, [releaseCallResources]);

  const createPeerConnection = useCallback(() => {
    const peer = new RTCPeerConnection(peerConfiguration);

    peer.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) setRemoteStream(stream);
    };

    peer.onicecandidate = (event) => {
      const room = activeChatRef.current?.id;
      const candidate = event.candidate?.toJSON();
      if (!room || !candidate || !socketRef.current?.connected) return;

      socketRef.current.emit('ice-candidate', {
        room,
        candidate,
        callerId: callMetaRef.current?.callerId || user?.id,
      });
    };

    peerConnectionRef.current = peer;
    return peer;
  }, [user?.id]);

  const flushQueuedCandidates = useCallback(async () => {
    const peer = peerConnectionRef.current;
    if (!peer || !remoteDescriptionSetRef.current) return;

    const candidates = queuedCandidatesRef.current;
    queuedCandidatesRef.current = [];

    for (const candidate of candidates) {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  const setPeerRemoteDescription = useCallback(async (signal: RTCSessionDescriptionInit) => {
    const peer = peerConnectionRef.current;
    if (!peer) return;

    await peer.setRemoteDescription(new RTCSessionDescription(signal));
    remoteDescriptionSetRef.current = true;
    await flushQueuedCandidates();
  }, [flushQueuedCandidates]);

  const addRemoteCandidate = useCallback(async (candidate?: RTCIceCandidateInit) => {
    const peer = peerConnectionRef.current;
    if (!peer || !candidate) return;

    if (!remoteDescriptionSetRef.current) {
      queuedCandidatesRef.current.push(candidate);
      return;
    }

    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }, []);

  const setupLocalMedia = useCallback(async (isVideoCall: boolean) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Trình duyệt không hỗ trợ camera/microphone.');
    }

    releaseCallResources();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: isVideoCall,
    });
    localStreamRef.current = stream;
    setLocalStream(stream);

    const peer = createPeerConnection();
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
    return peer;
  }, [createPeerConnection, releaseCallResources]);

  const startCallTimer = useCallback(() => {
    callStartedAtRef.current = Date.now();
  }, []);

  const getCallDurationSeconds = useCallback(() => {
    if (!callStartedAtRef.current) return 0;
    return Math.max(0, Math.round((Date.now() - callStartedAtRef.current) / 1000));
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchConversations();
    });
  }, [fetchConversations]);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    callMetaRef.current = callMeta;
  }, [callMeta]);

  useEffect(() => {
    callPhaseRef.current = callPhase;
  }, [callPhase]);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [callPhase, localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [callPhase, remoteStream]);

  useEffect(() => {
    if (activeChat) {
      queueMicrotask(() => {
        fetchMessages(activeChat.id);
      });
    }
  }, [activeChat, fetchMessages]);

  useEffect(() => {
    if (!activeChat?.id || !user?.id) return;

    const rawToken = localStorage.getItem('access_token');
    const token = rawToken?.replace(/^Bearer\s+/i, '');
    if (!token) return;

    const socket = io(config.apiUrl, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('subscribe', activeChat.id);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
      setOnlineUsers([]);
    });

    socket.on('onlineUsers', (data: any) => {
      setOnlineUsers(Array.isArray(data?.users) ? data.users : []);
    });

    socket.on('userJoined', (data: any) => {
      const joinedUserId = data?.userId || data?.sender;
      if (!joinedUserId) return;
      setOnlineUsers(prev => prev.includes(joinedUserId) ? prev : [...prev, joinedUserId]);
    });

    socket.on('userLeft', (data: any) => {
      const leftUserId = data?.userId || data?.sender;
      if (!leftUserId) return;
      setOnlineUsers(prev => prev.filter(id => id !== leftUserId));
    });

    socket.on('chatMessage', (data: any) => {
      appendSocketMessage(data);
      fetchConversations();
    });

    socket.on('receive-call', (data: any) => {
      if (data?.sender === user.id) return;

      if (callPhaseRef.current !== 'idle') {
        socket.emit('call-declined', {
          room: activeChat.id,
          callerId: data?.callerId || data?.sender,
          isVideoCall: Boolean(data?.isVideoCall),
        });
        return;
      }

      setCallMeta({
        isVideoCall: Boolean(data?.isVideoCall),
        callerId: data?.callerId || data?.sender,
        sender: data?.sender,
        signal: data?.signal,
        status: 'Cuộc gọi đến',
      });
      setCallPhase('incoming');
    });

    socket.on('call-answered', async (data: any) => {
      if (data?.sender === user.id || callPhaseRef.current !== 'outgoing') return;

      try {
        clearOutgoingTimeout();
        await setPeerRemoteDescription(data.signal);
        startCallTimer();
        setCallMeta(prev => prev ? { ...prev, status: 'Đang trong cuộc gọi' } : prev);
        setCallPhase('active');
      } catch (error) {
        console.error('Failed to handle call answer:', error);
        resetCall();
      }
    });

    socket.on('ice-candidate-res', async (data: any) => {
      if (data?.from === user.id) return;
      try {
        await addRemoteCandidate(data?.candidate);
      } catch (error) {
        console.error('Failed to add ICE candidate:', error);
      }
    });

    socket.on('call-declined', (data: any) => {
      if (data?.sender !== user.id) {
        setCallMeta(prev => prev ? { ...prev, status: 'Người nhận đã từ chối cuộc gọi' } : prev);
      }
      window.setTimeout(() => {
        resetCall();
        fetchMessages(activeChat.id);
      }, 600);
    });

    socket.on('call-unreceived', () => {
      setCallMeta(prev => prev ? { ...prev, status: 'Người nhận không liên lạc được' } : prev);
      window.setTimeout(() => {
        resetCall();
        fetchMessages(activeChat.id);
      }, 600);
    });

    socket.on('call-creating-ended', () => {
      resetCall();
      fetchMessages(activeChat.id);
    });

    socket.on('call-ended', () => {
      resetCall();
      fetchMessages(activeChat.id);
    });

    socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
      setSocketConnected(false);
    });

    socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    socket.connect();

    return () => {
      socket.emit('unsubscribe', activeChat.id);
      socket.removeAllListeners();
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
      setSocketConnected(false);
      setOnlineUsers([]);
      resetCall();
    };
  }, [
    activeChat?.id,
    user?.id,
    addRemoteCandidate,
    appendSocketMessage,
    clearOutgoingTimeout,
    fetchConversations,
    fetchMessages,
    resetCall,
    setPeerRemoteDescription,
    startCallTimer,
  ]);

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !activeChat) return;
    try {
      if (selectedFile) {
        await chatService.sendImage(activeChat.id, selectedFile);
        setSelectedFile(null);
        setPreviewUrl(null);
      }
      
      if (message.trim()) {
        const res = await chatService.sendMessageText({
          conversation_id: activeChat.id,
          content: message
        });
        if (res.err === 0) {
          setMessage('');
        }
      }
      
      fetchMessages(activeChat.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;
    
    // Set preview
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Clear input so same file can be selected again
    e.target.value = '';
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const startCall = async (isVideoCall: boolean) => {
    if (!activeChat?.id || !user?.id || !socketRef.current?.connected) {
      setCallMeta({
        isVideoCall,
        status: 'Chưa kết nối được socket cuộc gọi. Vui lòng thử lại.',
      });
      setCallPhase('outgoing');
      return;
    }

    if (callPhaseRef.current !== 'idle') return;

    const nextMeta: CallMeta = {
      isVideoCall,
      callerId: user.id,
      sender: user.id,
      status: 'Đang gọi',
    };

    callMetaRef.current = nextMeta;
    setCallMeta(nextMeta);
    setCallPhase('outgoing');

    try {
      const peer = await setupLocalMedia(isVideoCall);
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socketRef.current.emit('call-user', {
        room: activeChat.id,
        signal: {
          type: offer.type,
          sdp: offer.sdp,
        },
        isVideoCall,
        callerId: user.id,
      });

      outgoingTimeoutRef.current = window.setTimeout(() => {
        socketRef.current?.emit('call-unreceived', {
          room: activeChat.id,
          callerId: user.id,
          isVideoCall,
        });
        setCallMeta(prev => prev ? { ...prev, status: 'Người nhận không liên lạc được' } : prev);
        window.setTimeout(() => {
          resetCall();
          fetchMessages(activeChat.id);
        }, 700);
      }, 30000);
    } catch (error) {
      console.error('Failed to start call:', error);
      const message = error instanceof Error ? error.message : 'Không thể tạo cuộc gọi.';
      releaseCallResources();
      setCallMeta({
        isVideoCall,
        status: message,
      });
    }
  };

  const handleVoiceCall = () => {
    startCall(false);
  };

  const handleVideoCall = () => {
    startCall(true);
  };

  const handleAcceptCall = async () => {
    if (!activeChat?.id || !callMeta?.signal || !socketRef.current?.connected) return;

    const nextMeta: CallMeta = {
      ...callMeta,
      status: 'Đang kết nối',
    };

    callMetaRef.current = nextMeta;
    setCallMeta(nextMeta);

    try {
      const peer = await setupLocalMedia(callMeta.isVideoCall);
      await setPeerRemoteDescription(callMeta.signal);

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socketRef.current.emit('answer-call', {
        room: activeChat.id,
        signal: {
          type: answer.type,
          sdp: answer.sdp,
        },
        callerId: callMeta.callerId,
      });

      startCallTimer();
      setCallMeta(prev => prev ? { ...prev, status: 'Đang trong cuộc gọi' } : prev);
      setCallPhase('active');
    } catch (error) {
      console.error('Failed to answer call:', error);
      const message = error instanceof Error ? error.message : 'Không thể trả lời cuộc gọi.';
      releaseCallResources();
      setCallMeta(prev => prev ? { ...prev, status: message } : prev);
    }
  };

  const handleDeclineCall = () => {
    if (activeChat?.id && callMeta && socketRef.current?.connected) {
      socketRef.current.emit('call-declined', {
        room: activeChat.id,
        callerId: callMeta.callerId,
        isVideoCall: callMeta.isVideoCall,
      });
    }
    resetCall();
  };

  const handleCancelOutgoingCall = () => {
    if (activeChat?.id && callMeta && socketRef.current?.connected) {
      socketRef.current.emit('end-creating-call', {
        room: activeChat.id,
        callerId: callMeta.callerId || user?.id,
        isVideoCall: callMeta.isVideoCall,
      });
    }
    resetCall();
  };

  const handleEndCall = () => {
    if (activeChat?.id && callMeta && socketRef.current?.connected) {
      socketRef.current.emit('end-call', {
        room: activeChat.id,
        duration: getCallDurationSeconds(),
        callerId: callMeta.callerId || user?.id,
        isVideoCall: callMeta.isVideoCall,
      });
    }
    resetCall();
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    localStreamRef.current?.getAudioTracks().forEach(track => {
      track.enabled = !nextMuted;
    });
    setIsMuted(nextMuted);
  };

  const toggleCamera = () => {
    const nextCameraOff = !isCameraOff;
    localStreamRef.current?.getVideoTracks().forEach(track => {
      track.enabled = !nextCameraOff;
    });
    setIsCameraOff(nextCameraOff);
  };

  const filteredConversations = conversations.filter((c: any) => {
    const partner = getChatPartner(c, user?.id);
    const role = partner?.role_value;
    const name = (partner?.name || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (tab === 0) return role === 'patient';
    return role === 'doctor' || role === 'admin';
  });

  const activeChatPartner = getChatPartner(activeChat, user?.id);
  const activeChatPartnerOnline = Boolean(
    activeChatPartner?.id && onlineUsers.includes(activeChatPartner.id)
  );
  const callPartnerName = activeChatPartner?.name || 'Người dùng';
  const callPartnerAvatar = activeChatPartner?.avatar_url || activeChat?.avatar || '';
  const isCallDialogOpen = callPhase !== 'idle';

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                const partner = getChatPartner(c, user?.id);
                const role = partner?.role_value;
                const name = (partner?.name || '').toLowerCase();
                const matchesSearch = name.includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
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
          {filteredConversations.map((conv) => {
            const partner = getChatPartner(conv, user?.id);
            const partnerOnline = Boolean(
              partner?.id && (onlineUsers.includes(partner.id) || conv.online || partner.active_status)
            );

            return (
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
                        backgroundColor: partnerOnline ? '#22C55E' : '#94A3B8',
                        color: partnerOnline ? '#22C55E' : '#94A3B8',
                        boxShadow: `0 0 0 2px #fff`,
                        width: 10,
                        height: 10,
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <Avatar src={conv.avatar || partner?.avatar_url} sx={{ width: 48, height: 48 }} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: 15 }}>
                        {partner?.role_value === 'doctor' ? 'BS. ' : ''}
                        {partner?.name || `User ${String(partner?.id || conv.user1).substring(0, 6)}`}
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
            );
          })}
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
                <Avatar src={activeChat.avatar || activeChatPartner?.avatar_url} sx={{ width: 40, height: 40 }} />
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#1E293B', fontSize: 16 }}>
                    {activeChatPartner?.role_value === 'doctor' ? 'BS. ' : ''}
                    {activeChatPartner?.name || `User ${String(activeChatPartner?.id || activeChat.user1).substring(0, 6)}`}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: socketConnected && activeChatPartnerOnline ? '#22C55E' : '#94A3B8' }} />
                    <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                      {socketConnected && activeChatPartnerOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ color: '#64748B' }} onClick={handleVoiceCall} disabled={callPhase !== 'idle'}>
                  <PhoneIcon fontSize="small" />
                </IconButton>
                <IconButton sx={{ color: '#64748B' }} onClick={handleVideoCall} disabled={callPhase !== 'idle'}>
                  <VideocamIcon fontSize="small" />
                </IconButton>
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
                    <Avatar src={isMine ? user?.avatar_url : activeChat.avatar || activeChatPartner?.avatar_url} sx={{ width: 32, height: 32, mt: 0.5 }} />
                    <Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: msg.message_type === 'image' ? '4px' : '12px 16px',
                          borderRadius: isMine ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                          background: isMine ? '#00A3FF' : '#fff',
                          color: isMine ? '#fff' : '#1E293B',
                          boxShadow: isMine ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                          overflow: 'hidden'
                        }}
                      >
                        {msg.message_type === 'image' ? (
                          <Box
                            component="img"
                            src={msg.content}
                            sx={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              borderRadius: '12px',
                              display: 'block'
                            }}
                          />
                        ) : msg.message_type === 'call' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VideocamIcon fontSize="small" />
                            <Typography sx={{ fontSize: 14 }}>{msg.content}</Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: 14, lineHeight: 1.5 }}>
                            {msg.content}
                          </Typography>
                        )}
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
          {previewUrl && (
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, ml: 2 }}>
              <Box
                component="img"
                src={previewUrl}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '2px solid #00A3FF'
                }}
              />
              <IconButton
                size="small"
                onClick={removeSelectedImage}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#1E293B',
                  color: '#fff',
                  padding: '2px',
                  '&:hover': { background: '#000' }
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          )}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            background: '#F1F5F9',
            p: '8px 12px',
            borderRadius: '16px'
          }}>
            <IconButton size="small" sx={{ color: '#64748B' }}><AddCircleIcon /></IconButton>
            <input
              type="file"
              id="image-input"
              hidden
              accept="image/*"
              onChange={handleSendImage}
            />
            <label htmlFor="image-input">
              <IconButton size="small" sx={{ color: '#64748B' }} component="span">
                <ImageIcon />
              </IconButton>
            </label>
            <TextField
              fullWidth
              placeholder="Nhập tin nhắn..."
              variant="standard"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
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

      <Dialog
        open={isCallDialogOpen && callPhase !== 'active'}
        onClose={callPhase === 'incoming' ? handleDeclineCall : handleCancelOutgoingCall}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {callPhase === 'incoming'
            ? (callMeta?.isVideoCall ? 'Cuộc gọi video đến' : 'Cuộc gọi thoại đến')
            : (callMeta?.isVideoCall ? 'Đang gọi video' : 'Đang gọi thoại')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 1.5 }}>
            <Avatar src={callPartnerAvatar} sx={{ width: 84, height: 84 }} />
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#1E293B' }}>
              {callPartnerName}
            </Typography>
            <Typography sx={{ color: '#64748B', textAlign: 'center' }}>
              {callMeta?.status || (callPhase === 'incoming' ? 'Đang gọi cho bạn' : 'Đang kết nối')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          {callPhase === 'incoming' ? (
            <>
              <Button
                onClick={handleDeclineCall}
                variant="contained"
                startIcon={<CallEndIcon />}
                sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, textTransform: 'none' }}
              >
                Từ chối
              </Button>
              <Button
                onClick={handleAcceptCall}
                variant="contained"
                startIcon={callMeta?.isVideoCall ? <VideocamIcon /> : <PhoneIcon />}
                sx={{ bgcolor: '#22C55E', '&:hover': { bgcolor: '#16A34A' }, textTransform: 'none' }}
              >
                Nghe máy
              </Button>
            </>
          ) : (
            <Button
              onClick={handleCancelOutgoingCall}
              variant="contained"
              startIcon={<CallEndIcon />}
              sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, textTransform: 'none' }}
            >
              Hủy cuộc gọi
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={isCallDialogOpen && callPhase === 'active'}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { overflow: 'hidden', bgcolor: '#0F172A' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: 'relative', minHeight: 520, bgcolor: '#0F172A', color: '#fff' }}>
            {callMeta?.isVideoCall ? (
              <>
                {remoteStream ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block', background: '#020617' }}
                  />
                ) : (
                  <Box sx={{ height: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                    <Avatar src={callPartnerAvatar} sx={{ width: 96, height: 96 }} />
                    <Typography sx={{ fontWeight: 700 }}>{callPartnerName}</Typography>
                    <Typography sx={{ color: '#CBD5E1' }}>Đang chờ tín hiệu video...</Typography>
                  </Box>
                )}

                <Box sx={{ position: 'absolute', top: 16, right: 16, width: 180, height: 120, borderRadius: '8px', overflow: 'hidden', bgcolor: '#1E293B', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {localStream && !isCameraOff ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <VideocamOffIcon />
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ minHeight: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Avatar src={callPartnerAvatar} sx={{ width: 108, height: 108 }} />
                <Typography sx={{ fontWeight: 700, fontSize: 22 }}>{callPartnerName}</Typography>
                <Typography sx={{ color: '#CBD5E1' }}>Đang trong cuộc gọi thoại</Typography>
              </Box>
            )}

            <Box sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              p: 2.5,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              background: 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.88) 45%)'
            }}>
              <IconButton onClick={toggleMute} sx={{ bgcolor: '#334155', color: '#fff', '&:hover': { bgcolor: '#475569' } }}>
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              {callMeta?.isVideoCall && (
                <IconButton onClick={toggleCamera} sx={{ bgcolor: '#334155', color: '#fff', '&:hover': { bgcolor: '#475569' } }}>
                  {isCameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
                </IconButton>
              )}
              <IconButton onClick={handleEndCall} sx={{ bgcolor: '#EF4444', color: '#fff', '&:hover': { bgcolor: '#DC2626' } }}>
                <CallEndIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Chat;
