import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { messagingAPI } from '../lib/api'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'
import { Send, MessageSquare, Search, ArrowLeft } from 'lucide-react'

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Сегодня'
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Вчера'
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

export default function MessagesPage() {
  const { convId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true)
      try {
        const res = await messagingAPI.getConversations()
        const convs = res.data.results || res.data
        setConversations(convs)
        if (!convId && convs.length > 0) {
          navigate(`/messages/${convs[0].id}`, { replace: true })
        }
      } catch { }
      finally { setLoading(false) }
    }
    fetchConversations()
  }, [convId, navigate])

  // Load messages for active conversation
  useEffect(() => {
    if (!convId) return
    const fetchMessages = async () => {
      setMsgLoading(true)
      try {
        const res = await messagingAPI.getMessages(Number(convId))
        setMessages(res.data.results || res.data)
      } catch { }
      finally { setMsgLoading(false) }
    }
    fetchMessages()

    // WebSocket connection
    const token = localStorage.getItem('access_token')
    if (token) {
      const wsUrl = `ws://localhost:8000/ws/chat/${convId}/`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.type === 'message') {
          setMessages(prev => {
            const exists = prev.find(m => m.id === data.id)
            if (exists) return prev
            return [...prev, {
              id: data.id,
              content: data.content,
              sender: data.sender_id,
              sender_name: data.sender_name,
              is_mine: data.sender_id === user?.id,
              created_at: data.created_at,
            }]
          })
        }
      }

      return () => { ws.close() }
    }
  }, [convId, user?.id])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !convId) return

    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      // Send via WebSocket if connected, else REST
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'message', content }))
      } else {
        const res = await messagingAPI.sendMessage(Number(convId), content)
        setMessages(prev => [...prev, res.data])
      }
    } catch {
      toast.error('Ошибка отправки')
      setNewMessage(content)
    } finally {
      setSending(false)
    }
  }

  const activeConv = conversations.find(c => c.id === Number(convId))
  const otherUser = activeConv?.other_participant

  // Group messages by date
  const groupedMessages: { date: string; msgs: any[] }[] = []
  messages.forEach(msg => {
    const date = formatDate(msg.created_at)
    const last = groupedMessages[groupedMessages.length - 1]
    if (last?.date === date) {
      last.msgs.push(msg)
    } else {
      groupedMessages.push({ date, msgs: [msg] })
    }
  })

  return (
    <>
      <Navbar />
      <div style={{ height: '100vh', paddingTop: '72px', display: 'flex', background: 'var(--color-bg-primary)' }}>
        {/* Conversations Sidebar */}
        <div style={{
          width: '320px',
          flexShrink: 0,
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--color-bg-primary)',
        }}>
          <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="serif-title" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '12px' }}>Сообщения</h2>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Поиск диалогов..." className="input-glass"
                style={{ paddingLeft: '36px', fontSize: '13px', padding: '10px 12px 10px 36px' }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '68px', borderRadius: '12px', marginBottom: '4px', background: 'var(--color-bg-secondary)' }} />
              ))
            ) : conversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-text-tertiary)' }}>
                <MessageSquare size={32} style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: '14px' }}>Нет диалогов</p>
                <Link to="/tutors" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--color-accent-primary)', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
                  Найти репетитора →
                </Link>
              </div>
            ) : (
              conversations.map(conv => {
                const other = conv.other_participant
                const isActive = conv.id === Number(convId)
                return (
                  <Link key={conv.id} to={`/messages/${conv.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{
                      padding: '12px', borderRadius: '12px', cursor: 'pointer',
                      background: isActive ? 'rgba(108,126,114,0.1)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(108,126,114,0.2)' : 'transparent'}`,
                      transition: 'all 0.2s', marginBottom: '2px',
                    }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(108,126,114,0.05)' }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'white', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                          {other?.avatar_url
                            ? <img src={other.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : other?.first_name?.[0] || '?'
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {other?.full_name || 'Пользователь'}
                            </p>
                            {conv.unread_count > 0 && (
                              <span style={{ background: 'var(--color-accent-primary)', color: 'white', fontSize: '11px', fontWeight: '700', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          {conv.last_message && (
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                              {conv.last_message.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-primary)' }}>
          {!convId ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>
              <div style={{ textAlign: 'center' }}>
                <MessageSquare size={48} style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '16px' }}>Выберите диалог</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'white', overflow: 'hidden', flexShrink: 0 }}>
                  {otherUser?.avatar_url
                    ? <img src={otherUser.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : otherUser?.first_name?.[0] || '?'
                  }
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-primary)' }}>{otherUser?.full_name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {otherUser?.role === 'tutor' ? 'Репетитор' : 'Студент'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {msgLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: '32px', height: '32px', border: '2px solid rgba(108,126,114,0.2)', borderTopColor: 'var(--color-accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                ) : (
                  <>
                    {groupedMessages.map(({ date, msgs }) => (
                      <div key={date}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0 16px' }}>
                          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{date}</span>
                          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                        </div>

                        {msgs.map(msg => {
                          const isMine = msg.is_mine || msg.sender === user?.id
                          return (
                            <AnimatePresence key={msg.id}>
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                style={{
                                  display: 'flex',
                                  flexDirection: isMine ? 'row-reverse' : 'row',
                                  gap: '10px',
                                  marginBottom: '10px',
                                }}
                              >
                                {!isMine && (
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white', flexShrink: 0, alignSelf: 'flex-end' }}>
                                    {otherUser?.first_name?.[0] || '?'}
                                  </div>
                                )}
                                <div style={{ maxWidth: '65%' }}>
                                  <div style={{
                                    padding: '12px 16px',
                                    borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    background: isMine
                                      ? 'var(--color-accent-primary)'
                                      : 'var(--color-bg-secondary)',
                                    border: isMine ? 'none' : '1px solid var(--color-border)',
                                    color: isMine ? 'white' : 'var(--color-text-primary)',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    boxShadow: isMine ? 'var(--shadow-glow-primary)' : 'none',
                                  }}>
                                    {msg.content}
                                  </div>
                                  <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '4px', textAlign: isMine ? 'right' : 'left' }}>
                                    {formatTime(msg.created_at)}
                                  </p>
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          )
                        })}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message input */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
                  <input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="input-glass"
                    style={{ flex: 1, fontSize: '14px' }}
                    disabled={sending}
                  />
                  <motion.button
                    type="submit"
                    className="btn-primary"
                    disabled={sending || !newMessage.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ padding: '14px 20px', flexShrink: 0, opacity: !newMessage.trim() ? 0.5 : 1 }}
                  >
                    <Send size={18} />
                  </motion.button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
