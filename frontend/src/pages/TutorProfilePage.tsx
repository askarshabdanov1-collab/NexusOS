import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tutorsAPI, messagingAPI } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import {
  Star, MapPin, Clock, CheckCircle, GraduationCap,
  MessageSquare, Calendar, Globe, Award, Users, ArrowLeft, Send
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import BookingModal from '../components/BookingModal'

function ReviewCard({ review }: { review: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ padding: '20px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--color-accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', fontWeight: '700', color: '#FAF6F0', flexShrink: 0,
            overflow: 'hidden',
          }}>
            {review.student_avatar
              ? <img src={review.student_avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : review.student_name?.[0]
            }
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{review.student_name}</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {new Date(review.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={13} fill={i <= review.rating ? 'var(--color-accent-gold)' : 'none'} color="var(--color-accent-gold)" />
          ))}
        </div>
      </div>
      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{review.comment}</p>
    </motion.div>
  )
}

export default function TutorProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [tutor, setTutor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'schedule'>('about')

  useEffect(() => {
    const fetchTutor = async () => {
      setLoading(true)
      try {
        const [tutorRes, reviewsRes] = await Promise.all([
          tutorsAPI.get(Number(id)),
          tutorsAPI.getReviews(Number(id)),
        ])
        setTutor({ ...tutorRes.data, reviews: reviewsRes.data.results || reviewsRes.data })
      } catch {
        toast.error('Репетитор не найден')
        navigate('/tutors')
      } finally {
        setLoading(false)
      }
    }
    fetchTutor()
  }, [id, navigate])

  const handleMessage = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      const conv = await messagingAPI.startConversation(tutor.user.id)
      navigate(`/messages/${conv.data.id}`)
    } catch {
      toast.error('Ошибка при открытии чата')
    }
  }

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    if (!reviewText.trim()) { toast.error('Напишите отзыв'); return }
    setSubmittingReview(true)
    try {
      await tutorsAPI.addReview(Number(id), { rating: reviewRating, comment: reviewText })
      toast.success('Отзыв добавлен!')
      setReviewText('')
      setReviewRating(5)
      const reviewsRes = await tutorsAPI.getReviews(Number(id))
      setTutor((t: any) => ({ ...t, reviews: reviewsRes.data.results || reviewsRes.data }))
    } catch (err: any) {
      toast.error(err?.response?.data?.non_field_errors?.[0] || 'Ошибка при добавлении отзыва')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-primary)' }}>
        <div style={{ fontSize: '40px', color: 'var(--color-accent-primary)' }} className="animate-float">📖</div>
      </div>
    </>
  )

  if (!tutor) return null

  const colors = ['#6C7E72', '#C38B7B', '#A69E8F', '#D29D56', '#C98B82']
  const color = colors[(tutor.id - 1) % colors.length]
  const initials = `${tutor.user?.first_name?.[0] || ''}${tutor.user?.last_name?.[0] || ''}`

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: '88px', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(108, 126, 114, 0.04) 0%, transparent 100%)',
          borderBottom: '1px solid var(--color-border)',
          padding: '48px 24px',
        }}>
          <div style={{ maxWidth: '95%', margin: '0 auto' }}>
            <Link to="/tutors" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '14px', marginBottom: '28px', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'}
            >
              <ArrowLeft size={16} /> Все репетиторы
            </Link>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: '120px', height: '120px', borderRadius: '24px',
                  background: tutor.user?.avatar_url ? 'none' : `linear-gradient(135deg, ${color}, ${color}99)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '40px', fontWeight: '800', color: '#FAF6F0',
                  overflow: 'hidden',
                  boxShadow: `0 4px 15px rgba(29, 30, 32, 0.05)`,
                  border: '2px solid var(--color-border)',
                  position: 'relative',
                }}>
                  {tutor.user?.avatar_url
                    ? <img src={tutor.user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials
                  }
                </div>
                {tutor.is_online && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--color-accent-emerald)', borderRadius: '50%' }} />
                    <span style={{ fontSize: '12px', color: 'var(--color-accent-emerald)', fontWeight: '500' }}>Онлайн</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <h1 className="serif-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                    {tutor.user?.first_name} {tutor.user?.last_name}
                  </h1>
                  {tutor.is_verified && <span className="badge badge-verified"><CheckCircle size={10} /> Верифицирован</span>}
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} fill={i <= Math.round(tutor.rating) ? 'var(--color-accent-gold)' : 'none'} color="var(--color-accent-gold)" />
                    ))}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                    {parseFloat(tutor.rating || 0).toFixed(1)}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    ({tutor.total_reviews} отзывов)
                  </span>
                </div>

                {/* Subjects */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {tutor.subjects_display?.map((s: string) => (
                    <span key={s} className="badge badge-primary">{s}</span>
                  ))}
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {tutor.city && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                      <MapPin size={14} />{tutor.city}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    <Globe size={14} />{tutor.format_display}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    <Award size={14} />{tutor.experience_years} лет опыта
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    <Users size={14} />{tutor.total_students} учеников
                  </div>
                </div>
              </div>

              {/* Booking Card */}
              <div className="glass-card" style={{ padding: '28px', minWidth: '260px', flexShrink: 0, border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                    {parseInt(tutor.price_per_hour || 0).toLocaleString()} сом
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>за академический час</div>
                </div>

                {tutor.trial_lesson_available && (
                  <div style={{
                    background: 'rgba(140, 166, 147, 0.1)', border: '1px solid rgba(140, 166, 147, 0.15)',
                    borderRadius: '10px', padding: '10px 12px', marginBottom: '16px',
                    fontSize: '13px', color: 'var(--color-accent-emerald)',
                  }}>
                    🎁 Пробный урок: {tutor.trial_lesson_price > 0 ? `${parseInt(tutor.trial_lesson_price).toLocaleString()} сом` : 'Бесплатно'}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => isAuthenticated ? setShowBooking(true) : navigate('/login')}
                    style={{ width: '100%', padding: '14px', borderRadius: '10px' }}
                  >
                    <Calendar size={16} /> Забронировать урок
                  </motion.button>
                  <motion.button
                    className="btn-secondary"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleMessage}
                    style={{ width: '100%', padding: '14px', borderRadius: '10px' }}
                  >
                    <MessageSquare size={16} /> Написать сообщение
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ maxWidth: '95%', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
            {[
              { id: 'about', label: 'О репетиторе' },
              { id: 'reviews', label: `Отзывы (${tutor.reviews?.length || 0})` },
              { id: 'schedule', label: 'Расписание' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 20px', borderRadius: '10px', border: '1px solid',
                  borderColor: activeTab === tab.id ? 'var(--color-accent-primary)' : 'transparent',
                  background: activeTab === tab.id ? 'rgba(108, 126, 114, 0.1)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* About Tab */}
          {activeTab === 'about' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {tutor.description && (
                  <div className="glass-card" style={{ padding: '28px' }}>
                    <h3 className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '14px' }}>О себе</h3>
                    <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>{tutor.description}</p>
                  </div>
                )}

                <div className="glass-card" style={{ padding: '28px' }}>
                  <h3 className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '20px' }}>Образование и опыт</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {tutor.university && (
                      <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(108,126,114,0.08)', border: '1px solid rgba(108,126,114,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <GraduationCap size={18} color="var(--color-accent-primary)" />
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{tutor.university}</p>
                          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>{tutor.education}</p>
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(140,166,147,0.08)', border: '1px solid rgba(140,166,147,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Award size={18} color="var(--color-accent-emerald)" />
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>{tutor.experience_years} лет преподавания</p>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
                          {tutor.total_lessons} проведённых уроков · {tutor.total_students} учеников
                        </p>
                      </div>
                    </div>
                    {tutor.languages?.length > 0 && (
                      <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(166,158,143,0.08)', border: '1px solid rgba(166,158,143,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Globe size={18} color="var(--color-accent-tertiary)" />
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>Языки</p>
                          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>{tutor.languages.join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Add review form */}
              {isAuthenticated && user?.role === 'student' && (
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '16px' }}>Написать отзыв</h3>
                  <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Оценка</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1,2,3,4,5].map(i => (
                          <button key={i} type="button" onClick={() => setReviewRating(i)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Star size={24} fill={i <= reviewRating ? 'var(--color-accent-gold)' : 'none'} color="var(--color-accent-gold)" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                      placeholder="Расскажите о своём опыте занятий с этим репетитором..."
                      className="input-glass"
                      style={{ resize: 'vertical', minHeight: '100px', fontFamily: 'inherit' }} />
                    <button type="submit" className="btn-primary" disabled={submittingReview}
                      style={{ alignSelf: 'flex-start', padding: '12px 28px', borderRadius: '10px' }}>
                      <Send size={15} /> {submittingReview ? 'Отправка...' : 'Отправить отзыв'}
                    </button>
                  </form>
                </div>
              )}

              {tutor.reviews?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-secondary)' }}>
                  Пока нет отзывов. Будьте первым!
                </div>
              ) : (
                tutor.reviews?.map((r: any) => <ReviewCard key={r.id} review={r} />)
              )}
            </motion.div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass-card" style={{ padding: '28px' }}>
                <h3 className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
                  Доступное расписание
                </h3>
                {tutor.availability?.length === 0 ? (
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                    Расписание не указано. Уточните у репетитора через сообщение.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, idx) => {
                      const slots = tutor.availability?.filter((a: any) => a.day_of_week === idx)
                      return (
                        <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ width: '32px', fontSize: '13px', fontWeight: '600', color: slots?.length > 0 ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                            {day}
                          </span>
                          {slots?.length > 0 ? (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {slots.map((s: any, i: number) => (
                                <span key={i} className="badge badge-primary">
                                  <Clock size={10} /> {s.start_time} – {s.end_time}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>Недоступно</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {showBooking && (
        <BookingModal tutor={tutor} onClose={() => setShowBooking(false)} />
      )}

      <Footer />
    </>
  )
}
