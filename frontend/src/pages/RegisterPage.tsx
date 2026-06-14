import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap, BookOpen, ArrowRight } from 'lucide-react'
import SceneBackground from '../components/three/SceneBackground'

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
    role: searchParams.get('role') || 'student',
    username: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      toast.error('Заполните все обязательные поля')
      return
    }
    if (form.password !== form.password2) {
      toast.error('Пароли не совпадают')
      return
    }
    if (form.password.length < 8) {
      toast.error('Пароль должен быть не менее 8 символов')
      return
    }
    const username = form.username || form.email.split('@')[0] + Math.floor(Math.random() * 1000)
    try {
      await registerUser({ ...form, username })
      toast.success('Аккаунт создан! Добро пожаловать!')
      navigate('/dashboard')
    } catch (err: any) {
      const errors = err?.response?.data
      if (errors) {
        const msgs = Object.values(errors).flat() as string[]
        toast.error(msgs[0] || 'Ошибка при регистрации')
      } else {
        toast.error('Ошибка при регистрации')
      }
    }
  }

  const roleBtn = (role: string, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => update('role', role)}
      style={{
        flex: 1, padding: '16px', border: '1px solid',
        borderColor: form.role === role ? 'var(--color-accent-primary)' : 'var(--color-border)',
        background: form.role === role ? 'rgba(108, 126, 114, 0.1)' : 'var(--color-bg-secondary)',
        borderRadius: '12px', cursor: 'pointer', color: 'var(--color-text-primary)',
        transition: 'all 0.2s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
      }}
    >
      {icon}
      <span style={{ fontSize: '14px', fontWeight: '600' }}>{label}</span>
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '100px 24px 60px', backgroundColor: 'var(--color-bg-primary)' }}>
      <SceneBackground />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 40%, rgba(108,126,114,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 2 }}
      >
        <div className="glass-strong" style={{ padding: '48px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <motion.div whileHover={{ scale: 1.05, rotate: -3 }} style={{
              width: '56px', height: '56px',
              background: 'var(--color-accent-primary)',
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', boxShadow: '0 4px 15px rgba(108,126,114,0.18)',
            }}>
              <GraduationCap size={28} color="#FAF6F0" />
            </motion.div>
            <h1 className="serif-title" style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Создать аккаунт
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              Присоединяйтесь к 10,000+ пользователям
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Role selector */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '10px' }}>
                Я хочу...
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {roleBtn('student', 'Найти репетитора', <BookOpen size={20} color={form.role === 'student' ? 'var(--color-accent-primary)' : 'var(--color-text-tertiary)'} />)}
                {roleBtn('tutor', 'Стать репетитором', <GraduationCap size={20} color={form.role === 'tutor' ? 'var(--color-accent-primary)' : 'var(--color-text-tertiary)'} />)}
              </div>
            </div>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  Имя *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                  <input type="text" value={form.first_name} onChange={e => update('first_name', e.target.value)}
                    placeholder="Айдар" className="input-glass" style={{ paddingLeft: '40px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  Фамилия *
                </label>
                <input type="text" value={form.last_name} onChange={e => update('last_name', e.target.value)}
                  placeholder="Сейткали" className="input-glass" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="your@email.com" className="input-glass" style={{ paddingLeft: '40px' }} autoComplete="email" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Телефон</label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                  placeholder="+996 700 000000" className="input-glass" style={{ paddingLeft: '40px' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Пароль *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Минимум 8 символов" className="input-glass"
                  style={{ paddingLeft: '40px', paddingRight: '44px' }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '4px' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Повторите пароль *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input type={showPassword2 ? 'text' : 'password'} value={form.password2}
                  onChange={e => update('password2', e.target.value)}
                  placeholder="Повторите пароль" className="input-glass"
                  style={{ paddingLeft: '40px', paddingRight: '44px' }} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword2(!showPassword2)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '4px' }}>
                  {showPassword2 ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              style={{ width: '100%', fontSize: '15px', padding: '14px', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '4px' }}
            >
              {isLoading ? 'Регистрация...' : <> Создать аккаунт <ArrowRight size={18} /></>}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '24px' }}>
            Уже есть аккаунт?{' '}
            <Link to="/login" style={{ color: 'var(--color-accent-primary)', textDecoration: 'none', fontWeight: '600' }}>
              Войти
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
