import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { bookingsAPI } from '../lib/api'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import toast from 'react-hot-toast'
import { Calendar, Clock, CheckCircle, X, RotateCcw } from 'lucide-react'

const STATUS_LABELS: any = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  rejected: 'Отклонено',
  completed: 'Завершено',
  cancelled: 'Отменено',
}

const STATUS_COLORS: any = {
  pending: { bg: 'rgba(210, 157, 86, 0.1)', border: 'rgba(210, 157, 86, 0.2)', color: 'var(--color-accent-gold)' },
  confirmed: { bg: 'rgba(140, 166, 147, 0.1)', border: 'rgba(140, 166, 147, 0.2)', color: 'var(--color-accent-emerald)' },
  rejected: { bg: 'rgba(201, 139, 130, 0.1)', border: 'rgba(201, 139, 130, 0.2)', color: 'var(--color-accent-rose)' },
  completed: { bg: 'rgba(108, 126, 114, 0.1)', border: 'rgba(108, 126, 114, 0.2)', color: 'var(--color-accent-primary)' },
  cancelled: { bg: 'var(--color-bg-secondary)', border: 'var(--color-border)', color: 'var(--color-text-tertiary)' },
}

export default function BookingsPage() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingsAPI.list()
      setBookings(res.data.results || res.data)
    } catch { toast.error('Ошибка загрузки') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleAction = async (id: number, status: string, extra?: any) => {
    try {
      await bookingsAPI.updateStatus(id, { status, ...extra })
      toast.success(status === 'confirmed' ? 'Урок подтверждён!' : status === 'rejected' ? 'Урок отклонён' : status === 'completed' ? 'Урок завершён!' : 'Бронирование отменено')
      fetchBookings()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Ошибка')
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: '88px', padding: '88px 24px 60px', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
            <h1 className="serif-title" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              {user?.role === 'tutor' ? 'Запросы на уроки' : 'Мои уроки'}
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
              {bookings.length} бронирований
            </p>
          </motion.div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '8px 18px', borderRadius: '20px', border: '1px solid',
                  borderColor: filter === f ? 'var(--color-accent-primary)' : 'var(--color-border)',
                  background: filter === f ? 'rgba(76, 157, 176, 0.15)' : 'var(--color-bg-secondary)',
                  color: filter === f ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                  fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}>
                {f === 'all' ? 'Все' : STATUS_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 20px' }}>
              <Calendar size={40} color="var(--color-text-tertiary)" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>Нет бронирований</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filtered.map(booking => {
                const s = STATUS_COLORS[booking.status]
                return (
                  <motion.div key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: '24px' }}
                  >
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                          <h3 className="serif-title" style={{ fontSize: '17px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{booking.subject_display}</h3>
                          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: s?.bg, border: `1px solid ${s?.border}`, color: s?.color }}>
                            {booking.status_display}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                            <Calendar size={13} />
                            {new Date(booking.date).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                            <Clock size={13} />
                            {booking.start_time} – {booking.end_time}
                          </div>
                        </div>

                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
                          {user?.role === 'tutor' ? `Студент: ${booking.student_name}` : `Репетитор: ${booking.tutor_name}`}
                          {' · '}{booking.format === 'online' ? '🖥️ Онлайн' : '🏠 Оффлайн'}
                          {' · '}<strong style={{ color: 'var(--color-text-primary)' }}>{parseInt(booking.price).toLocaleString()} сом</strong>
                        </p>

                        {booking.message && (
                          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '6px', fontStyle: 'italic' }}>
                            "{booking.message}"
                          </p>
                        )}

                        {booking.meeting_link && booking.status === 'confirmed' && (
                          <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', color: 'var(--color-accent-primary)', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
                            🔗 Ссылка на встречу
                          </a>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', justifyContent: 'center' }}>
                        {user?.role === 'tutor' && booking.status === 'pending' && (
                          <>
                            <button onClick={() => handleAction(booking.id, 'confirmed')}
                              className="btn-primary" style={{ padding: '10px 18px', fontSize: '13px', gap: '6px', borderRadius: '8px' }}>
                              <CheckCircle size={14} /> Подтвердить
                            </button>
                            <button onClick={() => handleAction(booking.id, 'rejected')}
                              style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '8px', border: '1px solid rgba(201, 139, 130, 0.3)', background: 'rgba(201, 139, 130, 0.1)', color: 'var(--color-accent-rose)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', fontWeight: '600', transition: 'all 0.2s' }}>
                              <X size={14} /> Отклонить
                            </button>
                          </>
                        )}
                        {user?.role === 'tutor' && booking.status === 'confirmed' && (
                          <button onClick={() => handleAction(booking.id, 'completed')}
                            className="btn-primary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '8px' }}>
                            Завершить урок
                          </button>
                        )}
                        {user?.role === 'student' && ['pending', 'confirmed'].includes(booking.status) && (
                          <button onClick={() => handleAction(booking.id, 'cancelled')}
                            style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit', fontWeight: '500', transition: 'all 0.2s' }}>
                            <RotateCcw size={14} /> Отменить
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
