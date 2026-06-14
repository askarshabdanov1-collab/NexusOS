import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { bookingsAPI, tutorsAPI, messagingAPI } from '../lib/api'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Calendar, MessageSquare, Star, Clock, ArrowRight, TrendingUp } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{label}</p>
          <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-text-primary)' }}>{value}</p>
        </div>
        <div style={{ width: '44px', height: '44px', background: `${color}15`, border: `1px solid ${color}33`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </motion.div>
  )
}

function BookingItem({ booking, onAction }: { booking: any; onAction: () => void }) {
  const statusColors: any = {
    pending: { bg: 'rgba(210, 157, 86, 0.1)', border: 'rgba(210, 157, 86, 0.2)', color: 'var(--color-accent-gold)' },
    confirmed: { bg: 'rgba(140, 166, 147, 0.1)', border: 'rgba(140, 166, 147, 0.2)', color: 'var(--color-accent-emerald)' },
    rejected: { bg: 'rgba(201, 139, 130, 0.1)', border: 'rgba(201, 139, 130, 0.2)', color: 'var(--color-accent-rose)' },
    completed: { bg: 'rgba(108, 126, 114, 0.1)', border: 'rgba(108, 126, 114, 0.2)', color: 'var(--color-accent-primary)' },
    cancelled: { bg: 'var(--color-bg-secondary)', border: 'var(--color-border)', color: 'var(--color-text-tertiary)' },
  }
  const s = statusColors[booking.status] || statusColors.pending

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ width: '44px', height: '44px', background: 'rgba(108,126,114,0.08)', border: '1px solid rgba(108,126,114,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Calendar size={18} color="var(--color-accent-primary)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <p className="serif-title" style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{booking.subject_display}</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
              с {booking.tutor_name} · {new Date(booking.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} · {booking.start_time}–{booking.end_time}
            </p>
          </div>
          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: s.bg, border: `1px solid ${s.border}`, color: s.color, whiteSpace: 'nowrap' }}>
            {booking.status_display}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
            {parseInt(booking.price).toLocaleString()} сом
          </span>
          {booking.meeting_link && booking.status === 'confirmed' && (
            <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}>
              Подключиться
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [tutorProfile, setTutorProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [bookRes, msgRes] = await Promise.all([
          bookingsAPI.list(),
          messagingAPI.getConversations(),
        ])
        setBookings(bookRes.data.results || bookRes.data)
        setConversations(msgRes.data.results || msgRes.data)

        if (user?.role === 'tutor') {
          try {
            const profileRes = await tutorsAPI.myProfile()
            setTutorProfile(profileRes.data)
          } catch {}
        }
      } catch { }
      finally { setLoading(false) }
    }
    fetchData()
  }, [user?.role])

  const upcomingBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status))
  const completedBookings = bookings.filter(b => b.status === 'completed')
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0)

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: '88px', padding: '88px 24px 60px', backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
            <h1 className="serif-title" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Добрый день, {user?.first_name}! 👋
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              {user?.role === 'tutor' ? 'Панель управления наставника' : 'Ваш личный кабинет'}
            </p>
          </motion.div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            <StatCard label="Предстоящих уроков" value={upcomingBookings.length} icon={Calendar} color="var(--color-accent-primary)" />
            <StatCard label="Завершено уроков" value={completedBookings.length} icon={TrendingUp} color="var(--color-accent-emerald)" />
            <StatCard label="Новых сообщений" value={unreadMessages} icon={MessageSquare} color="var(--color-accent-secondary)" />
            {user?.role === 'tutor' && tutorProfile && (
              <StatCard label="Мой рейтинг" value={parseFloat(tutorProfile.rating || 0).toFixed(1)} icon={Star} color="var(--color-accent-gold)" />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Upcoming Bookings */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Ближайшие уроки</h2>
                <Link to="/bookings" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-accent-primary)', textDecoration: 'none', fontWeight: '500' }}>
                  Все уроки <ArrowRight size={13} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                  [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />)
                ) : upcomingBookings.length === 0 ? (
                  <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                    <Calendar size={32} color="var(--color-text-tertiary)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Нет предстоящих уроков</p>
                    <Link to="/tutors" className="btn-primary" style={{ display: 'inline-flex', marginTop: '16px', padding: '10px 20px', fontSize: '13px', borderRadius: '8px' }}>
                      Найти наставника
                    </Link>
                  </div>
                ) : (
                  upcomingBookings.slice(0, 4).map(b => (
                    <BookingItem key={b.id} booking={b} onAction={() => {}} />
                  ))
                )}
              </div>
            </div>

            {/* Messages */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Сообщения</h2>
                <Link to="/messages" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-accent-primary)', textDecoration: 'none', fontWeight: '500' }}>
                  Все сообщения <ArrowRight size={13} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loading ? (
                  [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '14px' }} />)
                ) : conversations.length === 0 ? (
                  <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                    <MessageSquare size={32} color="var(--color-text-tertiary)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Нет сообщений</p>
                  </div>
                ) : (
                  conversations.slice(0, 5).map(conv => (
                    <Link key={conv.id} to={`/messages/${conv.id}`} style={{ textDecoration: 'none' }}>
                      <motion.div whileHover={{ x: 4 }} className="glass-card"
                        style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#FAF6F0', flexShrink: 0, overflow: 'hidden' }}>
                          {conv.other_participant?.avatar_url
                            ? <img src={conv.other_participant.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : conv.other_participant?.first_name?.[0] || '?'
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                              {conv.other_participant?.full_name || 'Пользователь'}
                            </p>
                            {conv.unread_count > 0 && (
                              <span style={{ width: '18px', height: '18px', background: 'var(--color-accent-primary)', borderRadius: '50%', fontSize: '11px', fontWeight: '700', color: '#FAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                      </motion.div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
