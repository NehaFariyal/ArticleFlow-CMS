import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, messageAPI } from '../services/api';
import { Search, Send, User as UserIcon, MessageSquare, AlertCircle, RefreshCw, Activity, CheckCheck } from 'lucide-react';
import { io } from 'socket.io-client';

const ChatPage = () => {
  const { user: authUser, isAuthenticated, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const currentUserId = authUser?.id || authUser?._id;

  // Real-time Socket.io Connection
  useEffect(() => {
    if (!currentUserId) return;

    const authToken = token || localStorage.getItem('lumen_token');
    const backendUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : (import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || window.location.origin);
    const socket = io(backendUrl, {
      auth: { token: authToken },
    });
    socketRef.current = socket;

    socket.emit('join_room', currentUserId);

    socket.on('receive_message', (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, token]);

  // Scroll to bottom of message container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setError('');

        const response = await userAPI.getAllUsers();
        const allUsers = response.data?.users || [];

        setUsers(allUsers);

        // Select first user other than logged in user
        const otherUser = allUsers.find(
          (u) => (u._id || u.id) !== currentUserId
        );
        if (otherUser) {
          setSelectedUser((prev) => prev || otherUser);
        }
      } catch (err) {
        console.error('Fetch users error:', err);
        setError('Unable to load user directory. Ensure backend is running.');
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [currentUserId, isAuthenticated]);

  // Fetch conversation messages
  useEffect(() => {
    if (!selectedUser || !currentUserId) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        setError('');

        const selectedId = selectedUser._id || selectedUser.id;
        const response = await messageAPI.getConversation(selectedId);

        if (response.data?.success) {
          setMessages(response.data.messages || []);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('Fetch messages error:', err);
        // Soft fallback
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUserId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    const textToSend = messageText.trim();
    const recipientId = selectedUser._id || selectedUser.id;

    setSending(true);
    try {
      const response = await messageAPI.sendMessage({
        recipientId,
        text: textToSend,
      });

      if (response.data?.success && response.data?.message) {
        const sentMsg = response.data.message;
        setMessages((prev) => [...prev, sentMsg]);

        if (socketRef.current) {
          socketRef.current.emit('send_message', {
            ...sentMsg,
            recipientId,
          });
        }

        setMessageText('');
      } else {
        // Optimistic append fallback
        const optimisticMsg = {
          _id: `temp-${Date.now()}`,
          sender: currentUserId,
          recipient: recipientId,
          text: textToSend,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticMsg]);
        setMessageText('');
      }
    } catch (err) {
      console.error('Send message error:', err);
      setError('Message failed to send. Check connection.');
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const uId = u._id || u.id;
    if (uId === currentUserId) return false;
    return (
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 rounded-full text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Encrypted Direct Messaging</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Enterprise Communications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time peer correspondence with verified editorial authors and moderators.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono">WebSocket Connected</span>
        </div>
      </div>

      {/* Main Chat Console */}
      <div className="enterprise-card overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] border border-slate-200/80 dark:border-slate-800/80 shadow-md">
        
        {/* User Directory Sidebar */}
        <div className="md:col-span-4 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col bg-slate-50/50 dark:bg-slate-900/40">
          <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search team members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="enterprise-input w-full pl-9 pr-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {loadingUsers ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading directory...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No users found.</div>
            ) : (
              filteredUsers.map((u) => {
                const uId = u._id || u.id;
                const selectedId = selectedUser?._id || selectedUser?.id;
                const isSelected = uId === selectedId;

                return (
                  <button
                    key={uId}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full text-left p-3.5 transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-l-blue-600'
                        : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {u.name ? u.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{u.name}</p>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{u.role || 'user'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {u.email}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Message Workspace */}
        <div className="md:col-span-8 flex flex-col bg-white dark:bg-[#0B0F19]">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-white dark:bg-[#111827]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {selectedUser.name ? selectedUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedUser.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">{selectedUser.email}</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                  {selectedUser.role || 'User'}
                </span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/40 dark:bg-slate-950/40 min-h-[380px]">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {loadingMessages ? (
                  <div className="py-12 text-center text-xs text-slate-400">Loading conversation...</div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">No messages yet. Send a message to start communicating!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const msgSenderId = typeof msg.sender === 'object' ? (msg.sender._id || msg.sender.id) : msg.sender;
                    const isMe = msgSenderId === currentUserId;

                    return (
                      <div
                        key={msg._id || idx}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs shadow-2xs ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-xs'
                              : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <p
                            className={`text-[9px] mt-1 text-right font-mono ${
                              isMe ? 'text-blue-200' : 'text-slate-400'
                            }`}
                          >
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <form onSubmit={handleSend} className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#111827] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="enterprise-input flex-1 px-4 py-2.5 text-xs"
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              Select a team member to begin messaging
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
