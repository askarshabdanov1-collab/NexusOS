import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { tutorsAPI } from '../lib/api'
import { Search, Star, MapPin, Clock, ChevronDown, X, SlidersHorizontal, CheckCircle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const SUBJECTS = [
  { value: '', label: 'Все предметы' },
  { value: 'math', label: 'Математика' },
  { value: 'physics', label: 'Физика' },
  { value: 'chemistry', label: 'Химия' },
  { value: 'english', label: 'Английский язык' },
  { value: 'russian', label: 'Русский язык' },
  { value: 'history', label: 'История' },
  { value: 'biology', label: 'Биология' },
  { value: 'programming', label: 'Программирование' },
  { value: 'informatics', label: 'Информатика' },
  { value: 'music', label: 'Музыка' },
  { value: 'kyrgyz', label: 'Кыргызский язык' },
  { value: 'other', label: 'Другое' },
]

function TutorCard({ tutor }: { tutor: any }) {
  const initials = `${tutor.user_first_name?.[0] || ''}${tutor.user_last_name?.[0] || ''}`
  const colors = ['#6C7E72', '#C38B7B', '#A69E8F', '#D29D56', '#C98B82', '#8CA693']
  const color = colors[(tutor.id - 1) % colors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card"
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '16px',
            background: tutor.avatar_url ? 'none' : `linear-gradient(135deg, ${color}, ${color}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: '700', color: '#FAF6F0',
            overflow: 'hidden',
            boxShadow: `0 4px 12px ${color}33`,
          }}>
            {tutor.avatar_url
              ? <img src={tutor.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials
            }
          </div>
          {tutor.is_online && (
            <div style={{
              position: 'absolute', bottom: '2px', right: '2px',
              width: '12px', height: '12px',
              background: 'var(--color-accent-emerald)', border: '2px solid var(--color-bg-secondary)', borderRadius: '50%',
            }} />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 className="serif-title" style={{ fontSize: '17px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              {tutor.user_first_name} {tutor.user_last_name}
            </h3>
            {tutor.is_verified && (
              <span className="badge badge-verified">
                <CheckCircle size={10} /> Верифицирован
              </span>
            )}
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={12} fill={i <= Math.round(tutor.rating) ? 'var(--color-accent-gold)' : 'none'} color="var(--color-accent-gold)" />
              ))}
            </div>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              {parseFloat(tutor.rating || 0).toFixed(1)} ({tutor.total_reviews} отз.)
            </span>
          </div>

          {/* Subjects */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {tutor.subjects_display?.slice(0, 3).map((s: string) => (
              <span key={s} className="badge badge-primary" style={{ fontSize: '11px' }}>{s}</span>
            ))}
            {tutor.subjects_display?.length > 3 && (
              <span className="badge" style={{ fontSize: '11px', background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>
                +{tutor.subjects_display.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
            {parseInt(tutor.price_per_hour || 0).toLocaleString()} сом
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>за час</div>
        </div>
      </div>

      {/* Description */}
      {tutor.description && (
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tutor.description}
        </p>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {tutor.city && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            <MapPin size={12} />
            {tutor.city}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          <Clock size={12} />
          {tutor.format_display}
        </div>
        {tutor.experience_years > 0 && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Опыт: {tutor.experience_years} лет
          </div>
        )}
      </div>

      {/* Trial */}
      {tutor.trial_lesson_available && (
        <div style={{
          background: 'rgba(140, 166, 147, 0.1)',
          border: '1px solid rgba(140, 166, 147, 0.15)',
          borderRadius: '10px', padding: '10px 14px',
          fontSize: '13px', color: 'var(--color-accent-emerald)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Star size={13} fill="var(--color-accent-emerald)" color="var(--color-accent-emerald)" />
          Пробный урок — {tutor.trial_lesson_price > 0 ? `${parseInt(tutor.trial_lesson_price).toLocaleString()} сом` : 'Бесплатно'}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        <Link to={`/tutors/${tutor.id}`} className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '12px 16px', fontSize: '14px', borderRadius: '10px' }}>
          Открыть профиль
        </Link>
      </div>
    </motion.div>
  )
}

export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('')
  const [city, setCity] = useState('')
  const [format, setFormat] = useState('')
  const [minRating, setMinRating] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [ordering, setOrdering] = useState('-rating')
  const [showFilters, setShowFilters] = useState(false)
  const [total, setTotal] = useState(0)

  const fetchTutors = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { ordering }
      if (search) params.search = search
      if (subject) params.subject = subject
      if (city) params.city = city
      if (format) params.format = format
      if (minRating) params.min_rating = minRating
      if (maxPrice) params.max_price = maxPrice
      const res = await tutorsAPI.list(params)
      setTutors(res.data.results || res.data)
      setTotal(res.data.count || (res.data.results || res.data).length)
    } catch {
      setTutors([])
    } finally {
      setLoading(false)
    }
  }, [search, subject, city, format, minRating, maxPrice, ordering])

  useEffect(() => {
    const timer = setTimeout(fetchTutors, 300)
    return () => clearTimeout(timer)
  }, [fetchTutors])

  const clearFilters = () => {
    setSearch('')
    setSubject('')
    setCity('')
    setFormat('')
    setMinRating('')
    setMaxPrice('')
  }

  const hasFilters = search || subject || city || format || minRating || maxPrice

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: '88px', backgroundColor: 'var(--color-bg-primary)' }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(108, 126, 114, 0.04) 0%, transparent 100%)',
          padding: '48px 24px 40px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{ maxWidth: '95%', margin: '0 auto' }}>
            <h1 className="serif-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Найти репетитора
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '28px' }}>
              {total > 0 ? `Найдено ${total} репетиторов` : 'Поиск репетиторов...'}
            </p>

            {/* Search bar */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Поиск по имени, предмету, городу..."
                  className="input-glass"
                  style={{ paddingLeft: '48px', fontSize: '15px' }}
                />
              </div>

              <div style={{ position: 'relative', minWidth: '200px' }}>
                <select value={subject} onChange={e => setSubject(e.target.value)} className="select-glass">
                  {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', pointerEvents: 'none' }} />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary"
                style={{ padding: '14px 20px', gap: '8px', whiteSpace: 'nowrap', borderRadius: '10px' }}
              >
                <SlidersHorizontal size={16} />
                Фильтры
                {hasFilters && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-primary)' }} />}
              </button>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    display: 'flex', gap: '12px', flexWrap: 'wrap',
                    marginTop: '16px', padding: '20px',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '14px',
                    boxShadow: 'var(--shadow-card)',
                  }}>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)}
                      placeholder="Город" className="input-glass" style={{ flex: 1, minWidth: '150px' }} />

                    <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                      <select value={format} onChange={e => setFormat(e.target.value)} className="select-glass">
                        <option value="">Любой формат</option>
                        <option value="online">Онлайн</option>
                        <option value="offline">Оффлайн</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                    </div>

                    <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                      placeholder="Макс. цена (сом)" className="input-glass" style={{ flex: 1, minWidth: '160px' }} />

                    <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                      <select value={minRating} onChange={e => setMinRating(e.target.value)} className="select-glass">
                        <option value="">Любой рейтинг</option>
                        <option value="4">От 4 звёзд</option>
                        <option value="4.5">От 4.5 звёзд</option>
                        <option value="5">5 звёзд</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                    </div>

                    {hasFilters && (
                      <button onClick={clearFilters} className="btn-ghost" style={{ color: 'var(--color-accent-rose)', whiteSpace: 'nowrap' }}>
                        <X size={14} /> Сбросить
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sort */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              {[
                { value: '-rating', label: 'По рейтингу' },
                { value: 'price_per_hour', label: 'Дешевле' },
                { value: '-price_per_hour', label: 'Дороже' },
                { value: '-experience_years', label: 'По опыту' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setOrdering(opt.value)}
                  style={{
                    padding: '8px 16px', borderRadius: '20px', border: '1px solid',
                    borderColor: ordering === opt.value ? 'var(--color-accent-primary)' : 'var(--color-border)',
                    background: ordering === opt.value ? 'rgba(76, 157, 176, 0.15)' : 'var(--color-bg-secondary)',
                    color: ordering === opt.value ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                    fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ maxWidth: '95%', margin: '0 auto', padding: '40px 24px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '280px', borderRadius: '20px' }} />
              ))}
            </div>
          ) : tutors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 className="serif-title" style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Репетиторы не найдены
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                Попробуйте изменить параметры поиска
              </p>
              <button onClick={clearFilters} className="btn-secondary">
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {tutors.map(tutor => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
