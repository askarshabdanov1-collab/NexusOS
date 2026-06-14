import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, GraduationCap, ArrowRight } from 'lucide-react'
import SceneBackground from '../components/three/SceneBackground'

export default function LoginPage() {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Заполните все поля')
      return
    }
    try {
      await login(email, password)
      toast.success('Добро пожаловать!')
      navigate(from, { replace: true })
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Неверный email или пароль'
      toast.error(detail)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '100px 24px 40px', backgroundColor: 'var(--color-bg-primary)' }}>
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
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 2 }}
      >
        {/* Card */}
        <div className="glass-strong" style={{ padding: '48px 40px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              style={{
                width: '56px', height: '56px',
                background: 'var(--color-accent-primary)',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 15px rgba(108,126,114,0.18)',
              }}
            >
              <GraduationCap size={28} color="#FAF6F0" />
            </motion.div>
            <h1 className="serif-title" style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Войти в аккаунт
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              Рады видеть вас снова
            </p>
          </div>

          {/* Demo hint */}
          <div style={{
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
          }}>
            <strong style={{ color: 'var(--color-accent-primary)' }}>Демо:</strong> aizat@student.kz / student123
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-glass"
                  style={{ paddingLeft: '44px' }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Пароль
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Минимум 8 символов"
                  className="input-glass"
                  style={{ paddingLeft: '44px', paddingRight: '48px' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-secondary)', padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              style={{
                width: '100%', fontSize: '15px', padding: '14px',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '4px',
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                  <div style={{
                    width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Вход...
                </div>
              ) : (
                <>Войти <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          {/* Register link */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '24px' }}>
            Нет аккаунта?{' '}
            <Link to="/register" style={{ color: 'var(--color-accent-primary)', textDecoration: 'none', fontWeight: '600' }}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
