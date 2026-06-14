import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { bookingsAPI } from '../lib/api'
import toast from 'react-hot-toast'
import { X, Calendar, Clock, BookOpen, ChevronDown } from 'lucide-react'

const SUBJECTS = [
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

export default function BookingModal({ tutor, onClose }: { tutor: any; onClose: () => void }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    subject: tutor.subjects?.[0] || 'math',
    date: '',
    start_time: '10:00',
    end_time: '11:00',
    format: tutor.format === 'offline' ? 'offline' : 'online',
    message: '',
    is_trial: false,
  })
  const [loading, setLoading] = useState(false)

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.date) { toast.error('Выберите дату урока'); return }
    if (form.start_time >= form.end_time) { toast.error('Время окончания должно быть позже начала'); return }
    setLoading(true)
    try {
      const price = form.is_trial && tutor.trial_lesson_available
        ? tutor.trial_lesson_price
        : tutor.price_per_hour
      await bookingsAPI.create({
        tutor: tutor.id,
        subject: form.subject,
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        format: form.format,
        message: form.message,
        is_trial: form.is_trial,
        price,
      })
      toast.success('Запрос на урок отправлен! Ждите подтверждения.')
      onClose()
      navigate('/bookings')
    } catch (err: any) {
      const msg = err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.detail ||
        (Object.values(err?.response?.data || {}) as string[][])?.[0]?.[0] ||
        'Ошибка при бронировании'
      toast.error(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: '36px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 className="serif-title" style={{ fontSize: '22px', fontWeight: '700' }}>Забронировать урок</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              {tutor.user?.first_name} {tutor.user?.last_name}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '4px', borderRadius: '8px', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-tertiary)'}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Subject */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              <BookOpen size={13} /> Предмет
            </label>
            <div style={{ position: 'relative' }}>
              <select value={form.subject} onChange={e => update('subject', e.target.value)} className="select-glass">
                {tutor.subjects?.map((s: string) => {
                  const sub = SUBJECTS.find(x => x.value === s)
                  return <option key={s} value={s}>{sub?.label || s}</option>
                })}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              <Calendar size={13} /> Дата урока
            </label>
            <input type="date" value={form.date} min={minDate}
              onChange={e => update('date', e.target.value)}
              className="input-glass"
              style={{ colorScheme: 'dark' }} />
          </div>

          {/* Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                <Clock size={13} /> Начало
              </label>
              <input type="time" value={form.start_time}
                onChange={e => update('start_time', e.target.value)}
                className="input-glass" style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Конец</label>
              <input type="time" value={form.end_time}
                onChange={e => update('end_time', e.target.value)}
                className="input-glass" style={{ colorScheme: 'dark' }} />
            </div>
          </div>

          {/* Format */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Формат</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {(['online', 'offline'] as const).filter(f => tutor.format === 'both' || tutor.format === f).map(f => (
                <button key={f} type="button" onClick={() => update('format', f)}
                  style={{
                    flex: 1, padding: '12px', border: '1px solid',
                    borderColor: form.format === f ? 'var(--color-accent-primary)' : 'var(--color-border)',
                    background: form.format === f ? 'rgba(108,126,114,0.1)' : 'var(--color-bg-secondary)',
                    borderRadius: '10px', cursor: 'pointer', color: form.format === f ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                    fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'inherit',
                  }}>
                  {f === 'online' ? '🖥️ Онлайн' : '🏠 Оффлайн'}
                </button>
              ))}
            </div>
          </div>

          {/* Trial */}
          {tutor.trial_lesson_available && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_trial} onChange={e => update('is_trial', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent-primary)', cursor: 'pointer' }} />
              <span style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>
                Пробный урок ({tutor.trial_lesson_available ? (tutor.trial_lesson_price > 0 ? `${parseInt(tutor.trial_lesson_price).toLocaleString()} сом` : 'Бесплатно') : ''})
              </span>
            </label>
          )}

          {/* Message */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              Сообщение для репетитора (необязательно)
            </label>
            <textarea value={form.message} onChange={e => update('message', e.target.value)}
              placeholder="Расскажите о своих целях и уровне знаний..."
              className="input-glass"
              style={{ resize: 'none', height: '80px', fontFamily: 'inherit' }} />
          </div>

          {/* Price summary */}
          <div style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              <span>Стоимость урока</span>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: '700' }}>
                {form.is_trial && tutor.trial_lesson_available
                  ? (tutor.trial_lesson_price > 0 ? `${parseInt(tutor.trial_lesson_price).toLocaleString()} сом` : 'Бесплатно')
                  : `${parseInt(tutor.price_per_hour).toLocaleString()} сом`
                }
              </span>
            </div>
          </div>

          <motion.button type="submit" className="btn-primary" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '16px', fontSize: '15px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Отправка запроса...' : '📅 Отправить запрос на урок'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
